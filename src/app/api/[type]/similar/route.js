import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { id, type } = body;

  let url = `https://api.themoviedb.org/3/${type}/${id}/recommendations?language=en-US&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };
  let response = await fetch(url, options).then((res) => res.json());

  const infoResponse = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}`,
    options,
  );
  const infoData = await infoResponse.json();

  if (infoData.belongs_to_collection !== null) {
  }

  if (response?.results?.length === 0) {
    url = `https://api.themoviedb.org/3/trending/${type}/day?language=en-US&page=1`;

    const trendingResponse = await fetch(url, options).then((res) =>
      res.json(),
    );

    response.results = trendingResponse.results.filter((movie) => {
      const isEqual = movie.id.toString() !== id;
      return isEqual;
    });
  }

  return NextResponse.json(response);
}
