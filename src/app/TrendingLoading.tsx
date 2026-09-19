import React from "react";

interface TrendingLoadingProps {
  count?: number;
}

const TrendingLoading: React.FC<TrendingLoadingProps> = () => {
  return (
    <div className="flex overflow-x-auto pt-4 pb-9 space-x-4 scrollbar-thin flex-nowrap w-full">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="w-28 sm:w-36 md:w-40 lg:w-44 aspect-[2/3] flex-shrink-0 animate-pulse rounded-xl bg-neutral-800/60 border border-white/5"
        />
      ))}
    </div>
  );
};

export default TrendingLoading;
