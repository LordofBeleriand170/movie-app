import { NextResponse } from "next/server";
import getCategoryId from "@/libs/getCategoryId";

export async function POST(req) {
  const body = await req.json(); // App Router requires reading json this way
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

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  }).then((res) => res.json());

  const voteWorth = (vote) => {
    if (vote < 7) {
      return vote / 2;
    } else if (vote < 7.6 && vote >= 7) {
      return vote;
    } else if (vote < 8 && vote >= 7.6) {
      return vote * 2;
    } else if (vote >= 8) {
      return vote * 7;
    }
  };

  if (Array.isArray(response.results)) {
    response.results = response.results.map((item) => ({
      ...item,
      media_type: item.media_type || filter.mediaType,
      weight: voteWorth(item.vote_average) * item.vote_count,
    }));
  }

  if (Array.isArray(response.results) && filter.date) {
    response.results.sort(
      (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0),
    );
  }

  !rating && response?.results?.sort((a, b) => b.weight - a.weight);

  response.results = response?.results?.filter(
    (result) => result.poster_path !== null || result.backdrop_path !== null,
  );

  /*if (filter.option === "upcoming") {
      response.results = response.results.filter((result) => {
        console.log(new Date(result.release_date));
        new Date(result.release_date) < new Date();
      });
    }*/

  const finalResponse = {
    result: response,
    total_pages: response.total_pages,
    total_results: response.total_results,
  };

  return NextResponse.json(finalResponse);
}
