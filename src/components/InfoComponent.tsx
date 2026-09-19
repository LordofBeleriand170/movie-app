"use client";

import { useContentStore } from "@/features/content/contentStore";
import { InfoComponentProps } from "@/features/content/contentStore";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import LoadingPage from "@/app/LoadingPage";
import Similar from "./Similar";
import ContentInfoComponent from "./ContentInfoComponent";
import { useSession } from "next-auth/react";
import ActorComponent from "./ActorComponent";
import CommentSectionComponent from "./CommentSectionComponent";
import ErrorPage from "@/libs/ErrorPage";

import "../app/nprogress.css";
import { Error } from "@/features/tv/tvStore";
import { User } from "@/features/collection/collectionStore";

/*${
                openMedia && "bg-black opacity-30"
              }*/

const InfoComponent: React.FC<InfoComponentProps> = ({ option, type }) => {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newRate, setNewRate] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  const [info, setInfo] = useState<[] | null>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchInfo = useContentStore((state) => state.fetchInfo);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) return;

    setCurrentUser((prev) => {
      // Compare shallowly by id or email
      if (prev?.id === user.id) return prev;
      return user;
    });
  }, [user]);

  useEffect(() => {
    if (!option) return; // no option → exit

    const getInfo = async () => {
      const mediaId = option.split("-")[0];
      setId(mediaId);
      setLoading(true);

      try {
        const infoData = await fetchInfo(mediaId, type, currentUser);

        setInfo(infoData);
      } catch (err: unknown) {
        console.error("Error fetching movie data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, [option, currentUser]); // depend only on `option`

  if (type === "movie" && !info?.info && !loading) {
    return <div>No movie found for ID: {id}</div>;
  } else if (type === "tv" && !info?.info && !loading) {
    return <div>No tv show found for ID: {id}</div>;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      {error ? (
        <>
          <Navbar />
          <main className="px-82 bg-black">
            <ErrorPage error={error} />
          </main>
        </>
      ) : (
        <div>
          <Navbar />

          <div className="relative">
            <section className="relative w-full bg-[#09090b] min-h-[60vh] border-b border-zinc-900">
              {/* Backdrop Image Container */}
              <div className="absolute inset-0 z-0 w-[86%] mx-auto h-full pointer-events-none overflow-hidden">
                <div
                  style={{
                    backgroundImage: `
            linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.7) 100%),
            linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.5) 100%),
            url(https://image.tmdb.org/t/p/original/${info?.info?.backdrop_path})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(200%)",
                  }}
                  className="w-full h-full"
                />

                {/* Inner Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
              </div>

              {/* Content Layer */}
              <div className="relative z-10 w-full h-full">
                <ContentInfoComponent
                  type={type}
                  newRate={newRate}
                  setNewRate={setNewRate}
                  info={info}
                />
              </div>
            </section>

            {/* Extra Heavy Blur & Shadow Transition Strip */}
            <div className="relative w-full h-24 -mt-12 -mb-12 z-20 pointer-events-none bg-gradient-to-b from-transparent via-black/90 to-black backdrop-blur-xl shadow-2xl" />

            <main
              className={` bg-gradient-to-b from-black to-gray-950 flex flex-col gap-10 relative z-10`}
            >
              <section className="flex flex-col m-auto gap-10 pt-10 w-[90%]">
                <ActorComponent />
                <Similar type={type} id={id} info={info} />
              </section>

              <section className="relative bg-black text-white z-10">
                <CommentSectionComponent
                  movieId={Number(id)}
                  type={type}
                  newRate={newRate}
                  setNewRate={setNewRate}
                  avg={info?.ratingAvg?._avg?.rating || 0}
                />
              </section>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoComponent;
