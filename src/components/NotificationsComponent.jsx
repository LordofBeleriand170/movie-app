"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import React, { useEffect, useState, Suspense } from "react";
import NotificationsPreview from "./NotificationsPreview";
import NotificationCurrent from "./NotificationCurrent";
import { useSearchParams } from "next/navigation";
import { Bell, Inbox } from "lucide-react";

const NotificationsContent = () => {
  const notifications = useCollectionStore((state) => state.notifications);
  const [selectedNotifications, setSelectedNotifications] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"

  const params = useSearchParams();
  const notificationId = params.get("notificationId");

  // Handle query parameter for deep-linking a specific notification
  useEffect(() => {
    if (!notificationId) return;

    const found = notifications.find((not) => not.id === notificationId);
    if (found) {
      setSelectedNotifications(found);
    }
  }, [notificationId, notifications]);

  // If the currently selected notification gets deleted or filtered out, clear it
  useEffect(() => {
    if (selectedNotifications) {
      const exists = notifications.some(
        (not) => not.id === selectedNotifications.id,
      );
      if (!exists) {
        setSelectedNotifications(null);
      }
    }
  }, [notifications, selectedNotifications]);

  const filteredNotifications = notifications
    .slice()
    .reverse()
    .filter((not) => {
      const isUnread = !not.isRead && !not.read;
      if (filter === "unread") return isUnread;
      if (filter === "read") return !isUnread;
      return true;
    });

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center py-10 w-[90%] mx-auto px-8 sm:px-6 lg:px-8">
      <div className="w-full bg-[#0f0f12] border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-inner">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Notifications Center
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Manage your alerts, messages, and platform activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl">
              {notifications.length} Total
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 border border-neutral-800/80 rounded-xl">
            {["all", "unread", "read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 font-medium hidden sm:block">
            Showing {filteredNotifications.length} items
          </div>
        </div>

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Notification List / Preview List */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const isSelected =
                  selectedNotifications?.id === notification.id;
                return (
                  <div
                    key={notification.id}
                    onClick={() => setSelectedNotifications(notification)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    <NotificationsPreview
                      notification={notification}
                      setSelectedNotifications={setSelectedNotifications}
                      selectedNotifications={selectedNotifications}
                      isSelected={isSelected}
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-neutral-950/40 border border-neutral-800/60 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-500">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-neutral-300">
                  No notifications found
                </p>
                <p className="text-xs text-neutral-500">
                  You have no messages matching this filter.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Active Notification Viewer Details */}
          <div className="lg:col-span-7 bg-[#16161a] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 min-h-[450px] flex flex-col justify-center shadow-inner">
            {selectedNotifications ? (
              <NotificationCurrent
                selectedNotifications={selectedNotifications}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-inner animate-pulse">
                  <Inbox className="w-8 h-8 text-red-500/70" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">
                    Select a notification
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
                    Choose any item from the left panel to read full content,
                    details, and execute actions.
                  </p>
                </div>
              </div>
            )}
          </div>
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
