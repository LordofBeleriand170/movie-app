import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { mediaType } = body;

  const url = `https://api.themoviedb.org/3/genre/${mediaType === "tvshows" ? "tv" : "movie"}/list?language=en`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };
  const response = await fetch(url, options).then((res) => res.json());

  return NextResponse.json(response);
}
