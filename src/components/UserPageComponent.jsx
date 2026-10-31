"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useState } from "react";
import UserInfoComponent from "./UserInfoComponent";
import IconComponent from "./IconComponent";
import slugify from "@/libs/slugify";
import { Heart, Bookmark, Film, Tv, LucideClock2 } from "lucide-react";
import { GoClock } from "react-icons/go";

const UserPageComponent = () => {
  const [activeTab, setActiveTab] = useState("watchlist");

  const [activeFavorite, setActiveFavorite] = useState("movies");
  const [activeWatchlist, setActiveWatchlist] = useState("movies");
  const [activeBookmark, setActiveBookmark] = useState("movies");

  const watchlist = useCollectionStore((state) => state.watchlist);
  const favorite = useCollectionStore((state) => state.favorite);
  const bookmark = useCollectionStore((state) => state.bookmark);

  const movieFavorite = favorite?.filter((item) => item.mediaType === "movie");
  const tvShowFavorite = favorite?.filter((item) => item.mediaType === "tv");

  const movieWatchlist = watchlist?.filter(
    (item) => item.mediaType === "movie",
  );
  const tvShowWatchlist = watchlist?.filter((item) => item.mediaType === "tv");

  const movieBookmark = bookmark?.filter((item) => item.mediaType === "movie");
  const tvShowBookmark = bookmark?.filter((item) => item.mediaType === "tv");

  let isActiveFavorite =
    activeFavorite === "movies" ? movieFavorite : tvShowFavorite;

  let isActiveWatchlist =
    activeWatchlist === "movies" ? movieWatchlist : tvShowWatchlist;

  let isActiveBookmark =
    activeBookmark === "movies" ? movieBookmark : tvShowBookmark;

  return (
    <main className="min-h-screen text-slate-100 bg-black pb-16">
      <div className="w-[90%] px-8 mx-auto space-y-10 pt-6">
        <div className="rounded-2xl bg-neutral-900/80 border border-white/10 p-6 shadow-2xl">
          <UserInfoComponent />
        </div>

        <div className="relative flex w-full bg-[#121215]  rounded-xl p-1.5">
          <button
            onClick={() => setActiveTab("favorite")}
            className={`flex items-center justify-center cursor-pointer w-1/3 py-3 rounded-lg transition-colors ${
              activeTab === "favorite"
                ? "text-red-500 bg-red-500/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex items-center cursor-pointer justify-center w-1/3 py-3 rounded-lg transition-colors ${
              activeTab === "watchlist"
                ? "text-cyan-400 bg-cyan-500/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("bookmark")}
            className={`flex items-center cursor-pointer justify-center w-1/3 py-3 rounded-lg transition-colors ${
              activeTab === "bookmark"
                ? "text-cyan-300 bg-cyan-500/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LucideClock2 className="w-5 h-5" />
          </button>
        </div>

        {activeTab === "favorite" && (
          <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    Favorites
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {activeFavorite === "movies"
                      ? movieFavorite?.length
                      : tvShowFavorite?.length}{" "}
                    titles saved
                  </p>
                </div>
              </div>

              <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/10 w-fit">
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeFavorite === "movies"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveFavorite("movies")}
                >
                  <Film className="w-3.5 h-3.5" />
                  Movies
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeFavorite === "tv"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveFavorite("tv")}
                >
                  <Tv className="w-3.5 h-3.5" />
                  TV Shows
                </button>
              </div>
            </div>

            {!isActiveFavorite || isActiveFavorite.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-26 text-center border border-dashed border-white/10 rounded-xl bg-neutral-950/60">
                <Heart className="w-10 h-10 text-neutral-600 mb-2.5" />
                <p className="text-neutral-400 text-sm font-medium">
                  No favorites added yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7 gap-2">
                {isActiveFavorite?.map((item, idx) => {
                  const titleOrName = item.title || item.name || "untitled";
                  const slug = slugify(item.mediaId, titleOrName);

                  return (
                    <div
                      key={idx}
                      className="group relative w-[150px] min-w-[150px] flex flex-col bg-neutral-950 border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/30"
                    >
                      <div className="group relative">
                        <IconComponent
                          result={item}
                          slug={slug}
                          watchDisplay={"no"}
                          isUserPage={true}
                        />
                      </div>
                      <div className="p-2.5 flex flex-col justify-between flex-1 bg-neutral-950">
                        <span className="text-xs font-semibold text-neutral-200 group-hover:text-red-400 transition-colors line-clamp-1">
                          {item?.name || item?.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium mt-1">
                          {item?.releaseDate?.split("-")[0] || "N/A"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "watchlist" && (
          <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Watched
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {activeWatchlist === "movies"
                      ? movieWatchlist?.length
                      : tvShowWatchlist?.length}{" "}
                    titles saved
                  </p>
                </div>
              </div>

              <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/10 w-fit">
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeWatchlist === "movies"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveWatchlist("movies")}
                >
                  <Film className="w-3.5 h-3.5" />
                  Movies
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeWatchlist === "tv"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveWatchlist("tv")}
                >
                  <Tv className="w-3.5 h-3.5" />
                  TV Shows
                </button>
              </div>
            </div>

            {!isActiveWatchlist || isActiveWatchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-26 text-center border border-dashed border-white/10 rounded-xl bg-neutral-950/60">
                <Bookmark className="w-10 h-10 text-neutral-600 mb-2.5" />
                <p className="text-neutral-400 text-sm font-medium">
                  Nothing in your watched list yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7 gap-2">
                  {isActiveWatchlist?.map((item, idx) => {
                    const titleOrName = item.title || item.name || "untitled";
                    const slug = slugify(item.mediaId, titleOrName);

                    return (
                      <div
                        key={idx}
                        className="group relative flex flex-col bg-neutral-950 border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30"
                      >
                        <div className="group">
                          <IconComponent
                            result={item}
                            slug={slug}
                            watchDisplay={"no"}
                            isUserPage={true}
                          />
                        </div>

                        <div className="p-2.5 flex flex-col justify-between flex-1 bg-neutral-950">
                          <span className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                            {item?.name || item?.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-medium mt-1">
                            {item?.releaseDate?.split("-")[0] || "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "bookmark" && (
          <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <GoClock className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Bookmark
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {activeBookmark === "movies"
                      ? movieBookmark?.length
                      : tvShowBookmark?.length}{" "}
                    titles saved
                  </p>
                </div>
              </div>

              <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/10 w-fit">
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeBookmark === "movies"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveBookmark("movies")}
                >
                  <Film className="w-3.5 h-3.5" />
                  Movies
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeBookmark === "tv"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveBookmark("tv")}
                >
                  <Tv className="w-3.5 h-3.5" />
                  TV Shows
                </button>
              </div>
            </div>

            {!isActiveBookmark || isActiveBookmark.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-26 text-center border border-dashed border-white/10 rounded-xl bg-neutral-950/60">
                <GoClock className="w-10 h-10 text-neutral-600 mb-2.5" />
                <p className="text-neutral-400 text-sm font-medium">
                  Nothing in your bookmark list yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7 gap-2">
                  {isActiveBookmark?.map((item, idx) => {
                    const titleOrName = item.title || item.name || "untitled";
                    const slug = slugify(item.mediaId, titleOrName);

                    return (
                      <div
                        key={idx}
                        className="group relative w-[150px] min-w-[150px] flex flex-col bg-neutral-950 border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30"
                      >
                        <div className="group">
                          <IconComponent
                            result={item}
                            slug={slug}
                            watchDisplay={"no"}
                            isUserPage={true}
                          />
                        </div>
                        <div className="p-2.5 flex flex-col justify-between flex-1 bg-neutral-950">
                          <span className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                            {item?.name || item?.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-medium mt-1">
                            {item?.releaseDate?.split("-")[0] || "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default UserPageComponent;
