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
    { name: "About Us", href: "/" },
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
          <div className="flex items-center justify-center py-3 md:py-4 font-extrabold text-xl">
            <Sparkles className="mr-2" />
            GlobalTrotter
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="ml-10 flex justify-center items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-xl text-base transition-all duration-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Administration Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base hover:text-sky-600 transition-all duration-200"
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
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-sky-600 hover:bg-sky-50 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <Link href="/">
              <button className="py-1 px-4 text-sm rounded-full transform hover:scale-95 transition-all duration-200 border">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white/95 backdrop-blur-md">
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out",
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-y border-sky-50 shadow-sm rounded-b-3xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-sky-600 bg-sky-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="px-3 py-2">
              <div className="text-base font-medium mb-2">Administration</div>
              {adminItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors duration-200"
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
