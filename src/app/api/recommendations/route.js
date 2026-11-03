import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { watchlist = [], favorite = [] } = await req.json();

    let page = 1;
    let data = [];

    const tmdbOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    while (data.length < 21) {
      const infoResponse = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&include_adult=false&vote_count.gte=3000&page=${page}`,
        tmdbOptions,
      );
      const infoData = await infoResponse.json();
      let responseData = infoData?.results?.filter(
        (result) =>
          !watchlist.some((item) => item?.mediaId === result?.id) &&
          !favorite.some((item) => item?.mediaId === result?.id),
      );

      data.push(...responseData);
      page++;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching movie info:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
