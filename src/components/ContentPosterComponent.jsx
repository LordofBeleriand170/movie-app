import ImageFormat from "./ImageFormat";

const ContentPosterComponent = ({ info }) => {
  const imageUrl = info?.poster_path
    ? info?.poster_path.includes(".jpg") || info?.poster_path.includes(".png")
      ? `https://image.tmdb.org/t/p/w342/${info?.poster_path}`
      : `/image-not-found.jpg`
    : `/image-not-found.jpg`;

  const name = `${info?.title || info?.name} poster`;

  /*<div className="flex flex-col gap-1">
      <div className="h-full flex-shrink-0 rounded shadow-lg border border-gray-400 overflow-hidden">
        <div className="relative block aspect-[2/3] w-full overflow-hidden">
          <ImageFormat imageUrl={imageUrl} name={name} />
        </div>
      </div>
    </div>*/

  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-full rounded shadow-lg border border-gray-400 overflow-hidden block aspect-[2/3] w-full overflow-hidden">
        <ImageFormat imageUrl={imageUrl} name={name} />
      </div>
    </div>
  );
};

export default ContentPosterComponent;
