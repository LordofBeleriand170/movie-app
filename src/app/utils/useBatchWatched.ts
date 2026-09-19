import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

const globalWatchedCache: Record<string | number, boolean> = {};
const pendingIdsSet = new Set<string | number>();

export const useBatchWatched = () => {
  // 1. Initialize state as empty on mount to avoid rendering stale initial cache
  const [watchedStatuses, setWatchedStatuses] = useState<
    Record<string | number, boolean>
  >({});

  // Track initial fetch completion so UI knows when first check is done
  const [isInitialReady, setIsInitialReady] = useState(false);

  const user = useCollectionStore((state) => state.user);
  const watchlist = useCollectionStore((state) => state.watchlist);
  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);
  const { data: session, status } = useSession();

  const lastItemsRef = useRef<[]>([]);

  const checkBatch = useCallback(
    async (items: [], isBackgroundRefresh = false) => {
      const activeUserId = user?.id || session?.user?.id;
      if (status === "loading" || !activeUserId || !items?.length) {
        return {};
      }

      lastItemsRef.current = items;

      const rawIds = items
        .map((item) => item?.id || item?.mediaId || item?.contentId)
        .filter(Boolean);

      // On initial page loads or forced updates, bypass stale in-memory cache
      const idsToFetch = rawIds.filter(
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
          // Set accurate server status
          Object.entries(batchResult).forEach(([id, isWatched]) => {
            const numericId = !isNaN(Number(id)) ? Number(id) : id;
            globalWatchedCache[numericId] = Boolean(isWatched);
            globalWatchedCache[id] = Boolean(isWatched);
          });
        }

        // Fill unreturned IDs as false
        idsToFetch.forEach((id) => {
          if (globalWatchedCache[id] === undefined) {
            globalWatchedCache[id] = false;
          }
        });

        // Sync local component state with fresh server data
        setWatchedStatuses({ ...globalWatchedCache });
      } catch (err) {
        console.error("Batch check failed:", err);
      } finally {
        idsToFetch.forEach((id) => pendingIdsSet.delete(id));

        // Mark initial loading complete
        setIsInitialReady(true);
      }
      return globalWatchedCache;
    },
    [status, user?.id, session?.user?.id, isWatchedBatch, isInitialReady],
  );

  const setOptimisticStatus = useCallback(
    (id: string | number, status: boolean) => {
      globalWatchedCache[id] = status;
      const numericId = !isNaN(Number(id)) ? Number(id) : id;
      globalWatchedCache[numericId] = status;
      setWatchedStatuses({ ...globalWatchedCache });
    },
    [],
  );

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
