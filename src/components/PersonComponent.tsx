"use client";

import LoadingPage from "@/app/LoadingPage";
import { Person, usePersonStore } from "@/features/person/personStore";
import slugify from "@/libs/slugify";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import IconComponent from "./IconComponent";
import { useBatchWatched } from "@/app/utils/useBatchWatched";

const PersonComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  const slugParts = slug?.split("-") || [];
  const id = slugParts[0];

  const {
    watchedStatuses,
    checkBatch,
    loading: isWatchedLoading,
  } = useBatchWatched();

  const personState = usePersonStore((state) => state.person);
  const fetchPerson = usePersonStore((state) => state.fetchPerson);
  const error = usePersonStore((state) => state.error);

  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  useEffect(() => {
    const getPerson = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        await fetchPerson(id);
      } catch (err) {
        console.error("Error fetching person:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getPerson();
  }, [id, fetchPerson]);

  useEffect(() => {
    if (personState?.personContent && personState.personContent.length > 0) {
      checkBatch(personState.personContent);
    }
  }, [personState?.personContent, checkBatch]);

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

  if (!personState || !personState.person) {
    return <main className="px-30 py-4">Person not found!</main>;
  }

  const { person, personContent } = personState;

  // Image Source Helper
  const getProfileImage = () => {
    if (person.profile_path && person.profile_path.includes(".jpg")) {
      return `https://image.tmdb.org/t/p/original/${person.profile_path}`;
    }
    return person.gender === 1
      ? "/female-not-found.jpg"
      : "/male-not-found.jpg";
  };

  // Date Formatting Helper
  const birthYear = person.birthday ? person.birthday.split("-")[0] : null;
  const deathYear = person.deathday ? person.deathday.split("-")[0] : null;

  return (
    <main className="relative py-4 bg-gradient-to-t from-gray-950 to-gray-900">
      <div className="flex flex-col m-auto xs:flex-col gap-10 items-start w-[90%]">
        <div className="flex flex-row items-start gap-10">
          <div className="relative w-100 aspect-[2/3]">
            <Image
              src={getProfileImage()}
              className="rounded-md border border-gray-800 object-cover"
              fill
              alt={person.name ?? "Person Name"}
            />
          </div>
          <div className="flex flex-col justify-between w-full gap-5 overflow-hidden">
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-bold text-white">{person.name}</h1>
                <span className="text-sm text-gray-400">
                  {person.known_for_department}
                </span>
              </div>

              {(birthYear || deathYear) && (
                <div className="text-sm text-gray-300">
                  <span>{birthYear ?? "Unknown"}</span>
                  <span> – </span>
                  <span>{deathYear ?? (person.birthday ? "Present" : "")}</span>
                </div>
              )}

              {person.biography && (
                <div
                  className={`${
                    !showMore ? "h-30 overflow-hidden" : ""
                  } relative`}
                >
                  <p
                    className={`transition-all ease-in-out duration-300 text-sm text-gray-300 ${
                      !showMore ? "line-clamp-5" : ""
                    }`}
                  >
                    {person.biography}
                  </p>
                  {person.biography.split(" ").length > 50 && (
                    <div
                      className={
                        !showMore
                          ? "absolute bottom-0 w-2/3 right-0 h-5 bg-gradient-to-l from-gray-950 to-transparent"
                          : "mt-2"
                      }
                    >
                      <span
                        className="font-bold text-sm text-blue-400 cursor-pointer float-right"
                        onClick={handleShowMore}
                      >
                        {!showMore ? "View More" : "View Less"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {personContent && personContent.length > 0 && (
          <div className="flex flex-col w-full">
            <h4 className="text-lg font-bold text-white">Known For</h4>
            <div className="grid 2xl:grid-cols-8 xl:grid-cols-8 lg:grid-cols-8 md:grid-cols-7 sm:grid-cols-6 xs:grid-cols-6 grid-cols-6 gap-3 scroll-smooth py-4">
              {personContent.map((content: Person, index: number) => {
                const titleOrName = content.title || content.name || "untitled";
                const slug = slugify(content.id, titleOrName);
                const contentId =
                  content?.id || content?.mediaId || content?.contentId;

                return (
                  <IconComponent
                    key={contentId || index}
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
