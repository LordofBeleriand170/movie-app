import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ lists }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch lists" },
      { status: 500 },
    );
  }
}
