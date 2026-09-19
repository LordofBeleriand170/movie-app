import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  trendingResult: any[]; // your movie data array
  loadMore: () => void; // function to fetch next page
  threshold?: number; // optional observer threshold
  rootMargin?: string; // optional root margin
}

export const useInfiniteScroll = ({
  trendingResult,
  loadMore,
  threshold = 0,
  rootMargin = "200px",
}: InfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trendingResult || trendingResult.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    };

    // Disconnect old observer if exists
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin,
      threshold,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [trendingResult, loadMore, threshold, rootMargin]);

  return loadMoreRef;
};
