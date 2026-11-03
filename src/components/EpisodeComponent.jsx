import React from "react";
import ImageFormat from "./ImageFormat";
import { formatDate } from "@/app/utils/formatDate";

const EpisodeComponent = ({ episode, index }) => {
  const imageUrl = episode.still_path
    ? `https://image.tmdb.org/t/p/original${episode.still_path}`
    : "/no-poster.webp";

  const name = episode?.still_path;
  return (
    <div
      key={index}
      className="relative pr-3  bg-zinc-900 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex gap-6 h-50 min-h-[200px] cursor-pointer"
    >
      <ImageFormat imageUrl={imageUrl} name={name} width={"w-100"} />

      <div className="flex flex-col gap-1 pt-4 pb-1 w-full">
        <div className="flex flex-col gap-0.5">
          <span className="uppercase text-xs">episode {index + 1}</span>
          <span className="font-semibold text-xl text-white line-clamp-1">
            {episode?.name}
          </span>
          <div className="flex items-baseline gap-2">
            {episode.runtime && (
              <span className="text-xs text-white">
                {episode.runtime} minutes
              </span>
            )}{" "}
            |{" "}
            <span className="text-xs text-white">
              {formatDate(episode?.air_date)}
            </span>
          </div>
        </div>

        <p className="text-xs text-white line-clamp-4">{episode?.overview}</p>
      </div>
    </div>
  );
};

export default EpisodeComponent;
