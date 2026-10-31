import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userData } = body;

    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: "User data and ID required" },
        { status: 400 },
      );
    }

    // Provera da li korisnik postoji
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ažuriranje korisnika u bazi
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        ...(userData.username && { name: userData.username }),
        ...(userData.password && { password: userData.password }),
        ...(userData.image && { image: userData.image }),
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
