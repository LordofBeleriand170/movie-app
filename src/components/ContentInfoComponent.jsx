"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaPlay, FaChevronDown } from "react-icons/fa6";

import { Rating } from "@/features/content/contentStore";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { Cast, Crew, TvShow } from "@/features/content/contentStore";

import RateComponent from "./RateComponent";
import TrailerPlayer from "./TrailerPlayer";
import ContentActionsComponent from "./ContentActionsComponent";
import ContentPosterComponent from "./ContentPosterComponent";
import RatingsComponents from "./RatingsComponents";
import AwardsComponent from "./AwardsComponent";

const ContentInfoComponent = ({ type, newRate, setNewRate, info }) => {
  const { data: session } = useSession();
  const ratings = useCollectionStore((state) => state.ratings);

  const releaseDate = new Date(
    info?.info?.release_date || info?.info?.first_air_date,
  );
  const now = new Date();

  const checkDate = releaseDate <= now;

  const [rate, setRate] = useState(0);
  const [trailer, setTrailer] = useState(false);
  const [media, setMedia] = useState("movies");

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const overviewRef = useRef(null);

  const params = useParams();

  useEffect(() => {
    if (params?.type === "movies") {
      setMedia("movies");
    } else {
      setMedia("tv");
    }
  }, [params]);

  useEffect(() => {
    if (!session?.user?.email) return;
    useCollectionStore.getState().fetchUserCollections(session.user.email);
  }, [session?.user?.email]);

  useEffect(() => {
    const rating = ratings.find((r) => r.movieId === info?.info?.id);
    setRate(rating?.rating ?? 0);
  }, [ratings, info?.info?.id]);

  useEffect(() => {
    if (overviewRef.current) {
      setIsOverflowing(
        overviewRef.current.scrollHeight > overviewRef.current.clientHeight,
      );
    }
  }, [info?.info?.overview]);

  let avgRating =
    info?.ratingAvg?._avg?.rating !== false
      ? info?.ratingAvg?._avg?.rating
      : info?.info?.vote_average / 2;

  let count =
    info?.ratingAvg?._count?.rating !== 0
      ? info?.ratingAvg?._count?.rating
      : info?.info?.vote_count;

  return (
    <div className="relative w-full text-white pb-10">
      {info?.info?.backdrop_path && (
        <div
          style={{
            backgroundImage: `
              linear-gradient(to top, rgba(10, 15, 29, 0.98) 0%, rgba(10, 15, 29, 0.5) 50%, rgba(10, 15, 29, 0.8) 100%),
              linear-gradient(to right, rgba(10, 15, 29, 0.9) 0%, rgba(10, 15, 29, 0.3) 50%, rgba(10, 15, 29, 0.9) 100%),
              url(https://image.tmdb.org/t/p/original/${info?.info?.backdrop_path})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            filter: "brightness(130%)",
          }}
          className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        />
      )}

      <div className="relative z-10 w-[90%] max-w-7xl mx-auto">
        {trailer ? (
          <div className="rounded-2xl w-full overflow-hidden shadow-2xl border border-white/10 bg-black/80">
            <TrailerPlayer video={info?.video} setTrailer={setTrailer} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-stretch gap-8 lg:gap-12">
            <div
              className={`flex flex-col items-start gap-2 ${
                type !== "tvshows" ? "pt-11" : "pt-2"
              }`}
            >
              {type === "tvshows" && (
                <Link
                  href={`/media/tvshows/${info?.info?.id}-${info?.info?.name
                    ?.toLowerCase()
                    .replaceAll(" ", "-")}/seasons`}
                  className="group flex gap-2 items-center justify-between py-1.5 rounded-lg text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      Episodes
                    </span>
                    <span className="text-xs font-black text-neutral-400">
                      {info?.info?.number_of_episodes}
                    </span>
                  </div>

                  <svg
                    className="w-4 h-4 text-neutral-300 group-hover:text-white group-hover:translate-x-0.5 transition-all fill-current stroke-[1.5]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </Link>
              )}
              <div className="w-[200px] md:w-[220px] flex flex-col items-stretch gap-3 flex-shrink-0 mx-auto md:mx-0">
                <ContentPosterComponent info={info?.info} />

                {info?.video && (
                  <button
                    onClick={() => setTrailer(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 cursor-pointer"
                  >
                    <FaPlay className="text-[10px]" />
                    Play Trailer
                  </button>
                )}

                <div className="bg-[#111623]/80 backdrop-blur-md rounded-xl p-3 border border-gray-800 flex flex-col gap-2 text-xs w-full">
                  {media === "movies" ? (
                    <>
                      {info?.director?.length !== 0 && (
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-400">Director:</span>
                          <Link
                            href={`/person/${
                              info?.director?.id || info?.director?.[0]?.id
                            }-${(
                              info?.director?.[0]?.name || info?.director?.name
                            )
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                            className="font-medium text-white hover:text-red-400 transition-colors truncate"
                          >
                            {info?.director?.[0]?.name || info?.director?.name}
                          </Link>
                        </div>
                      )}
                      {info?.writer?.length !== 0 && (
                        <div className="flex justify-between items-center gap-2 border-t border-gray-800/60 pt-2">
                          <span className="text-gray-400">Writer:</span>
                          <Link
                            href={`/person/${
                              info?.writer?.id || info?.writer?.[0]?.id
                            }-${(info?.writer?.[0]?.name || info?.writer?.name)
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                            className="font-medium text-white hover:text-red-400 transition-colors truncate"
                          >
                            {info?.writer?.[0]?.name || info?.writer?.name}
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    info?.creator && (
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-gray-400">Creator:</span>
                        <Link
                          href={`/person/${info?.creator?.id}-${info?.creator?.name
                            ?.toLowerCase()
                            .replace(" ", "-")}`}
                          className="font-medium text-white hover:text-red-400 transition-colors truncate"
                        >
                          {info?.creator?.name}
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col pt-8 w-full">
              <div className="flex flex-col items-start gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {info?.info?.title || info?.info?.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-300 font-medium bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                    {media === "movies" ? (
                      <>
                        <Link
                          href={`/media/${params?.type}/popular/year/${
                            info?.info?.release_date?.split("-")[0]
                          }`}
                          className="hover:text-white transition-colors"
                        >
                          {!checkDate
                            ? "Coming soon"
                            : info?.info?.release_date?.split("-")[0]}
                        </Link>
                        {info?.info?.runtime > 0 && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span>
                              {Math.floor(info?.info?.runtime / 60)}h{" "}
                              {info?.info?.runtime % 60}m
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span>
                          {info?.info?.first_air_date?.split("-")[0]}
                          {info?.info?.status === "Ended"
                            ? `-${info?.info?.last_air_date?.split("-")[0]}`
                            : "-"}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span>
                          {info?.info?.number_of_seasons}{" "}
                          {info?.info?.number_of_seasons > 1
                            ? "Seasons"
                            : "Season"}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 ml-auto md:ml-0">
                    {(info?.info?.genres || []).map((genre) => (
                      <Link
                        href={`/genre/${type}/${genre.name.toLowerCase()}`}
                        key={genre.id}
                        className="rounded-lg bg-gray-900/80 hover:bg-gray-800 border border-gray-800 px-2.5 py-1 text-gray-300 hover:text-white transition-all"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative max-w-3xl w-full">
                  <p
                    ref={overviewRef}
                    className={`text-sm text-gray-300 leading-relaxed opacity-90 transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? "max-h-[1000px]"
                        : "max-h-[4.5rem] line-clamp-3"
                    }`}
                  >
                    {info?.info?.overview}
                  </p>

                  {(isOverflowing || isExpanded) && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Show less" : "Read more"}</span>
                      <FaChevronDown
                        className={`text-[10px] transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {checkDate && (
                <div className="flex flex-wrap justify-center items-stretch gap-4 max-w-3xl mt-auto pt-6">
                  <div className="flex-1 min-w-[220px] max-w-xs flex items-center justify-center p-4 rounded-xl bg-[#0f1522]/90 border border-gray-800/80">
                    <AwardsComponent />
                  </div>

                  <div className="flex-1 min-w-[240px] max-w-xs flex flex-col justify-center items-center gap-3 p-4 rounded-xl bg-[#0f1522]/90 border border-gray-800/80">
                    <ContentActionsComponent media={media} />
                    <RateComponent
                      rate={rate}
                      media={media}
                      newRate={newRate}
                      setNewRate={setNewRate}
                    />
                  </div>

                  <div className="flex-1 min-w-[220px] max-w-xs flex flex-col justify-between p-4 rounded-xl bg-[#0f1522]/90 border border-gray-800/80">
                    <RatingsComponents avg={avgRating} count={count || 0} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentInfoComponent;
