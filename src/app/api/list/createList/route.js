import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { userId, text, description } = body;

  try {
    if (!userId || !text || !description) {
      throw new Error("Field empty");
    }

    const list = await prisma.list.create({
      data: {
        userId: userId,
        text: text,
        description: description,
      },
    });

    return NextResponse.json({ list }, { status: 200 });
  } catch (err) {
    throw new Error(err);
  }
}
