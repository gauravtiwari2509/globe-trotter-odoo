"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-950 overflow-hidden text-white ">
      <div className="absolute top-20 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 sm:w-80 sm:h-80 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

      <div className="text-center z-10 max-w-full mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold font-michroma leading-tight mb-4">
          Oops! <span className="text-orange-500">Page Not Found</span>
        </h1>

        <p className="text-lg md:text-2xl font-semibold text-white mt-6 font-tektur tracking-widest max-w-4xl mx-auto">
          The page you're looking for might have been moved or deleted.
        </p>
        <p className="text-sm max-sm:hidden md:text-lg text-gray-400 mb-12 font-tektur tracking-wider mt-2 max-w-3xl mx-auto">
          Don't worry, we'll help you get back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-sm:mt-10">
          <Link
            href="/"
            className="px-8 py-3 bg-orange-600 text-white text-base z-10 font-bold cursor-pointer hover:bg-orange-700 transition-all duration-300 shadow-lg transform hover:scale-105 font-michroma flex items-center group rounded-xl"
          >
            Go Home
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <button
            onClick={goBack}
            className="px-8 py-3 border-2  z-10 rounded-2xl cursor-pointer text-base font-bold bg-white text-gray-900 transition-all duration-300 shadow-lg transform hover:scale-105 font-michroma"
          >
            Go Back
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
