"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import slugify from "@/libs/slugify";
import TrendingLoading from "@/app/TrendingLoading";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const RecentlyVisited = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const recently = useCollectionStore((state) => state.recently);
  const [recentlyError, setRecentlyError] = useState(false);

  const [recentlyLoading, setRecentlyLoading] = useState(true);

  const fetchUserCollections = useCollectionStore(
    (state) => state.fetchUserCollections,
  );
  const clearRecentlyVisited = useCollectionStore(
    (state) => state.clearRecentlyVisited,
  );

  useEffect(() => {
    if (status === "loading") return;

    if (!user?.email) {
      setRecentlyLoading(false);
      return;
    }

    const fetchRecentlyVisited = async () => {
      try {
        setRecentlyLoading(true);
        setRecentlyError(false);
        await fetchUserCollections(user.email);
      } catch (error) {
        console.error("Error fetching recently visited items:", error);
        setRecentlyError(true);
      } finally {
        setRecentlyLoading(false);
      }
    };

    fetchRecentlyVisited();
  }, [user?.email, status, fetchUserCollections]);

  const handleClear = async () => {
    if (!user) return;
    await clearRecentlyVisited(user);
  };

  const isLoading = status === "loading" || recentlyLoading;

  return (
    <div className="flex flex-col w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            Recently viewed
          </h2>
        </div>

        {recently && recently.length > 0 && !isLoading && (
          <button
            onClick={handleClear}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-base text-blue-400 font-bold transition-all duration-200 cursor-pointer hover:text-blue-300"
          >
            <span>Clear All</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <TrendingLoading count={10} />
      ) : recentlyError ? (
        <div className="flex items-center justify-center py-10 text-sm text-red-400 bg-red-950/20 rounded-xl border border-red-900/50">
          Something went wrong. Please check your connection.
        </div>
      ) : recently && recently.length > 0 ? (
        <div className="relative">
          <div className="flex overflow-x-auto gap-3.5 py-3 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {[...recently]?.map((recent) => {
              console.log("RECENT: ", recent);
              const titleOrName = recent.title || recent.name || "untitled";
              const slug = slugify(recent.id, titleOrName);
              const recentType = recent?.type || recent?.mediaType;
              const id = recentType + "-" + recent?.id;

              console.log("RECENTLYY: ", recent);

              return (
                <div
                  key={id}
                  className="w-28 sm:w-36 md:w-40 lg:w-44 flex-shrink-0"
                >
                  <div className="group relative transition-all duration-300 ease-out">
                    <IconComponent
                      result={recent}
                      slug={slug}
                      watchDisplay={"true"}
                      checked={recent?.isWatched}
                      isWatchedLoading={recentlyLoading}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 rounded-2xl bg-neutral-900/30 border border-white/5 backdrop-blur-md">
          <p className="text-xs sm:text-sm text-neutral-400 font-medium">
            You have no recently viewed media.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentlyVisited;
