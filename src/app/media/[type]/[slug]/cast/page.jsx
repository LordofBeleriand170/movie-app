"use client";

import CastComponent from "@/components/CastComponent";
import Navbar from "@/components/Navbar";
import { useContentStore } from "@/features/content/contentStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CastPage = () => {
  const params = useParams();
  const id = params?.slug?.toString().split("-")[0];
  const type = params?.type;

  const { fetchInfo } = useContentStore();

  useEffect(() => {
    const fetchCrewAndCast = async () => {
      try {
        await fetchInfo(id, type);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCrewAndCast();
  }, []);

  return (
    <>
      <Navbar />
      <CastComponent />
    </>
  );
};

export default CastPage;
