import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, listId } = body;

    // 1. Validation check
    if (!content || !listId || !content?.mediaId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingListItem = await prisma.listItem.findFirst({
      where: {
        listId: listId,
        mediaId: content.mediaId,
        mediaType: content.mediaType,
      },
    });

    if (existingListItem) {
      return NextResponse.json(
        { error: "Content already exists in this list" },
        { status: 409 },
      );
    }

    const listItem = await prisma.listItem.create({
      data: {
        listId: listId,
        mediaId: content?.mediaId,
        mediaType: content?.mediaType,
        title: content?.title || "Unknown",
        poster: content?.poster || "",
      },
    });

    return NextResponse.json({ listItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to add item to list" },
      { status: 500 },
    );
  }
}
