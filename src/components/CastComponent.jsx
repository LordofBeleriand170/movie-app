import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useContentStore } from "@/features/content/contentStore";
import CastSkeleton from "./loadingComponents/CastSkeleton";

const CastComponent = () => {
  const cast = useContentStore((state) => state.cast);
  console.log("CAST: ", cast);
  const crew = useContentStore((state) => state.crew);
  const content = useContentStore((state) => state.content);

  const getProfileImage = (person) => {
    if (
      !person.profile_path?.includes("jpg") ||
      (person.profile_path?.includes("null") && person.gender == 2)
    ) {
      return "/male-not-found.jpg";
    }
    if (
      !person.profile_path?.includes("jpg") ||
      (person.profile_path?.includes("null") && person.gender == 1)
    ) {
      return "/female-not-found.jpg";
    }
    return `https://image.tmdb.org/t/p/w342/${person.profile_path}`;
  };

  return (
    <main className="flex flex-col gap-10 px-8 md:px-30 py-10 bg-black text-white min-h-screen">
      <h1 className="text-3xl">{content?.original_title}</h1>
      {cast.length === 0 && crew.length === 0 ? (
        <CastSkeleton />
      ) : (
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-3">
              Cast
            </h2>
            {cast && cast.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {cast.map((person, index) => (
                  <Link
                    href={`/person/${person?.id}-${person.name?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col items-center gap-3 p-3 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-red-500/50 transition group shrink-0 w-36"
                    key={index}
                  >
                    <div className="relative w-28 h-36 overflow-hidden rounded-lg bg-zinc-900">
                      <Image
                        src={getProfileImage(person)}
                        alt={person.name || "profile picture"}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition text-center line-clamp-1">
                      {person.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No cast information available.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-3">
              Crew
            </h2>
            {crew && crew.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {crew.map((person, index) => (
                  <Link
                    href={`/person/${person?.id}-${person.name?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col items-center gap-3 p-3 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-red-500/50 transition group shrink-0 w-36"
                    key={index}
                  >
                    <div className="relative w-28 h-36 overflow-hidden rounded-lg bg-zinc-900">
                      <Image
                        src={getProfileImage(person)}
                        alt={person.name || "profile picture"}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition text-center line-clamp-1">
                      {person.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No crew information available.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CastComponent;
