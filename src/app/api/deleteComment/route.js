import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    const commentExists = await prisma.comment.findUnique({
      where: { id: id },
    });

    if (!commentExists) {
      throw new Error("No comment found");
    }

    await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
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
