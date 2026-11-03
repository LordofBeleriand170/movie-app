"use client";

import LoadingPage from "@/components/loadingComponents/LoadingPage";
import SeasonInfoSkeleton from "@/components/loadingComponents/SeasonInfoSkeleton";
import Navbar from "@/components/Navbar";
import SeasonComponent from "@/components/season/SeasonComponent";
import SeasonInfo from "@/components/season/SeasonInfo";
import SeasonPoster from "@/components/season/SeasonPoster";
import { useContentStore } from "@/features/content/contentStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SeasonPage = () => {
  const { slug } = useParams();
  const slugParts = slug?.split("-") || [];

  const fetchInfo = useContentStore((state) => state.fetchInfo);
  const content = useContentStore((state) => state.content);
  const loadingSeasonInfo = useContentStore((state) => state.loadingSeasonInfo);
  const [loading, setLoading] = useState(true);

  const [currentSeason, setCurrentSeason] = useState(1);

  const id = slugParts[0];

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        await fetchInfo(id, "tvshows");
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
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
        <Navbar />
        {loadingSeasonInfo ? <SeasonInfoSkeleton /> : <SeasonInfo />}
      </div>
      <div className="w-[90%] mx-auto px-8">
        <div className="flex gap-5 py-3 overflow-x-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          {content?.seasons?.map((season, index) => (
            <SeasonPoster
              key={index}
              season={season}
              setCurrentSeason={setCurrentSeason}
            />
          ))}
        </div>
      </div>
      <SeasonComponent id={id} currentSeason={currentSeason} />
    </>
  );
};

export default SeasonPage;
