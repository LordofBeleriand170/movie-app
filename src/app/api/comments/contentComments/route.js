import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { movieId, mediaType } = body;
    if (!movieId || !mediaType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const media =
      mediaType === "movies" || mediaType === "movie" ? "movie" : "tv";
    const contentComments = await prisma.comment.findMany({
      where: {
        mediaId: movieId,
        mediaType: media,
      },
      include: {
        replies: {
          include: {
            replyLikes: true,
          },
        },
        commentLikes: true,
      },
    });

    return NextResponse.json({ success: true, contentComments });
  } catch (err) {
    console.error("Error adding comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
