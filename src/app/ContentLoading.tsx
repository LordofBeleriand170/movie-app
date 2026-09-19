import React from "react";

const ContentLoading = () => {
  /*<div className="w-3/4 h-4 bg-gray-300 rounded" />
          <div className="w-1/2 h-3 bg-gray-200 rounded" />*/
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="aspect-[2/3] w-full bg-neutral-800/60 rounded-xl animate-pulse border border-white/5"
        />
      ))}
    </div>
  );
};

export default ContentLoading;
