import React from "react";

import Image from "next/image";
import { Posters } from "@/features/content/contentStore";

interface ContentPosterComponentProps {
  info: Posters;
}

const ContentPosterComponent: React.FC<ContentPosterComponentProps> = ({
  info,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-full flex-shrink-0 rounded shadow-lg border border-gray-400 overflow-hidden">
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={
              info?.poster_path
                ? info?.poster_path.includes(".jpg") ||
                  info?.poster_path.includes(".png")
                  ? `https://image.tmdb.org/t/p/w342/${info?.poster_path}`
                  : `/image-not-found.jpg`
                : `/image-not-found.jpg`
            }
            fill
            alt={`${info?.title || info?.name} poster`}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentPosterComponent;
