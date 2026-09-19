import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.TMDB_ACCESS_TOKEN) {
      return NextResponse.json("Missing TMDB Access Token");
    }

    const url = `https://api.themoviedb.org/3/configuration/countries`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const response = await fetch(url, options).then((res) => res.json());

    const countries = response.map((res) => ({
      name: res.english_name,
    }));

    return NextResponse.json(countries);
  } catch (err) {
    console.log(err);
  }
}
