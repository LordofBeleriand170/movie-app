import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing notification id" },
        { status: 400 },
      );
    }

    const notificationDelete = await prisma.notification.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ notificationDelete }, { status: 200 });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
