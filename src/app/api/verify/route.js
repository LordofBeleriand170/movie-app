import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { verificationCode } = body;

    const code = String(verificationCode);

    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Verification code required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: code },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 },
      );
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        userId: updatedUser.id,
        ipAddress,
        action: "User account verified successfully",
        endpoint: "POST /api/verify",
      },
    });

    const res = NextResponse.json({
      user: {
        id: updatedUser.id,
        username: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password || "",
        isVerified: updatedUser.isVerified,
      },
    });
    return res;
  } catch (err) {
    console.error(err);

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          action: "Internal server error during account verification",
          endpoint: "POST /api/verify",
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
