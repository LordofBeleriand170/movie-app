"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import {
  Movie,
  TvShow,
  useContentStore,
} from "@/features/content/contentStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";

const RateComponent = ({ rate, media, newRate, setNewRate }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const user = useCollectionStore((state) => state.user);
  const addRating = useCollectionStore((state) => state.addRating);
  const content = useContentStore((state) => state.content);
  const [hover, setHover] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const [clearRating, setClearRating] = useState(false);

  const handleRating = async (rate) => {
    try {
      await addRating(
        user?.id ? user?.id : user?.email ? user?.email : session?.user?.email,
        content?.info,
        media,
        rate,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };
  return (
    <div className="flex gap-1 pr-5 items-end">
      <div className="w-4 flex items-center justify-center pb-3">
        {isAuthenticated && (newRate > 0 || rate > 0) && !clearRating ? (
          <button
            type="button"
            onClick={() => {
              setClearRating(true);
              setNewRate(0);
              handleRating(0);
            }}
            className="text-sm cursor-pointer text-blue-400 hover:text-blue-300 leading-none select-none"
          >
            ✕
          </button>
        ) : null}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 tracking-wide text-center">
          {!newRate && !rate ? "Rate" : "Rated"}
        </span>
        <div className="flex flex-col gap-2 backdrop-blur-md py-2 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 w-fit h-6">
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active =
                    isAuthenticated &&
                    (hover
                      ? star <= hover
                      : star <=
                        (clearRating ? 0 : newRate > 0 ? newRate : rate));

                  return (
                    <FaStar
                      key={star}
                      size={20}
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push(
                            `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                          );
                          return;
                        } else {
                          setClearRating(false);
                          setNewRate(star);

                          if (star !== rate) {
                            handleRating(star);
                          }
                        }
                      }}
                      onMouseEnter={() => {
                        if (!isAuthenticated) return;
                        setHover(star);
                      }}
                      onMouseLeave={() => {
                        if (!isAuthenticated) return;
                        setHover(null);
                      }}
                      className={`cursor-pointer transition-all duration-200 shrink-0 ${
                        active ? "text-yellow-400 scale-110" : "text-gray-400"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateComponent;
