import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/libs/prisma";

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
  const body = await req.json();
  const { username } = body;
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!username) {
      return NextResponse.json({ error: "Username missing" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { name: username },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user = await prisma.user.update({
      where: { name: username },
      data: {
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: username,
        ipAddress,
        action: "Verification code resend successfully",
        endpoint: "POST /api/auth/resendVerificationCode",
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

    await transporter.sendMail({
      from: `"Movie app" <${process.env.SMTP_EMAIL}>`,
      to: user?.email,
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

    return res;
  } catch (err) {
    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: username,
          action: "Internal server error during verification code resend.",
          endpoint: "POST /api/auth/resendVerificationCode",
          metadata: { message: err.message },
        },
      });
    } catch (logErr) {
      console.error("Failed to write to SystemLog:", logErr);
    }
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
