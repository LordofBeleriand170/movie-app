import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, type, user } = body;

    const mediaType = type === "tvshows" ? "tv" : "movie";

    const mediaInWatchlist = await prisma.watchlist.findFirst({
      where: {
        userId: user?.id,
        mediaId: parseInt(id),
        mediaType: mediaType,
      },
    });

    console.log("sddssds", mediaInWatchlist);

    const isWatched = mediaInWatchlist ? true : false;

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 },
      );
    }

    if (user?.id) {
      const now = new Date();

      await prisma.$transaction(async (tx) => {
        await tx.userRecentlyVisited.deleteMany({
          where: {
            userId: user.id,
            mediaId: String(id),
            mediaType: mediaType,
          },
        });

        await tx.userRecentlyVisited.create({
          data: {
            userId: user.id,
            mediaId: String(id),
            mediaType: mediaType,
            isWatched,
            createdAt: now,
          },
        });

        const extraItems = await tx.userRecentlyVisited.findMany({
          where: { userId: user.id },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: 10,
          select: { id: true },
        });

        if (extraItems.length > 0) {
          await tx.userRecentlyVisited.deleteMany({
            where: {
              id: { in: extraItems.map((e) => e.id) },
            },
          });
        }
      });
    }

    const tmdbOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };

    const infoResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}`,
      tmdbOptions,
    );
    const infoData = await infoResponse.json();
    let seasonOne = infoData?.seasons?.find(
      (season) => season?.name === "Season 1" || season?.season_number === 1,
    );
    if (mediaType === "tv") {
      const seasonResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/1`,
        tmdbOptions,
      );

      const seasonIndex = infoData.seasons.findIndex(
        (season) => season?.season_number === 1 || season?.name === "Season 1",
      );

      if (seasonResponse.ok) {
        const seasonData = await seasonResponse.json();

        seasonOne = {
          ...seasonOne,
          episodes: seasonData.episodes || [],
        };

        infoData.seasons[seasonIndex] = {
          ...infoData.seasons[seasonIndex],
          ...seasonData,
        };
      }
    }

    let seasons = 0;

    for (let i = 0; i < infoData?.seasons?.length; i++) {
      if (infoData?.seasons[i]?.name.toLowerCase() === `season ${i}`) {
        if (new Date(infoData?.seasons[i]?.air_date) < new Date()) {
          seasons++;
        }
      } else {
        continue;
      }
    }

    infoData.number_of_seasons = seasons;

    const creditsUrl =
      mediaType === "tv"
        ? `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?language=en-US`
        : `https://api.themoviedb.org/3/movie/${id}/credits`;
    const creditsResponse = await fetch(creditsUrl, tmdbOptions);
    const creditsData = await creditsResponse.json();

    let url;
    let data;

    if (mediaType === "tv") {
      url = `https://api.themoviedb.org/3/tv/${id}`;
      const res = await fetch(url, tmdbOptions);
      data = await res.json();
    }

    let mainDirector;
    let mainWriter;
    let mainCreator;

    mainCreator = data?.created_by[0];

    if (mediaType === "movie") {
      const director = creditsData.crew.find((c) => c.job === "Director");
      mainDirector = director.length > 1 ? director[0] : director;

      const writers = creditsData.crew.filter(
        (c) => c.job.includes("Writer") || c.job.includes("Screenplay"),
      );
      mainWriter = writers.length > 1 ? writers[0] : writers;
    } else if (mediaType === "tv") {
      const directors = creditsData.crew
        .filter((c) => c.jobs?.some((j) => j.job === "Director"))
        .map((c) => {
          const directorJob = c.jobs.find((j) => j.job === "Director");
          return { name: c.name, episode_count: directorJob.episode_count };
        })
        .sort((a, b) => b.episode_count - a.episode_count);

      mainDirector = directors;

      const writers = creditsData.crew
        .filter((c) => c.jobs?.some((j) => j.job.includes("Writer")))
        .map((c) => {
          const writerJob = c.jobs.find((j) => j.job.includes("Writer"));
          return { name: c.name, episode_count: writerJob.episode_count };
        })
        .sort((a, b) => b.episode_count - a.episode_count);

      mainWriter = writers;
    }

    const videosResponse = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos`,
      tmdbOptions,
    ).then((res) => res.json());

    const trailer = videosResponse?.results?.filter((video) =>
      video?.type.includes("Trailer"),
    );

    const externalIdsRes = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/external_ids`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      },
    );

    const externalIds = await externalIdsRes.json();

    if (!externalIds.imdb_id) {
      console.log("No IMDb ID found");
    }

    let omdbData;

    if (externalIds?.imdb_id) {
      const omdbRes = await fetch(
        `https://www.omdbapi.com/?i=${externalIds.imdb_id}&apikey=${process.env.OMDB_KEY}`,
      );
      omdbData = await omdbRes.json();
    }

    if (omdbData?.Response === "False") {
      console.log("OMDb error:", omdbData.Error);
    }

    let keywordsData;

    const keywords = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/keywords`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      },
    );

    keywordsData = await keywords.json();

    const rating = await prisma?.rating?.findFirst({
      where: { movieId: parseInt(id) },
      include: { voters: true },
    });

    const aggregateResult = await prisma.rating.aggregate({
      where: { movieId: parseInt(id) },
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

    const response = {
      info: infoData,
      credits: creditsData,
      creator: mainCreator,
      director: mainDirector,
      writer: mainWriter,
      video: trailer?.results?.[0] || trailer?.[0],
      awards: omdbData?.Awards,
      keywordsData,
      rating,
      ratingAvg,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching movie info:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
