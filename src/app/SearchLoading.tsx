import React from "react";

interface SearchLoadingProps {
  rows: number;
  cols: number;
}

const SearchLoading: React.FC<SearchLoadingProps> = ({ rows, cols }) => {
  return (
    <div className="pl-4 flex w-full flex-wrap gap-4">
      {[...Array(rows * cols)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col flex-shrink-0 bg-gray-400 w-full gap-1 animate-pulse"
          style={{
            width: rows === 1 ? "100%" : "150px",
            ...(rows === 1 && { height: "60px" }),
          }}
        ></div>
      ))}
    </div>
  );
};

export default SearchLoading;
