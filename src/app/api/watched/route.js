import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { Console } from "console";

// GET: Check if movies/shows are inside user's watchlist (supports single or batch check)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Support both `contentIds` (plural batch) or `contentId` (single)
    const rawContentIds =
      searchParams.get("contentIds") || searchParams.get("contentId");

    // Guard against unauthenticated users or missing parameters
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

    // Parse comma-separated list and deduplicate IDs
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

    // Fetch all matching records in a single indexed query
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

    // Create a Set for O(1) membership lookup
    const watchedSet = new Set(entries.map((entry) => entry.mediaId));

    const watchedStatuses = {};
    numericMediaIds.forEach((id) => {
      watchedStatuses[id] = watchedSet.has(id);
    });

    return NextResponse.json(
      {
        // Backward-compatibility field for single checks
        isWatched: watchedSet.has(numericMediaIds[0]),
        // Batch lookup dictionary: { "550": true, "680": false, ... }
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

// POST: Toggle item in user's watchlist
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

    // Check if entry already exists
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
      // Remove from watchlist
      await prisma.watchlist.delete({
        where: { id: existingEntry.id },
      });

      return NextResponse.json(
        { isWatched: false, message: "Removed from watchlist" },
        { status: 200 },
      );
    } else {
      // Add to watchlist
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
