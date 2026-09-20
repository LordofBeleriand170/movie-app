"use client";

import React from "react";
import formattedDate from "@/libs/formattedDate";
import { Trash2 } from "lucide-react";

const NotificationsPreview = ({
  notification,
  setSelectedNotifications,
  selectedNotifications,
}) => {
  const isSelected = selectedNotifications?.id === notification?.id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await fetch("/api/notifications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notification.id }),
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div
      onClick={() => setSelectedNotifications(notification)}
      className={`
        group relative min-w-[280px] sm:min-w-[320px] max-w-[320px]
        flex gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/5 ring-1 ring-red-500/30"
            : "bg-[#16161a] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#1c1c22]"
        }
      `}
    >
      <div className="relative">
        <div
          className={`
            rounded-xl min-w-10 w-10 h-10 flex items-center justify-center
            text-sm font-bold transition-colors
            ${
              isSelected
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "bg-neutral-800 border border-neutral-700/60 text-neutral-300 group-hover:border-neutral-600"
            }
          `}
        >
          {notification?.sender?.name?.[0]?.toUpperCase() || "U"}
        </div>

        {!isSelected && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#16161a]" />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-white text-sm truncate">
            {notification?.sender?.name || "System Alert"}
          </span>
          <span className="text-[11px] text-neutral-400 shrink-0">
            {formattedDate(notification?.createdAt)}
          </span>
        </div>

        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
          {notification?.text}
        </p>
      </div>

      <button
        onClick={handleDelete}
        title="Delete notification"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg absolute bottom-2.5 right-2.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default NotificationsPreview;
