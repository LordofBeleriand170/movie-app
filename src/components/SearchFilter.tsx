import React from "react";

interface SearchFilterProps {
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ setSearchFilter }) => {
  return (
    <div className="flex justify-center gap-2 ">
      <button
        onClick={() => setSearchFilter("tv")}
        className="cursor-pointer px-5 py-1 bg-gray-800 text-white hover:bg-gray-600"
      >
        TV Shows
      </button>
      <button
        onClick={() => setSearchFilter("movie")}
        className="cursor-pointer px-5 py-1 bg-gray-800 text-white hover:bg-gray-600"
      >
        Movies
      </button>
      <button
        onClick={() => setSearchFilter("person")}
        className="cursor-pointer px-5 py-1 bg-gray-800 text-white hover:bg-gray-600"
      >
        People
      </button>
    </div>
  );
};

export default SearchFilter;
