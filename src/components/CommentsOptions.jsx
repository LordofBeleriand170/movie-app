"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const CommentsOptions = ({
  comments,
  currentRating,
  commentOptions,
  setCommentOptions,
}) => {
  const [openSort, setOpenSort] = useState(false);

  let length = comments?.filter(
    (comment) => comment.rating === currentRating,
  )?.length;
  return (
    <div className="flex justify-between items-baseline">
      <div className="relative">
        <button
          onClick={() => setOpenSort((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg border border-gray-800 bg-zinc-900 px-3 py-2 hover:border-gray-600 transition"
        >
          <span className="text-xs text-gray-400">Sort by:</span>
          <span className="text-xs text-white">{commentOptions}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {openSort && (
          <div className="absolute left-0 mt-2 w-52 rounded-xl border border-gray-800 bg-zinc-950 shadow-2xl overflow-hidden z-50">
            {[
              "Newest",
              "Oldest",
              "Highest Rated",
              "Lowest Rated",
              "Most Likes",
              "Most Replies",
            ].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCommentOptions(item);
                  setOpenSort(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm transition
            ${
              commentOptions === item
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:bg-white/5"
            }`}
              >
                {item}
                {commentOptions === item && <Check size={15} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="text-gray-400 text-xs">
        Showing {length !== 0 ? length : comments?.length} reviews
      </span>
    </div>
  );
};

export default CommentsOptions;
