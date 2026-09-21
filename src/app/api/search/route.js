import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { input, page } = body;

    if (!input) {
      return NextResponse.json({
        result: [],
        total_pages: 0,
        total_results: 0,
      });
    }

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    const searchUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(input)}${page && page !== 0 ? `&page=${page}` : ""}`;

    const [response, genreResponse, tvGenreResponse] = await Promise.all([
      fetch(searchUrl, options).then((res) => res.json()),
      fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en",
        options,
      ).then((res) => res.json()),
      fetch(
        "https://api.themoviedb.org/3/genre/tv/list?language=en",
        options,
      ).then((res) => res.json()),
    ]);

    if (!response || !response.results) {
      return NextResponse.json({
        result: [],
        total_pages: 0,
        total_results: 0,
      });
    }

    const genres = [
      ...(genreResponse?.genres || []),
      ...(tvGenreResponse?.genres || []),
    ];
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

        try {
          if (item.media_type === "movie") {
            const details = await fetch(
              `https://api.themoviedb.org/3/movie/${item.id}?append_to_response=credits`,
              options,
            ).then((res) => res.json());

            actors =
              details.credits?.cast?.slice(0, 5).map((actor) => actor.name) ||
              [];
            runtime = details.runtime;
            status = details.status;
          }

          if (item.media_type === "tv") {
            const details = await fetch(
              `https://api.themoviedb.org/3/tv/${item.id}?append_to_response=credits`,
              options,
            ).then((res) => res.json());

            actors =
              details.credits?.cast?.slice(0, 5).map((actor) => actor.name) ||
              [];
            last_air_date = details.last_air_date;
            status = details.status;

            const today = new Date();

            seasons =
              details.seasons
                ?.filter(
                  (season) =>
                    season.air_date && new Date(season.air_date) <= today,
                )
                .map((season) => ({
                  season_number: season.season_number,
                  name: season.name,
                  air_date: season.air_date,
                  episode_count: season.episode_count,
                  poster_path: season.poster_path,
                })) || [];

            number_of_seasons = seasons.length;
          }

          let rating = null;
          let ratingAvg = { _avg: { rating: null }, _count: { rating: 0 } };

          if (typeof prisma !== "undefined" && item?.id) {
            const movieIdNum = parseInt(item.id);

            rating = await prisma.rating.findFirst({
              where: { movieId: movieIdNum },
              include: { voters: true },
            });

            const aggregateResult = await prisma.rating.aggregate({
              where: { movieId: movieIdNum },
              _avg: { rating: true },
              _count: { rating: true },
            });

            ratingAvg = {
              _avg: {
                rating:
                  aggregateResult._count.rating > 0
                    ? aggregateResult._avg.rating
                    : null,
              },
              _count: {
                rating: aggregateResult._count.rating,
              },
            };
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
            rating,
            ratingAvg,
          };
        } catch (err) {
          console.error(`Error processing item ${item.id}:`, err);
          return { ...item, genres: [], actors: [] };
        }
      }),
    );

    return NextResponse.json({
      result,
      total_pages: response.total_pages || 1,
      total_results: response.total_results || 0,
    });
  } catch (error) {
    console.error("SEARCH_API_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
