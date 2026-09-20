"use client";

import React, { useEffect, useState } from "react";

import { useMovieStore } from "@/features/movie/movieStore";
import { useSession } from "next-auth/react";
import { useCollectionStore } from "@/features/collection/collectionStore";
import CommentComponent from "./CommentComponent";

import { LoadingDots } from "@/app/LoadingDots";
import { useContentStore } from "@/features/content/contentStore";
import AddCommentComponent from "./AddCommentComponent";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { ReviewHighlights } from "./ReviewHightlights";
import CommentsOptions from "./CommentsOptions";

const CommentSectionComponent = ({
  movieId,
  type,
  newRate,
  setNewRate,
  avg,
  voters,
  contentTitle,
}) => {
  const { likes } = useMovieStore();

  const comments = useContentStore((state) => state.comments);
  const ratings = useContentStore((state) => state.ratings);
  const fetchComments = useContentStore((state) => state.fetchComments);
  const fetchRating = useContentStore((state) => state.fetchRating);
  const addComment = useContentStore((state) => state.addComment);

  const error = useContentStore((state) => state.error);
  const user = useCollectionStore((state) => state.user);
  const sentimentScore = useContentStore((state) => state.sentimentScore);

  const [commentOptions, setCommentOptions] = useState("");

  const params = useSearchParams();
  const commentId = params.get("commentId");

  useEffect(() => {
    if (!commentId) return;

    const el = document.getElementById(`comment-${commentId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-gray-500"); // optional highlight

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
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {}, [likes, comments]);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((c) => c.rating === star).length,
  }));

  const maxCount = Math.max(...ratingCounts.map((r) => r.count));

  let isBanned = new Date(user?.bannedUntil) > new Date();

  return (
    <div className="flex flex-col m-auto gap-10 w-[90%] px-8 pb-20">
      {comments.length >= 3 && (
        <>
          <ReviewHighlights
            movieId={movieId}
            type={type}
            contentTitle={contentTitle}
          />
        </>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              User reviews
            </h2>
          </div>

          {isBanned ? (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
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

        <div className="flex flex-col items-center gap-6 w-full">
          {comments.length > 0 && !loading ? (
            <div className="w-full flex flex-col gap-2">
              <div className="relative flex justify-between items-center px-5 py-6 bg-[#11161F] border border-[#222A36] gap-5 mb-6 rounded-lg">
                <div className="flex flex-col items-center">
                  {currentRating !== undefined && (
                    <button
                      onClick={() => setCurrentRating(undefined)}
                      className="text-sm text-blue-400 mt-2 cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <span className="flex gap-2 text-5xl">{avg?.toFixed(1)}</span>

                  <div className="text-xl text-yellow-400">
                    {"★".repeat(avg)}
                  </div>

                  <span className="text-xs text-gray-500">
                    {ratings?.length}{" "}
                    {ratings?.length !== 1 ? "ratings" : "rating"}
                  </span>
                </div>

                <span className="h-35 w-0.5 bg-gray-800" />

                <div className="flex flex-col gap-1 w-full">
                  {ratingCounts.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="w-6 text-right tabular-nums text-xs">
                          {star}
                        </span>
                        <span className="text-yellow-400">★</span>
                      </div>

                      <div className="w-[90%] h-2 rounded">
                        <div className="w-full h-2 bg-gray-800 rounded cursor-pointer">
                          <div
                            className="h-2 bg-yellow-400 rounded cursor-pointer"
                            style={{ width: `${(count / maxCount) * 50}%` }}
                            onClick={() => setCurrentRating(star)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-nowrap gap-1 text-xs text-gray-300 w-6">
                        <span>
                          {count !== 0
                            ? `${((count / comments.length) * 100).toFixed(1)}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <CommentsOptions
                comments={comments}
                currentRating={currentRating}
                commentOptions={commentOptions}
                setCommentOptions={setCommentOptions}
              />

              {comments.length === 0 ? (
                <span>No reviews yet</span>
              ) : (
                [...comments]
                  .sort((a, b) => {
                    switch (commentOptions) {
                      case "Newest":
                        return new Date(a?.createdAt) - new Date(b?.createdAt);
                      case "Oldest":
                        return new Date(b?.createdAt) - new Date(a?.createdAt);
                      case "Highest Rated":
                        return b.rating - a.rating;
                      case "Lowest Rated":
                        return a.rating - b.rating;
                      case "Most Likes":
                        return b.likes - a.likes;
                      case "Most Replies":
                        return b.replies.length - a.replies.length;
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
                    <CommentComponent key={comment.id} comment={comment} />
                  ))
              )}
            </div>
          ) : loading ? (
            <LoadingDots />
          ) : (
            <span>No comments yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSectionComponent;
