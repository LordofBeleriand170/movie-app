"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { LoadingDots } from "@/components/loadingComponents/LoadingDots";
import { useContentStore } from "@/features/content/contentStore";
import AddCommentComponent from "./AddCommentComponent";
import { useSearchParams } from "next/navigation";
import { ReviewHighlights } from "../contentPage/ReviewHightlights";
import CommentsOptions from "./CommentsOptions";
import { MessageSquarePlus, Star } from "lucide-react";
import CommentFormatComponent from "./CommentFormatComponent";
import { showToast } from "../ToastComponent";
import { useCommentStore } from "@/features/comment/commentStore";

const CommentSectionComponent = ({
  movieId,
  type,
  newRate,
  setNewRate,
  avg,
  voters,
  contentTitle,
}) => {
  const comments = useCommentStore((state) => state.comments);
  const ratings = useContentStore((state) => state.ratings);
  const fetchComments = useCommentStore((state) => state.fetchComments);
  const fetchRating = useContentStore((state) => state.fetchRating);

  const error = useContentStore((state) => state.error);
  const user = useCollectionStore((state) => state.user);

  const [commentOptions, setCommentOptions] = useState("");

  const params = useSearchParams();
  const commentId = params.get("commentId");

  useEffect(() => {
    if (!commentId) return;

    const el = document.getElementById(`comment-${commentId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-gray-500");

      setTimeout(() => el.classList.remove("bg-yellow-200"), 2000);
    }
  }, [commentId, comments]);

  const fetchUserCollections = useCollectionStore(
    (state) => state.fetchUserCollections,
  );

  const [loading, setLoading] = useState(true);
  const [currentRating, setCurrentRating] = useState(undefined);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserCollections(session.user.email);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchComments(movieId, type),
          fetchRating(movieId, type),
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [movieId, type, fetchComments, fetchRating]);

  useEffect(() => {
    if (error) {
      showToast("error", error);
    }
  }, [error]);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((c) => c.rating === star).length,
  }));

  let isBanned = new Date(user?.bannedUntil) > new Date();

  return (
    <div className="flex flex-col m-auto gap-8 pb-20 text-white w-[90%] px-8 sm:px-6 lg:px-8 ">
      {comments.length >= 3 && (
        <ReviewHighlights
          movieId={movieId}
          type={type}
          contentTitle={contentTitle}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
          <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight text-white">
            User Reviews
          </h2>
          <span className="px-2.5 py-0.5 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full">
            {comments.length}
          </span>
        </div>

        {isBanned ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-sm">
            You are banned from commenting until{" "}
            <span className="font-semibold">
              {new Date(user?.bannedUntil).toLocaleString()}
            </span>
          </div>
        ) : (
          <AddCommentComponent
            movieId={movieId}
            type={type}
            newRate={newRate}
            setNewRate={setNewRate}
          />
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingDots />
          </div>
        ) : comments.length > 0 ? (
          <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center px-6 py-6 bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl shadow-xl">
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-gray-800 pb-6 lg:pb-0 lg:pr-6">
                <span className="text-5xl font-black tracking-tight text-white mb-2">
                  {avg ? avg.toFixed(1) : "0.0"}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avg || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  Based on {ratings?.length || 0}{" "}
                  {ratings?.length === 1 ? "rating" : "ratings"}
                </span>

                {currentRating !== undefined && (
                  <button
                    onClick={() => setCurrentRating(undefined)}
                    className="mt-4 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 cursor-pointer"
                  >
                    Reset Filter ({currentRating} ★)
                  </button>
                )}
              </div>

              <div className="lg:col-span-8 flex flex-col gap-2 w-full">
                {ratingCounts.map(({ star, count }) => {
                  const percentage =
                    comments.length > 0 ? (count / comments.length) * 100 : 0;
                  const isSelected = currentRating === star;

                  return (
                    <div
                      key={star}
                      onClick={() =>
                        setCurrentRating(isSelected ? undefined : star)
                      }
                      className={`flex items-center gap-4 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-blue-600/10 border border-blue-500/30"
                          : "hover:bg-gray-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-1 w-10 flex-shrink-0">
                        <span className="text-xs font-bold text-gray-300">
                          {star}
                        </span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      </div>

                      <div className="flex-grow h-2.5 bg-gray-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500 group-hover:brightness-110"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="w-16 text-right text-xs text-gray-400 tabular-nums font-medium">
                        {count} ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <CommentsOptions
              comments={comments}
              currentRating={currentRating}
              commentOptions={commentOptions}
              setCommentOptions={setCommentOptions}
            />

            <div className="flex flex-col gap-4">
              {[...comments]
                .sort((a, b) => {
                  switch (commentOptions) {
                    case "Newest":
                      return new Date(b?.createdAt) - new Date(a?.createdAt);
                    case "Oldest":
                      return new Date(a?.createdAt) - new Date(b?.createdAt);
                    case "Highest Rated":
                      return b.rating - a.rating;
                    case "Lowest Rated":
                      return a.rating - b.rating;
                    case "Most Likes":
                      return b.likes - a.likes;
                    case "Most Replies":
                      return (
                        (b.replies?.length || 0) - (a.replies?.length || 0)
                      );
                    default:
                      return 0;
                  }
                })
                .filter(
                  (comment) =>
                    currentRating === undefined ||
                    comment.rating === currentRating,
                )
                .map((comment) => (
                  <CommentFormatComponent key={comment.id} comment={comment} />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-800/80 flex items-center justify-center text-gray-400 shadow-inner">
              <MessageSquarePlus className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                No reviews yet
              </h3>
              <p className="text-sm text-gray-400 max-w-sm">
                Be the first to share your thoughts and rate this content!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSectionComponent;
