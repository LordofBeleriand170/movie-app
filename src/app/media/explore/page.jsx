"use client";

import ExploreComponent from "@/components/ExploreComponent";
import Navbar from "@/components/Navbar";
import React from "react";

const ExplorePage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen h-full mt-30">
        <div className="flex flex-col gap-10 m-auto w-[90%] px-8">
          <ExploreComponent />
        </div>
      </main>
    </>
  );
};

export default ExplorePage;
