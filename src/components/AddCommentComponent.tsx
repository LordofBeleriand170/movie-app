"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useContentStore } from "@/features/content/contentStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

interface AddCommentComponentProps {
  movieId: number;
  type: string;
  newRate: number;
  setNewRate: React.Dispatch<React.SetStateAction<number>>;
}

const AddCommentComponent: React.FC<AddCommentComponentProps> = ({
  movieId,
  type,
  newRate,
  setNewRate,
}) => {
  const addComment = useContentStore((state) => state.addComment);
  const user = useCollectionStore((state) => state.user);
  const ratings = useCollectionStore((state) => state.ratings);

  const [text, setText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [spoiler, setSpoiler] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const router = useRouter();

  let current;

  useEffect(() => {
    currentRating = ratings.find((rating: []) => {
      return (
        rating?.userId === user?.id &&
        rating?.movieId === movieId &&
        rating?.type === "mediaType"
      );
    });

    if (!currentRating) {
      currentRating = newRate > 0 ? newRate : 0;
    }

    setRating(currentRating?.rating);
  }, [ratings, openComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
      return;
    }

    if (!text.trim()) return;

    try {
      setNewRate(rating);

      // Add the comment with optional rating
      await addComment(user, movieId, text, rating, type, spoiler);

      // Clear form
      setText("");
      setRating(0);
      setOpenComment(false);
    } catch (error) {
      console.error(error);

      // ❌ Error toast
      toast.error("Failed to add comment. Please try again.");
    }
  };

  return (
    <>
      <div>
        <button
          className="flex gap-1.5 flex-nowrap items-center text-red-500 hover:text-white hover:bg-red-600 border px-3.5 py-2 rounded-lg border-red-500/80 font-bold cursor-pointer transition-all duration-200 shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]"
          onClick={() => setOpenComment(true)}
        >
          <Pencil className="h-4 w-4" />
          <span className="text-sm font-bold">Write a Review</span>
        </button>
      </div>

      {openComment && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="
            mt-4
            w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%]
            rounded-2xl
            border border-neutral-800
            bg-neutral-950
            p-6
            shadow-2xl shadow-red-950/20
          "
          >
            <div className="flex justify-between items-center mb-5 border-b border-neutral-800/60 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Add your review
                </h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                  Share your thoughts with the community
                </p>
              </div>

              <button
                onClick={() => setOpenComment(false)}
                className="text-neutral-400 cursor-pointer hover:text-white text-2xl font-light transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Rating */}
              <div>
                <p className="text-sm text-neutral-400 mb-2 font-medium">
                  Your rating
                </p>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className={`
                      cursor-pointer
                      text-3xl
                      transition-all duration-150 transform hover:scale-110
                      ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                          : "text-neutral-700"
                      }
                    `}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <textarea
                className="
                w-full
                min-h-36
                rounded-xl
                bg-neutral-900
                border border-neutral-800
                text-white
                placeholder-neutral-500
                p-4
                outline-none
                focus:border-red-500/80
                focus:ring-1 focus:ring-red-500/50
                resize-none
                transition-all
              "
                placeholder="What did you think about this movie?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {/* Spoiler Checkbox */}
              <label
                className="
                flex items-center gap-3
                text-neutral-300
                cursor-pointer
                text-sm
                select-none
              "
              >
                <input
                  type="checkbox"
                  checked={spoiler}
                  onChange={() => setSpoiler(!spoiler)}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 accent-red-600 focus:ring-red-500 focus:ring-offset-neutral-950 cursor-pointer"
                />
                Contains spoilers
              </label>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenComment(false)}
                  className="
                  px-5 py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                  text-neutral-400
                  hover:text-white
                  hover:bg-neutral-900
                  transition-colors
                  cursor-pointer
                "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                  px-6 py-2.5
                  rounded-xl
                  bg-red-600
                  hover:bg-red-500
                  text-white
                  text-sm
                  font-semibold
                  shadow-[0_0_12px_rgba(239,68,68,0.4)]
                  hover:shadow-[0_0_18px_rgba(239,68,68,0.6)]
                  transition-all duration-200
                  cursor-pointer

                "
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCommentComponent;
