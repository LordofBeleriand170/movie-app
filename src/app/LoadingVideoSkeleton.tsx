import React from "react";

interface LoadingSkeletonProps {
  rows: number;
  cols: number;
}

const VideoLoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows,
  cols,
}) => {
  return (
    <div className="flex flex-nowrap w-full space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      {[...Array(rows * cols)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 animate-pulse min-w-[650px] sm:min-w-[750px] lg:min-w-[850px] aspect-video rounded-xl bg-neutral-800/60 border border-neutral-700/50"
        />
      ))}
    </div>
  );
};

export default VideoLoadingSkeleton;
