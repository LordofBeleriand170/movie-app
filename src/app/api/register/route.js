// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/libs/prisma";
import generateTokenAndSetCookie from "@/libs/generateTokenAndSetCookie";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    // Check if username or email already exists
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ name: username }, { email }],
      },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24h

    // Create user
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashed,
        verificationToken,
        verificationTokenExpiresAt,
        isVerified: false,
      },
    });

    // Return user info without sensitive data
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        verified: user.isVerified,
      },
    });

    // Set JWT cookie
    generateTokenAndSetCookie(res, user.id);

    return res;
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
