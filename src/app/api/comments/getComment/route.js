import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { commentId } = body;

    if (!commentId) {
      throw new Error("No commentId delivered");
    }

    const commentFound = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!commentId) {
      throw new Error("No comment found");
    }

    const tmdbOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    const infoResponse = await fetch(
      `https://api.themoviedb.org/3/${commentFound?.mediaType}/${commentFound?.mediaId}`,
      tmdbOptions,
    );
    const infoData = await infoResponse.json();

    const comment = {
      ...commentFound,
      title: infoData?.title || infoData?.name,
    };

    return NextResponse.json({ comment }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
