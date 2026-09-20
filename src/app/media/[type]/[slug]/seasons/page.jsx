"use client";

import Navbar from "@/components/Navbar";
import SeasonComponent from "@/components/SeasonComponent";
import SeasonInfo from "@/components/SeasonInfo";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SeasonPage = () => {
  const [tvShow, setTvShow] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);

  const { slug } = useParams();
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
        <Navbar background={"no"} />
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
