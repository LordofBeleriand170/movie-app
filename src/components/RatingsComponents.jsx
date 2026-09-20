import { formatVoteCount } from "@/app/utils/formatVoteCount";
import { useContentStore } from "@/features/content/contentStore";
import { FaStar } from "react-icons/fa";

const RatingsComponent = ({ avg, count, fansCount }) => {
  const ratings = useContentStore((state) => state.ratings);

  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: ratings.filter((c) => c.rating === star).length,
  }));

  const histogramData = ratingCounts.map((item) => item.count);
  const maxVal = Math.max(...histogramData, 1);

  // Safely resolve numerical average value
  const numericAvg =
    typeof avg === "number"
      ? avg
      : typeof avg === "object" && avg !== null
        ? (avg.rating ?? 0)
        : 0;

  // Round to nearest integer for star lighting (e.g. 4.2 -> 4 filled stars)
  const filledStarsCount = Math.round(numericAvg);

  return (
    <div className="w-full max-w-xs text-xs text-slate-400 font-sans select-none bg-[#0f1522]/90 p-3.5 rounded-lg">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60 tracking-wider font-semibold">
        <span className="text-slate-300">RATINGS</span>
        <span className="text-slate-400 font-normal">
          {fansCount ? `${fansCount} FANS` : `${formatVoteCount(count)} VOTERS`}
        </span>
      </div>

      {/* Content Area */}
      <div className="mt-4 flex items-end justify-between gap-4">
        {/* Histogram Column */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-16 flex items-end gap-1">
            {histogramData.map((barCount, index) => {
              const heightPercent = Math.max((barCount / maxVal) * 100, 4);
              return (
                <div
                  key={index}
                  className="flex-1 bg-slate-600/70 hover:bg-slate-400 rounded-t-[2px] transition-colors"
                  style={{ height: `${heightPercent}%` }}
                  title={`Step ${index + 1}: ${barCount}`}
                />
              );
            })}
          </div>
        </div>

        {/* Rating Value & Dynamic Stars */}
        <div className="flex flex-col gap-2">
          <div className="text-4xl font-light text-slate-200 tracking-tight pl-2">
            {numericAvg > 0 ? numericAvg.toFixed(1) : "0.0"}
          </div>

          {/* Dynamic 5-Star Row */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <FaStar
                key={starIndex}
                className={`w-3 h-3 transition-colors ${
                  starIndex <= filledStarsCount
                    ? "text-[#00e054]"
                    : "text-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsComponent;
