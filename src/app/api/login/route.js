// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/libs/prisma";
import generateTokenAndSetCookie from "@/libs/generateTokenAndSetCookie";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        favorite: true,
        watchlist: true,
        rating: true,
        reviews: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    // Create response
    const res = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.isVerified,
        favorite: user.favorite,
        watchlist: user.watchlist,
        ratings: user.rating,
        reviews: user.reviews,
      },
    });

    // Set JWT cookie
    generateTokenAndSetCookie(res, user.id);

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
