import React from "react";

const ExploreComponent = () => {
  return (
    <>
      <h1 className="text-6xl text-center">Explore best movies and tv shows</h1>
      <input
        placeholder="Describe content you want to watch..."
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-200 text-base"
      />
    </>
  );
};

export default ExploreComponent;
