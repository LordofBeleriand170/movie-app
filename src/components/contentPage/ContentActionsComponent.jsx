"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";

import { useContentStore } from "@/features/content/contentStore";
import { IoChevronDown } from "react-icons/io5";

const ContentActionsComponent = ({ media, setIsModalOpen }) => {
  const watchlist = useCollectionStore((state) => state.watchlist);
  const content = useContentStore((state) => state.content);

  const mediaType = media === "movies" ? "movie" : "tv";

  const mediaInWatchlist = watchlist.some(
    (item) => item.mediaId === content?.id && item.mediaType === mediaType,
  );

  return (
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-md ${
          mediaInWatchlist
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20"
            : "bg-transparent text-neutral-200 border-white/10 hover:bg-white/5"
        }`}
      >
        <span className="text-xs font-semibold tracking-wide">
          {mediaInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </span>
        <IoChevronDown className="w-4 h-4 text-neutral-400" />
      </button>
    </div>
  );
};

export default ContentActionsComponent;
