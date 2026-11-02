import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
  trendingResult,
  loadMore,
  threshold = 0,
  rootMargin = "200px",
}) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!trendingResult || trendingResult.length === 0) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    };

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
