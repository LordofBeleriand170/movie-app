"use client";

import React, { useEffect } from "react";
import formattedDate from "@/libs/formattedDate";
import { useContentStore } from "@/features/content/contentStore";
import { useRouter } from "next/navigation";
import { Notification } from "./NotificationsComponent";

const NotificationCurrent = (selectedNotifications: Notification) => {
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
  }, [selectedNotifications]);

  const redirect = () => {
    router.push(
      `/media/${content?.comment?.mediaType === "movie" ? "movies" : "tvshows"}/${content?.comment?.mediaId}-${content?.comment?.title}?commentId=${content?.comment.id}`,
    );
  };

  const handleDelete = async () => {
    try {
      await fetch("/api/notifications/delete", {
        method: "POST",
        body: JSON.stringify({ id: selectedNotifications.id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="bg-gradient-to-br from-blue-500 to-indigo-600
          text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg"
          >
            {selectedNotifications?.sender?.name || "U"}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {selectedNotifications?.sender?.name}
            </span>

            <span className="text-sm text-gray-400">
              {formattedDate(selectedNotifications?.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm cursor-pointer text-red-400 border border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"
        >
          Delete
        </button>
      </div>

      {/* Notification Message */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-gray-200 leading-relaxed">
          {selectedNotifications?.text}
        </p>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={redirect}
            className="px-5 py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            View Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCurrent;
