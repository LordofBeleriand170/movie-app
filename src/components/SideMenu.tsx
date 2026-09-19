import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface SideMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideMenu: React.FC<SideMenuProps> = ({ setOpenMenu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

      <Link
        href={`/register?callbackUrl=${encodeURIComponent(fullUrl)}`}
        className="cursor-pointer"
      >
        Create an account
      </Link>
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(fullUrl)}`}
        className="cursor-pointer"
      >
        Login
      </Link>
    </div>
  );
};

export default SideMenu;
