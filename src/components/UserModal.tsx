"use client";

import { ChevronRight, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface UserModalProps {
  openSettings: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserModal: React.FC<UserModalProps> = ({
  openSettings,
  setOpenSettings,
}) => {
  const { data: session, status } = useSession();

  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef?.current &&
        !optionsRef?.current?.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "user-avatar"
      ) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const optionsRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col items-end relative">
      {" "}
      <span
        id="user-avatar"
        className="flex justify-center items-center pb-0.5 text-white cursor-pointer  w-8 h-8 rounded-3xl border-1 border-amber-50"
        onClick={() => setOpenSettings(!openSettings)}
      >
        {user?.username?.[0] || user?.email?.[0] || "?"}
      </span>
      {openSettings && (
        <div ref={optionsRef} className="absolute right-0 top-10 z-50 w-72">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/95 shadow-2xl backdrop-blur-md">
            {/* Profile */}
            <Link
              href={`/user/${user?.email}`}
              className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {user?.username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
              </div>

              <ChevronRight size={18} className="text-gray-500" />
            </Link>

            <div className="h-px bg-white/10" />

            {/* Menu */}
            <div className="p-2">
              <Link
                href="/settings/account"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5 transition"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              <button
                onClick={async () => {
                  await signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={18} />
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
