"use client";

import React from "react";
import LoadingPage from "@/app/LoadingPage";
import SearchItemComponent from "./SearchItemComponent";

interface SearchPageProps {
  query: string;
  loading: boolean;
  searchResult: [];
}

const SearchPageComponent: React.FC<SearchPageProps> = ({
  query,
  loading,
  searchResult,
}) => {
  return (
    <main className="min-h-screen bg-[#09090b] text-white pt-10 pb-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex justify-center text-center">
          <p className="text-zinc-400 text-xl">
            Results for <span className="text-red-500">{`"${query}"`}</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <LoadingPage />
          ) : !searchResult || searchResult.length === 0 ? (
            <div className="w-full text-center py-20 text-zinc-500 text-sm">
              No results found for {`"${query}"`}.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {searchResult
                .slice()
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .map((result) => (
                  <SearchItemComponent key={result.id} result={result} />
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPageComponent;
