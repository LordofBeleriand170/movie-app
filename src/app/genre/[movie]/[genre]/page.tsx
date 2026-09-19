"use client";

import LoadingPage from "@/app/LoadingPage";
import Navbar from "@/components/Navbar";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchItemComponent from "@/components/SearchItemComponent";

const Genre = () => {
  const [loading, setLoading] = useState<boolean | null>(true);
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
          <main className="py-4 bg-gradient-to-t from-gray-950 to-gray-900 2xl:px-82 xl:px-60 lg:px-40 md:px-20 sm:px-10">
            <div className="flex flex-col gap-5">
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
