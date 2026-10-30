"use client";

import Navbar from "@/components/Navbar";
import Trending from "@/components/Trending";
import { useAuthStore } from "@/features/auth/authStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import "./nprogress.css";
import RecommendedComponent from "@/components/RecommendedComponent";
import RecentlyVisited from "@/components/RecentlyVisited";
import { useMovieStore } from "@/features/movie/movieStore";

export default function Home() {
  const { data: session, status } = useSession();
  const [errorComponent, setErrorComponent] = useState(false);

  // Fixed: Check that session.user actually exists when authenticated
  const isUserAuthenticated = status === "authenticated" && !!session?.user;

  if (status === "loading") {
    return <LoadingPage />;
  }

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

            {isUserAuthenticated && (
              <>
                <section className="transition-all duration-300">
                  <RecommendedComponent />
                </section>
                <section className="transition-all duration-300">
                  <RecentlyVisited />
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
