import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, user } = body;

    const receiver = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    console.log("RECEIVER: ", receiver);

    if (!receiver) {
      throw new Error("No admin found");
    }

    const notification = await prisma.notification.create({
      data: {
        text: `I want to report this comment ${id}`,
        sender: {
          connect: { id: user.id },
        },
        receiver: {
          connect: { id: receiver.id },
        },
        comment: {
          connect: { id: id },
        },
      },
    });

    console.log("NOTIFICATION: ", notification);

    return NextResponse.json({ notification }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
