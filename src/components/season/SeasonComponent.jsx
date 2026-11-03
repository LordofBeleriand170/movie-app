"use client";

import { useContentStore } from "@/features/content/contentStore";
import EpisodeComponent from "../EpisodeComponent";
import { useEffect, useState } from "react";

const SeasonComponent = ({ id, currentSeason }) => {
  const fetchSeason = useContentStore((state) => state.fetchSeason);
  const episodes = useContentStore((state) => state.episodes);
  const season = useContentStore((state) => state.season);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSeason = async () => {
      try {
        setLoading(true);
        await fetchSeason(id, currentSeason);
      } catch (err) {
        console.log("ERR: ", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && currentSeason) {
      handleSeason();
    }
  }, [id, currentSeason, fetchSeason]);

  return (
    <main className="relative flex flex-col bg-black px-8">
      <div className="w-[90%] mx-auto">
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"></div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col h-full mt-5 items-center justify-center">
            <div className="flex w-full overflow-x-auto gap-5 pt-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"></div>
          </div>

          <div>
            <h2 id="seasonId-name" className="text-3xl">
              {season?.name}
            </h2>
            <span>{season?.overview}</span>
          </div>

          <div>
            <div className="flex rounded-2xl border border-gray-500 bg-black p-5 flex-col gap-2">
              {episodes && Array.isArray(episodes) ? (
                episodes.map((episode, index) => {
                  return (
                    <EpisodeComponent
                      key={index}
                      episode={episode}
                      index={index}
                    />
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
