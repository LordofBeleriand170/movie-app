"use client";

import LoadingPage from "@/components/loadingComponents/LoadingPage";
import { usePersonStore } from "@/features/person/personStore";
import slugify from "@/libs/slugify";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const PersonComponent = () => {
  const {
    watchedStatuses,
    checkBatch,
    loading: isWatchedLoading,
  } = useBatchWatched();

  const person = usePersonStore((state) => state.person);

  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (person?.personContent && person?.personContent.length > 0) {
      checkBatch(person?.personContent);
    }
  }, [person?.personContent, checkBatch]);

  return (
    <main className="relative min-h-screen w-[86%] m-auto bg-gray-950 text-white overflow-hidden pb-16">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className=" space-y-12 relative z-10">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-48 sm:w-60 md:w-72 aspect-[2/3] flex-shrink-0 mx-auto md:mx-0 shadow-2xl rounded-2xl overflow-hidden border border-gray-700/50 group">
            <Image
              src={`${
                !person?.person?.profile_path?.includes("jpg") &&
                person?.person.gender == 0
                  ? "/male-not-found.jpg"
                  : !person?.person?.profile_path?.includes("jpg") &&
                      person?.person?.gender == 1
                    ? "/male-not-found.jpg"
                    : `https://image.tmdb.org/t/p/original/${person?.person?.profile_path}`
              }`}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              fill
              priority
              alt={person?.person?.name || "Person name"}
            />
          </div>

          <div className="flex flex-col justify-between flex-grow space-y-6 w-full overflow-hidden">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                  {person?.person?.name}
                </h1>
                {person?.person?.known_for_department && (
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {person?.person?.known_for_department}
                  </span>
                )}
              </div>

              {(person?.person?.birthday || person?.person?.deathday) && (
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <span>
                    {person?.person?.birthday
                      ? new Date(person?.person?.birthday).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : ""}
                  </span>
                  {person?.person?.deathday && (
                    <>
                      <span>—</span>
                      <span>
                        {new Date(person?.person?.deathday).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {person?.person?.biography && (
              <div className="space-y-2 border-t border-gray-800/80 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Biography
                </h3>
                <p
                  className={`text-gray-300 text-sm md:text-base leading-relaxed transition-all duration-300 ${
                    !showMore ? "line-clamp-4" : ""
                  }`}
                >
                  {person?.person?.biography}
                </p>
                {person?.person?.biography?.length > 200 && (
                  <button
                    onClick={handleShowMore}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors pt-1 flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    {showMore ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {person?.personContent?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
                Known For
              </h2>
              <span className="text-xl text-gray-400 font-medium">
                {person?.personContent?.length} titles
              </span>
            </div>

            <div className="grid 2xl:grid-cols-8 xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-4 xs:grid-cols-3 grid-cols-3 gap-4 py-2">
              {person?.personContent?.map((content, index) => {
                const titleOrName = content.title || content.name || "untitled";
                const slug = slugify(content.id, titleOrName);
                const contentId =
                  content?.id || content.mediaId || content.contentId;

                return (
                  <div
                    key={index}
                    className="transform hover:-translate-y-1 transition-transform duration-300"
                  >
                    <IconComponent
                      result={content}
                      slug={slug}
                      watchDisplay={"true"}
                      checked={watchedStatuses[contentId] ?? false}
                      isWatchedLoading={isWatchedLoading}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PersonComponent;
