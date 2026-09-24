"use client";

import LoadingPage from "@/app/LoadingPage";
import Navbar from "@/components/Navbar";
import SeasonComponent from "@/components/SeasonComponent";
import SeasonInfo from "@/components/SeasonInfo";
import { useTvShowStore } from "@/features/tv/tvStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SeasonPage = () => {
  const { slug } = useParams();
  const slugParts = slug?.split("-") || [];

  const { fetchInfo } = useTvShowStore();
  const loading = useTvShowStore((state) => state.loading);

  const id = slugParts[0];

  useEffect(() => {
    const getContent = async () => {
      try {
        await fetchInfo(id, "tvshows");
      } catch (err) {
        console.log(err);
      }
    };
    getContent();
  }, [id, fetchInfo]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="bg-black">
        <Navbar background={"no"} />
        <SeasonInfo />
      </div>
      <SeasonComponent id={id} />
    </>
  );
};

export default SeasonPage;
