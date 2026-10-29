"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useToggleWatchlist } from "@/app/utils/handleToggleWatchlist";
import ImageFormat from "./ImageFormat";

const IconComponent = ({
  result,
  slug,
  watchDisplay,
  checked,
  isWatchedLoading,
  onImageLoad,
}) => {
  const [watched, setWatched] = useState(checked);
  const { toggleWatchlist } = useToggleWatchlist();

  useEffect(() => {
    setWatched(checked);
  }, [checked]);

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const router = useRouter();
  const params = useParams();

  const mediaType =
    params?.type ||
    (result?.mediaType === "movie" ||
    result?.media_type === "movie" ||
    result?.type === "movie" ||
    result?.release_date
      ? "movies"
      : "tvshows");

  const title = result?.title || result?.name || "Untitled";
  const rawReleaseDate =
    result?.release_date || result?.first_air_date || result?.releaseDate;

  const rawPoster = result?.poster_path || result?.posterPath || result?.poster;
  const posterPath = rawPoster
    ? rawPoster.startsWith("http")
      ? rawPoster
      : `https://image.tmdb.org/t/p/w500${rawPoster}`
    : "/no-poster.webp";

  /*<Image
          src={posterPath}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          onLoad={onImageLoad}
          onError={onImageLoad}
          unoptimized={posterPath === "/placeholder.png"}
        />*/

  const sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw";

  return (
    <div
      className={`group relative aspect-[2/3] cursor-pointer w-full overflow-hidden rounded-r-xl bg-neutral-900 shadow-md hover:shadow-2xl hover:shadow-red-950/30 border border-white/5 ${
        watchDisplay === "yes"
          ? watched
            ? "hover:border-amber-400/60"
            : "hover:border-red-500"
          : null
      }`}
    >
      <Link href={`/media/${mediaType}/${slug}`}>
        <ImageFormat imageUrl={posterPath} name={title} sizes={sizes} />
      </Link>

      {watchDisplay !== "no" && watchDisplay !== "false" && (
        <button
          onClick={() => {
            if (isAuthenticated) {
              setWatched((prev) => !prev);
              toggleWatchlist(result);
            } else {
              router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
            }
          }}
          aria-label={watched ? "Remove from watched" : "Mark as watched"}
          className="absolute top-0 -left-1 z-10 flex items-center cursor-pointer justify-center w-10 h-12 transition-all duration-200 active:scale-95 focus:outline-none disabled:cursor-wait"
        >
          <svg
            viewBox="0 0 34 46"
            className={`absolute inset-0 w-full h-full drop-shadow-md transition-colors duration-200 ${
              isWatchedLoading
                ? "fill-neutral-800/80"
                : watched
                  ? "fill-amber-400"
                  : "fill-black/60 group-hover:fill-red-600"
            }`}
          >
            <path d="M0 0h34v46l-17-9.2L0 46V0z" />
          </svg>

          <span className="relative z-10 -mt-1">
            {isWatchedLoading && isAuthenticated ? (
              <Loader2 className="w-4 h-4 text-white/70 animate-spin" />
            ) : watched ? (
              <Check className="w-5 h-5 text-black stroke-[3]" />
            ) : (
              <Plus className="w-5 h-5 text-white transition-all group-hover:scale-110" />
            )}
          </span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <p className="text-sm font-semibold text-white truncate">{title}</p>
        {rawReleaseDate && (
          <p className="text-xs text-neutral-400">
            {new Date(rawReleaseDate).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default IconComponent;
