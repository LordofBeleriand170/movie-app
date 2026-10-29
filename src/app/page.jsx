"use client";

import Navbar from "@/components/Navbar";
import Trending from "@/components/Trending";
import { useAuthStore } from "@/features/auth/authStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import "./nprogress.css";
import ErrorPage from "@/libs/ErrorPage";
import RecommendedComponent from "@/components/RecommendedComponent";
import RecentlyVisited from "@/components/RecentlyVisited";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [errorComponent, setErrorComponent] = useState(false);

  /*useEffect(() => {
    let data = [
      {
        user: { id: "cmuap95bj0000cq2ymt7kjvzh", username: "User0" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: false,
        text: "One of the greatest crime dramas I've ever watched. Every scene has a purpose.",
      },
      {
        user: { id: "cmuap961u0002cq2y0s422fav", username: "User1" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: false,
        text: "The performances are phenomenal, especially from Brando and Pacino.",
      },
      {
        user: { id: "cmuap98760003cq2yvrlme9ix", username: "User2" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "Amazing storytelling and unforgettable characters. It deserves its legendary status.",
      },
      {
        user: { id: "cmuap991c0005cq2y2uy8cbnl", username: "User3" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "The pacing is slow, but the payoff is worth it. A fantastic film overall.",
      },
      {
        user: { id: "cmuap9a9i0006cq2ywaq1aca6", username: "User4" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: false,
        text: "Beautiful cinematography, incredible dialogue, and a timeless soundtrack.",
      },
      {
        user: { id: "cmuap9bw20007cq2yecrn5avo", username: "User5" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: true,
        text: "Michael's transformation into the family's ruthless leader is one of the best character arcs in film history.",
      },
      {
        user: { id: "cmuap9db50008cq2ypisbclwj", username: "User6" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "A classic that still holds up today. Every rewatch reveals something new.",
      },
      {
        user: { id: "cmuap9esa0009cq2y49xcftfj", username: "User7" },
        mediaId: 238,
        mediaType: "movies",
        rating: 3,
        spoilers: false,
        text: "Good movie, but I personally found parts of it a little too slow.",
      },
      {
        user: { id: "cmuap9esa0009cq2y49xcftfj", username: "User8" },
        mediaId: 238,
        mediaType: "movie",
        rating: 5,
        spoilers: false,
        text: "An absolute masterpiece. The writing and directing are nearly flawless.",
      },
      {
        user: { id: "cmuap9hvc000bcq2ysbsttj2g", username: "User9" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "The family dynamics make the story much more compelling than a typical gangster film.",
      },
      {
        user: { id: "cmuap9isj000ccq2yq3zc0ay8", username: "User10" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: true,
        text: "The final scene with Michael denying everything to Kay before the door closes is unforgettable.",
      },
      {
        user: { id: "cmuap9k6x000dcq2yqvlwskhs", username: "User11" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "One of those rare movies that completely lives up to the hype.",
      },
      {
        user: { id: "cmuap9lbg000ecq2ysregy5cr", username: "User12" },
        mediaId: 238,
        mediaType: "movies",
        rating: 3,
        spoilers: false,
        text: "Very well made, although I think it's a bit overrated compared to modern crime dramas.",
      },
      {
        user: { id: "cmuap9me1000fcq2ya3e6nuqu", username: "User13" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: false,
        text: "The cast is perfect. I can't imagine anyone else playing these roles.",
      },
      {
        user: { id: "cmuap9odi000gcq2yqdc70q1n", username: "User14" },
        mediaId: 238,
        mediaType: "movies",
        rating: 2,
        spoilers: false,
        text: "I appreciated the craftsmanship, but it wasn't really my type of movie.",
      },
      {
        user: { id: "cmuap9pog000hcq2yzqia2e5a", username: "User15" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: true,
        text: "Sonny's death completely changed the direction of the story and raised the stakes dramatically.",
      },
      {
        user: { id: "cmuap9qy0000icq2yt6ks9iju", username: "User16" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "Excellent character development and some of the best dialogue ever written.",
      },
      {
        user: { id: "cmuap9tvr000jcq2y17zqh89j", username: "User17" },
        mediaId: 238,
        mediaType: "movies",
        rating: 1,
        spoilers: false,
        text: "I know it's considered a classic, but I just couldn't get invested in it.",
      },
      {
        user: { id: "cmuap9upp000lcq2yqvsak7vc", username: "User18" },
        mediaId: 238,
        mediaType: "movies",
        rating: 5,
        spoilers: false,
        text: "A movie that earns every minute of its runtime. Absolutely incredible.",
      },
      {
        user: { id: "cmuap9w7p000mcq2yog2iu0fo", username: "User19" },
        mediaId: 238,
        mediaType: "movies",
        rating: 4,
        spoilers: false,
        text: "Even decades later, this remains one of the defining films of the crime genre.",
      },
    ];
    const addCommentd = async () => {
      for (let i = 0; i < data.length; i++) {
        await addComment(
          data[i].user,
          data[i].mediaId,
          data[i].text,
          data[i].rating,
          data[i].mediaType,
          data[i].spoilers,
        );

        toast.success(`Comment ${data[i].user.username} added successfully!`);
      }
    };

    addCommentd();
  }, []);*/

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <LoadingPage />;
  }

  if (errorComponent) {
    return <ErrorPage />;
  }

  const isUserAuthenticated = status === "authenticated" && !!session?.user;

  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-red-900/15 rounded-full blur-[140px]" />

        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[150px]" />

        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[450px] bg-neutral-900/40 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />

        <main className="flex flex-col py-8 w-full">
          <div className="flex flex-col m-auto gap-8 w-[90%]">
            <section className="transition-all duration-300">
              <Trending setErrorComponent={setErrorComponent} />
            </section>

            {(isAuthenticated || isUserAuthenticated) && (
              <section className="transition-all duration-300">
                <RecommendedComponent />
              </section>
            )}

            {isUserAuthenticated && (
              <section className="transition-all duration-300">
                <RecentlyVisited />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
