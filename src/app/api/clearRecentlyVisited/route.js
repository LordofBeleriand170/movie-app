import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { user } = body;

    if (!user?.id) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    await prisma.userRecentlyVisited.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { message: "Successfully cleared recently visited!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error: ", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
