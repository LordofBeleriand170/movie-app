"use client";

import React, { useState } from "react";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaHeart } from "react-icons/fa6";
import { formatDate } from "@/app/utils/formatDate";
import toggleLike from "@/app/utils/toggleLike";
import Image from "next/image";
import { toast } from "react-toastify";

const ReplyComponent = ({ reply }) => {
  const user = useCollectionStore((state) => state.user);
  const report = useCollectionStore((state) => state.report);
  const deleteComment = useCollectionStore((store) => store.deleteComment);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const router = useRouter();

  const hasLiked = reply?.replyLikes?.some((like) => like?.userId === user?.id);

  const [liked, setLiked] = useState(hasLiked);
  const [bannedModal, setBannedModal] = useState < boolean > false;

  const handleReport = async (id, user) => {
    try {
      const res = await report(id, user);

      if (res?.ok) {
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

  const handleDeleteComment = async (id) => {
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
    <div className="flex gap-3 items-start py-2">
      {/* Avatar */}
      <Image
        src={reply?.image ?? "/user-not-found.jpg"}
        alt="Reply avatar"
        className="w-8 h-8 rounded-full object-cover"
        width={8}
        height={8}
      />

      {/* Reply Content */}
      <div className="flex flex-col gap-1 flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-200">{reply?.username}</span>

          {reply?.createdAt && (
            <span className="text-gray-400">{formatDate(reply.createdAt)}</span>
          )}
        </div>

        {/* Reply Text */}
        <p className="text-sm text-gray-200 leading-relaxed">{reply?.text}</p>

        <div className="flex gap-2">
          <div
            onClick={() => {
              if (!user) {
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(fullUrl)}`,
                );
                return;
              }

              setLiked((prev) => !prev);
              toggleLike(reply, user?.id, true);
            }}
            className={`flex items-center gap-2 cursor-pointer transition ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <FaHeart />
            <span>{reply?.replyLikes?.length ?? 0}</span>
          </div>
          {user?.role === "ADMIN" ? (
            <div className="flex gap-5 text-sm">
              <button
                className="cursor-pointer text-sm text-gray-400"
                onClick={() => handleDeleteComment(reply?.id)}
              >
                Delete
              </button>
              <button
                className="cursor-pointer text-sm text-gray-400"
                onClick={() => {
                  setBannedModal(true);
                  {
                    /*handleBan(comment?.comment?.user);*/
                  }
                }}
              >
                Ban User
              </button>
            </div>
          ) : reply?.userId !== user?.id ? (
            <button
              className="cursor-pointer text-sm text-gray-400 "
              onClick={() => handleReport(reply?.id, user)}
            >
              Report
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReplyComponent;
