import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("PATHNAME: ", pathname);

  const token = await getToken({
    req: request,
    secret: process.env.SECRET,
  });

  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Ako nema tokena, preusmeri na login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/settings") || pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/settings",
    "/account",
  ],
};
