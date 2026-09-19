"use client";

import React, { useEffect, useRef, useState } from "react";
import { Comment } from "@/types/comment";
import { formatDate } from "@/app/utils/formatDate";
import {
  useCollectionStore,
  User,
} from "@/features/collection/collectionStore";
import toggleLike from "@/app/utils/toggleLike";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Ban, Flag, Heart, Trash2 } from "lucide-react";
import ReplyComponent from "./ReplyComponent";
import AddReplyComponent from "./AddReplyComponent";
import Image from "next/image";
import { toast } from "react-toastify";
import BannedModal from "./BannedModal";
import { MoreVertical } from "lucide-react";
import { Reply } from "@/features/content/contentStore";

interface CommentComponentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment }) => {
  const [openSpoilers, setOpenSpoilers] = useState<string | null>(null);
  const [openResponds, setOpenResponds] = useState<string | undefined>("");
  const router = useRouter();

  const [bannedModal, setBannedModal] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const optionsRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const user = useCollectionStore((state) => state.user);
  const isBanned = Boolean(
    user?.bannedUntil && new Date(user.bannedUntil) > new Date(),
  );
  const report = useCollectionStore((state) => state.report);
  const deleteComment = useCollectionStore((store) => store.deleteComment);

  const hasLiked = comment?.comment?.commentLikes?.some(
    (item) => item.like?.userId === user?.id,
  );

  const [liked, setLiked] = useState(hasLiked);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef?.current &&
        !optionsRef?.current?.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "user-avatar"
      ) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLiked(hasLiked);
  }, [hasLiked]);

  const handleReport = async (id: string, user: User | null) => {
    try {
      const res = await report(id, user);

      if (res?.notification) {
        toast.success("Report has been sent!");
        setBannedModal(false);
      } else {
        toast.error("Error occured!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error occured!");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await deleteComment(id);

      if (res?.ok) {
        toast.success("Comment has been deleted!");
        setBannedModal(false);
      } else {
        toast.error("Error occured!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error occured!");
    }
  };

  return (
    <div
      id={`comment-${comment?.comment?.id}`}
      className="flex gap-4 px-3 py-6 bg-[#11161F] border border-[#222A36]  rounded-lg transition"
    >
      <div className="relative w-10 h-10">
        <Image
          src={comment?.comment?.image ?? "/user-not-found.jpg"}
          alt="avatar"
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2">
        {/* Header */}
        <div className="flex flex-col items-start flex-wrap">
          <div className="w-full flex justify-between">
            <span className="font-semibold text-sm">
              {comment?.comment?.isDeleted
                ? `[deleted]`
                : comment?.comment?.username}
            </span>
            <div ref={optionsRef} className="flex flex-col">
              <MoreVertical
                className="h-5 cursor-pointer"
                onClick={() => {
                  setOpenSettings((prev) => !prev);
                }}
              />
              {openSettings && (
                <div className="relative w-full z-40">
                  <div className="absolute right-0 z-50 w-48 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {user?.role === "ADMIN" && !comment?.comment?.isDeleted && (
                      <>
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.comment.id)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                        <button
                          onClick={() => setBannedModal(true)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Ban size={16} />
                          Ban User
                        </button>
                      </>
                    )}

                    {user?.role !== "ADMIN" &&
                      comment?.comment?.userId !== user?.id &&
                      !comment?.comment?.isDeleted && (
                        <button
                          onClick={() => handleReport(comment.comment.id, user)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition"
                        >
                          <Flag size={16} />
                          Report
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            {!comment?.comment?.isDeleted && comment?.comment?.rating > 0 && (
              <span className="text-yellow-400 text-lg">
                {"★".repeat(comment?.comment?.rating)}
              </span>
            )}

            <span className="text-xs text-gray-400">
              {formatDate(comment?.comment?.updatedAt)}
            </span>
          </div>
        </div>

        {comment?.comment?.isDeleted ? (
          <p className="text-sm text-gray-200 leading-relaxed">
            Removed by administrator
          </p>
        ) : comment?.comment?.spoilers ? (
          openSpoilers !== comment?.comment?.id ? (
            <span
              className="text-red-500 text-sm cursor-pointer"
              onClick={() => setOpenSpoilers(comment?.comment?.id)}
            >
              Show Spoilers
            </span>
          ) : (
            <>
              <span
                className="text-red-500 text-sm cursor-pointer"
                onClick={() => setOpenSpoilers(null)}
              >
                Hide Spoilers
              </span>
              <p className="text-sm text-gray-200">{comment?.comment?.text}</p>
            </>
          )
        ) : (
          <p className="text-sm text-gray-200 leading-relaxed">
            {comment?.comment?.text}
          </p>
        )}

        {/* Actions */}
        <div
          className={`flex items-center gap-6 text-sm text-gray-400 ${comment?.comment?.isDeleted ? "opacity-40" : ""}`}
        >
          <div className="flex items-center gap-0.5 ">
            <Heart
              onClick={() => {
                if (!comment?.comment?.isDeleted) {
                  if (!user) {
                    router.push(
                      `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                    );
                    return;
                  }
                }

                setLiked((prev) => !prev);
                toggleLike(comment, user?.id, false);
              }}
              className={` h-4 ${!comment?.comment?.isDeleted ? "cursor-pointer hover:text-red-400 " : ""} ${
                liked
                  ? "text-red-600 fill-red-600"
                  : "text-gray-400 fill-none hover:text-red-500 cursor-pointer"
              }`}
            />
            {comment?.comment?.commentLikes?.length ?? 0}
          </div>

          <span
            onClick={() => {
              if (!comment?.comment?.isDeleted) {
                if (
                  openResponds === "" ||
                  openResponds !== comment?.comment?.id
                ) {
                  setOpenResponds(comment?.comment?.id);
                } else {
                  setOpenResponds("");
                }
              }
            }}
            className={`${!comment?.comment?.isDeleted ? "cursor-pointer hover:text-white" : ""}`}
          >
            {comment?.comment?.replies?.length || 0} Replies
          </span>
        </div>

        {/* Replies */}
        {openResponds === comment?.comment?.id && (
          <div className="ml-6 pl-6 border-l border-white/10 flex flex-col gap-4 mt-3">
            {comment?.comment?.replies &&
            comment?.comment?.replies?.length > 0 ? (
              comment?.comment?.replies.map((reply: Reply) => (
                <ReplyComponent key={reply.id} reply={reply} />
              ))
            ) : (
              <span className="text-sm text-gray-400">No replies yet</span>
            )}
            {isBanned ? (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                You are banned from commenting until{" "}
                <span className="font-semibold">
                  {user?.bannedUntil
                    ? new Date(user.bannedUntil).toLocaleString()
                    : "N/A"}{" "}
                </span>
              </div>
            ) : !comment?.comment?.isDeleted ? (
              <AddReplyComponent id={comment?.comment?.id} />
            ) : null}
          </div>
        )}
      </div>

      {bannedModal && (
        <BannedModal comment={comment} setBannedModal={setBannedModal} />
      )}
    </div>
  );
};

export default CommentComponent;
