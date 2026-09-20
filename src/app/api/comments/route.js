import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, username, movieId, text, mediaType, rating, spoiler } = body;

    if (!id || !movieId || !text || !mediaType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const media = mediaType === "movies" ? "movie" : "tv";

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userComment = await prisma.comment.findFirst({
      where: {
        userId: id,
        mediaId: movieId,
        mediaType: media,
      },
    });

    if (userComment) {
      return NextResponse.json(
        {
          error: `You already made comment about this ${mediaType === "movies" ? "movie." : " tv show."}`,
        },
        { status: 400 },
      );
    } else {
      const watchlistExists = await prisma.watchlist.findFirst({
        where: {
          userId: user.id,
          mediaId: movieId,
          mediaType: media,
        },
      });
      const tmdbOptions = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      if (!watchlistExists) {
        const infoResponse = await fetch(
          `https://api.themoviedb.org/3/${media}/${movieId}`,
          tmdbOptions,
        );
        const infoData = await infoResponse.json();

        await prisma.watchlist.upsert({
          where: {
            userId_mediaId: {
              userId: user.id,
              mediaId: movieId,
            },
          },
          update: {},
          create: {
            userId: user.id,
            mediaId: movieId,
            mediaType: media,
            poster: infoData?.poster_path,
            title: infoData?.first_air_date ? infoData?.name : infoData?.title,
            releaseDate: infoData?.release_date,
          },
        });
      }

      const comment = await prisma.comment.create({
        data: {
          userId: id,
          username,
          mediaId: movieId,
          mediaType: media,
          text,
          spoilers: spoiler,
          rating,
        },
      });

      let userRating = await prisma.rating.findFirst({
        where: { userId: id, movieId: movieId },
        include: { voters: true }, // only relation fields
      });

      if (!userRating) {
        await prisma?.rating?.create({
          data: {
            userId: id,
            movieId: movieId,
            rating,
            mediaType: media,
          },
        });
      } else {
        if (rating === 0) {
          await prisma.rating.deleteMany({
            where: { userId: id, movieId: movieId },
          });
        } else {
          if (rating !== userRating.rating) {
            await prisma.rating.updateMany({
              where: { userId: id, movieId: movieId },
              data: { rating },
            });
          }
        }
      }

      return NextResponse.json({ success: true, comment });
    }
  } catch (err) {
    console.error("Error adding comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get("mediaId");
    let mediaType = searchParams.get("mediaType");

    if (!mediaId || !mediaType) {
      return NextResponse.json(
        { error: "Missing mediaId or mediaType" },
        { status: 400 },
      );
    }

    const media = mediaType === "movies" ? "movie" : "tv";

    const comments = await prisma.comment.findMany({
      where: {
        mediaId: parseInt(mediaId), // convert string to number
        mediaType: media, // "movie" | "tv"
      },
      orderBy: { createdAt: "desc" },
      include: {
        replies: true,
        commentLikes: true,
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
    console.error("Error fetching comments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
