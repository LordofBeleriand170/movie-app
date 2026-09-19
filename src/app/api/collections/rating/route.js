import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, result, media, rating } = body;

    const itemId = result?.info?.id || result?.id;
    const isEmail = id?.includes("@");

    let mediaType = media === "movies" ? "movie" : "tv";

    // Find user
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

    // Update or create user rating
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

    // Update global rating record
    /*if (!ratingRecord && rating > 0) {
      await prisma.rating.create({
        data: {
          movieId: itemId,
          mediaType: result.info?.first_air_date ? "tv" : "movie", // "movie" or "tv"
          rating,
          votes: 1,
          user: { connect: { id: user.id } }, // ✅ connect to existing user
          voters: {
            create: [{ user: { connect: { id: user.id } }, rating }],
          }, // ✅ nested relation
        },
      });
    } else if (ratingRecord) {
      const existingVote = await prisma?.votes?.findUnique({
        where: { userId_movieId: { userId: user.id, movieId: itemId } },
      });

      if (!existingVote && rating > 0) {
        await prisma?.votes?.create({
          data: { userId: user.id, movieId: itemId, rating },
        });

        // Recalculate average
        const votes = await prisma?.votes?.findMany({
          where: { movieId: itemId },
        });
        const avgRating =
          votes.reduce((sum, v) => sum + v.rating, 0) / votes.length;

        await prisma.rating.update({
          where: { movieId: itemId },
          data: { rating: avgRating, votes: votes.length },
        });
      } else if (existingVote) {
        if (rating === 0) {
          await prisma.votes.delete({
            where: { userId_movieId: { userId: user.id, movieId: itemId } },
          });

          const votes = await prisma.votes.findMany({
            where: { movieId: itemId },
          });

          if (votes.length === 0) {
            await prisma.rating.delete({ where: { movieId: itemId } });
          } else {
            const avgRating =
              votes.reduce((sum, v) => sum + v.rating, 0) / votes.length;
            await prisma.rating.update({
              where: { movieId: itemId },
              data: { rating: avgRating, votes: votes.length },
            });
          }
        } else {
          await prisma.votes.update({
            where: { userId_movieId: { userId: user.id, movieId: itemId } },
            data: { rating },
          });

          const votes = await prisma.votes.findMany({
            where: { movieId: itemId },
          });
          const avgRating =
            votes.reduce((sum, v) => sum + v.rating, 0) / votes.length;
          await prisma.rating.update({
            where: { movieId: itemId },
            data: { rating: avgRating },
          });
        }
      }
    }*/

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
