"use client";

import { Backdrops, Posters } from "@/components/InfoComponent";
import Navbar from "@/components/Navbar";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Media {
  backdrops: Backdrops[];
  posters: Posters[];
}

const Page = () => {
  const params = useParams();
  const id = params?.slug?.toString().split("-")[0];
  const type = params?.type?.toString() ?? "movie"; // fallback to "movie" if not present

  const [media, setMedia] = useState<Media | null>(null);
  const { fetchInfo } = useMovieStore();

  const [openMedia, setOpenMedia] = useState<boolean | null>(false);
  const [openedMedia, setOpenedMedia] = useState<string | null>(null);

  const mediaRef = useRef<HTMLImageElement>(null);

  const mediaOpen = (image: string) => {
    setOpenMedia(true);
    setOpenedMedia(image);
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetchInfo(id, type);
        setMedia(response?.media);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMedia();
  }, [id, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mediaRef?.current &&
        !mediaRef?.current?.contains(event.target as Node)
      ) {
        setOpenMedia(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Navbar />
      {openMedia && (
        <div className="fixed top-0 flex h-full w-full justify-center items-center z-100">
          <img src={`${openedMedia}`} className="max-h-full" ref={mediaRef} />
        </div>
      )}
      <main
        className={`${openMedia && " bg-black opacity-30"} flex flex-wrap gap-5 px-30 py-4`}
      >
        {(params.option === "popular" || params.option === "backdrops") &&
          media?.backdrops?.map((backdrop, index) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/original/${backdrop.file_path}`}
              alt="Backdrop"
              className="w-100"
              onClick={() =>
                mediaOpen(
                  `https://image.tmdb.org/t/p/original/${backdrop.file_path}`,
                )
              }
            />
          ))}

        {(params.option === "popular" || params.option === "posters") &&
          media?.posters?.map((poster, index) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/original/${poster.file_path}`}
              alt="Poster"
              className="w-100"
              onClick={() =>
                mediaOpen(
                  `https://image.tmdb.org/t/p/original/${poster.file_path}`,
                )
              }
            />
          ))}
      </main>
    </>
  );
};

export default Page;
