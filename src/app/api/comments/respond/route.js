// app/api/replies/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, username, commentId, text } = body;

    if (!id || !commentId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        commentId,
        userId: id,
        username,
        text,
        likes: 0,
      },
    });

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("Error adding reply:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get("mediaId");
    const mediaType = searchParams.get("mediaType");

    if (!mediaId || !mediaType) {
      return NextResponse.json(
        { error: "Missing mediaId or mediaType" },
        { status: 400 },
      );
    }

    // Fetch comments with their replies and usernames
    const comments = await prisma.comment.findMany({
      where: { mediaId: mediaId, mediaType: mediaType },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        replies: { include: { user: { select: { username: true } } } },
      },
    });

    const result = comments.map((c) => ({
      ...c,
      username: c.user?.username || c.username || "Unknown",
      replies: c.replies?.map((r) => ({
        ...r,
        username: r.user?.username || r.username || "Unknown",
      })),
    }));

    return NextResponse.json({ comments: result });
  } catch (err) {
    console.error("Error fetching replies:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
