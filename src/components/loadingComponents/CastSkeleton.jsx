const CastSkeleton = () => {
  return (
    <main className="flex flex-col gap-10 px-8 w-full py-10 bg-black text-white min-h-screen">
      <div>
        <div className="h-8 bg-zinc-800 rounded-md w-32 mb-6 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[...Array(8)].map((_, index) => (
            <div
              key={`cast-skeleton-${index}`}
              className="flex flex-col items-center gap-3 rounded-xl bg-zinc-950/40 border border-white/5 shrink-0 w-36 animate-pulse"
            >
              <div className="w-28 h-36 rounded-lg bg-zinc-800" />
              <div className="h-3 bg-zinc-800 rounded w-20" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="h-8 bg-zinc-800 rounded-md w-32 mb-6 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[...Array(8)].map((_, index) => (
            <div
              key={`crew-skeleton-${index}`}
              className="flex flex-col items-center gap-3 rounded-xl bg-zinc-950/40 border border-white/5 shrink-0 w-36 animate-pulse"
            >
              <div className="w-28 h-36 rounded-lg bg-zinc-800" />
              <div className="h-3 bg-zinc-800 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CastSkeleton;
