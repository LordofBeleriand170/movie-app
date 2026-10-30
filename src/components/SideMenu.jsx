import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import NotificationModal from "./NotificationModal";
import UserModal from "./UserModal";

const SideMenu = ({ setOpenMenu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [openSettings, setOpenSettings] = useState(false);

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  return (
    <div className="md:hidden fixed inset-0 bg-black text-white flex flex-col gap-6 p-8 z-50">
      <div className="flex justify-end">
        <button onClick={() => setOpenMenu(false)} className="cursor-pointer">
          <X size={28} />
        </button>
      </div>

      <Link href="/" onClick={() => setOpenMenu(false)}>
        Home
      </Link>
      <Link href="/media/movies/popular" onClick={() => setOpenMenu(false)}>
        Movies
      </Link>
      <Link href="/media/tvshows/popular" onClick={() => setOpenMenu(false)}>
        Tv Shows
      </Link>

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
  );
};

export default SideMenu;
