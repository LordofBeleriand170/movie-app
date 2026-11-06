import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
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
  const { identifier, password } = body;
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password are required" },
        { status: 400 },
      );
    }

    const isEmail = identifier.includes("@");

    let userExists;

    if (isEmail) {
      userExists = await prisma.user.findUnique({
        where: { email: identifier },
      });
    } else {
      userExists = await prisma.user.findUnique({
        where: { name: identifier },
      });
    }

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { email: userExists?.email },
      data: {
        password: password,
      },
    });

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: user.name,
        ipAddress,
        action: "Password reset successfully",
        endpoint: "POST /api/auth/resetPassword",
      },
    });

    return NextResponse.json(
      { message: "Password resetted successfully" },
      { status: 200 },
    );
  } catch (err) {
    const isEmail = identifier?.includes("@");

    let userExists;

    if (identifier) {
      if (isEmail) {
        userExists = await prisma.user.findUnique({
          where: { email: identifier },
        });
      } else {
        userExists = await prisma.user.findUnique({
          where: { name: identifier },
        });
      }
    }

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: userExists?.name,
          action: "Internal server error during password reset.",
          endpoint: "POST /api/auth/resetPassword",
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
