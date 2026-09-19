"use client";

import LoadingPage from "@/app/LoadingPage";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserInfoComponent from "./UserInfoComponent";
import IconComponent from "./IconComponent";
import slugify from "@/libs/slugify";
import {
  Star,
  Heart,
  Bookmark,
  MessageSquare,
  ChevronRight,
  Film,
  Tv,
} from "lucide-react";
import Link from "next/link";

const UserPageComponent = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFavorite, setActiveFavorite] = useState<string>("movies");
  const [activeWatchlist, setActiveWatchlist] = useState<string>("movies");

  const watchlist = useCollectionStore((state) => state.watchlist);
  const favorite = useCollectionStore((state) => state.favorite);
  const fetchUserCollections = useCollectionStore(
    (state) => state.fetchUserCollections,
  );

  useEffect(() => {
    if (!user?.email) return;

    fetchUserCollections(user.email);
    setLoading(false);
  }, [user?.email]);

  if (loading) {
    return <LoadingPage />;
  }

  const movieFavorite = favorite?.filter((item) => item.mediaType === "movie");
  const tvShowFavorite = favorite?.filter((item) => item.mediaType === "tv");

  const movieWatchlist = watchlist?.filter(
    (item) => item.mediaType === "movie",
  );
  const tvShowWatchlist = watchlist?.filter((item) => item.mediaType === "tv");

  let isActiveFavorite =
    activeFavorite === "movies" ? movieFavorite : tvShowFavorite;

  let isActiveWatchlist =
    activeWatchlist === "movies" ? movieWatchlist : tvShowWatchlist;

  console.log("USER: ", user);

  return (
    <main className="min-h-screen text-slate-100 bg-black pb-16">
      <div className="w-[90%] px-8 mx-auto space-y-10 pt-6">
        {/* User Banner Header */}
        <div className="rounded-2xl bg-neutral-900/80 border border-white/10 p-6 shadow-2xl">
          <UserInfoComponent />
        </div>

        {/* FAVORITES SECTION */}
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

            {/* Filter Pill Tabs */}
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
                onClick={() => setActiveFavorite("tvshow")}
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
            <div className="flex flex-wrap gap-4">
              {isActiveFavorite?.map((item, idx) => {
                const titleOrName = item.title || item.name || "untitled";
                const slug = slugify(item.mediaId, titleOrName);

                return (
                  <div
                    key={idx}
                    className="group relative w-[150px] min-w-[150px] flex flex-col bg-neutral-950 border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/30"
                  >
                    {/* Fixed 2:3 aspect ratio container for icon */}
                    <div className="group relative">
                      <IconComponent
                        result={item}
                        slug={slug}
                        watchDisplay={"no"}
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

        {/* WATCHED SECTION */}
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
                onClick={() => setActiveWatchlist("tvshow")}
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
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {isActiveWatchlist?.slice(0, 20)?.map((item, idx) => {
                  const titleOrName = item.title || item.name || "untitled";
                  const slug = slugify(item.mediaId, titleOrName);

                  return (
                    <div
                      key={idx}
                      className="group relative w-[150px] min-w-[150px] flex flex-col bg-neutral-950 border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30"
                    >
                      {/* Fixed 2:3 aspect ratio container matching Favorites */}
                      <div className="group">
                        <IconComponent
                          result={item}
                          slug={slug}
                          watchDisplay={"no"}
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

                {isActiveWatchlist?.length > 20 && (
                  <Link
                    href={`/user/${activeWatchlist}/${user?.email}`}
                    className="min-w-[120px] flex flex-col items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 border border-white/10 rounded-xl transition cursor-pointer text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* REVIEWS SECTION */}
        <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Reviews
              </h2>
              <p className="text-xs text-neutral-400">
                {user?.reviews?.length || 0} reviews written
              </p>
            </div>
          </div>

          {!user?.reviews || user?.reviews?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-xl bg-neutral-950/60">
              <MessageSquare className="w-10 h-10 text-neutral-600 mb-2" />
              <p className="text-neutral-400 text-sm font-medium">
                No reviews published yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.reviews?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-4 rounded-xl bg-neutral-950 border border-white/10 hover:border-white/20 transition duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {item?.title || item?.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{item?.rating || "N/A"}</span>
                    </div>
                  </div>
                  {item?.content && (
                    <p className="text-xs text-neutral-400 line-clamp-2 italic">
                      "{item.content}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserPageComponent;
