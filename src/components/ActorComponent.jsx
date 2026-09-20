"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useContentStore } from "@/features/content/contentStore";

const ActorComponent = () => {
  const content = useContentStore((state) => state.content);
  const casts = content?.credits?.cast || [];

  return (
    <div className="flex flex-col gap-3 relative py-2 px-8">
      <div className="flex items-center gap-2.5">
        <span className="h-6 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Actors
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent pb-3">
          {casts.slice(0, 15).map((cast) => {
            const hasProfile =
              cast?.profile_path && !cast.profile_path.includes("null");
            const fallbackImg =
              cast?.gender === 1
                ? "/female-not-found.jpg"
                : "/male-not-found.jpg";
            const imageUrl = hasProfile
              ? `https://image.tmdb.org/t/p/w300/${cast.profile_path}`
              : fallbackImg;

            return (
              <Link
                href={`/person/${cast?.id}-${cast?.name?.toLowerCase().replaceAll(" ", "-")}`}
                key={cast.id}
                className="flex flex-col bg-[#121824] hover:bg-[#1a2334] border border-gray-800/80 hover:border-gray-700 min-w-[150px] w-[150px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group flex-shrink-0 shadow-lg"
              >
                <div className="relative w-full h-40 bg-gray-900 overflow-hidden">
                  <Image
                    src={imageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 origin-top"
                    fill
                    alt={cast?.name || "Actor"}
                  />
                </div>

                <div className="flex flex-col p-3 gap-0.5 min-h-[85px] justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                      {cast?.name}
                    </span>

                    <span className="text-[11px] text-gray-400 line-clamp-1 font-medium mt-0.5">
                      {cast?.character || cast?.roles?.[0]?.character || "N/A"}
                    </span>
                  </div>

                  {cast?.total_episode_count && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      {cast?.total_episode_count} episodes
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {casts.length > 15 && (
            <div className="flex items-center justify-center min-w-[120px] flex-shrink-0">
              <button className="text-xs font-bold text-gray-300 hover:text-white bg-[#121824] hover:bg-[#1a2334] border border-gray-800 px-4 py-3 rounded-lg transition-all">
                View All
              </button>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0 h-full w-12 pointer-events-none bg-gradient-to-l from-black via-black/40 to-transparent" />
      </div>
    </div>
  );
};

export default ActorComponent;
