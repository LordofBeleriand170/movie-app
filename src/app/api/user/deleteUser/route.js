import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { supabase } from "@/libs/supabaseClient";

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.image && user.image.includes("supabase.co")) {
      try {
        const urlParts = user.image.split("/avatars/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from("avatars").remove([filePath]);
        }
      } catch (storageErr) {
        console.error("Failed to delete avatar from storage:", storageErr);
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
