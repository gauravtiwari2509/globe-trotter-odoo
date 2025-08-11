"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Get Inspired", href: "/" },
  ];

  const adminItems = [
    { name: "Solo Trip", href: "/" },
    { name: "Group Trip", href: "/" },
    { name: "Random People", href: "/" },
  ];

  return (
    <header
      className={cn(
        "fixed w-full z-40 transition-all duration-100 text-black",
        isScrolled
          ? "bg-white/65 top-0 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className=" py-1">
        <div className="mx-auto px-3 lg:px-12 flex justify-between">
          <div className="flex items-center justify-center py-3 md:py-4 font-extrabold text-xl font-arimo">
            <Sparkles className="mr-2" />
            GlobalTrotter
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="ml-10 flex justify-center items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 rounded-full hover:bg-gray-700/10 text-base transition-all duration-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Administration Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center px-5 py-2 rounded-full hover:bg-gray-700/10 text-base  transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setIsAdminDropdownOpen(true)}
                  onMouseLeave={() => setIsAdminDropdownOpen(false)}
                >
                  Plan
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                <div
                  className={cn(
                    "absolute top-full left-0 mt-1 w-48 bg-white/60 rounded-md shadow-lg transition-all duration-200 px-2 py-4",
                    isAdminDropdownOpen
                      ? "opacity-100 visible transform translate-y-0"
                      : "opacity-0 invisible transform -translate-y-2"
                  )}
                  onMouseEnter={() => setIsAdminDropdownOpen(true)}
                  onMouseLeave={() => setIsAdminDropdownOpen(false)}
                >
                  <div className="py-1">
                    {adminItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md  hover:bg-sky-50/40 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin">
              <button className="py-1 px-4 text-sm transform hover:scale-95 transition-all duration-200 cursor-pointer">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="py-1 px-4 text-sm rounded-full transform hover:scale-95 transition-all duration-200 border cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white/15 backdrop-blur-md">
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/15 backdrop-blur-md shadow-sm rounded-b-3xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-white/25"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="">
              <div className="px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 bg-white/25 cursor-pointer">
                Plan
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm hover:bg-sky-50 rounded-md transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
