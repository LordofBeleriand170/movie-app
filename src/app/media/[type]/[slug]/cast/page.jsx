"use client";

import CastComponent from "@/components/contentPage/CastComponent";
import Navbar from "@/components/Navbar";
import { useContentStore } from "@/features/content/contentStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CastPage = () => {
  const params = useParams();
  const id = params?.slug?.toString().split("-")[0];
  const type = params?.type;

  const [crew, setCrew] = useState(null);
  const [cast, setCast] = useState(null);

  const { fetchInfo } = useContentStore();

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
