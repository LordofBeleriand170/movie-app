"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useContentStore } from "@/features/content/contentStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa";
import { useToggleWatchlist } from "@/app/utils/handleToggleWatchlist";

const ContentActionsComponent = ({ media }) => {
  const user = useCollectionStore((state) => state.user);
  const favorite = useCollectionStore((state) => state.favorite);
  const watchlist = useCollectionStore((state) => state.watchlist);
  const addFavorite = useCollectionStore((state) => state.addFavorite);
  const content = useContentStore((state) => state.content);
  const { toggleWatchlist } = useToggleWatchlist();

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();
  const searchParams = useSearchParams();

  false;

  const [watched, setWatched] = useState(false);
  const [currentlyWatched, setCurrentlyWatched] = useState(false);
  const [favoriteContent, setFavoriteContent] = useState(false);

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const router = useRouter();

  const handleFavorite = async () => {
    await addFavorite(
      user?.id ? user?.id : user?.email,
      content?.info,
      mediaType,
    );
  };

  const mediaType = media === "movies" ? "movie" : "tv";

  let result = content
    ? {
        id: content?.info?.id,
        name: content?.info?.title || content?.info?.name,
        poster_path: content?.info?.poster_path,
        type: content?.info?.release_date ? "movie" : "tv",
      }
    : null;
  console.log("WATCHLIST: ", watchlist);
  console.log("CONTENT: ", content);
  console.log("MEDIATYPE", mediaType);
  const mediaInWatchlist = watchlist.some(
    (item) =>
      item.mediaId === content?.info?.id && item.mediaType === mediaType,
  );

  console.log("MEDIAINWATCHLIST: ", mediaInWatchlist);

  const favoriteInWatchlist = favorite.some(
    (item) =>
      item.mediaId === content?.info?.id && item.mediaType === mediaType,
  );

  useEffect(() => {
    if (!currentlyWatched) {
      if (mediaInWatchlist) {
        setWatched(true);
      } else {
        setWatched(false);
      }
    }

    if (favoriteInWatchlist) {
      setFavoriteContent(true);
    } else {
      setFavoriteContent(false);
    }
  }, [watchlist, user]);

  const favoriteType = favorite.filter((fav) => fav.mediaType === media).length;

  return (
    <div className="flex items-center justify-around w-full max-w-xs gap-4 p-2">
      {/* Watch Button */}
      <div className="flex flex-col items-center gap-1.5 group">
        <button
          onClick={() => {
            if (isAuthenticated) {
              setWatched(!watched);
              setCurrentlyWatched(!currentlyWatched);
              toggleWatchlist(result);
            } else {
              router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
            }
          }}
          className={`p-3 rounded-full transition-all duration-200 cursor-pointer ${
            watched
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10"
          }`}
        >
          <MdOutlineRemoveRedEye className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200">
          Watch
        </span>
      </div>

      {/* Like Button */}
      <div className="flex flex-col items-center gap-1.5 group">
        <button
          onClick={() => {
            if (isAuthenticated) {
              if (favoriteType < 5) {
                setFavoriteContent(!favoriteContent);
                handleFavorite();
              } else {
                toast.error(
                  `You can only add 5 favorite ${media === "tv" ? "tv shows" : "movies"}`,
                );
              }
            } else {
              router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
            }
          }}
          className={`p-3 rounded-full transition-all duration-200 cursor-pointer ${
            favoriteContent
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10"
          }`}
        >
          <FaRegHeart className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200">
          Like
        </span>
      </div>

      {/* Watchlist Button */}
      <div className="flex flex-col items-center gap-1.5 group">
        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-all duration-200 cursor-pointer">
          <GoClock className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200">
          Watchlist
        </span>
      </div>
    </div>
  );
};

export default ContentActionsComponent;
