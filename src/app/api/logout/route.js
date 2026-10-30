import { NextResponse } from "next/server";

async function logoutHandler(request) {
  // Return a success JSON response instead of redirecting
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 },
  );

  // List of all tokens your app might be using
  const cookiesToClear = [
    "token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
  ];

  cookiesToClear.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  });

  return response;
}

// Support both GET and POST so it never throws 405 errors
export async function GET(request) {
  return logoutHandler(request);
}

export async function POST(request) {
  return logoutHandler(request);
}
