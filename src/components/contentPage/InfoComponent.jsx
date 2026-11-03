"use client";

import { useContentStore } from "@/features/content/contentStore";

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LoadingPage from "@/components/loadingComponents/LoadingPage";
import Similar from "./Similar";
import ContentInfoComponent from "./ContentInfoComponent";
import { useSession } from "next-auth/react";
import ActorComponent from "./ActorComponent";
import CommentSectionComponent from "../comment/CommentSectionComponent";
import ErrorPage from "@/libs/ErrorPage";
import OptionModal from "../OptionModal";
import { useParams } from "next/navigation";

const InfoComponent = ({ option, type }) => {
  const [id, setId] = useState("");

  const content = useContentStore((state) => state.content);
  const error = useContentStore((state) => state.error);
  const avg = useContentStore((state) => state.avg);
  const voters = useContentStore((state) => state.voters);

  const [newRate, setNewRate] = useState(0);
  const [media, setMedia] = useState("movies");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openMedia, setOpenMedia] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchInfo = useContentStore((state) => state.fetchInfo);

  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    if (params?.type === "movies") {
      setMedia("movies");
    } else {
      setMedia("tv");
    }
  }, [params]);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) return;

    setCurrentUser((prev) => {
      if (prev?.id === user.id) return prev;
      return user;
    });
  }, [user]);

  useEffect(() => {
    if (!option) return;

    const getInfo = async () => {
      const mediaId = option.split("-")[0];
      setId(mediaId);
      setLoading(true);

      try {
        await fetchInfo(mediaId, type, currentUser);
      } catch (err) {
        console.error("Error fetching movie data:", err);
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, [option, currentUser]);

  return (
    <>
      {loading ? (
        <>
          <LoadingPage />
        </>
      ) : error ? (
        <>
          <ErrorPage error={error} />
        </>
      ) : (
        <div>
          <Navbar background={"no"} />
          {isModalOpen && (
            <OptionModal media={media} setIsModalOpen={setIsModalOpen} />
          )}
          <div className="relative">
            <section className="relative w-full bg-[#09090b] min-h-[60vh] border-b border-zinc-900">
              <div className="absolute inset-0 z-0 w-[86%] mx-auto h-full pointer-events-none overflow-hidden">
                <div
                  style={{
                    backgroundImage: `
            linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.7) 100%),
            linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.5) 100%),
            url(https://image.tmdb.org/t/p/original/${content?.backdrop_path})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(200%)",
                  }}
                  className="w-full h-full"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
              </div>

              <div className="relative z-10 w-full h-full">
                <ContentInfoComponent
                  type={type}
                  newRate={newRate}
                  setNewRate={setNewRate}
                  media={media}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
            </section>

            <div className="relative w-full h-24 -mt-12 -mb-12 z-20 pointer-events-none bg-gradient-to-b from-transparent via-black/90 to-black backdrop-blur-xl shadow-2xl" />

            <main
              className={`${
                openMedia && "bg-black opacity-30"
              } bg-gradient-to-b from-black to-gray-950 flex flex-col gap-10 relative z-10`}
            >
              <section className="flex flex-col m-auto gap-10 pt-10 w-[90%]">
                <ActorComponent />
                <Similar type={type} id={id} />
              </section>

              {(content?.status === "Released" ||
                content?.status === "Ended" ||
                content?.status === "Returning Series" ||
                (content?.status === "Canceled" && content?.seasons)) && (
                <section className="relative bg-black text-white z-10">
                  <CommentSectionComponent
                    movieId={Number(id)}
                    type={type}
                    newRate={newRate}
                    setNewRate={setNewRate}
                    avg={avg}
                    voters={voters}
                    contentTitle={
                      content?.original_title || content?.original_name
                    }
                  />
                </section>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoComponent;
