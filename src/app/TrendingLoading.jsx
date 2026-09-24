import React from "react";

const TrendingLoading = ({ count = 10 }) => {
  return (
    <div className="flex overflow-x-auto pt-4 pb-9 space-x-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent flex-nowrap w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="w-28 sm:w-36 md:w-40 lg:w-44 aspect-[2/3] flex-shrink-0 animate-pulse rounded-xl bg-neutral-800/60 border border-white/5"
        />
      ))}
    </div>
  );
};

export default TrendingLoading;
