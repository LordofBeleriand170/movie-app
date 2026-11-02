"use client";

import { useEffect, useState } from "react";
import ImageFormat from "../ImageFormat";
import { formatDate } from "@/app/utils/formatDate";
import { useParams, useRouter } from "next/navigation";
import { useContentStore } from "@/features/content/contentStore";

const SeasonComponent = ({ id }) => {
  const [season, setSeason] = useState(null);
  const router = useRouter();
  const params = useParams();

  const currentSeason = useContentStore((state) => state.season);
  const fetchSeason = useContentStore((state) => state.fetchSeason);
  const tvShow = useContentStore((state) => state.tvShow);

  const tvShowSeason = tvShow?.season?.find(
    (season) => season?.name === "Season 1" || season?.number === 1,
  );

  const episodes = currentSeason?.episodes
    ? currentSeason?.episodes
    : tvShowSeason?.episodes;

  useEffect(() => {
    const getSeason = async () => {
      try {
        await fetchSeason(id, season);
      } catch (err) {
        console.log(err);
      }
    };
    if (season !== null) {
      getSeason();
    }
  }, [season, id, fetchSeason]);

  return (
    <main className="relative flex flex-col bg-black px-8">
      <div className="w-[90%] mx-auto">
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"></div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col h-full mt-5 items-center justify-center">
            <div className="flex w-full overflow-x-auto gap-5 pt-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              {tvShow?.seasons?.map((season, index) => {
                const imageUrl = `https://image.tmdb.org/t/p/original${season.poster_path}`;
                const name = season.name;
                const height = "h-[300px]";
                const width = "w-[200px]";

                return (
                  <div
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setSeason(season.season_number);
                      router.replace(
                        `/media/${params?.type}/${params?.slug}/seasons`,
                        {
                          scroll: false,
                        },
                      );
                    }}
                    key={index}
                    className="cursor-pointer rounded-lg flex flex-col items-center gap-3 flex-shrink-0"
                  >
                    <ImageFormat
                      imageUrl={imageUrl}
                      name={name}
                      height={height}
                      width={width}
                      style={"rounded-lg"}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 id="seasonId-name" className="text-3xl">
              {currentSeason?.name}
            </h2>
            <span>{currentSeason?.overview}</span>
          </div>

          <div>
            <div className="flex rounded-2xl border border-gray-500 bg-black p-5 flex-col gap-2">
              {episodes && Array.isArray(episodes) ? (
                episodes.map((episode, index) => {
                  const imageUrl = episode.still_path
                    ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                    : "/no-poster.webp";

                  const name = episode?.still_path;

                  return (
                    <div
                      key={index}
                      className="relative pr-3  bg-zinc-900 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex gap-6 h-50 min-h-[200px] cursor-pointer"
                    >
                      <ImageFormat
                        imageUrl={imageUrl}
                        name={name}
                        width={"w-100"}
                      />

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
                              {formatDate(episode?.air_date)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-white line-clamp-4">
                          {episode?.overview}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">
                  No episodes available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeasonComponent;
