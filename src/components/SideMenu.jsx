import { X, Film, Tv, Home as HomeIcon, LogIn, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import NotificationModal from "./notification/NotificationModal";
import UserModal from "./UserModal";
import { useAuthStore } from "@/features/auth/authStore";

const SideMenu = ({ setOpenMenu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [openSettings, setOpenSettings] = useState(false);
  const user = useAuthStore((state) => state.user);

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const isActive = (path) => pathname === path;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex justify-start">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setOpenMenu(false)}
      />

      <div className="relative w-4/5 max-w-sm h-full bg-neutral-950 text-white flex flex-col justify-between p-6 shadow-2xl border-r border-neutral-800 animate-in slide-in-from-left duration-300 overflow-visible">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <span className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
              Menu
            </span>
            <button
              onClick={() => setOpenMenu(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setOpenMenu(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive("/")
                  ? "bg-red-600/10 text-red-500 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <HomeIcon size={20} />
              Home
            </Link>

            <Link
              href="/media/movies/popular"
              onClick={() => setOpenMenu(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive("/media/movies/popular")
                  ? "bg-red-600/10 text-red-500 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Film size={20} />
              Movies
            </Link>

            <Link
              href="/media/tvshows/popular"
              onClick={() => setOpenMenu(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive("/media/tvshows/popular")
                  ? "bg-red-600/10 text-red-500 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Tv size={20} />
              TV Shows
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3 relative">
          {status === "loading" ? (
            <div className="h-12 w-full bg-neutral-900 animate-pulse rounded-xl" />
          ) : status !== "authenticated" ? (
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(fullUrl)}`}
                onClick={() => setOpenMenu(false)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-red-600/20 transition-all duration-200"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(fullUrl)}`}
                onClick={() => setOpenMenu(false)}
                className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white py-3 rounded-xl font-medium border border-neutral-800 transition-colors"
              >
                <UserPlus size={18} />
                Create an account
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-neutral-900/80 border border-neutral-800 p-3 rounded-2xl relative">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="shrink-0">
                  <UserModal
                    openSettings={openSettings}
                    setOpenSettings={setOpenSettings}
                  />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "Account"}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center shrink-0">
                <NotificationModal setOpenSettings={setOpenSettings} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
