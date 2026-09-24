import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, result } = body;
    console.log("RESULT: ", result);

    const rawId = result?.info?.id || result?.id || body?.mediaId;
    const itemId = typeof rawId === "string" ? parseInt(rawId, 10) : rawId;

    if (!itemId) {
      return NextResponse.json({ error: "Invalid Media ID" }, { status: 400 });
    }

    const isEmail = id?.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: { watchlist: true, recentlyVisited: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mediaType = result?.type || (result?.first_air_date ? "tv" : "movie");

    const watchlistExists = user.watchlist.some(
      (w) => Number(w.mediaId) === Number(itemId) && w.mediaType === mediaType,
    );

    const recentlyExists = user.recentlyVisited.some(
      (w) => Number(w.mediaId) === Number(itemId) && w.mediaType === mediaType,
    );

    let isWatchedNextState = false;

    if (watchlistExists) {
      await prisma.watchlist.deleteMany({
        where: {
          userId: user.id,
          mediaId: itemId,
          mediaType: mediaType,
        },
      });

      isWatchedNextState = false;
    } else {
      let poster = result?.poster_path || "";
      let title = result?.title || result?.name || "Untitled";
      let releaseDate = result?.release_date || result?.first_air_date || "";

      if (!result) {
        const tmdbOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        };

        const infoResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${itemId}`,
          tmdbOptions,
        );
        const infoData = await infoResponse.json();

        poster = infoData?.poster_path || "";
        title = infoData?.title || infoData?.name || "Untitled";
        releaseDate = infoData?.release_date || infoData?.first_air_date || "";
      }

      await prisma.watchlist.create({
        data: {
          userId: user.id,
          mediaId: itemId,
          mediaType: mediaType,
          poster,
          title,
          releaseDate,
        },
      });

      isWatchedNextState = true;
    }

    if (recentlyExists) {
      await prisma.userRecentlyVisited.update({
        where: {
          userId_mediaId_mediaType: {
            userId: user.id,
            mediaId: String(itemId),
            mediaType: mediaType,
          },
        },
        data: {
          isWatched: isWatchedNextState,
        },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        favorite: true,
        watchlist: true,
        recentlyVisited: true,
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
