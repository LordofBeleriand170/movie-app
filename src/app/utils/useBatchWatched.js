import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

const globalWatchedCache = {};
const pendingIdsSet = new Set();

export const useBatchWatched = () => {
  const [watchedStatuses, setWatchedStatuses] = useState({});

  const [isInitialReady, setIsInitialReady] = useState(false);

  const user = useCollectionStore((state) => state.user);
  const watchlist = useCollectionStore((state) => state.watchlist);
  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);
  const { data: session, status } = useSession();

  const lastItemsRef = useRef([]);

  const checkBatch = useCallback(
    async (items, isBackgroundRefresh = false) => {
      const activeUserId = user?.id || session?.user?.id;
      if (status === "loading" || !activeUserId || !items?.length) {
        return {};
      }

      lastItemsRef.current = items;

      const normalizedItems = items
        .map((item) => {
          const id = item?.id || item?.mediaId || item?.contentId;
          if (!id) return null;

          const mediaType =
            item?.mediaType ||
            item?.media_type ||
            (item?.first_air_date ? "tv" : "movie");

          const key = `${mediaType}_${id}`;
          return { key };
        })
        .filter(Boolean);

      const idsToFetch = normalizedItems.filter(
        (id) =>
          isBackgroundRefresh ||
          !isInitialReady ||
          (globalWatchedCache[id] === undefined && !pendingIdsSet.has(id)),
      );

      if (idsToFetch.length === 0) {
        setWatchedStatuses({ ...globalWatchedCache });
        setIsInitialReady(true);
        return globalWatchedCache;
      }

      idsToFetch.forEach((id) => pendingIdsSet.add(id));

      try {
        const batchResult = await isWatchedBatch(activeUserId, idsToFetch);

        if (batchResult && typeof batchResult === "object") {
          Object.entries(batchResult).forEach(([id, isWatched]) => {
            const numericId = !isNaN(Number(id)) ? Number(id) : id;
            globalWatchedCache[numericId] = Boolean(isWatched);
            globalWatchedCache[id] = Boolean(isWatched);
          });
        }

        idsToFetch.forEach((id) => {
          if (globalWatchedCache[id] === undefined) {
            globalWatchedCache[id] = false;
          }
        });

        setWatchedStatuses({ ...globalWatchedCache });
      } catch (err) {
        console.error("Batch check failed:", err);
      } finally {
        idsToFetch.forEach((id) => pendingIdsSet.delete(id));

        setIsInitialReady(true);
      }
      return globalWatchedCache;
    },
    [status, user?.id, session?.user?.id, isWatchedBatch, isInitialReady],
  );

  const setOptimisticStatus = useCallback((id, status) => {
    globalWatchedCache[id] = status;
    const numericId = !isNaN(Number(id)) ? Number(id) : id;
    globalWatchedCache[numericId] = status;
    setWatchedStatuses({ ...globalWatchedCache });
  }, []);

  useEffect(() => {
    if (watchlist && lastItemsRef.current.length > 0) {
      checkBatch(lastItemsRef.current, true);
    }
  }, [watchlist, checkBatch]);

  return {
    watchedStatuses,
    checkBatch,
    isInitialReady,
    setOptimisticStatus,
  };
};
