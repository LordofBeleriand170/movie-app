import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    const userExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExist) {
      throw new Error("No user found");
    }

    await prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
