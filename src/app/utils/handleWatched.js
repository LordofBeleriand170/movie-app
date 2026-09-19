import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback } from "react";

export const useHandleWatched = () => {
  const [loading, setLoading] = useState(false);
  const user = useCollectionStore((state) => state.user);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Use store action that handles batch checking
  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);

  // Persistent cache to keep track of already checked content IDs
  const cacheRef = useRef({});

  const checkWatchedList = useCallback(
    async (items) => {
      if (status === "loading") return cacheRef.current;

      const activeUserId = user?.id || session?.user?.id;
      if (!activeUserId || !items.length) return cacheRef.current;

      // 1. Extract valid content IDs from input items
      const allContentIds = items
        .map((item) => item?.id || item?.mediaId || item?.contentId)
        .filter(Boolean);

      if (!allContentIds.length) return cacheRef.current;

      // 2. Identify missing IDs not already stored in cache
      const missingIds = allContentIds.filter(
        (id) => cacheRef.current[id] === undefined,
      );

      // If all items are already cached, return existing cache without hitting the API/store
      if (missingIds.length === 0) {
        return cacheRef.current;
      }

      setLoading(true);
      try {
        // 3. Send only missing IDs to the store batch check
        const newWatchedMap = await isWatchedBatch(activeUserId, missingIds);

        // 4. Merge new results into persistent cache
        cacheRef.current = {
          ...cacheRef.current,
          ...newWatchedMap,
        };

        return cacheRef.current;
      } catch (err) {
        console.error("Failed to check watched statuses in batch:", err);
        return cacheRef.current;
      } finally {
        setLoading(false);
      }
    },
    [status, user?.id, session?.user?.id, isWatchedBatch],
  );

  return { checkWatchedList, isAuthenticated, loading };
};
