"use client";

import Link from "next/link";
import React, { useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, Search, X } from "lucide-react";
import NotificationModal from "./notification/NotificationModal";
import SideMenu from "./SideMenu";
import UserModal from "./UserModal";

const NavbarContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const { data: session, status } = useSession();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search/${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/media/movies/popular" },
    { name: "TV Shows", href: "/media/tvshows/popular" },
  ];
  return (
    <>
      {openMenu && <SideMenu setOpenMenu={setOpenMenu} />}
      <header className="w-full sticky top-0 z-50 bg-black border-b border-neutral-800/80 backdrop-blur-md transition-colors duration-300">
        <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive =
                pathname === "/"
                  ? "Home"
                  : pathname.split("/")[2] ===
                      link.name.split(" ").join("").toLowerCase()
                    ? link.name
                    : null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 hover:text-white ${
                    isActive === link.name
                      ? "text-white font-bold border-b-2 border-red-600 pb-0.5"
                      : "text-neutral-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="p-2 text-neutral-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {openMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="flex-1 max-w-md mx-2">
            <form
              onSubmit={handleSearch}
              className="relative w-full flex items-center"
            >
              <Search className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-full pl-10 pr-4 py-1.5 text-xs sm:text-sm bg-neutral-900/80 text-white placeholder-neutral-500 rounded-full border border-neutral-800 focus:border-red-500/50 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
              />
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
            {status !== "authenticated" ? (
              <>
                <Link
                  href={`/register?callbackUrl=${encodeURIComponent(fullUrl)}`}
                  className="text-neutral-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                >
                  Create an account
                </Link>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(fullUrl)}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full shadow-md transition-all duration-200 hover:shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                >
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NotificationModal setOpenSettings={setOpenSettings} />
                <UserModal
                  openSettings={openSettings}
                  setOpenSettings={setOpenSettings}
                />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default function Navbar() {
  return (
    <Suspense fallback={<div className="w-full h-16 bg-black" />}>
      <NavbarContent />
    </Suspense>
  );
}
