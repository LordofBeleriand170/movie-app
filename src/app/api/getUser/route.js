import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  const { username } = body;

  try {
    if (!username) {
      throw new Error("No username delivered");
    }

    const user = await prisma.user.findFirst({
      where: {
        name: username,
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
