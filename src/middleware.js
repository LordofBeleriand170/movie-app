import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Koristimo NextAuth helper da dekodiramo token i pročitamo podatke iz njega
  const token = await getToken({
    req: request,
    secret: process.env.SECRET, // Proverite da li vam je u .env fajlu varijabla SECRET ili NEXTAUTH_SECRET
  });

  // 1. Provera da li je korisnik uopšte ulogovan
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Ako nema tokena, preusmeri na login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Provera role (Primer: dozvoli pristup samo ako je role === "ADMIN")
    if (token.role !== "ADMIN") {
      // Ako nema odgovarajuću rolu, preusmeri na unauthorized stranicu
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
