import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const logs = await prisma.systemLog.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json(
      {
        total: logs.length,
        logs,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
