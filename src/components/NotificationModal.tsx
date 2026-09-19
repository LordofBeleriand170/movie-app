"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import formattedDate from "@/libs/formattedDate";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";

interface NotificationModalProps {
  setOpenSettings?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationModal: React.FC<NotificationModalProps> = () => {
  const [isntRead, setIsntRead] = useState(0);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  const { data: session } = useSession();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  const notifications = useCollectionStore((state) => state.notifications);
  const clearNotifications = useCollectionStore(
    (state) => state.clearNotifications,
  );

  useEffect(() => {
    const messagesNum = notifications.filter(
      (notification) =>
        notification.isRead === false || notification.read === false,
    ).length;
    setIsntRead(messagesNum);
  }, [notifications]);

  const handleNotifications = async () => {
    try {
      setIsntRead(0);
      await clearNotifications(user?.id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef?.current &&
        !notificationsRef?.current?.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "notification-avatar"
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col items-end">
      {/* Bell Icon & Unread Badge */}
      <div className="relative flex items-center">
        <button
          id="notification-avatar"
          onClick={() => {
            setOpenNotifications(!openNotifications);
            if (!openNotifications) {
              handleNotifications();
            }
          }}
          className="relative cursor-pointer p-1.5 text-gray-300 hover:text-white transition focus:outline-none"
        >
          <FaRegBell size={20} className="pointer-events-none" />
          {isntRead > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          )}
        </button>
      </div>

      {/* Notifications Modal / Dropdown */}
      {openNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-0 top-10 z-50 w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#121212]/95 shadow-2xl backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-white">
                Notifications
              </span>
            </div>

            <button
              onClick={handleNotifications}
              className="flex items-center cursor-pointer gap-1 text-xs text-red-500 hover:text-red-400 transition font-medium"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
            {notifications.length > 0 ? (
              notifications
                .slice(-5)
                .reverse()
                .map((notification) => {
                  const isUnread = !notification.isRead && !notification.read;
                  return (
                    <Link
                      key={notification.id}
                      href={`/notifications?notificationId=${notification.id}`}
                      onClick={() => setOpenNotifications(false)}
                      className="group flex gap-3 px-4 py-3.5 transition hover:bg-white/5"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-500 font-semibold text-sm border border-red-500/30">
                          {notification.sender?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>

                        {/* Unread indicator dot */}
                        {isUnread && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#121212] bg-red-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">
                          {notification.sender?.name || "System"}
                        </p>

                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-400 group-hover:text-gray-300">
                          {notification.text}
                        </p>

                        <span className="mt-1 block text-[10px] text-gray-500">
                          {formattedDate(notification.createdAt)}
                        </span>
                      </div>

                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-600 opacity-0 transition group-hover:opacity-100 group-hover:text-red-500" />
                    </Link>
                  );
                })
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <Bell className="h-8 w-8 text-gray-600" />
                <p className="text-xs text-gray-400">
                  You&apos;re all caught up.
                </p>{" "}
              </div>
            )}
          </div>

          {/* Footer */}
          <Link
            href="/notifications"
            onClick={() => setOpenNotifications(false)}
            className="flex items-center justify-center gap-1.5 border-t border-white/10 py-2.5 text-xs font-medium text-red-500 transition hover:bg-white/5 hover:text-red-400"
          >
            View all notifications
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
