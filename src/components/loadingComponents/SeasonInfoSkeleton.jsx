const SeasonInfoSkeleton = () => {
  return (
    <div className="relative flex justify-center items-center overflow-hidden min-h-[350px] w-[90%] mx-auto rounded-2xl bg-zinc-950 animate-pulse">
      <div className="absolute inset-0 bg-zinc-900" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-8 p-8 min-h-[350px] mx-auto w-full max-w-5xl">
        <div className="w-56 h-80 rounded-lg bg-zinc-800 shrink-0" />

        <div className="flex-1 w-full flex flex-col items-center md:items-start gap-4 py-3">
          <div className="h-10 bg-zinc-800 rounded-md w-3/4 max-w-md" />

          <div className="flex flex-col items-center md:items-start gap-2 mt-2 w-full">
            <div className="h-3.5 bg-zinc-800 rounded w-full max-w-2xl" />
            <div className="h-3.5 bg-zinc-800 rounded w-11/12 max-w-xl" />
            <div className="h-3.5 bg-zinc-800 rounded w-3/4 max-w-lg" />
          </div>

          <div className="mt-4">
            <div className="h-10 bg-zinc-800 rounded-lg w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonInfoSkeleton;
