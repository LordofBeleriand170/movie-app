import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json(); // App Router requires reading json this way
  const { input, page } = body;

  let url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(input)}${page && page !== 0 ? `&page=${page}` : ""}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };
  let response = await fetch(url, options).then((res) => res.json());

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

      if (item.media_type === "movie") {
        const details = await fetch(
          `https://api.themoviedb.org/3/movie/${item.id}?append_to_response=credits`,
          options,
        ).then((res) => res.json());

        actors =
          details.credits?.cast?.slice(0, 5).map((actor) => actor.name) || [];

        runtime = details.runtime;
        status = details.status;
      }

      if (item.media_type === "tv") {
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

      const rating = await prisma?.rating?.findFirst({
        where: { movieId: parseInt(item?.id) },
        include: { voters: true },
      });

      const aggregateResult = await prisma.rating.aggregate({
        where: { movieId: parseInt(item?.id) },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      const ratingAvg = {
        _avg: {
          rating:
            aggregateResult._count.rating > 0 && aggregateResult._avg.rating,
        },
        _count: {
          rating: aggregateResult._count.rating,
        },
      };

      return {
        ...item,
        genres: genre_ids?.map((id) => genreMap[id]) || [],
        actors,
        runtime,
        last_air_date,
        number_of_seasons,
        status,
        seasons,
        rating,
        ratingAvg,
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
