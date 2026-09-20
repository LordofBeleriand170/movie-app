"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import React, { useEffect, useState, Suspense } from "react";
import NotificationsPreview from "./NotificationsPreview";
import NotificationCurrent from "./NotificationCurrent";
import { useSearchParams } from "next/navigation";

const NotificationsContent = () => {
  const notifications = useCollectionStore((state) => state.notifications);
  const [selectedNotifications, setSelectedNotifications] = useState();

  const params = useSearchParams();
  const notificationId = params.get("notificationId");

  useEffect(() => {
    if (!notificationId) return;

    let notification = notifications.filter((not) => not.id === notificationId);

    setSelectedNotifications(notification[0]);
  }, [notificationId, notifications]);

  return (
    <div className="h-screen flex flex-col bg-black text-white 2xl:px-82 xl:px-60 lg:px-40 md:px-20 sm:px-10">
      {/* LEFT PANEL */}

      <div className="pt-8 font-semibold text-2xl tracking-wide">
        Notifications
      </div>
      <div className="w-full overflow-y-auto scrollbar-thin">
        <div className="flex gap-2 pl-1 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
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

      {/* RIGHT PANEL */}
      <div className="flex-1 ">
        {selectedNotifications ? (
          <NotificationCurrent selectedNotifications={selectedNotifications} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <span className="text-lg">No notification selected</span>

            <span className="text-sm text-gray-600">
              Select a notification above to view details
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsComponent() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-black text-white p-8">Loading...</div>
      }
    >
      <NotificationsContent />
    </Suspense>
  );
}
