import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const rawContentIds =
      searchParams.get("contentIds") || searchParams.get("contentId");

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

    const numericMediaIds = Array.from(
      new Set(
        rawContentIds
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id)),
      ),
    );

    if (numericMediaIds.length === 0) {
      return NextResponse.json(
        { isWatched: false, watchedStatuses: {} },
        { status: 200 },
      );
    }

    const entries = await prisma.watchlist.findMany({
      where: {
        userId: userId,
        mediaId: {
          in: numericMediaIds,
        },
      },
      select: {
        mediaId: true,
      },
    });

    const watchedSet = new Set(entries.map((entry) => entry.mediaId));

    const watchedStatuses = {};
    numericMediaIds.forEach((id) => {
      watchedStatuses[id] = watchedSet.has(id);
    });

    return NextResponse.json(
      {
        isWatched: watchedSet.has(numericMediaIds[0]),
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
    const {
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

    const numericMediaId = parseInt(contentId, 10);
    if (isNaN(numericMediaId)) {
      return NextResponse.json(
        { error: "Invalid contentId format" },
        { status: 400 },
      );
    }

    const existingEntry = await prisma.watchlist.findFirst({
      where: {
        userId,
        mediaId: numericMediaId,
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
          mediaType: mediaType === "tv" ? "tv" : "movie",
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
