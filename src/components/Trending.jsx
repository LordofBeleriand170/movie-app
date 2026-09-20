"use client";

import TrendingLoading from "@/app/TrendingLoading";
import VideoLoadingSkeleton from "@/app/LoadingVideoSkeleton";
import { useMovieStore } from "@/features/movie/movieStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import { useAuthStore } from "@/features/auth/authStore";
import slugify from "@/libs/slugify";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const Trending = ({ setErrorComponent }) => {
  const [videoLoading, setVideoLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");

  const [videoError, setVideoError] = useState(false);
  const [trendingError, setTrendingError] = useState(false);

  const [videoType, setVideoType] = useState("movie");

  const [popularOption, setPopularOption] = useState("movie");

  const [trendingMovie, setTrendingMovie] = useState([]);
  const [trendingShow, setTrendingShow] = useState([]);
  const {
    watchedStatuses,
    checkBatch,
    loading: isWatchedLoading,
  } = useBatchWatched();

  const trending = useMovieStore((state) => state.trending);
  const trendingVideos = useMovieStore((state) => state.trendingVideos);

  const videos = useMovieStore((state) => state.videos);
  const error = useAuthStore((state) => state.error);

  const currentList = activeTab === "movies" ? trendingMovie : trendingShow;

  useEffect(() => {
    const fetchVideoTrending = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        setVideoLoading(true);
        await trendingVideos(videoType, 1, {
          signal: controller.signal,
        });
        setVideoError(false);
      } catch (error) {
        console.error("Error fetching video trending:", error);
        setVideoError(true);
      } finally {
        clearTimeout(timeoutId);
        setVideoLoading(false);
      }
    };

    fetchVideoTrending();
  }, [trending, videoType, trendingVideos]);

  useEffect(() => {
    if (error) {
      setErrorComponent(true);
    }
  }, [error, setErrorComponent]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        setTrendingLoading(true);
        const dataMovie = await trending("movie", 1);

        let mappedData = dataMovie.map((movie) => ({
          id: movie?.id,
          title: movie?.title || movie?.name,
          name: movie?.name,
          media_type: movie?.media_type,
          poster_path: movie?.poster_path,
          first_air_date: movie?.first_air_date,
          release_date: movie?.release_date,
          backdrop_path: movie?.backdrop_path,
          adult: movie?.adult,
          overview: movie?.overview,
          original_language: movie?.original_language,
          rating: movie?.rating,
          genre_ids: movie?.genre_ids,
          trailerKey: movie?.trailerKey,
          video: movie?.video,
        }));

        setTrendingMovie(mappedData);

        const dataTv = await trending("tv", 1);

        mappedData = dataTv.map((movie) => ({
          id: movie?.id,
          title: movie?.title || movie?.name,
          name: movie?.name,
          media_type: movie?.media_type,
          poster_path: movie?.poster_path,
          first_air_date: movie?.first_air_date,
          release_date: movie?.release_date,
          backdrop_path: movie?.backdrop_path,
          adult: movie?.adult,
          overview: movie?.overview,
          original_language: movie?.original_language,
          rating: movie?.rating || null,
          genre_ids: movie?.genre_ids,
          trailerKey: movie?.trailerKey,
          video: movie?.video || null,
        }));

        setTrendingShow(mappedData);
      } catch (error) {
        console.error("Error fetching trending results:", error);
        setTrendingError(true);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingData();
  }, [trending]);

  useEffect(() => {
    if (currentList && currentList.length > 0) {
      checkBatch(currentList);
    }
  }, [currentList, checkBatch]);

  return (
    <div className="flex flex-col gap-10 w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-white">
      <section className="relative flex flex-col gap-5 rounded-2xl bg-neutral-900/60 p-6 backdrop-blur-md border border-neutral-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-neutral-100">
            Featured Trailers
          </h2>
          <div className="flex items-center gap-1 rounded-full bg-black/40 p-1.5 border border-neutral-800/60 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setPopularOption("movie");
                setVideoType("movie");
              }}
              className={`rounded-full px-5 py-1.5 cursor-pointer text-xs sm:text-sm transition-all duration-300 ${
                popularOption === "movie"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-red-500/50 bg-red-500"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
              }`}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => {
                setPopularOption("tv");
                setVideoType("tv");
              }}
              className={`rounded-full px-5 py-1.5 cursor-pointer text-xs sm:text-sm transition-all duration-300 ${
                popularOption === "tv"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-red-500/50 bg-red-500"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

        {videoLoading ? (
          <VideoLoadingSkeleton rows={1} cols={2} />
        ) : videoError ? (
          <div className="flex items-center justify-center py-10 text-sm text-red-400 bg-red-950/20 rounded-xl border border-red-900/50">
            Something went wrong. Please check your connection.
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {videos
              ?.filter((item) => item.trailerKey)
              .map((item, i) => {
                const titleOrName = item.title || item.name || "untitled";
                const slug = slugify(item.id, titleOrName);
                const mediaPath = item.release_date ? "movies" : "tvshows";

                return (
                  <div
                    key={item.id || i}
                    className="group relative min-w-[650px] sm:min-w-[750px] lg:min-w-[850px] aspect-video overflow-hidden rounded-xl bg-neutral-950 shadow-xl border border-neutral-800/60 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${item.trailerKey}`}
                      title={titleOrName}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full object-cover"
                    />
                    <Link
                      href={`/media/${mediaPath}/${slug}`}
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 opacity-90 transition-opacity group-hover:opacity-100 flex justify-between items-end"
                    >
                      <span className="font-bold text-lg sm:text-xl text-white truncate drop-shadow">
                        {titleOrName}
                      </span>
                      <span className="text-xs sm:text-sm bg-red-500 hover:text-white px-5 py-2 rounded-full font-bold shrink-0 ml-3 shadow-lg border border-red-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] flex items-center gap-1.5">
                        Details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </span>
                    </Link>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <h2 className="text-lg font-bold tracking-tight text-white">
                {activeTab === "movies" ? "Popular Movies" : "Popular TV Shows"}
              </h2>
            </div>

            {/* Dynamic Tab Switcher */}
            <div className="flex items-center bg-neutral-900/80 p-1 rounded-full border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("movies")}
                className={`px-4 py-1.5 text-xs cursor-pointer font-semibold rounded-full transition-all duration-300 ${
                  activeTab === "movies"
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveTab("tv")}
                className={`px-4 py-1.5 text-xs cursor-pointer font-semibold rounded-full transition-all duration-300 ${
                  activeTab === "tv"
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                TV Shows
              </button>
            </div>
          </div>
          {trendingLoading ? (
            <TrendingLoading rows={20} cols={1} />
          ) : trendingError ? (
            <div className="flex items-center justify-center py-8 text-xs text-red-400 bg-red-950/20 rounded-xl border border-red-900/50">
              Something went wrong loading trending data.
            </div>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto gap-4 py-3 scrollbar-thin scroll-smooth transition-all duration-300">
                {currentList?.map((result, i) => {
                  const titleOrName = result.name || result.title || "untitled";
                  const slug = slugify(result.id, titleOrName);
                  const contentId =
                    result.id || result.mediaId || result.contentId;

                  return (
                    <div
                      key={result.id || i}
                      className="w-28 sm:w-36 md:w-40 lg:w-44 flex-shrink-0"
                    >
                      <div className="group relative transition-all duration-300 ease-out">
                        <IconComponent
                          result={result}
                          slug={slug}
                          watchDisplay="true"
                          checked={watchedStatuses[contentId] ?? false}
                          isWatchedLoading={isWatchedLoading}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Trending;
