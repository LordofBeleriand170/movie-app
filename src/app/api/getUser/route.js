import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  try {
    if (!email) {
      throw new Error("No email delivered");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
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

    if (!user) {
      throw new Error("No user found");
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    throw new Error(err);
  }
}
