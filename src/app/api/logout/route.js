// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "User logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // immediately expires
    path: "/",
  });

  return response;
}
