import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { id, result, media } = body;

  try {
    const itemId = result?.info?.id || result?.id;

    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    if (!itemId) {
      return NextResponse.json(
        { error: "mediaId is required" },
        { status: 400 },
      );
    }
    const isEmail = id?.includes("@");

    const userWhere = isEmail ? { email: id } : id ? { id } : null;

    if (!userWhere) {
      return NextResponse.json(
        { error: "User identifier missing" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: userWhere,
      include: {
        favorite: true,
        bookmark: true,
        watchlist: true,
        ratings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const type = media === "movies" ? "movie" : "tv";

    const currentNumber = user.favorite.filter(
      (favorite) => favorite.mediaType === type,
    ).length;

    if (currentNumber === 5) {
      return NextResponse.json(
        { error: `Favorite ${type} number reached` },
        { status: 404 },
      );
    }

    const favoriteExists = user.favorite.some(
      (f) => f.mediaId === itemId && f.mediaType === type,
    );

    let actionMessage = "";

    if (favoriteExists) {
      await prisma?.favorite?.deleteMany({
        where: {
          userId: user.id,
          mediaId: itemId,
          mediaType: type,
        },
      });

      actionMessage = `Media ID ${itemId} (${type}) removed from favorites`;
    } else {
      await prisma?.favorite?.create({
        data: {
          userId: user.id,
          mediaId: itemId,
          mediaType: type,
          poster: result?.poster_path,
          title: result?.first_air_date ? result?.name : result?.title,
          releaseDate: result?.release_date || result?.first_air_date,
        },
      });

      actionMessage = `Media ID ${itemId} (${type}) added to favorites`;
    }

    await prisma.systemLog.create({
      data: {
        level: "SUCCESS",
        username: user.name,
        ipAddress,
        action: actionMessage,
        endpoint: "POST /api/collections/favorite",
        metadata: { mediaId: itemId, type, title: actionMessage },
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: isEmail ? { email: id } : { id },
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

    const userWhere = isEmail ? { email: id } : id ? { id } : null;

    const user = await prisma.user.findUnique({
      where: userWhere,
      include: {
        favorite: true,
        bookmark: true,
        watchlist: true,
        ratings: true,
      },
    });

    try {
      await prisma.systemLog.create({
        data: {
          level: "ERROR",
          username: user.name,
          action: "Internal server error during favorites modification",
          endpoint: "POST /api/collections/favorite",
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
``;
