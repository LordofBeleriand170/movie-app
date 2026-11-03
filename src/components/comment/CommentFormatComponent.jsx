"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/app/utils/formatDate";
import {
  Heart,
  CornerDownRight,
  MessageSquareX,
  ShieldAlert,
  X,
  Star,
} from "lucide-react";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddReplyComponent from "./AddReplyComponent";
import { showToast } from "../ToastComponent";
import { useCommentStore } from "@/features/comment/commentStore";

const CommentFormatComponent = ({ comment, type }) => {
  const deleteComment = useCommentStore((store) => store.deleteComment);
  const ban = useCollectionStore((store) => store.ban);
  const addLike = useCommentStore((state) => state.addLike);

  comment = comment?.comment || comment;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const targetedCommentId = searchParams.get("commentId");

  const user = useCollectionStore((state) => state.user);
  const report = useCollectionStore((state) => state.report);
  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const [bannedModal, setBannedModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDurationDays, setBanDurationDays] = useState("7");
  const [isSubmittingBan, setIsSubmittingBan] = useState(false);

  const [openResponds, setOpenResponds] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);
  let isBanned = new Date(user?.bannedUntil) > new Date();

  const isReply = Boolean(comment?.replyLikes);

  const hasLiked = isReply
    ? comment?.replyLikes?.some((like) => like?.userId === user?.id)
    : comment?.commentLikes?.some((like) => like?.userId === user?.id);
  const [liked, setLiked] = useState(hasLiked);

  const toggleLike = async (target, userObj, isReplyParam) => {
    if (!userObj || !target) return;
    const userIdStr = userObj?.id?.toString();
    const targetId = target?.id;

    if (isReplyParam) {
      const likesList = target?.replyLikes || [];
      const hasLikedTarget = likesList.some(
        (like) => like.userId === userIdStr,
      );

      target.replyLikes = hasLikedTarget
        ? likesList.filter((like) => like.userId !== userIdStr)
        : [...likesList, { userId: userIdStr, replyId: targetId }];
    } else {
      const likesList = target?.commentLikes || [];
      const hasLikedTarget = likesList.some(
        (like) => like.userId === userIdStr,
      );

      target.commentLikes = hasLikedTarget
        ? likesList.filter((like) => like.userId !== userIdStr)
        : [...likesList, { userId: userIdStr, commentId: targetId }];
    }

    console.log("isReply: ", isReply);

    try {
      await addLike(targetId, isReply, userObj?.id);
    } catch (err) {
      console.error("Failed to add like:", err);
    }
  };

  useEffect(() => {
    if (
      targetedCommentId &&
      String(comment?.id) === String(targetedCommentId)
    ) {
      setIsHighlighted(true);

      const timer = setTimeout(() => {
        const element = document.getElementById(`commentId-${comment?.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      const removeHighlight = setTimeout(() => {
        setIsHighlighted(false);
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeHighlight);
      };
    }
  }, [targetedCommentId, comment?.id]);

  const handleDeleteComment = async (id, isComment) => {
    try {
      const res = await deleteComment(id, isComment);

      if (res?.ok) {
        showToast("success", "Comment has been deleted!");
      } else {
        showToast("error", "Error has occurred!");
      }
    } catch (err) {
      console.log(err);
      showToast("error", "Error has occurred!");
    }
  };

  const handleReport = async (id, userObj) => {
    try {
      const res = await report(id, userObj);

      if (res?.notification) {
        showToast("success", "Report has been sent!");
      } else {
        showToast("error", "Error has occurred!");
      }
    } catch (err) {
      console.log(err);
      showToast("error", "Error has occurred!");
    }
  };

  const handleBanUser = async (e) => {
    e.preventDefault();
    if (!banReason.trim()) {
      showToast("error", "Please enter a ban reason!");
      return;
    }

    try {
      setIsSubmittingBan(true);

      let bannedUntilDate;
      if (banDurationDays === "permanent") {
        bannedUntilDate = new Date();
        bannedUntilDate.setFullYear(bannedUntilDate.getFullYear() + 100);
      } else {
        const days = parseInt(banDurationDays, 10);
        bannedUntilDate = new Date();
        bannedUntilDate.setDate(bannedUntilDate.getDate() + days);
      }

      const res = await ban(
        comment?.userId,
        user?.id,
        banReason,
        bannedUntilDate.toISOString(),
      );

      if (res?.ok) {
        showToast(
          "success",
          `User ${comment?.username || ""} has been banned!`,
        );
        setBannedModal(false);
        setBanReason("");
      } else {
        showToast("error", res?.error || "Failed to ban user!");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "An error occurred while banning!");
    } finally {
      setIsSubmittingBan(false);
    }
  };

  useEffect(() => {
    setLiked(hasLiked);
  }, [hasLiked]);

  if (comment?.isDeleted) {
    return (
      <div
        id={`commentId-${comment?.id}`}
        className="flex gap-3.5 items-start p-3.5 rounded-2xl border border-neutral-800/50 bg-[#0e0e11]/60 my-1.5 transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-neutral-800/40 border border-neutral-700/30 flex items-center justify-center shrink-0 text-neutral-500">
          <MessageSquareX className="w-4 h-4" />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-neutral-500 italic">
              [Deleted]
            </span>
            {comment?.createdAt && (
              <span className="text-[11px] text-neutral-600">
                {formatDate(comment.createdAt)}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-500 italic">
            This {type ? "comment" : "reply"} has been removed.
          </p>

          {type && comment?.replies?.length > 0 && (
            <div className="pt-1">
              <button
                onClick={() =>
                  setOpenResponds((prev) =>
                    prev === comment?.id ? "" : comment?.id,
                  )
                }
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-neutral-500" />
                <span>{comment.replies.length} Replies</span>
              </button>
            </div>
          )}

          {openResponds === comment?.id && (
            <div className="ml-3 pl-3 border-l border-neutral-800 flex flex-col gap-3 mt-3">
              {comment?.replies.map((reply) => (
                <CommentFormatComponent
                  key={reply.id}
                  comment={reply}
                  type={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const ratingValue = Number(comment?.rating) || 0;

  return (
    <>
      <div
        id={`commentId-${comment?.id}`}
        className={`
        flex gap-3.5 items-start p-4 rounded-2xl border transition-all duration-300 my-1.5
        ${
          isHighlighted
            ? "bg-red-500/10 border-red-500/80 shadow-lg shadow-red-500/10 ring-2 ring-red-500/40"
            : "bg-[#121215] border-neutral-800/80 hover:border-neutral-700/80"
        }
      `}
      >
        <Image
          src={comment?.image ?? "/user-not-found.jpg"}
          alt="comment avatar"
          className="w-9 h-9 rounded-full object-cover border border-neutral-700/60 shrink-0"
          width={36}
          height={36}
        />

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-white truncate">
                {comment?.username || "Anonymous"}
              </span>

              {ratingValue > 0 && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3.5 h-3.5 ${
                        index < ratingValue
                          ? "text-amber-400 fill-amber-400"
                          : "text-neutral-600"
                      }`}
                    />
                  ))}
                </div>
              )}

              {comment?.createdAt && (
                <span className="text-neutral-400">
                  {formatDate(comment.createdAt)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-neutral-200 leading-relaxed font-normal">
            {comment?.text}
          </p>

          <div className="flex items-center gap-5 pt-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Heart
                onClick={() => {
                  if (!user) {
                    router.push(
                      `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                    );
                    return;
                  }

                  setLiked((prev) => !prev);
                  toggleLike(comment, user, isReply);
                }}
                className={`w-4 h-4 cursor-pointer transition-transform active:scale-125 ${
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-neutral-400 hover:text-red-500"
                }`}
              />
              <span className="font-medium">
                {comment?.commentLikes?.length ??
                  comment?.replyLikes?.length ??
                  0}
              </span>
            </div>

            {
              <button
                onClick={() => {
                  setOpenResponds((prev) =>
                    prev === comment?.id ? "" : comment?.id,
                  );
                }}
                className="flex items-center gap-1 text-xs cursor-pointer hover:text-white transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-neutral-500" />
                <span>{comment?.replies?.length || 0} Replies</span>
              </button>
            }

            {user?.role === "ADMIN" && user?.id !== comment?.userId ? (
              <div className="flex items-center gap-3">
                <button
                  className="cursor-pointer text-xs text-neutral-400 hover:text-red-400 transition-colors"
                  onClick={() => handleDeleteComment(comment?.id, type)}
                >
                  Delete
                </button>
                <button
                  className="cursor-pointer text-xs text-neutral-400 hover:text-red-400 transition-colors"
                  onClick={() => setBannedModal(true)}
                >
                  Ban User
                </button>
              </div>
            ) : comment?.userId !== user?.id ? (
              <button
                className="cursor-pointer text-xs text-neutral-400 hover:text-red-400 transition-colors"
                onClick={() => handleReport(comment?.id, user)}
              >
                Report
              </button>
            ) : null}
          </div>

          {openResponds === comment?.id && (
            <div className="ml-4 pl-4 border-l border-neutral-800 flex flex-col gap-3 mt-3">
              {comment?.replies && comment?.replies?.length > 0 ? (
                comment?.replies.map((reply) => (
                  <CommentFormatComponent
                    key={reply.id}
                    comment={reply}
                    type={false}
                  />
                ))
              ) : (
                <span className="text-xs text-neutral-500 py-1">
                  No replies yet
                </span>
              )}

              {isBanned ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs">
                  You are banned from commenting until{" "}
                  <span className="font-semibold">
                    {new Date(user?.bannedUntil).toLocaleString()}
                  </span>
                </div>
              ) : (
                <AddReplyComponent id={comment?.id} />
              )}
            </div>
          )}
        </div>
      </div>

      {bannedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#16161a] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Ban User
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Restricting access for{" "}
                    <span className="text-red-400 font-medium">
                      @{comment?.username || "User"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBannedModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBanUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Ban Duration
                </label>
                <select
                  value={banDurationDays}
                  onChange={(e) => setBanDurationDays(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/80 transition-colors"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Reason for Ban
                </label>
                <textarea
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Provide a clear reason for banning this user..."
                  className="w-full bg-[#0e0e11] border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/80 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBannedModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBan}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  {isSubmittingBan ? "Banning..." : "Confirm Ban"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentFormatComponent;
