import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { id, season } = body;

  if (!process.env.TMDB_ACCESS_TOKEN) {
    return NextResponse.json("Missing TMDB Access Token");
  }
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  }).then((res) => res.json());

  return NextResponse.json(response);
}
