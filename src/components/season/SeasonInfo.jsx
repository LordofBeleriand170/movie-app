import ImageFormat from "../ImageFormat";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useContentStore } from "@/features/content/contentStore";

const SeasonInfo = () => {
  const season = useContentStore((state) => state.season);
  const tvShow = useContentStore((state) => state.tvShow);
  const params = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const targetedSeasonId = searchParams.has("seasonId-name");

  const redirect = () => {
    router.push(`/media/${params?.type}/${params?.slug}/seasons?seasonId-name`);
  };

  useEffect(() => {
    if (!targetedSeasonId) return;
    const timer = setTimeout(() => {
      const element = document.getElementById(`seasonId-name`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [targetedSeasonId]);

  const name = season?.name || tvShow?.name || "Season";
  const imageUrl = season?.poster_path
    ? `https://image.tmdb.org/t/p/original${season.poster_path}`
    : "/no-poster.webp";

  const backdropUrl = tvShow?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : null;

  return (
    <div className="relative flex justify-center overflow-hidden min-h-[350px] w-[90%] mx-auto rounded-2xl">
      {backdropUrl && (
        <div className="absolute inset-0 overflow-hidden flex justify-center">
          <div
            className="absolute inset-0 bg-no-repeat bg-top brightness-40"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      )}

      <div
        className="absolute inset-y-0 left-0 w-[15%]"
        style={{
          background:
            "linear-gradient(to right, black 0%, black 10%, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[15%]"
        style={{
          background:
            "linear-gradient(to left, black 0%, black 10%, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 min-h-[350px] mx-auto">
        <ImageFormat
          imageUrl={imageUrl}
          name={name}
          width="w-56"
          style={"rounded-lg"}
        />

        <div className="flex-1 text-white">
          <h2 className="text-4xl font-bold tracking-tight">{name}</h2>

          <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
            {season?.air_date && <span>{season?.air_date?.slice(0, 4)}</span>}
            {season?.episodes?.length > 0 && (
              <span>{season?.episodes?.length} Episodes</span>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 line-clamp-3">
            {season?.overview || "No overview available for this season."}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={redirect}
              className="rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-zinc-200 cursor-pointer"
            >
              Episodes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonInfo;
