import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback } from "react";

export const useHandleWatched = () => {
  const [loading, setLoading] = useState(false);
  const user = useCollectionStore((state) => state.user);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);

  const cacheRef = useRef({});

  const checkWatchedList = useCallback(
    async (items) => {
      if (status === "loading") return cacheRef.current;

      const activeUserId = user?.id || session?.user?.id;
      if (!activeUserId || !items.length) return cacheRef.current;

      const allContentIds = items
        .map((item) => item?.id || item?.mediaId || item?.contentId)
        .filter(Boolean);

      if (!allContentIds.length) return cacheRef.current;

      const missingIds = allContentIds.filter(
        (id) => cacheRef.current[id] === undefined,
      );

      if (missingIds.length === 0) {
        return cacheRef.current;
      }

      setLoading(true);
      try {
        const newWatchedMap = await isWatchedBatch(activeUserId, missingIds);

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
