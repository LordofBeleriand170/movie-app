"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import React, { useEffect, useState, Suspense } from "react";
import NotificationsPreview from "./NotificationsPreview";
import NotificationCurrent from "./NotificationCurrent";
import { useSearchParams } from "next/navigation";
import { Bell, Inbox } from "lucide-react";

const NotificationsContent = () => {
  const notifications = useCollectionStore((state) => state.notifications);
  const [selectedNotifications, setSelectedNotifications] = useState();

  const params = useSearchParams();
  const notificationId = params.get("notificationId");

  useEffect(() => {
    if (!notificationId) return;

    const notification = notifications.filter(
      (not) => not.id === notificationId,
    );
    setSelectedNotifications(notification[0]);
  }, [notificationId, notifications]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center py-10 px-4 sm:px-8">
      {/* Main Container styled like the modal in the picture */}
      <div className="w-full max-w-5xl bg-[#0f0f12] border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-md">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-red-500" />
              Notifications
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Stay updated with your latest alerts and activity
            </p>
          </div>
          {notifications?.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">
              {notifications.length} Total
            </span>
          )}
        </div>

        {/* Horizontal Notification Previews List */}
        <div className="w-full">
          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {notifications
              .slice()
              .reverse()
              .map((notification) => (
                <NotificationsPreview
                  key={notification.id}
                  notification={notification}
                  setSelectedNotifications={setSelectedNotifications}
                  selectedNotifications={selectedNotifications}
                />
              ))}
          </div>
        </div>

        {/* Active Notification Detail View */}
        <div className="bg-[#16161a] border border-neutral-800/60 rounded-2xl p-6 min-h-[350px] flex flex-col justify-center">
          {selectedNotifications ? (
            <NotificationCurrent
              selectedNotifications={selectedNotifications}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800/50 border border-neutral-700/40 flex items-center justify-center text-neutral-400 mb-2">
                <Inbox className="w-7 h-7" />
              </div>
              <span className="text-lg font-medium text-white">
                No notification selected
              </span>
              <span className="text-sm text-neutral-400 max-w-sm">
                Select a notification from the list above to view its details.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NotificationsComponent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080a] text-neutral-400 flex items-center justify-center font-medium">
          <div className="flex items-center gap-3 bg-[#0f0f12] border border-neutral-800 px-6 py-4 rounded-2xl shadow-lg">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            Loading notifications...
          </div>
        </div>
      }
    >
      <NotificationsContent />
    </Suspense>
  );
}
