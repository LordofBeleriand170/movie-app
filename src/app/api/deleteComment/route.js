import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, isComment } = body;

    console.log(isComment);

    if (!id) {
      return NextResponse.json({ error: "ID je obavezan" }, { status: 400 });
    }

    if (!isComment) {
      const replyExists = await prisma.reply.findUnique({
        where: { id: id },
      });

      if (!replyExists) {
        return NextResponse.json(
          { error: "Comment answer not found" },
          { status: 404 },
        );
      }

      await prisma.reply.update({
        where: { id: id },
        data: { isDeleted: true },
      });

      return NextResponse.json({
        ok: true,
        message: "Odgovor je uspešno obrisan",
      });
    } else {
      const commentExists = await prisma.comment.findUnique({
        where: { id: id },
      });

      if (!commentExists) {
        return NextResponse.json(
          { error: "Komentar nije pronađen" },
          { status: 404 },
        );
      }

      await prisma.comment.update({
        where: { id: id },
        data: { isDeleted: true },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Komentar je uspešno obrisan",
    });
  } catch (err) {
    console.error("Greška pri brisanju komentara:", err);
    return NextResponse.json(
      { error: err.message || "Greška na serveru" },
      { status: 500 },
    );
  }
}
