import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, isComment } = body;
    console.log("ID: ", id, isComment);

    if (!id) {
      return NextResponse.json({ error: "ID je obavezan" }, { status: 400 });
    }

    if (!isComment) {
      const replyExists = await prisma.reply.findUnique({
        where: { id: id },
      });

      if (!replyExists) {
        return NextResponse.json(
          { error: "Comment answer not found" },
          { status: 404 },
        );
      }

      await prisma.reply.update({
        where: { id: id },
        data: { isDeleted: true },
      });

      return NextResponse.json({
        ok: true,
        message: "Answer is successfully deleted",
      });
    } else {
      const commentExists = await prisma.comment.findUnique({
        where: { id: id },
      });

      if (!commentExists) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }

      await prisma.comment.update({
        where: { id: id },
        data: { isDeleted: true },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Comment successfully deleted",
    });
  } catch (err) {
    console.error("Error while deleting comment:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
