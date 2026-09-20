import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { commentId, isReply, id } = body;

    console.log("ID: ", id);

    if (!commentId || !id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isReply) {
      const reply = await prisma.reply.findUnique({
        where: { id: commentId },
      });
      if (!reply) {
        return NextResponse.json({ error: "Reply not found" }, { status: 404 });
      }

      const existingLike = await prisma.replyLike.findUnique({
        where: { userId_replyId: { userId: user.id, replyId: reply.id } },
      });

      if (existingLike) {
        await prisma.replyLike.delete({
          where: { userId_replyId: { userId: user.id, replyId: reply.id } },
        });
        await prisma.reply.update({
          where: { id: reply.id },
          data: { likes: { decrement: 1 } },
        });
      } else {
        await prisma.replyLike.create({
          data: { userId: user.id, replyId: reply.id },
        });
        await prisma.reply.update({
          where: { id: reply.id },
          data: { likes: { increment: 1 } },
        });
      }

      const updatedReply = await prisma.reply.findUnique({
        where: { id: reply.id },
      });
      return NextResponse.json(
        { message: "Reply liked/unliked", reply: updatedReply },
        { status: 200 },
      );
    } else {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }

      const existingLike = await prisma.commentLike.findUnique({
        where: { userId_commentId: { userId: user.id, commentId: comment.id } },
      });

      if (existingLike) {
        await prisma.commentLike.delete({
          where: {
            userId_commentId: { userId: id, commentId: comment.id },
          },
        });
        await prisma.comment.update({
          where: { id: comment.id },
          data: { likes: { decrement: 1 } },
        });
      } else {
        await prisma.commentLike.create({
          data: { userId: id, commentId: comment.id },
        });
        await prisma.comment.update({
          where: { id: comment.id },
          data: { likes: { increment: 1 } },
        });
      }

      const updatedComment = await prisma.comment.findUnique({
        where: { id: comment.id },
      });

      return NextResponse.json(
        { message: "Comment liked/unliked", comment: updatedComment },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("Like error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
