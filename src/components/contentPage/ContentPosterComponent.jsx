import { useContentStore } from "@/features/content/contentStore";
import ImageFormat from "../ImageFormat";

const ContentPosterComponent = () => {
  const content = useContentStore((state) => state.content);

  const imageUrl = content?.poster_path
    ? content?.poster_path.includes(".jpg") ||
      content?.poster_path.includes(".png")
      ? `https://image.tmdb.org/t/p/w342/${content?.poster_path}`
      : `/no-poster.webp`
    : `/no-poster.webp`;

  const name = `${content?.title || content?.name} poster`;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-full rounded shadow-lg border border-gray-400 overflow-hidden block aspect-[2/3] w-full overflow-hidden">
        <ImageFormat imageUrl={imageUrl} name={name} />
      </div>
    </div>
  );
};

export default ContentPosterComponent;
