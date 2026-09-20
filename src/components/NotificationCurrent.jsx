"use client";

import React, { useEffect } from "react";
import formattedDate from "@/libs/formattedDate";
import { useContentStore } from "@/features/content/contentStore";
import { useRouter } from "next/navigation";
import { Trash2, Clock, User, ExternalLink } from "lucide-react";

const NotificationCurrent = ({ selectedNotifications }) => {
  const getCommentInfo = useContentStore((state) => state.getCommentInfo);
  const content = useContentStore((state) => state.content);
  const router = useRouter();

  useEffect(() => {
    const getComment = async () => {
      try {
        const res = await getCommentInfo(selectedNotifications.commentId);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedNotifications?.commentId) {
      getComment();
    }
  }, [selectedNotifications, getCommentInfo]);

  const redirect = () => {
    if (!content?.comment) return;
    router.push(
      `/media/${content?.comment?.mediaType === "movie" ? "movies" : "tvshows"}/${content?.comment?.mediaId}-${content?.comment?.title}?commentId=${content?.comment.id}`,
    );
  };

  const handleDelete = async () => {
    try {
      await fetch("/api/notifications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedNotifications.id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-6 p-2">
      {/* Upper Content Block */}
      <div className="flex flex-col gap-6">
        {/* Top Header & Actions */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              Received {formattedDate(selectedNotifications?.createdAt)}
            </span>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-red-400 bg-neutral-800/40 hover:bg-red-500/10 border border-neutral-700/50 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#1c1c22] border border-neutral-800/80 p-4 rounded-2xl">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-base flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
            {selectedNotifications?.sender?.name?.[0]?.toUpperCase() || (
              <User className="w-5 h-5" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-base font-semibold text-white truncate">
              {selectedNotifications?.sender?.name || "Notification"}
            </h2>
            <span className="text-xs text-neutral-400 mt-0.5">
              Activity Alert
            </span>
          </div>
        </div>

        {/* Main Text Content */}
        <div className="bg-[#121215] border border-neutral-800/80 rounded-2xl p-5 text-sm text-neutral-200 leading-relaxed font-normal min-h-[140px]">
          {selectedNotifications?.text}
        </div>
      </div>

      {/* Footer / CTA Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800/80">
        <button
          onClick={handleDelete}
          className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
        >
          Dismiss
        </button>

        <button
          onClick={redirect}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer active:scale-95"
        >
          <span>View Comment</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCurrent;
