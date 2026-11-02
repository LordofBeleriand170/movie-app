"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import formattedDate from "@/libs/formattedDate";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";

const NotificationModal = () => {
  const [isntRead, setIsntRead] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);

  const { data: session } = useSession();
  const notificationsRef = useRef(null);
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
    const handleClickOutside = (event) => {
      if (
        notificationsRef?.current &&
        !notificationsRef?.current?.contains(event.target) &&
        event.target.id !== "notification-avatar"
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col items-end">
      <div className="relative flex items-center">
        <button
          id="notification-avatar"
          onClick={() => {
            setOpenNotifications(!openNotifications);
            if (!openNotifications) {
              handleNotifications();
            }
          }}
          className="relative cursor-pointer p-2 text-gray-300 hover:text-white transition rounded-full hover:bg-white/5 focus:outline-none"
        >
          <FaRegBell size={20} className="pointer-events-none" />
          {isntRead > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
          )}
        </button>
      </div>

      {openNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl 
          border border-white/10 bg-[#121212]/95 
          shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">
                Notifications
              </span>
              {isntRead > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                  {isntRead} new
                </span>
              )}
            </div>

            <button
              onClick={handleNotifications}
              className="flex items-center cursor-pointer gap-1 text-xs text-red-500 hover:text-red-400 transition font-medium px-2 py-1 rounded-md hover:bg-red-500/10"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y scrollbar-thin divide-white/5">
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
                      className={`group relative flex gap-3.5 px-5 py-4 transition hover:bg-white/[0.06] ${
                        isUnread ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <div className="relative shrink-0 pt-0.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-500 font-bold text-sm border border-red-500/30 shadow-inner">
                          {notification.sender?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>

                        {isUnread && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#121212] bg-red-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-xs font-semibold text-white group-hover:text-red-400 transition-colors">
                            {notification.sender?.name || "System"}
                          </p>
                          <span className="text-[10px] text-gray-500 font-medium shrink-0">
                            {formattedDate(notification.createdAt)}
                          </span>
                        </div>

                        <p className="line-clamp-2 text-xs text-gray-400 group-hover:text-gray-300 leading-relaxed">
                          {notification.text}
                        </p>
                      </div>

                      <div className="flex items-center self-center">
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-600 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-red-500" />
                      </div>
                    </Link>
                  );
                })
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-500">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-white">
                    All caught up!
                  </p>
                  <p className="text-[11px] text-gray-500">
                    You have no new notifications right now.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpenNotifications(false)}
            className="flex items-center justify-center gap-2 border-t border-white/10 py-3 text-xs font-semibold text-red-500 transition bg-white/[0.01] hover:bg-white/5 hover:text-red-400"
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
