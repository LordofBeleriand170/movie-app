"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import IconComponent from "./IconComponent";
import slugify from "@/libs/slugify";
import { useBatchWatched } from "@/app/utils/useBatchWatched";
import { useContentStore } from "@/features/content/contentStore";

const PaginatedItems = ({
  category,
  trendingLoading,
  setTrendingLoading,
  trendingResult,
  setTrendingResult,
  option,
  page,
  setPage,
  mediaType,
  year,
  decade,
  rating,
}) => {
  const trending = useContentStore((state) => state.trending);
  const optionFetch = useContentStore((state) => state.optionFetch);
  const error = useContentStore((state) => state.error);

  const { watchedStatuses, checkBatch } = useBatchWatched();

  const loadMoreRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  const [loadedImageIds, setLoadedImageIds] = useState(new Set());
  const [isImagesReady, setIsImagesReady] = useState(false);
  const [isWatchedLoading, setIsWatchedLoading] = useState(true);

  useEffect(() => {
    if (watchedStatuses && Object.keys(watchedStatuses).length === 0) {
      setIsWatchedLoading(true);
    } else {
      setIsWatchedLoading(false);
    }
  }, [watchedStatuses]);

  useEffect(() => {
    setLoadedImageIds(new Set());
    setIsImagesReady(false);
    setHasMore(true);
    setPage(1);
    setTrendingResult(null);
  }, [category, mediaType, option, year, decade, rating]);

  const handleImageLoad = useCallback((id) => {
    if (!id) return;
    setLoadedImageIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (page > 1) {
      setIsImagesReady(true);
      return;
    }

    if (!trendingResult || trendingResult.length === 0) {
      setIsImagesReady(true);
      return;
    }

    const pageOneIds = trendingResult.slice(0, 20).map((m) => m.id);
    const allLoaded = pageOneIds.every((id) => loadedImageIds.has(id));

    if (allLoaded) {
      setIsImagesReady(true);
    }
  }, [loadedImageIds, trendingResult, page]);

  useEffect(() => {
    if (trendingResult && trendingResult.length > 0) {
      checkBatch(trendingResult);
    }
  }, [trendingResult, checkBatch]);

  useEffect(() => {
    if (
      page === 1 &&
      trendingResult &&
      trendingResult.length > 0 &&
      !isImagesReady
    ) {
      const timer = setTimeout(() => {
        setIsImagesReady(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [page, trendingResult, isImagesReady]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !trendingLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [trendingLoading, hasMore, setPage],
  );

  useEffect(() => {
    const observerOption = {
      root: null,
      rootMargin: "300px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, observerOption);
    const current = loadMoreRef.current;

    if (current && hasMore) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver, hasMore, trendingResult?.length, page]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const useFilters = Boolean(
      (category && category !== "") ||
        (option && option !== "") ||
        year !== null ||
        (decade !== null && decade !== "") ||
        rating !== null,
    );

    const filter = {
      mediaType,
      option,
      category: category || "",
      page,
      year,
      decade,
      rating,
      signal,
    };

    const fetchData = async () => {
      try {
        setTrendingLoading(true);

        let rawData = null;

        if (useFilters) {
          rawData = await optionFetch(filter);
        } else {
          rawData = await trending(mediaType, page, { signal });
        }

        const data = Array.isArray(rawData)
          ? rawData
          : (rawData?.results ?? []);

        if (!data || data.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setTrendingResult((prev) => {
          if (page === 1 || !prev) return data;
          const baseMap = new Map((prev ?? []).map((item) => [item.id, item]));
          data.forEach((item) => baseMap.set(item.id, item));
          return Array.from(baseMap.values());
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      } finally {
        if (!signal.aborted) {
          setTrendingLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [page, category, mediaType, option, year, decade, rating]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        {error ? (
          <div className="flex justify-center p-12 text-red-400 font-semibold text-sm">
            An error occurred while fetching media.
          </div>
        ) : (trendingResult?.length === 0 || !trendingResult) &&
          !trendingLoading ? (
          <div className="flex justify-center items-center p-16 rounded-2xl bg-neutral-900/30 border border-white/5 backdrop-blur-md">
            <span className="text-neutral-400 text-sm font-medium">
              No results found matching your criteria.
            </span>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.isArray(trendingResult) &&
                trendingResult.map((result, i) => {
                  const titleOrName = result.title || result.name || "untitled";
                  const slug = slugify(result.id, titleOrName);
                  const contentId =
                    result.id || result.mediaId || result.contentId;

                  return (
                    <div
                      key={result.id || i}
                      className="group relative cursor-pointer"
                    >
                      <div>
                        <IconComponent
                          result={result}
                          slug={slug}
                          watchDisplay="true"
                          checked={watchedStatuses[contentId] ?? false}
                          isWatchedLoading={isWatchedLoading}
                          onImageLoad={() => handleImageLoad(result.id)}
                          isUserPage={false}
                        />
                      </div>
                    </div>
                  );
                })}

              {page > 1 &&
                trendingLoading &&
                [...Array(12)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="aspect-[2/3] w-full bg-neutral-900/80 rounded-xl animate-pulse border border-white/5"
                  />
                ))}
            </div>
          </div>
        )}

        {hasMore && (
          <div
            ref={loadMoreRef}
            className="h-16 w-full flex justify-center items-center mt-6"
          >
            {page > 1 && trendingLoading && (
              <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-medium">
                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading additional titles...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginatedItems;
