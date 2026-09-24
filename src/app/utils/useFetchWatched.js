"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCollectionStore } from "@/features/collection/collectionStore";

export const useFetchWatched = (recently) => {
  const { data: session } = useSession();
  const isWatchedBatch = useCollectionStore((state) => state.isWatchedBatch);

  useEffect(() => {
    const activeUserId = session?.user?.id;
    if (!activeUserId || !recently?.length) return;

    const items = recently.map((rec) => {
      const mediaType =
        rec?.type || rec?.mediaType || (rec?.first_air_date ? "tv" : "movie");
      const id = rec?.id || rec?.mediaId;
      return `${mediaType}_${id}`;
    });

    isWatchedBatch(activeUserId, items).catch((err) => {
      console.error("Batch check failed:", err);
    });
  }, [recently, session?.user?.id, isWatchedBatch]);
};
