"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import React, { useState } from "react";
import { Calendar, Heart, Eye, LucideClock2 } from "lucide-react";
import Image from "next/image";

const UserInfoComponent = () => {
  const { user } = useCollectionStore();

  let monthName = (monthNum) => {
    switch (monthNum) {
      case "01":
        return "January";
      case "02":
        return "February";
      case "03":
        return "March";
      case "04":
        return "April";
      case "05":
        return "May";
      case "06":
        return "June";
      case "07":
        return "July";
      case "08":
        return "August";
      case "09":
        return "September";
      case "10":
        return "October";
      case "11":
        return "November";
      case "12":
        return "December";
    }
  };

  let dateJoined =
    monthName(user?.createdAt?.split("T")[0].split("-")[1]) +
    " " +
    user?.createdAt?.split("T")[0].split("-")[0];

  const [loading, setLoading] = useState(true);
  const watchlist = useCollectionStore((state) => state.watchlist);
  const favorite = useCollectionStore((state) => state.favorite);
  const bookmark = useCollectionStore((state) => state.bookmark);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
        linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 30%),
        linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%),
        linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%),
        url('/360_F_271506927_WWFfd92jDIIDx6DgMflakU14o5jRPgBm.jpg')
      `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(50%)",
        }}
      />

      <div className="absolute inset-0 bg-black/30 -z-10" />

      <div className="relative flex justify-between items-center px-10 py-10">
        <div className="flex items-center gap-10">
          {user?.image ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
              <Image
                src={user?.image}
                fill
                alt={"Profile image"}
                className="object-cover rounded-full"
              />
            </div>
          ) : (
            <div
              id="user-avatar"
              className="flex items-center justify-center w-30 h-30
                         rounded-full bg-[#16161a] text-white 
                         font-bold text-5xl border border-neutral-700/80
                         hover:border-neutral-500 transition-all duration-200 
                         outline-none shrink-0"
            >
              {user?.name?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase() ||
                ""}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">
              {user?.name || user?.username}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="text-gray-400 w-4 h-4" />
              <span className="font-bold text-xs text-gray-400">
                Joined {dateJoined}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="flex gap-2 rounded-lg border border-gray-900 p-5 bg-gray-900">
            <Heart className="text-red-500 mt-1" />
            <div className="flex flex-col text-left">
              <div className="text-2xl font-bold text-white">
                {favorite?.length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Favorites
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-left rounded-lg border border-gray-900 p-5 bg-gray-900">
            <Eye className="text-blue-400 mt-1" />
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-white">
                {watchlist?.length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Watched
              </div>
            </div>
          </div>
          <div className="flex gap-2 rounded-lg border border-gray-900 p-5 bg-gray-900">
            <LucideClock2 className="text-blue-500 mt-1" />
            <div className="flex flex-col text-left">
              <div className="text-2xl font-bold text-white">
                {bookmark?.length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Bookmark
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoComponent;
