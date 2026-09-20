"use client";

import React from "react";
import formattedDate from "@/libs/formattedDate";

const NotificationsPreview = ({
  notification,
  setSelectedNotifications,
  selectedNotifications,
}) => {
  const isSelected = selectedNotifications?.id === notification.id;

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
    <div
      onClick={() => setSelectedNotifications(notification)}
      className={`
  min-w-[320px] max-w-[320px]
  flex gap-4 p-5 mr-4
  rounded-xl border border-gray-800
  cursor-pointer transition-all duration-200
  hover:bg-gray-900 hover:border-gray-700 hover:scale-[1.02]

  ${
    selectedNotifications?.id === notification.id
      ? "bg-gray-800 border-blue-500"
      : "bg-black"
  }
`}
    >
      <div
        className="bg-gradient-to-br from-blue-500 to-indigo-600
text-white rounded-full min-w-11 w-11 h-11
flex items-center justify-center
text-sm font-bold shadow-lg"
      >
        {notification?.sender?.name?.[0] || "U"}
      </div>

      {/* Notification content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-white text-sm">
            {notification?.sender?.name}
          </span>
          {!isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-xs text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          )}
          <span className="text-xs text-gray-400">
            {formattedDate(notification.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
          {notification?.text}
        </p>
      </div>
    </div>
  );
};

export default NotificationsPreview;
