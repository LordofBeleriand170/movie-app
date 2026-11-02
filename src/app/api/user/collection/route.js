import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;
    console.log("EMAIL: ", email);

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma?.user?.findUnique({
      where: { email: email },
      include: {
        favorite: true,
        watchlist: true,
        bookmark: true,
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

    for (let i = 0; i < user?.recentlyVisited?.length; i++) {
      const tmdbOptions = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      const infoResponse = await fetch(
        `https://api.themoviedb.org/3/${user?.recentlyVisited[i]?.mediaType}/${user?.recentlyVisited[i]?.mediaId}`,
        tmdbOptions,
      );

      const infoData = await infoResponse.json();

      let content = {
        id: infoData?.id,
        name: infoData?.first_air_date ? infoData?.name : infoData?.title,
        poster_path: infoData?.poster_path,
        type: infoData?.first_air_date ? "tv" : "movie",
        isWatched: user?.recentlyVisited[i]?.isWatched,
      };

      recentlyVisited?.push(content);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ratingMap = new Map(
      (user?.ratings || [])?.map((r) => [
        `${r?.movieId}-${r?.mediaType}`,
        r?.rating,
      ]),
    );

    const watchlistWithRatings = (user?.watchlist || [])?.map((item) => ({
      ...item,
      userRating: ratingMap?.get(`${item?.mediaId}-${item?.mediaType}`) ?? null,
    }));

    let isBanned = user?.bannedUntil > new Date();

    if (!isBanned && user?.bannedUntil) {
      await prisma.user.update({
        where: { email },
        data: {
          bannedUntil: null,
          banReason: null,
        },
      });
    }

    const formattedUser = {
      id: user.id,
      username: user.name,
      email: user.email,
      image: user.image,
      favorite: user.favorite || [],
      watchlist: watchlistWithRatings || [],
      bookmark: user.bookmark || [],
      ratings: user.ratings || [],
      recently: recentlyVisited || [],
      comments: user.comments || [],
      likes: user.upvotedComments || [],
      notifications: user.receivedNotifications || [],
      bannedUntil: isBanned ? user.bannedUntil : null,
      banReason: isBanned ? user.banReason : null,
      role: user.role,
      createdAt: user.createdAt,
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
