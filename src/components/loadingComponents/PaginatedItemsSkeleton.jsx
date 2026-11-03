const PaginatedItemsSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(18)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="aspect-[2/3] w-full bg-neutral-900/80 rounded-xl animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaginatedItemsSkeleton;
