"use client";

import Navbar from "@/components/Navbar";
import Trending from "@/components/Trending";
import { useAuthStore } from "@/features/auth/authStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import NProgress from "nprogress";
import "./nprogress.css";
import ErrorPage from "@/libs/ErrorPage";
import RecommendedComponent from "@/components/RecommendedComponent";
import RecentlyVisited from "@/components/RecentlyVisited";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [errorComponent, setErrorComponent] = useState<boolean>(false);

  console.log("ISAUTHENTICATED: ", isAuthenticated);

  useEffect(() => {
    if (status === "loading") {
      NProgress.start();
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        NProgress.done();
      }, 1000);

      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <LoadingPage />;
  }

  if (errorComponent) {
    return <ErrorPage error={{ message: "Error occured" }} />;
  }

  const isUserAuthenticated = status === "authenticated" && !!session?.user;

  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-x-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left subtle red aura */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-red-900/15 rounded-full blur-[140px]" />
        {/* Mid-right dynamic dark purple aura */}
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[150px]" />
        {/* Bottom deep ambient glow */}
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[450px] bg-neutral-900/40 rounded-full blur-[160px]" />
      </div>

      {/* Main Page Layout */}
      <div className="relative z-10 flex flex-col">
        <Navbar />

        <main className="flex flex-col py-8 w-full">
          <div className="flex flex-col m-auto gap-8 w-[90%]">
            <section className="transition-all duration-300">
              <Trending setErrorComponent={setErrorComponent} />
            </section>

            {isUserAuthenticated && (
              <section className="transition-all duration-300">
                <RecommendedComponent />
              </section>
            )}

            {/* Mounts only after authentication and session user are strictly confirmed */}
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
