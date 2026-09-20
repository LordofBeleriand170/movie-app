import { NextResponse } from "next/server";
import pLimit from "p-limit";

export const revalidate = 60; // cache 60s
const TMDB_BASE = "https://api.themoviedb.org/3";

const trailerCache = new Map();

const limit = pLimit(3);

async function fetchTrending(mediaType, page, token) {
  const res = await fetch(
    `${TMDB_BASE}/discover/${mediaType}?language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

async function fetchTrailer(id, mediaType, token) {
  if (trailerCache.has(id)) return trailerCache.get(id);

  try {
    const res = await fetch(
      `${TMDB_BASE}/${mediaType}/${id}/videos?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    const trailer = data.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    );
    const key = trailer?.key || null;

    if (key) trailerCache.set(id, key);

    return key;
  } catch (err) {
    console.error(`Trailer fetch failed for ${id}`, err);
    return null;
  }
}

export async function POST(req) {
  try {
    const { mediaType, page } = await req.json();
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "TMDB token missing" },
        { status: 500 },
      );
    }

    const data = await fetchTrending(mediaType, page, token);
    if (!data?.results) return NextResponse.json({ results: [] });

    const sorted = data.results.sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();

      if (dateB !== dateA) return dateB - dateA;
      return (b.popularity || 0) - (a.popularity || 0);
    });

    const topTen = sorted.slice(0, 10);
    const topTenWithTrailers = await Promise.all(
      topTen.map((item) =>
        limit(async () => {
          const trailerKey = await fetchTrailer(
            item.id,
            item.media_type || mediaType,
            token,
          );
          return { ...item, trailerKey };
        }),
      ),
    );

    const results = data.results.map((item) => {
      const topItem = topTenWithTrailers.find((t) => t.id === item.id);
      return topItem || item;
    });

    return NextResponse.json({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results,
    });
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending" },
      { status: 500 },
    );
  }
}
