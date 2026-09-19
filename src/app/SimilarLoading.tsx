import React from "react";

interface LoadingSkeletonProps {
  rows: number;
  cols: number;
}

const SimilarSkeleton: React.FC<LoadingSkeletonProps> = ({ rows, cols }) => {
  return (
    <div className="flex w-full overflow-x-auto scrollbar-thin space-x-3 flex-nowrap">
      {[...Array(rows * cols)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex flex-col gap-1 animate-pulse w-[360px]"
        >
          <div className="w-full h-[200px] bg-gray-300 rounded-lg" />
          <div className="w-3/4 h-4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
};

export default SimilarSkeleton;
