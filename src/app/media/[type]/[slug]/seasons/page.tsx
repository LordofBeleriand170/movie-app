"use client";

import Navbar from "@/components/Navbar";
import SeasonComponent from "@/components/SeasonComponent";
import SeasonInfo from "@/components/SeasonInfo";
import { useMovieStore } from "@/features/movie/movieStore";
import { TvShow } from "@/features/tv/tvStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Season } from "@/features/tv/tvStore";

const SeasonPage = () => {
  const [tvShow, setTvShow] = useState<TvShow | null>(null);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  const { slug } = useParams<{ slug: string }>();
  const slugParts = slug?.split("-") || [];

  const { fetchInfo } = useMovieStore();

  const id = slugParts[0];

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await fetchInfo(id, "tvshows");
        if (response) {
          setTvShow(response?.info);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContent();
  }, [id, fetchInfo]);
  return (
    <>
      <div className="bg-black">
        <Navbar />
        <SeasonInfo tvShow={tvShow} currentSeason={currentSeason} />
      </div>
      <SeasonComponent
        id={id}
        tvShow={tvShow}
        currentSeason={currentSeason}
        setCurrentSeason={setCurrentSeason}
      />
    </>
  );
};

export default SeasonPage;
