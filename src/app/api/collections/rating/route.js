import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { id, result, media, rating } = body;

  try {
    const itemId = result?.info?.id || result?.id;
    const isEmail = id?.includes("@");

    let mediaType = media === "movies" ? "movie" : "tv";

    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: {
        favorite: true,
        watchlist: true,
        ratings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRatingExists = user.ratings.some(
      (r) => r.movieId === itemId && r.mediaType === mediaType,
    );

    let actionMessage = "";

    if (!userRatingExists && rating > 0) {
      await prisma.rating.create({
        data: {
          userId: user.id,
          movieId: itemId,
          rating,
          mediaType: result?.first_air_date ? "tv" : "movie",
        },
      });

      actionMessage = `Rating for ${itemId} (${mediaType}) added`;
    } else if (userRatingExists) {
      if (rating === 0) {
        await prisma.rating.deleteMany({
          where: { userId: user.id, movieId: itemId },
        });
      } else {
        await prisma.rating.updateMany({
          where: { userId: user.id, movieId: itemId },
          data: { rating },
        });
      }

      actionMessage = `Rating for ${itemId} (${mediaType}) removed`;
    }

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: user.name,
        ipAddress,
        action: actionMessage,
        endpoint: "POST /api/collections/rating",
        metadata: { mediaId: itemId, mediaType, title: actionMessage },
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: {
        favorite: true,
        watchlist: true,
        ratings: true,
        comments: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);

    try {
      const user = await prisma.user.findUnique({
        where: isEmail ? { email: id } : { id },
        include: {
          favorite: true,
          watchlist: true,
          ratings: true,
        },
      });

      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: user.name,
          action: "Internal server error during rating modification",
          endpoint: "POST /api/collections/rating",
          metadata: { message: err.message },
        },
      });
    } catch (logErr) {
      console.error("Failed to write to SystemLog:", logErr);
    }

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
