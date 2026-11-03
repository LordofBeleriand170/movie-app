"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { GoClock } from "react-icons/go";
import { MdOutlineRemoveRedEye, MdClose } from "react-icons/md";
import {
  LuArrowLeft,
  LuGlobe,
  LuListPlus,
  LuLock,
  LuPlus,
} from "react-icons/lu"; // Icon for Add to List
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa";
import { useToggleWatchlist } from "@/app/utils/handleToggleWatchlist";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { useContentStore } from "@/features/content/contentStore";
import { showToast } from "./ToastComponent";

const OptionModal = ({ media, setIsModalOpen }) => {
  const user = useCollectionStore((state) => state.user);
  const favorite = useCollectionStore((state) => state.favorite);
  const watchlist = useCollectionStore((state) => state.watchlist);
  const bookmark = useCollectionStore((state) => state.bookmark);
  const addFavorite = useCollectionStore((state) => state.addFavorite);
  const addBookmark = useCollectionStore((state) => state.addBookmark);
  const content = useContentStore((state) => state.content);
  const createList = useCollectionStore((state) => state.createList);
  const addToList = useCollectionStore((state) => state.addToList);
  const lists = useCollectionStore((state) => state.lists);
  const getLists = useCollectionStore((state) => state.getLists);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalView, setModalView] = useState("main");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toggleWatchlist } = useToggleWatchlist();

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [watched, setWatched] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [currentlyWatched, setCurrentlyWatched] = useState(false);
  const [favoriteContent, setFavoriteContent] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkContent, setBookmarkContent] = useState(false);
  const [listAdded, setListAdded] = useState(false); // State for list button toggle if needed

  const modalContentRef = useRef(null);

  const fullUrl = `${pathname}?${searchParams.toString()}`;
  const router = useRouter();

  const mediaType = media === "movies" ? "movie" : "tv";

  const handleFavorite = async () => {
    await addFavorite(user?.id ? user?.id : user?.email, content, mediaType);
  };

  const handleBookmark = async () => {
    await addBookmark(user?.id ? user?.id : user?.email, content, mediaType);
  };

  const handleCreateList = async () => {
    setListAdded(!listAdded);

    await createList(user?.id, title, description);
  };

  const handleAddToList = async (listId) => {
    const contentFormat = {
      mediaId: content?.id,
      mediaType: mediaType,
      title: content?.title,
      poster: content?.poster_path,
    };

    await addToList(contentFormat, listId);
  };

  const result = content
    ? {
        id: content?.id,
        name: content?.title || content?.name,
        poster_path: content?.poster_path,
        type: content?.release_date ? "movie" : "tv",
        release_date: content?.release_date || content?.first_air_date,
      }
    : null;

  const mediaInWatchlist = watchlist.some(
    (item) => item.mediaId === content?.id && item.mediaType === mediaType,
  );

  const favoriteInWatchlist = favorite.some(
    (item) => item.mediaId === content?.id && item.mediaType === mediaType,
  );

  const bookmarkExists = bookmark.some(
    (item) => item.mediaId === content?.id && item.mediaType === mediaType,
  );

  useEffect(() => {
    if (!currentlyWatched) {
      setWatched(mediaInWatchlist);
    }
    if (!favorites) {
      setFavoriteContent(favoriteInWatchlist);
    }
    if (!bookmarked) {
      setBookmarkContent(bookmarkExists);
    }
  }, [watchlist, user, bookmark]);

  const favoriteType = favorite.filter((fav) => fav.mediaType === media).length;

  useEffect(() => {
    const fetchLists = async () => {
      try {
        await getLists();
      } catch (err) {
        console.log("ERR: ", err);
      }
    };
    fetchLists();
  }, [modalView === "select-list"]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        ref={modalContentRef}
        className="relative w-full max-w-sm rounded-2xl bg-gray-900 border border-white/10 shadow-2xl p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {modalView !== "main" && (
              <button
                onClick={() =>
                  setModalView(
                    modalView === "create-list" ? "select-list" : "main",
                  )
                }
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <LuArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {modalView === "main" && "Manage Content"}
              {modalView === "select-list" && "Select or Create List"}
              {modalView === "create-list" && "Create New List"}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {modalView === "main" && (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setWatched(!watched);
                  setCurrentlyWatched(!currentlyWatched);
                  toggleWatchlist(result);
                } else {
                  router.push(
                    `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                  );
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                watched
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
              }`}
            >
              <MdOutlineRemoveRedEye className="w-4 h-4 shrink-0" />
              <span>Watch</span>
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  if (favoriteType < 5 || favoriteContent) {
                    setFavoriteContent(!favoriteContent);
                    setFavorites(!favorites);
                    handleFavorite();
                  } else {
                    showToast(
                      "error",
                      `You can only add 5 favorite ${media === "tv" ? "tv shows" : "movies"}`,
                    );
                  }
                } else {
                  router.push(
                    `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                  );
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                favoriteContent
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
              }`}
            >
              <FaRegHeart className="w-4 h-4 shrink-0" />
              <span>Like</span>
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setBookmarkContent(!bookmarkContent);
                  setBookmarked(!bookmarked);
                  handleBookmark();
                } else {
                  router.push(
                    `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                  );
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                bookmarkContent
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
              }`}
            >
              <GoClock className="w-4 h-4 shrink-0" />
              <span>Watchlist</span>
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setModalView("select-list");
                } else {
                  router.push(
                    `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                  );
                }
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
            >
              <LuListPlus className="w-4 h-4 shrink-0" />
              <span>Add to List</span>
            </button>
          </div>
        )}

        {modalView === "select-list" && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setModalView("create-list")}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LuPlus className="w-4 h-4" />
                Create New List
              </span>
              <span>+</span>
            </button>

            <div className="text-[11px] font-medium text-neutral-400 px-1 pt-1">
              Your Existing Lists:
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {lists.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-500">
                  No lists found. Create your first list!
                </div>
              ) : (
                lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => handleAddToList(list.id)}
                    className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-left bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-white group-hover:text-purple-300 transition-colors">
                        {list.text}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate max-w-[200px]">
                        {list.description || "No description"}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-neutral-300">
                      {list?.items?.length} items
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {modalView === "create-list" && (
          <form onSubmit={handleCreateList} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                List Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Favorite Sci-Fi Movies"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your list..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isPublic
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                      : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <LuGlobe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    !isPublic
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                      : "bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <LuLock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Creating..." : "Create List & Add Item"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OptionModal;
