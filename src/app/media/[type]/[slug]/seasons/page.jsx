"use client";

import LoadingPage from "@/components/loadingComponents/LoadingPage";
import Navbar from "@/components/Navbar";
import SeasonComponent from "@/components/season/SeasonComponent";
import SeasonInfo from "@/components/season/SeasonInfo";
import { useAuthStore } from "@/features/auth/authStore";
import { useContentStore } from "@/features/content/contentStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const SeasonPage = () => {
  const { slug } = useParams();
  const slugParts = slug?.split("-") || [];

  const { fetchInfo } = useContentStore((state) => state.fetchInfo);
  const loading = useContentStore((state) => state.loading);

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
