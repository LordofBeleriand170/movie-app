"use client";

import LoadingPage from "@/app/LoadingPage";
import { usePersonStore } from "@/features/person/personStore";
import slugify from "@/libs/slugify";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const PersonComponent = () => {
  const { slug } = useParams();
  const slugParts = slug?.split("-") || [];
  const id = slugParts[0];

  const {
    watchedStatuses,
    checkBatch,
    loading: isWatchedLoading,
  } = useBatchWatched();

  const person = usePersonStore((state) => state.person);
  const fetchPerson = usePersonStore((state) => state.fetchPerson);
  const error = usePersonStore((state) => state.error);

  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const getPerson = async () => {
      try {
        setIsLoading(true);
        await fetchPerson(id);
        setIsLoading(false);
      } catch (err) {
        console.log("Error:", err);
        setIsLoading(false);
      }
    };

    getPerson();
  }, [id, fetchPerson]);

  useEffect(() => {
    if (person?.personContent && person?.personContent.length > 0) {
      checkBatch(person?.personContent);
    }
  }, [person?.personContent, checkBatch]);

  // Handle loading, error, and the fetched person data
  if (isLoading) {
    return (
      <main>
        <LoadingPage />
      </main>
    );
  }

  if (error) {
    return <main className="px-30 py-4">Error fetching person data!</main>;
  }

  if (!person) {
    return <main className="px-30 py-4">Person not found!</main>;
  }

  /*2xl:px-82 xl:px-60 lg:px-40 md:px-20 sm:px-10*/

  /*2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-row*/

  return (
    <main className="relative py-4 bg-gradient-to-t from-gray-950 to-gray-900 ">
      <div className="flex flex-col m-auto  xs:flex-col gap-10 items-start w-[90%]">
        <div className="flex flex-row items-start gap-10">
          <div className="relative w-100 aspect-[2/3] ">
            <Image
              src={`${!person.person.profile_path?.includes("jpg") && person.person.gender == 0 ? "/male-not-found.jpg" : !person.person.profile_path?.includes("jpg") && person.person.gender == 1 ? "/male-not-found.jpg" : `https://image.tmdb.org/t/p/original/${person.person.profile_path}`}`}
              className="rounded-md border border-gray-800"
              fill
              alt={person.person.name}
            />
          </div>
          <div className="flex flex-col justify-between w-full gap-5 overflow-hidden">
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-2xl">{person.person.name}</h1>
                <span className="text-sm">
                  {person?.person?.known_for_department}
                </span>
              </div>
              <div>
                <span>{person?.person?.birthday?.split("-")[0]}-</span>
                <span>{person?.person?.deathday?.split("-")[0]}</span>
              </div>
              {person.person.biography && (
                <div
                  className={`${!showMore && "h-30 overflow-hidden"} relative`}
                >
                  <span
                    className={`transition-all ease-in-out duration-300 text-sm ${!showMore ? "line-clamp-5" : ""}`}
                  >
                    {person.person.biography}
                  </span>
                  {person.person.biography.split(" ").length > 100 && (
                    <div
                      className={
                        !showMore ? "absolute bottom-0 w-2/3 right-0 h-5" : ""
                      }
                    >
                      <div className="relative">
                        {" "}
                        <span
                          className="pl-10 absolute overflow-hidden right-0 font-bold text-sm text-blue-400 cursor-pointer"
                          onClick={handleShowMore}
                        >
                          {!showMore ? "View More" : "View Less"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {person?.personContent?.length > 0 && (
          <div className="flex flex-col w-full">
            <h4 className="text-lg font-bold">Known For</h4>
            <div className="grid 2xl:grid-cols-8 xl:grid-cols-8 lg:grid-cols-8 md:grid-cols-7 sm:grid-cols-6 xs:grid-cols-6 grid-cols-6 gap-3 scroll-smooth py-4">
              {person?.personContent?.map((content, index) => {
                const titleOrName = content.title || content.name || "untitled";
                const slug = slugify(content.id, titleOrName);
                const contentId =
                  content?.id || content.mediaId || content.contentId;

                return (
                  <IconComponent
                    key={index}
                    result={content}
                    slug={slug}
                    watchDisplay={"true"}
                    checked={watchedStatuses[contentId] ?? false}
                    isWatchedLoading={isWatchedLoading}
                  />
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
