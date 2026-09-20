import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, result, media, rating } = body;

    const itemId = result?.info?.id || result?.id;
    const isEmail = id?.includes("@");

    let mediaType = media === "movies" ? "movie" : "tv";

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

    let ratingRecord = await prisma.rating.findFirst({
      where: { userId: user.id, movieId: itemId },
      include: { voters: true }, // only relation fields
    });

    if (!userRatingExists && rating > 0) {
      await prisma.rating.create({
        data: {
          userId: user.id,
          movieId: itemId,
          rating,
          mediaType: result?.first_air_date ? "tv" : "movie",
        },
      });
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
    }

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
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
