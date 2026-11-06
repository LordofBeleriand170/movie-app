import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { identifier } = body;
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier missing" },
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

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: userExists?.name,
        ipAddress,
        action: "Password reset initiated successfully.",
        endpoint: "POST /api/auth/forgotPassword",
      },
    });

    return NextResponse.json(
      { message: "Password reset initiated successfully" },
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
          endpoint: "POST /api/auth/forgotPassword",
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
