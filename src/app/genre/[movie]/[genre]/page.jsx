"use client";

import LoadingPage from "@/app/LoadingPage";
import Navbar from "@/components/Navbar";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchItemComponent from "@/components/SearchItemComponent";

const Genre = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const genre = useMovieStore((state) => state.genre);
  const movies = useMovieStore((state) => state.movies);

  const params = useParams();
  const genreInput = params.genre?.toString();
  const mediaType = params.movie?.toString();

  const filter = {
    mediaType: mediaType === "movies" ? "movie" : "tv",
    category: genreInput,
    page: page,
  };

  useEffect(() => {
    const getContent = async () => {
      try {
        await genre(filter);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getContent();
  }, [page]);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Navbar />
          <main className="py-4 bg-gradient-to-t flex justify-center from-gray-950 to-gray-900 w-full">
            <div className="flex flex-col gap-5 w-[90%] px-8">
              {movies.map((movie, index) => {
                return <SearchItemComponent key={index} result={movie} />;
              })}
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Genre;
