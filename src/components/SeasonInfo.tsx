import React from "react";
import { TvShow, Season } from "@/features/tv/tvStore";
import Image from "next/image";

interface SeasonInfoProps {
  tvShow: TvShow;
  currentSeason: Season[] | null;
}

const SeasonInfo: React.FC<SeasonInfoProps> = ({ tvShow, currentSeason }) => {
  return (
    <div className="relative overflow-hidden min-h-[350px]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat bg-top brightness-40"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${tvShow?.backdrop_path})`,
            backgroundSize: "86%",
          }}
        />

        {/* Fade image to black on the right */}
      </div>

      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: "15%",
          background:
            "linear-gradient(to left, black 0%, black 10%, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: "15%",
          background:
            "linear-gradient(to right, black 0%, black 10%, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Dark overlays */}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[350px]  gap-8 px-16 2xl:px-82 xl:px-60 lg:px-40 md:px-20 sm:px-10 py-12">
        {/* Poster */}
        <div className="relative h-[300px] w-[200px] shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 brightness-90">
          <Image
            src={`https://image.tmdb.org/t/p/original${currentSeason?.poster_path}`}
            fill
            className="object-cover"
            alt={currentSeason?.name}
          />
        </div>

        {/* Info */}
        <div className="pb-2">
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {currentSeason?.name}
          </h2>

          <div className="mt-3 flex gap-4 text-sm text-zinc-400">
            {currentSeason?.air_date && (
              <>
                <span>{currentSeason.air_date.slice(0, 4)}</span>
              </>
            )}
          </div>

          <p className="mt-5 w-[80%] leading-7 text-zinc-300 line-clamp-4">
            {currentSeason?.overview}
          </p>
          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 cursor-pointer">
              Episodes
            </button>

            <button className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 backdrop-blur hover:bg-white/10 cursor-pointer">
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonInfo;
