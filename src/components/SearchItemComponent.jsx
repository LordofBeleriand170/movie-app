"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const SearchItemComponent = ({ result }) => {
  let avgVote = result?.ratingAvg?._avg?.rating || result?.vote_average / 2;

  const getImageUrl = (posterPath, gender) => {
    if (
      posterPath &&
      (posterPath.includes(".jpg") || posterPath.includes(".png"))
    ) {
      return `https://image.tmdb.org/t/p/w500/${posterPath}`;
    }
    if (gender === -1 || gender === undefined) {
      return "/no-poster.webp";
    }
    return gender === 2 || gender === 0
      ? "/male-not-found.jpg"
      : "/female-not-found.jpg";
  };

  const getResultSlug = (item) => {
    const name = item.name || item.title || "unknown";
    return name.toLowerCase().replaceAll(" ", "-");
  };

  const params = useParams();
  console.log("PARAMS: ", params);

  const isMovie = params?.movie === "movies";
  const isPerson = params?.movie === "person";

  const href = `${!isPerson ? "/media" : ""}/${
    isMovie ? "movies" : isPerson ? "person" : "tvshows"
  }/${result.id}-${getResultSlug(result)}`;

  return (
    <Link
      href={href}
      className="flex gap-4 sm:gap-6 cursor-pointer w-full bg-[#111216] hover:bg-[#15171e] border border-zinc-900 rounded-2xl overflow-hidden transition-colors duration-200"
    >
      <div className="relative w-28 sm:w-36 aspect-[2/3] shrink-0 bg-zinc-900">
        <Image
          src={
            isPerson
              ? getImageUrl(result.profile_path, result.gender)
              : getImageUrl(result.poster_path, -1)
          }
          alt={result.title || result.name || "Poster"}
          className="object-cover"
          fill
          sizes="(max-width: 640px) 112px, 144px"
        />
      </div>

      <div className="flex flex-col py-3 pr-4 sm:py-4 sm:pr-6 grow min-w-0 justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-bold text-base sm:text-lg text-white truncate">
            {result.title || result.name}
          </h2>

          {isPerson ? (
            <span className="text-xs text-zinc-400 font-medium">
              {result.known_for_department || "Person"}
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              {avgVote > 0 && (
                <div className="flex items-center gap-1.5 text-yellow-500 text-base sm:text-md font-bold">
                  <span>⭐</span>
                  <span className="text-white">{+avgVote.toFixed(1)}</span>
                  <span className="text-zinc-500 font-normal text-xs sm:text-sm">
                    /5
                  </span>
                </div>
              )}

              {result.vote_average > 0 && (
                <span className="text-zinc-700">•</span>
              )}

              {result.media_type === "tv" ? (
                <span>
                  {result.first_air_date?.split("-")[0]}
                  {result.status === "Ended" && result.last_air_date
                    ? `–${result.last_air_date.split("-")[0]}`
                    : "–Present"}
                </span>
              ) : (
                <span>{result.release_date?.split("-")[0]}</span>
              )}

              {result.runtime && (
                <>
                  <span className="text-zinc-700">•</span>
                  <span>{result.runtime} min</span>
                </>
              )}

              {result.number_of_seasons > 0 && (
                <>
                  <span className="text-zinc-700">•</span>
                  <span>
                    {result.number_of_seasons} season
                    {result.number_of_seasons > 1 ? "s" : ""}
                  </span>
                </>
              )}

              {result.genres?.length > 0 && (
                <>
                  <span className="text-zinc-700">•</span>
                  <span className="text-zinc-300">
                    {result.genres.slice(0, 2).join(", ")}
                  </span>
                </>
              )}

              <span className="text-zinc-700">•</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 uppercase tracking-wider">
                {result.media_type === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>
          )}

          {result.overview && (
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {result.overview}
            </p>
          )}
        </div>

        <div className="mt-3 text-xs text-zinc-400 truncate">
          {isPerson && result.known_for?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium shrink-0">
                Known for:
              </span>
              <span className="text-zinc-300 truncate">
                {result.known_for
                  .map((item) => item.title || item.name)
                  .join(", ")}
              </span>
            </div>
          )}

          {!isPerson && result.actors?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium shrink-0">Cast:</span>
              <span className="text-zinc-300 truncate">
                {result.actors.slice(0, 3).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchItemComponent;
