"use client";

import { useEffect, useState } from "react";
import { Episode, useTvShowStore } from "@/features/tv/tvStore";
import Image from "next/image";

const SeasonComponent = ({ id, tvShow, currentSeason, setCurrentSeason }) => {
  const [season, setSeason] = (useState < number) | (null > 1);

  const fetchSeason = useTvShowStore((state) => state.fetchSeason);

  useEffect(() => {
    const getSeason = async () => {
      try {
        const response = await fetchSeason(id, season);
        setCurrentSeason(response);
      } catch (err) {
        console.log(err);
      }
    };
    if (season !== null) {
      getSeason();
    }
  }, [season, id, fetchSeason]);

  console.log(currentSeason);

  return (
    <main className="relative flex flex-col bg-black px-8">
      <div className="w-[90%] mx-auto">
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"></div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col h-full mt-5 items-center justify-center">
            <div className="flex w-full overflow-x-auto scroll-smooth gap-5 pt-4 scrollbar-hide scrollbar-thin">
              {tvShow?.seasons?.map((season, index) => (
                <div
                  onClick={() => setSeason(season.season_number)}
                  key={index}
                  className="cursor-pointer flex flex-col items-center gap-3 flex-shrink-0"
                >
                  <div className="relative h-[300px] w-[200px]">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${season.poster_path}`}
                      fill
                      className="rounded-lg object-cover"
                      alt={season.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {currentSeason && (
              <div className="flex rounded-2xl border border-gray-500 bg-black p-5 flex-col gap-2">
                {currentSeason?.episodes &&
                Array.isArray(currentSeason?.episodes) ? (
                  currentSeason?.episodes.map((episode, index) => (
                    <div
                      key={index}
                      className="relative pr-3 
bg-zinc-900
backdrop-blur-md
rounded-2xl
shadow-2xl overflow-hidden flex gap-6 min-h-50 cursor-pointer"
                    >
                      <div className="relative w-72 self-stretch flex-shrink-0 overflow-hidden rounded-l-2xl">
                        <Image
                          src={
                            episode.still_path
                              ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                              : "/image-not-found.jpg"
                          }
                          alt={episode.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-1 pt-4 pb-1 w-full">
                        <div className="flex flex-col gap-0.5">
                          <span className="uppercase text-xs">
                            episode {index + 1}
                          </span>
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
                              {episode?.air_date}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-white line-clamp-4">
                          {episode?.overview}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No episodes available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeasonComponent;
