"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useToggleWatchlist = () => {
  const addWatchlist = useCollectionStore((state) => state.addWatchlist);
  const user = useCollectionStore((state) => state.user);

  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const toggleWatchlist = async (result) => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
      return;
    }

    console.log("RESULT TOGGLE: ", result);

    const activeUserId = user?.id || session?.user?.id;
    if (!activeUserId) return;

    try {
      await addWatchlist(activeUserId, result);
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    }
  };

  return { toggleWatchlist, isAuthenticated };
};
