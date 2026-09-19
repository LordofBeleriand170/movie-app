"use client";

import Navbar from "@/components/Navbar";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Backdrops, Posters } from "@/features/content/contentStore";

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

  const [openMedia, setOpenMedia] = useState<boolean>(false);
  const [openedMedia, setOpenedMedia] = useState<string | null>(null);

  const mediaRef = useRef<HTMLDivElement>(null);

  const mediaOpen = (image: string) => {
    setOpenMedia(true);
    setOpenedMedia(image);
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        if (!id) return;
        const response = await fetchInfo(id, type);
        setMedia(response?.media);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMedia();
  }, [id, type, fetchInfo]);

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
      {openMedia && openedMedia && (
        <div className="fixed inset-0 flex h-full w-full justify-center items-center z-50 bg-black/80">
          <div
            ref={mediaRef}
            className="relative max-h-[90vh] max-w-[90vw] h-full w-full"
          >
            <Image
              src={openedMedia}
              alt="Expanded media view"
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
      <main
        className={`${openMedia ? "bg-black opacity-30" : ""} flex flex-wrap gap-5 px-8 py-4`}
      >
        {(params?.option === "popular" || params?.option === "backdrops") &&
          media?.backdrops?.map((backdrop, index) => (
            <div
              key={backdrop.file_path || index}
              className="relative w-96 h-54 cursor-pointer overflow-hidden rounded"
              onClick={() =>
                mediaOpen(
                  `https://image.tmdb.org/t/p/original/${backdrop.file_path}`,
                )
              }
            >
              <Image
                src={`https://image.tmdb.org/t/p/w780/${backdrop.file_path}`}
                alt={`Backdrop ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          ))}

        {(params?.option === "popular" || params?.option === "posters") &&
          media?.posters?.map((poster, index) => (
            <div
              key={poster.file_path || index}
              className="relative w-64 h-96 cursor-pointer overflow-hidden rounded"
              onClick={() =>
                mediaOpen(
                  `https://image.tmdb.org/t/p/original/${poster.file_path}`,
                )
              }
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500/${poster.file_path}`}
                alt={`Poster ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </div>
          ))}
      </main>
    </>
  );
};

export default Page;
