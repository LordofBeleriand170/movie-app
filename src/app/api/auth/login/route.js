import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/libs/prisma";
import generateTokenAndSetCookie from "@/libs/generateTokenAndSetCookie";

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        favorite: true,
        watchlist: true,
        rating: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "SUSPENDED") {
      await prisma.systemLog.create({
        data: {
          level: "WARNING",
          username: username,
          ipAddress,
          action: `Login attempted on ${user.status.toLowerCase()} account`,
          endpoint: "POST /api/auth/login",
        },
      });

      return NextResponse.json(
        {
          error: `Account is ${user.status.toLowerCase()}. Reason: ${user.banReason || "Violation of terms"}`,
        },
        { status: 403 },
      );
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: verificationToken,
          verificationTokenExpiresAt: verificationTokenExpiresAt,
        },
      });

      return NextResponse.json(
        { error: "Verification code expired and new code has been sent" },
        { status: 400 },
      );
    } else if (!user.isVerified) {
      return NextResponse.json({ error: "User not verified" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    try {
      await prisma.systemLog.create({
        data: {
          level: "SUCCESS",
          username: username,
          ipAddress,
          action: "User logged in successfully",
          endpoint: "POST /api/auth/login",
        },
      });
    } catch (logErr) {
      console.error("FAILED TO CREATE SYSTEM LOG:", logErr);
    }

    const res = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.isVerified,
        favorite: user.favorite,
        watchlist: user.watchlist,
        ratings: user.rating,
      },
    });

    generateTokenAndSetCookie(res, user.id);

    return res;
  } catch (err) {
    console.error("Login error:", err);

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: username,
          action: "Internal server error during login",
          endpoint: "POST /api/auth/login",
          metadata: { message: err.message },
        },
      });
    } catch (logErr) {
      console.error("Failed to write to SystemLog:", logErr);
    }

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
