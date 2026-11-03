import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { id, result } = body;

  try {
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    const rawId = result?.info?.id || result?.id || body?.mediaId;
    const itemId = typeof rawId === "string" ? parseInt(rawId, 10) : rawId;

    if (!itemId) {
      return NextResponse.json({ error: "Invalid Media ID" }, { status: 400 });
    }

    const isEmail = id?.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: { bookmark: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mediaType = result?.first_air_date ? "tv" : "movie";

    const bookmarkExists = user.bookmark.some(
      (w) => Number(w.mediaId) === Number(itemId) && w.mediaType === mediaType,
    );

    let actionMessage = "";

    if (bookmarkExists) {
      await prisma.bookmark.deleteMany({
        where: {
          userId: user.id,
          mediaId: itemId,
        },
      });
      actionMessage = `Removed bookmark for media ID ${itemId} (${mediaType})`;
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

      await prisma.bookmark.create({
        data: {
          userId: user.id,
          mediaId: itemId,
          mediaType: mediaType,
          poster,
          title,
          releaseDate,
        },
      });
      actionMessage = `Added bookmark for "${title}" (${mediaType})`;
    }

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: user.name,
        ipAddress,
        action: actionMessage,
        endpoint: "POST /api/collections/bookmark",
        metadata: { mediaId: itemId, mediaType, title: actionMessage },
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        favorite: true,
        watchlist: true,
        bookmark: true,
        ratings: true,
        comments: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);

    const isEmail = id?.includes("@");

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
      include: { bookmark: true },
    });

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: user.name,
          action: "Internal server error during bookmark modification",
          endpoint: "POST /api/collections/bookmark",
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
