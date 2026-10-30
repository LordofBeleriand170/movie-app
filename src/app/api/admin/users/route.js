import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log("ADMIN: ", path.startsWith("/admin"), token?.role !== "ADMIN");

    // If logged in, but not an admin -> send to /unauthorized
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    // This matches what you have in your authOptions configuration
    secret: process.env.SECRET,
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
