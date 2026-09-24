import Image from "next/image";
import React from "react";

const ImageFormat = ({ imageUrl, name, sizes, height, width, style }) => {
  return (
    <div
      className={`relative block ${
        height ? height : "aspect-[2/3]"
      } ${width ? width : "w-full"} ${style} bg-gray-900 overflow-hidden`}
    >
      <Image
        src={imageUrl}
        className="w-full h-full object-cover origin-top"
        fill
        alt={name}
        sizes={sizes || null}
      />
    </div>
  );
};

export default ImageFormat;
