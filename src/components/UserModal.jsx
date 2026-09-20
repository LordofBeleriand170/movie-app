"use client";

import { ChevronRight, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const UserModal = ({ openSettings, setOpenSettings }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsRef?.current &&
        !optionsRef?.current?.contains(event.target) &&
        event.target.id !== "user-avatar"
      ) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenSettings]);

  return (
    <div className="flex flex-col items-end relative">
      <button
        id="user-avatar"
        onClick={() => setOpenSettings(!openSettings)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16161a] text-white font-bold text-sm border border-neutral-700/80 hover:border-neutral-500 transition-all duration-200 outline-none cursor-pointer"
      >
        {user?.username?.[0]?.toUpperCase() ||
          user?.email?.[0]?.toUpperCase() ||
          "?"}
      </button>

      {openSettings && (
        <div
          ref={optionsRef}
          className="absolute right-0 top-12 z-50 w-72 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#0e0e11] shadow-2xl backdrop-blur-xl">
            <Link
              href={`/user/${user?.email}`}
              onClick={() => setOpenSettings(false)}
              className="flex items-center gap-3 p-4 hover:bg-neutral-800/40 transition-colors cursor-pointer group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-base font-bold text-[#ff0015]">
                {user?.username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate group-hover:text-red-400 transition-colors">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="text-neutral-500 group-hover:text-white transition-colors"
              />
            </Link>

            <div className="h-px bg-neutral-800/80 mx-2" />

            <div className="p-2 space-y-1">
              <Link
                href="/settings/account"
                onClick={() => setOpenSettings(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition cursor-pointer"
              >
                <Settings size={16} className="text-neutral-400" />
                <span>Settings</span>
              </Link>

              <button
                onClick={async () => {
                  setOpenSettings(false);
                  await signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModal;
