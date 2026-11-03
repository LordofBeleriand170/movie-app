"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useContentStore } from "@/features/content/contentStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { showToast } from "../ToastComponent";

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
        content,
        media,
        rate,
      );
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to submit rating. Please try again.");
    }
  };
  return (
    <div className="flex w-full gap-1">
      {isAuthenticated && (newRate > 0 || rate > 0) && !clearRating ? (
        <div className="w-4 flex items-center justify-center pb-3">
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
        </div>
      ) : null}

      <div className="relative flex flex-col w-full">
        <div className="flex justify-between items-center w-full gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = hover
              ? star <= hover
              : star <= (clearRating ? 0 : newRate > 0 ? newRate : rate);

            return (
              <div
                key={star}
                className="flex-1 flex items-center justify-center cursor-pointer aspect-square"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
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
              >
                <FaStar
                  className={`w-full h-full max-w-[32px] max-h-[32px] cursor-pointer transition-all duration-200 ${
                    active ? "text-yellow-400 scale-110" : "text-gray-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RateComponent;
