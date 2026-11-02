"use client";

import { useContentStore } from "@/features/content/contentStore";
import React, { useEffect } from "react";
import slugify from "@/libs/slugify";
import IconComponent from "../IconComponent";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const Similar = ({ type, id }) => {
  const similar = useContentStore((state) => state.similar);
  const movies = useContentStore((state) => state.movies);
  const content = useContentStore((state) => state.content);

  const {
    watchedStatuses,
    checkBatch,
    loading: isWatchedLoading,
  } = useBatchWatched();

  useEffect(() => {
    const getSimilar = async () => {
      if (!id || !type) return;
      try {
        await similar(id, type, content);
      } catch (err) {
        console.error("Error fetching Similar:", err);
      }
    };
    getSimilar();
  }, [id, type, similar]);

  useEffect(() => {
    if (Array.isArray(movies) && movies.length > 0) {
      checkBatch(movies);
    }
  }, [movies, checkBatch]);

  return (
    <section className="flex flex-col gap-5 px-8 py-6 w-full text-white">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Similar
        </h2>
      </div>

      <div className="relative w-full">
        <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent pb-4">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie, index) => {
              const titleOrName = movie.title || movie.name || "untitled";
              const slug = slugify(movie.id, titleOrName);
              const contentId = movie.id || movie.mediaId || movie.contentId;

              return (
                <div
                  key={movie.id || index}
                  className="group flex flex-col gap-2.5 flex-shrink-0 w-36 sm:w-44"
                >
                  <IconComponent
                    result={movie}
                    slug={slug}
                    watchDisplay="yes"
                    checked={watchedStatuses[contentId] ?? false}
                    isWatchedLoading={isWatchedLoading}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-neutral-400 italic py-4">
              No similar media found.
            </p>
          )}
        </div>

        {Array.isArray(movies) && movies.length > 0 && (
          <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#05070d] to-transparent z-10" />
        )}
      </div>
    </section>
  );
};

export default Similar;
