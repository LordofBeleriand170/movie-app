import { NextResponse } from "next/server";
import getCategoryId from "@/libs/getCategoryId";

export async function POST(req) {
  const body = await req.json();
  const { filter } = body;

  const decade = filter?.decade?.substring(0, filter.decade.length - 1);
  const year = filter?.year;
  const rating = filter?.rating;

  if (!process.env.TMDB_ACCESS_TOKEN) {
    return NextResponse.json("Missing TMDB Access Token");
  }

  filter.category = filter.category.replaceAll("%20", " ");

  const genreId = await getCategoryId(
    filter.mediaType,
    filter.category.charAt(0).toUpperCase() + filter.category.slice(1),
  );

  let url;

  const dateField =
    filter.mediaType === "tv" ? "first_air_date" : "primary_release_date";

  url = `https://api.themoviedb.org/3/discover/${filter.mediaType}
?${genreId ? `with_genres=${genreId}` : ``}
${
  decade
    ? `&${dateField}.gte=${year ? year : decade}-01-01
&${dateField}.lte=${parseInt(year ? year : `${decade.substring(0, decade.length - 1) + 9}`)}-12-31`
    : `release_date.gte=1895-03-22&release_date.lte=2025-12-31`
}
&language=en-US${`&${rating === "highest" ? "sort_by=vote_average.desc" : rating === "lowest" ? "sort_by=vote_average.asc" : "sort_by=vote_count.desc"}`}&include_adult=false
&page=${filter.page}`;

  /*if (filter.decade || filter.year) {
    if (filter.decade && !filter.year) {
      const dateField =
        filter.mediaType === "tv" ? "first_air_date" : "primary_release_date";
      url = `https://api.themoviedb.org/3/discover/${filter.mediaType}
?${genreId && `with_genres=${genreId}`}
&${dateField}.gte=${decade}-01-01
&${dateField}.lte=${parseInt(decade) + 9}-12-31
&language=en-US&sort_by=vote_count.desc&include_adult=false
&page=${filter.page}`;
    } else if (filter.year) {
      url = `https://api.themoviedb.org/3/discover/movie&sort_by=vote_count.desc&include_adult=false&page=${filter.page}`;
    }
  } else {
    if (filter.option) {
      url = `https://api.themoviedb.org/3/${filter.mediaType}/${filter.option.replace(/-/g, "_")}?language=en-US&sort_by=vote_count.desc&include_adult=false&page=${filter.page}`;
    } else if (!filter.option) {
      url = `https://api.themoviedb.org/3/discover/${filter.mediaType}?release_date.gte=1895-03-22&release_date.lte=2025-12-31&sort_by=vote_count.desc&include_adult=false&page=${filter.page}`;
    }
  }*/

  /*else if (genreId) {
    if (filter.decade) {
      const dateField =
        filter.mediaType === "tv" ? "first_air_date" : "primary_release_date";

      url = `https://api.themoviedb.org/3/discover/${filter.mediaType}
?with_genres=${genreId}
&sort_by=vote_count.desc
&${dateField}.gte=${decade}-01-01
&${dateField}.lte=${parseInt(decade) + 9}-12-31
&language=en-US
&page=${filter.page}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/${filter.mediaType}?with_genres=${genreId}&sort_by=vote_count.desc&language=en-US&page=${filter.page}`;
    }
  }*/

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  }).then((res) => res.json());

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const genreResponse = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options,
  ).then((res) => res.json());

  const tvGenreResponse = await fetch(
    "https://api.themoviedb.org/3/genre/tv/list?language=en",
    options,
  ).then((res) => res.json());

  const genres = [...genreResponse.genres, ...tvGenreResponse.genres];

  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.id, genre.name]),
  );

  const result = await Promise.all(
    response.results.map(async ({ genre_ids, ...item }) => {
      let actors = [];
      let runtime = null;
      let last_air_date = null;
      let number_of_seasons = 0;
      let status = null;
      let seasons = [];
      if (filter.mediaType === "movie") {
        console.log(
          `https://api.themoviedb.org/3/movie/${item?.id}?append_to_response=credits`,
        );
        const details = await fetch(
          `https://api.themoviedb.org/3/movie/${item?.id}?append_to_response=credits`,
          options,
        ).then((res) => res.json());

        actors =
          details.credits?.cast?.slice(0, 5).map((actor) => actor.name) || [];

        runtime = details.runtime;
        status = details.status;
      }

      if (filter.mediaType === "tv") {
        const details = await fetch(
          `https://api.themoviedb.org/3/tv/${item.id}?append_to_response=credits`,
          options,
        ).then((res) => res.json());

        actors =
          details.credits?.cast?.slice(0, 5).map((actor) => actor.name) || [];

        last_air_date = details.last_air_date;

        status = details.status;

        const today = new Date();

        for (let i = 0; i < details?.seasons?.length; i++) {
          if (details?.seasons[i]?.name.toLowerCase() === `season ${i}`) {
            if (new Date(details?.seasons[i]?.air_date) < new Date()) {
              number_of_seasons++;
            }
          } else {
            continue;
          }
        }

        seasons =
          details.seasons
            ?.filter(
              (season) => season.air_date && new Date(season.air_date) <= today,
            )
            .map((season) => ({
              season_number: season.season_number,
              name: season.name,
              air_date: season.air_date,
              episode_count: season.episode_count,
              poster_path: season.poster_path,
            })) || [];
      }

      return {
        ...item,
        genres: genre_ids?.map((id) => genreMap[id]) || [],
        actors,
        runtime,
        last_air_date,
        number_of_seasons,
        status,
        seasons,
      };
    }),
  );

  const finalResponse = {
    result: result,
    total_pages: response.total_pages,
    total_results: response.total_results,
  };

  return NextResponse.json(finalResponse);
}
