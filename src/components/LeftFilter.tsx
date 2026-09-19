import React from "react";

interface LeftFilterComponentProps {
  decade: string | null;
  setDecade: React.Dispatch<React.SetStateAction<string | null>>;

  rating: string | null;
  setRating: React.Dispatch<React.SetStateAction<string | null>>;

  // Expecting a min/max tuple for the range slider (e.g., [0, 360])
  runtime: [number, number];
  setRuntime: React.Dispatch<React.SetStateAction<[number, number]>>;

  mediaType: string;
}

const LeftFilter: React.FC<LeftFilterComponentProps> = ({
  decade,
  setDecade,

  rating,
  setRating,

  runtime = [0, 360],
  setRuntime,
  mediaType,
}) => {
  const MIN_VAL = 0;
  const MAX_VAL = 360;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), runtime[1] - 10);
    setRuntime([value, runtime[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), runtime[0] + 10);
    setRuntime([runtime[0], value]);
  };

  // Percentages for positioning active blue fill line
  const leftPercent = ((runtime[0] - MIN_VAL) / (MAX_VAL - MIN_VAL)) * 100;
  const rightPercent =
    100 - ((runtime[1] - MIN_VAL) / (MAX_VAL - MIN_VAL)) * 100;

  return (
    <div className="w-1/5 pt-16">
      <div className="flex flex-col gap-6">
        {/* TITLE SELECT */}
        <select className="w-full px-3 py-2 text-sm cursor-pointer bg-neutral-800 border border-white/20 rounded-lg hover:border-white/50 transition">
          <option value="">Title</option>
          <option value="asc">Title (A-Z)</option>
          <option value="desc">Title (Z-A)</option>
        </select>

        {/* RATING SELECT */}
        <select
          value={rating?.toLowerCase() || "rating"}
          onChange={(e) => {
            if (e.target.value === "rating") {
              setRating(null);
            } else {
              setRating(e.target.value);
            }
          }}
          className="w-full px-3 py-2 text-sm cursor-pointer bg-neutral-800 border border-white/20 rounded-lg hover:border-white/50 transition"
        >
          <option value="rating">Rating</option>
          <option value="highest">Highest First</option>
          <option value="lowest">Lowest First</option>
        </select>
        {mediaType !== "tv" && (
          <>
            <div className="flex flex-col text-neutral-200">
              <span className="text-sm font-medium mb-3">Runtime</span>

              <div className="relative w-full py-4 flex flex-col items-center">
                {/* Ticks and Markings Track */}
                <div className="absolute w-full flex justify-between items-center pointer-events-none px-1">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className={`bg-neutral-500 ${
                        i % 8 === 0
                          ? "h-3.5 w-[1.5px]"
                          : "h-2 w-[1px] opacity-60"
                      }`}
                    />
                  ))}
                </div>

                {/* Custom Range Fill Track */}
                <div className="relative w-full h-[6px] bg-neutral-700 rounded my-auto pointer-events-none">
                  <div
                    className="absolute h-full bg-cyan-500 rounded"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                    }}
                  />
                </div>

                <input
                  type="range"
                  min={MIN_VAL}
                  max={MAX_VAL}
                  value={runtime[0]}
                  onChange={handleMinChange}
                  className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-none"
                />
                <input
                  type="range"
                  min={MIN_VAL}
                  max={MAX_VAL}
                  value={runtime[1]}
                  onChange={handleMaxChange}
                  className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-none"
                />
              </div>

              <div className="flex justify-between text-xs text-neutral-400 mt-1 px-0.5">
                <span>0</span>
                <span>120</span>
                <span>240</span>
                <span>360</span>
              </div>
            </div>
          </>
        )}
        {/* RUNTIME SLIDER */}
      </div>
    </div>
  );
};

export default LeftFilter;
