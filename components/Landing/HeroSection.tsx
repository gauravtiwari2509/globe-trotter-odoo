"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <>
      <section className="relative w-full min-h-[90vh] md:h-[95vh] rounded-b-4xl">
        <Image
          src="/photogallery/landing/hero.png"
          alt="Hero Image"
          fill
          objectFit="cover"
          className="absolute inset-0 -z-10 rounded-b-4xl"
        />
        <div className="absolute top-1/3 md:top-40 transform text-center text-black pl-8 md:pl-16 flex flex-col justify-center items-start">
          <h1 className="text-7xl md:text-9xl font-extrabold mb-4 text-left tracking-tight">
            Endless <br /> horizons
          </h1>
          <p className="text-lg mb-6">
            Curated luxury experiences that transform ordinary moments into
            lifelong memories.
          </p>
          <div className="space-x-2.5 text-sm">
            <Link href="/signup">
              <button className="bg-black text-white px-8 py-4 rounded-full hover:text-gray-200 cursor-pointer hover:scale-95 transition ">
                Get Started
              </button>
            </Link>
            <button className="text-black px-8 py-4 rounded-full cursor-pointer hover:scale-95 transition border border-black">
              Inspirations
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
