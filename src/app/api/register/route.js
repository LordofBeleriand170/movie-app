import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { prisma } from "@/libs/prisma";
import generateTokenAndSetCookie from "@/libs/generateTokenAndSetCookie";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = body;
    console.log("USERNAME: ", username);
    console.log("email:", email);
    console.log("password: ", password);

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

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

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

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

    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        verified: user.isVerified,
      },
    });

    console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
    console.log("SMTP_PASSWORD Length:", process.env.SMTP_PASSWORD?.length);

    await transporter.sendMail({
      from: `"Movie app" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome, ${username}!</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px; color: #4F46E5;">${verificationToken}</h1>
          <p>Expires in 24 hours.</p>
        </div>
      `,
    });

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
