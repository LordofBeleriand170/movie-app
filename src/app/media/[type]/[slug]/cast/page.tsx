"use client";

import CastComponent from "@/components/CastComponent";
import Navbar from "@/components/Navbar";
import { Cast, Crew } from "@/features/content/contentStore";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CastPage = () => {
  const params = useParams();
  const id = params?.slug?.toString().split("-")[0];
  const type = params?.type;

  const [crew, setCrew] = useState<Crew[] | null>(null);
  const [cast, setCast] = useState<Cast[] | null>(null);

  const { fetchInfo } = useMovieStore();

  useEffect(() => {
    const fetchCrewAndCast = async () => {
      try {
        const response = await fetchInfo(id, type);
        setCrew(response.credits.crew);
        setCast(response.credits.cast);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCrewAndCast();
  }, []);

  return (
    <>
      <Navbar />
      <CastComponent crew={crew} cast={cast} />
    </>
  );
};

export default CastPage;
