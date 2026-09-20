"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useContentStore } from "@/features/content/contentStore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import slugify from "@/libs/slugify";
import TrendingLoading from "@/app/TrendingLoading";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const RecommendedComponent = () => {
  const fetchUserCollections = useCollectionStore(
    (state) => state.fetchUserCollections,
  );
  const recommendations = useContentStore((state) => state.recommendations);

  const [recommended, setRecommended] = useState([]);
  const [recommendedError, setRecommendedError] = useState(false);

  const { watchedStatuses, checkBatch } = useBatchWatched();

  const [isLoading, setIsLoading] = useState(true);
  const [isWatchedLoading, setIsWatchedLoading] = useState(true);
  const [collectionsLoaded, setCollectionsLoaded] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user;

  // 1. Fetch user collections once email is available
  useEffect(() => {
    if (!user?.email) return;

    const loadCollections = async () => {
      try {
        await fetchUserCollections(user.email);
      } finally {
        setCollectionsLoaded(true);
      }
    };

    loadCollections();
  }, [user?.email, fetchUserCollections]);

  // 2. Handle watched status loading state
  useEffect(() => {
    if (watchedStatuses && Object.keys(watchedStatuses).length === 0) {
      setIsWatchedLoading(true);
    } else {
      setIsWatchedLoading(false);
    }
  }, [watchedStatuses]);

  // 3. Batch check watched items
  useEffect(() => {
    if (recommended && recommended.length > 0) {
      checkBatch(recommended);
    }
  }, [recommended, checkBatch]);

  // 4. Fetch recommendations ONLY AFTER collections finish loading
  // We explicitly trigger this once collectionsLoaded becomes true
  useEffect(() => {
    // If user is logged in, wait for collections to load first
    if (status === "authenticated" && !collectionsLoaded) return;
    if (status === "loading") return;

    const handleRecommended = async () => {
      try {
        setRecommendedError(false);
        setIsLoading(true);
        // Get snapshot of current watchlist/favorite without subscribing to future updates
        const currentWatchlist = useCollectionStore.getState().watchlist;
        const currentFavorite = useCollectionStore.getState().favorite;

        const data = await recommendations(currentWatchlist, currentFavorite);
        console.log("DATA: ", data);
        setRecommended(data);
      } catch (err) {
        setRecommendedError(true);
        console.error("ERROR: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    handleRecommended();

    // DO NOT include `watchlist` or `favorite` in dependencies.
    // That is what prevented the component from re-fetching when clicking "+"!
  }, [status, collectionsLoaded, recommendations]);

  return (
    <div className="px-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            Recommendations
          </h2>
        </div>

        <p className="text-sm text-zinc-400">
          Movies and TV shows just for you
        </p>

        {isLoading ? (
          <TrendingLoading count={10} />
        ) : recommendedError ? (
          <div className="flex items-center justify-center py-10 text-sm text-red-400 bg-red-950/20 rounded-xl border border-red-900/50">
            Something went wrong. Please check your connection.
          </div>
        ) : recommended && recommended.length > 0 ? (
          <div className="relative">
            <div className="flex overflow-x-auto gap-3.5 py-3 scrollbar-thin scroll-smooth transition-all duration-300">
              {[...recommended].reverse().map((recent) => {
                const titleOrName = recent.title || recent.name || "untitled";
                const slug = slugify(recent.id, titleOrName);
                const contentId =
                  recent.id || recent.mediaId || recent.contentId;

                return (
                  <div
                    key={recent.id}
                    className="w-28 sm:w-36 md:w-40 lg:w-44 flex-shrink-0"
                  >
                    <div className="group relative transition-all duration-300 ease-out">
                      <IconComponent
                        result={recent}
                        slug={slug}
                        watchDisplay={"true"}
                        checked={watchedStatuses[contentId] ?? false}
                        isWatchedLoading={isWatchedLoading}
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
              You have no recommended media.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedComponent;
