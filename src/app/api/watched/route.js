import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const ipAddress =
      req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    const rawContentIds =
      searchParams.get("contentIds") || searchParams.get("contentId");
    const defaultMediaType = searchParams.get("mediaType") || "movie";

    if (
      !userId ||
      userId === "undefined" ||
      userId === "null" ||
      !rawContentIds ||
      rawContentIds === "undefined"
    ) {
      return NextResponse.json(
        { isWatched: false, watchedStatuses: {} },
        { status: 200 },
      );
    }

    const parsedItems = Array.from(
      new Set(
        rawContentIds
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    )
      .map((item) => {
        if (item.includes("_")) {
          const [type, idStr] = item.split("_");
          const mediaId = parseInt(idStr, 10);
          const mediaType = type === "tv" ? "tv" : "movie";
          return !isNaN(mediaId)
            ? { mediaId, mediaType, key: `${mediaType}_${mediaId}` }
            : null;
        } else {
          const mediaId = parseInt(item, 10);
          const mediaType = defaultMediaType === "tv" ? "tv" : "movie";
          return !isNaN(mediaId)
            ? { mediaId, mediaType, key: `${mediaType}_${mediaId}` }
            : null;
        }
      })
      .filter(Boolean);

    if (parsedItems.length === 0) {
      return NextResponse.json(
        { isWatched: false, watchedStatuses: {} },
        { status: 200 },
      );
    }

    const entries = await prisma.watchlist.findMany({
      where: {
        userId: userId,
        OR: parsedItems.map((item) => ({
          mediaId: item.mediaId,
          mediaType: item.mediaType,
        })),
      },
      select: {
        mediaId: true,
        mediaType: true,
      },
    });

    const watchedSet = new Set(
      entries.map((entry) => `${entry.mediaType}_${entry.mediaId}`),
    );

    const watchedStatuses = {};
    parsedItems.forEach((item) => {
      const isWatched = watchedSet.has(item.key);
      watchedStatuses[item.key] = isWatched;
      watchedStatuses[item.mediaId] = isWatched;
    });

    const firstKey = parsedItems[0]?.key;

    return NextResponse.json(
      {
        isWatched: watchedSet.has(firstKey),
        watchedStatuses,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET Watchlist error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const text = await req.text();
    const body = text ? JSON.parse(text) : {};
    let {
      userId,
      contentId,
      title = "Unknown",
      poster = "",
      releaseDate = "",
      mediaType = "movie",
    } = body;

    if (!userId || userId === "undefined" || !contentId) {
      return NextResponse.json(
        { error: "Valid userId and contentId required" },
        { status: 400 },
      );
    }

    if (typeof contentId === "string" && contentId.includes("_")) {
      const [parsedType, idStr] = contentId.split("_");
      mediaType = parsedType;
      contentId = idStr;
    }

    const numericMediaId = parseInt(contentId, 10);
    if (isNaN(numericMediaId)) {
      return NextResponse.json(
        { error: "Invalid contentId format" },
        { status: 400 },
      );
    }

    const normalizedMediaType = mediaType === "tv" ? "tv" : "movie";

    const existingEntry = await prisma.watchlist.findFirst({
      where: {
        userId,
        mediaId: numericMediaId,
        mediaType: normalizedMediaType,
      },
      select: {
        id: true,
      },
    });

    if (existingEntry) {
      await prisma.watchlist.delete({
        where: { id: existingEntry.id },
      });

      return NextResponse.json(
        { isWatched: false, message: "Removed from watchlist" },
        { status: 200 },
      );
    } else {
      await prisma.watchlist.create({
        data: {
          userId,
          mediaId: numericMediaId,
          title,
          poster,
          releaseDate,
          mediaType: normalizedMediaType,
        },
      });

      return NextResponse.json(
        { isWatched: true, message: "Added to watchlist" },
        { status: 201 },
      );
    }
  } catch (err) {
    console.error("POST Watchlist error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
