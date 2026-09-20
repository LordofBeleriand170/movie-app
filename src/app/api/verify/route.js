import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { verificationCode } = body;

    const code = String(verificationCode);

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
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
