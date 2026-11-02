import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState } from "react";

export const useBatchWatched = () => {
  const [watchedStatuses, setWatchedStatuses] = useState({});

  const [isInitialReady, setIsInitialReady] = useState(false);

  const user = useCollectionStore((state) => state.user);
  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);
  const { data: session, status } = useSession();

  const lastItemsRef = useRef([]);

  const checkBatch = useCallback(
    async (items) => {
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
            item?.type ||
            item?.mediaType ||
            (item?.first_air_date ? "tv" : "movie");

          const key = `${mediaType}_${id}`;

          return { key };
        })
        .filter(Boolean);

      try {
        const batchResult = await isWatchedBatch(activeUserId, normalizedItems);

        setWatchedStatuses({ ...batchResult });
      } catch (err) {
        console.error("Batch check failed:", err);
      } finally {
        setIsInitialReady(true);
      }
    },
    [status, user?.id, session?.user?.id, isWatchedBatch, isInitialReady],
  );
  return {
    watchedStatuses,
    checkBatch,
  };
};
