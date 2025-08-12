"use client";

import { FC, JSX, useState } from "react";
import {
  Globe2,
  CalendarDays,
  Lightbulb,
  Wallet,
  Share2,
  X,
} from "lucide-react";
import Image from "next/image";

interface Step {
  icon: JSX.Element;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Sign Up & Personalize",
    description:
      "Create your free account and set your travel preferences — budget, interests, and destinations you love.",
  },
  {
    icon: <CalendarDays className="w-8 h-8" />,
    title: "Plan Your Trip",
    description:
      "Pick your cities, travel dates, and favorite activities. Add them to your itinerary with our easy drag-and-drop builder.",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Get Smart Suggestions",
    description:
      "Discover activities, attractions, and restaurants tailored to your interests, with real-time cost estimates.",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Track Your Budget",
    description:
      "See a live breakdown of travel, stay, and activity expenses — and stay on track with budget alerts.",
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Share Experiences",
    description:
      "Publish your itinerary and share it with friends or explore public trips for inspiration.",
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Travel and Explore",
    description:
      "Discover new destinations, connect with fellow travelers, and share your adventures.",
  },
];

const HowItWorks: FC = () => {
  return (
    <>
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-cyan-100/30 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center z-10">
                  <span className="text-sm font-bold text-gray-700">
                    {index + 1}
                  </span>
                </div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* Icon Container */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-4 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{step.icon}</div>
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300`}
                    ></div>
                  </div>

                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={`absolute bottom-0 left-8 right-8 h-[2px] bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
