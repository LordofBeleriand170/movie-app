import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { watchlist = [], favorite = [] } = await req.json();

    /*let mostUsualGenres = {};
    let mostUsualDecade = {};

    for (let i = 0; i < favorite.length; i++) {
      const infoResponse = await fetch(
        `https://api.themoviedb.org/3/${favorite[i]?.mediaType}/${favorite[i]?.mediaId}`,
        tmdbOptions,
      );
      const infoData = await infoResponse.json();

      let genres = infoData?.genres;
      let decade = infoData?.release_date?.split("-")[0]?.slice(0, 3) + "0s";

      for (let i = 0; i < genres?.length; i++) {
        if (genres?.[i]?.id in mostUsualGenres) {
          mostUsualGenres[genres?.[i]?.id] += 1;
        } else {
          mostUsualGenres[genres?.[i]?.id] = 1;
        }
      }

      if (decade in mostUsualDecade) {
        mostUsualDecade[decade] += 1;
      } else {
        mostUsualDecade[decade] = 1;
      }
    }

    for (let j = 0; j < watchlist.length; j++) {
      const infoResponse = await fetch(
        `https://api.themoviedb.org/3/${watchlist[j]?.mediaType}/${watchlist[j]?.mediaId}`,
        tmdbOptions,
      );
      const infoData = await infoResponse.json();

      let genres = infoData?.genres;
      let decade = infoData?.release_date?.split("-")[0]?.slice(0, 3) + "0s";

      const isNotInFavorite = !favorite.some(
        (fav) => fav.mediaId === watchlist[j]?.mediaId,
      );

      if (
        (watchlist?.[j]?.userRating === null ||
          watchlist?.[j]?.userRating >= 4) &&
        isNotInFavorite
      ) {
        for (let i = 0; i < genres?.length; i++) {
          if (genres?.[i]?.id in mostUsualGenres) {
            mostUsualGenres[genres?.[i]?.id] += 1;
          } else {
            mostUsualGenres[genres?.[i]?.id] = 1;
          }
        }

        if (decade in mostUsualDecade) {
          mostUsualDecade[decade] += 1;
        } else {
          mostUsualDecade[decade] = 1;
        }
      }
    }

    mostUsualDecade = Object.entries(mostUsualDecade)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, count]) => ({ id: isNaN(key) ? key : Number(key), count }));
    mostUsualGenres = Object.entries(mostUsualGenres)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, count]) => ({ id: isNaN(key) ? key : Number(key), count }));

    console.log("most usual genres: ", mostUsualGenres);

    let url = `https://api.themoviedb.org/3/discover/movie
?${mostUsualGenres ? `with_genres=${mostUsualGenres[0]?.id}|${mostUsualGenres[1]?.id}|${mostUsualGenres[2]?.id}` : ``}
  release_date.gte=1895-03-22&release_date.lte=2025-12-31&sort_by=vote_average.desc"&include_adult=false`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    }).then((res) => res.json());

    console.log("RESPONSE: ", response);

    const filteredResults = response?.results?.filter(
      (result) =>
        !watchlist.some((item) => item?.mediaId === result?.id) &&
        !favorite.some((item) => item?.mediaId === result?.id),
    );

    console.log("FILTERED RESULS: ", filteredResults);*/

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

    console.log("INFO DATA: ", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching movie info:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
