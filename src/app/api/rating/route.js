// app/api/comments/route.ts
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
    const contentRating = await prisma.rating.findMany({
      where: {
        movieId: movieId,
        mediaType: media,
      },
    });

    return NextResponse.json({ success: true, contentRating });
  } catch (err) {
    console.error("Error adding comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
