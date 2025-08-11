"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { UserNavItems } from "@/constants/constant";

const UserHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-gray-primary/80 shadow-lg sticky top-0 z-50 backdrop-filter backdrop-blur-lg font-michroma">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <Link href={"/"} className="flex items-center  space-x-2">
          <div className="flex items-center justify-center py-3 md:py-4 font-extrabold text-xl">
            <Sparkles className="mr-2" />
            GlobalTrotter
          </div>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:justify-center space-x-8">
          {UserNavItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={` hover:text-orange-primary transition-colors  duration-300 font-michroma ${
                pathname === item.path
                  ? "text-orange-500 border-b-2"
                  : "text-black/80"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => signOut()}
            className=" hidden lg:flex cursor-pointer px-5 py-1.5  rounded-xl bg-white/80 text-black  transition-all duration-300 shadow-lg font-michroma"
          >
            Logout
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-orange-primary" />
            ) : (
              <Menu className="h-5 w-5 text-orange-primary" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-primary/80 backdrop-blur-lg border-t border-white/10 px-4 py-4 space-y-3">
          {UserNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-michroma transition-colors ${
                pathname === item.path
                  ? "text-orange-primary"
                  : "text-white hover:text-orange-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 rounded-lg bg-orange-primary text-gray-primary font-michroma"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
