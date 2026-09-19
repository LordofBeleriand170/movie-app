export const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-1 h-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`w-3 h-3 bg-white rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};
