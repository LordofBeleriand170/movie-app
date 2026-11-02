import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { formatDate } from "@/app/utils/formatDate";

export async function POST(req) {
  try {
    const body = await req.json();
    const { receiverId, senderId, bannedText, bannedUntil } = body;

    const userExist = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!userExist) {
      throw new Error("No user found");
    }

    await prisma.user.update({
      where: { id: receiverId },
      data: {
        banReason: bannedText,
        bannedUntil: bannedUntil ? new Date(bannedUntil) : null,
        status: "SUSPENDED",
        receivedNotifications: {
          create: {
            text: `You are banned because of ${bannedText}. You will not be able to comment until ${formatDate(bannedUntil)}`,
            senderId: senderId,
          },
        },
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
