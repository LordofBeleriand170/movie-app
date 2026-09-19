import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Fetch user with related collections
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        favorite: true,
        watchlist: true,
        ratings: true,
        recentlyVisited: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 10,
        },
        receivedNotifications: {
          include: {
            sender: true,
          },
        },
        comments: {
          include: {
            replies: true,
            commentLikes: true,
          },
        },
        commentLikes: true,
        replyLikes: true,
      },
    });

    let recentlyVisited = [];

    for (let i = 0; i < user.recentlyVisited.length; i++) {
      const tmdbOptions = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      // Fetch basic info
      const infoResponse = await fetch(
        `https://api.themoviedb.org/3/${user.recentlyVisited[i].type === "movies" ? "movie" : "tv"}/${user.recentlyVisited[i].mediaId}`,
        tmdbOptions,
      );

      const infoData = await infoResponse.json();

      let content = {
        id: infoData?.id,
        name: infoData?.first_air_date ? infoData?.name : infoData?.title,
        poster_path: infoData?.poster_path,
        type: infoData?.first_air_date ? "tv" : "movie",
      };

      recentlyVisited.push(content);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Create composite string keys: "mediaId-mediaType" => rating
    const ratingMap = new Map(
      (user.ratings || []).map((r) => [
        `${r.movieId}-${r.mediaType}`,
        r.rating,
      ]),
    );

    // 2. Look up using the same composite key format
    const watchlistWithRatings = (user.watchlist || []).map((item) => ({
      ...item,
      userRating: ratingMap.get(`${item.mediaId}-${item.mediaType}`) ?? null,
    }));

    let isBanned = user.bannedUntil > new Date();

    if (!isBanned && user.bannedUntil) {
      await prisma.user.update({
        where: { email },
        data: {
          bannedUntil: null,
          banReason: null,
        },
      });
    }

    // Mapiramo user polja kao sto je bilo u Mongo verziji
    const formattedUser = {
      id: user.id,
      username: user.name,
      email: user.email,
      favorite: user.favorite || [],
      watchlist: watchlistWithRatings || [],
      ratings: user.ratings || [],
      recently: recentlyVisited || [],
      comments: user.comments || [],
      likes: user.upvotedComments || [],
      notifications: user.receivedNotifications || [],
      bannedUntil: isBanned ? user.bannedUntil : null,
      banReason: isBanned ? user.banReason : null,
      role: user.role,
    };

    return NextResponse.json({ user: formattedUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
