import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { id, result } = body;

  try {
    const rawId = result?.info?.id || result?.id || body?.mediaId;
    const itemId = typeof rawId === "string" ? parseInt(rawId, 10) : rawId;

    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

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

    const recentlyExists = user.recentlyVisited.some(
      (w) => Number(w.mediaId) === Number(itemId) && w.mediaType === mediaType,
    );

    let isWatchedNextState = false;
    let actionMessage = "";

    let poster = result?.poster_path || "";
    let title = result?.title || result?.name || "Untitled";
    let releaseDate = result?.release_date || result?.first_air_date || "";

    if (!result || (!result.title && !result.name && !result.poster_path)) {
      try {
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
      } catch (tmdbErr) {
        console.warn("Failed to fetch extra metadata from TMDB:", tmdbErr);
      }
    }

    try {
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
      actionMessage = `"${title}" (${mediaType}) added to watchlist`;
    } catch (createErr) {
      if (createErr.code === "P2002") {
        await prisma.watchlist.deleteMany({
          where: {
            userId: user.id,
            mediaId: itemId,
            mediaType: mediaType,
          },
        });
        isWatchedNextState = false;
        actionMessage = `"${title}" (${mediaType}) removed from watchlist`;
      } else {
        throw createErr;
      }
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

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: user.name,
        ipAddress,
        action: actionMessage,
        endpoint: "POST /api/collections/watchlist",
        metadata: { mediaId: itemId, mediaType, title },
      },
    });

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
    console.error("Watchlist error:", err);

    const isEmail = id?.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: { watchlist: true, recentlyVisited: true },
    });

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: user.name,
          action: "Internal server error during watchlist modification",
          endpoint: "POST /api/collections/watchlist",
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
