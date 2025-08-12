"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  CalendarDays,
  Wallet,
  X,
  MapPin,
  Users,
  Heart,
  Star,
  ChevronRight,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

interface Trip {
  id: number;
  title: string;
  image: string;
  budget: number;
  dates: string;
  itinerary: string[];
  location: string;
  participants: number;
  maxParticipants: number;
  rating: number;
  tags: string[];
  highlights: string[];
  difficulty: "Easy" | "Moderate" | "Challenging";
}

const trips: Trip[] = [
  {
    id: 1,
    title: "Manali Adventure",
    image: "/photogallery/landing/manali.jpg",
    budget: 12000,
    dates: "10th Sep 2025 - 15th Sep 2025",
    location: "Himachal Pradesh, India",
    participants: 8,
    maxParticipants: 12,
    rating: 4.8,
    difficulty: "Moderate",
    tags: ["Adventure", "Mountains", "Trekking"],
    highlights: ["Paragliding", "River Rafting", "Local Cuisine"],
    itinerary: [
      "Day 1: Arrival & Orientation at Manali",
      "Day 2: Solang Valley Adventure Sports",
      "Day 3: Rohtang Pass Snow Activities",
      "Day 4: Local Market & Cultural Tour",
      "Day 5: Departure with Memories",
    ],
  },
  {
    id: 2,
    title: "Goa Beach Escape",
    image: "/photogallery/landing/goa.jpg",
    budget: 15000,
    dates: "5th Oct 2025 - 10th Oct 2025",
    location: "Goa, India",
    participants: 15,
    maxParticipants: 20,
    rating: 4.9,
    difficulty: "Easy",
    tags: ["Beach", "Nightlife", "Relaxation"],
    highlights: ["Sunset Cruise", "Beach Parties", "Portuguese Heritage"],
    itinerary: [
      "Day 1: Beach Hopping & Welcome Party",
      "Day 2: Water Sports & Dolphin Watching",
      "Day 3: Old Goa Heritage & Spice Plantation",
      "Day 4: Night Markets & Beach Clubs",
      "Day 5: Farewell Brunch & Departure",
    ],
  },
  {
    id: 3,
    title: "Leh-Ladakh Road Trip",
    image: "/photogallery/landing/ladakh.jpg",
    budget: 18000,
    dates: "20th Aug 2025 - 27th Aug 2025",
    location: "Ladakh, India",
    participants: 6,
    maxParticipants: 8,
    rating: 4.7,
    difficulty: "Challenging",
    tags: ["Adventure", "Desert", "High Altitude"],
    highlights: ["Pangong Lake", "Monasteries", "Star Gazing"],
    itinerary: [
      "Day 1: Arrival in Leh & Acclimatization",
      "Day 2: Nubra Valley via Khardung La",
      "Day 3: Pangong Lake Camping Experience",
      "Day 4: Magnetic Hill & Monastery Tour",
      "Day 5: Return Journey with Stops",
    ],
  },
  {
    id: 4,
    title: "Kerala Backwaters",
    image: "/photogallery/landing/kerala.png",
    budget: 14000,
    dates: "1st Nov 2025 - 6th Nov 2025",
    location: "Kerala, India",
    participants: 10,
    maxParticipants: 16,
    rating: 4.6,
    difficulty: "Easy",
    tags: ["Nature", "Backwaters", "Ayurveda"],
    highlights: ["Houseboat Stay", "Ayurvedic Spa", "Tea Gardens"],
    itinerary: [
      "Day 1: Arrival in Kochi & Fort Tour",
      "Day 2: Munnar Tea Gardens & Hills",
      "Day 3: Alleppey Houseboat Experience",
      "Day 4: Kovalam Beach & Lighthouse",
      "Day 5: Ayurvedic Treatment & Departure",
    ],
  },
];

export default function FindBuddy() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-50 via-orange-50 to-indigo-50 pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Find Your Travel Buddies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join amazing adventures with like-minded travelers. Discover new
              places, make lifelong friends, and create unforgettable memories.
            </p>
          </div>

          {/* Trip Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trips.map((trip, index) => (
              <div
                key={trip.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 ${
                  animate
                    ? `opacity-100 translate-y-0`
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedTrip(trip)}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Trip Rating */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{trip.rating}</span>
                  </div>

                  {/* Participants */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {trip.participants}/{trip.maxParticipants}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    {trip.location}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {trip.title}
                  </h3>

                  {/* Budget */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{trip.budget.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        per person
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-orange-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {/* <div
            className={`text-center mt-16 transition-all duration-1000 delay-500 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Explore All Adventures
            </button>
          </div> */}
        </div>

        {/* Enhanced Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white max-w-7xl w-full max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in duration-300">
              {/* Scrollable Container */}
              <div className="flex flex-col h-full">
                {/* Modal Header with Image */}
                <div className="relative h-64 flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-600">
                  <img
                    src={selectedTrip.image}
                    alt={selectedTrip.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Trip Title Overlay */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">
                      {selectedTrip.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTrip.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedTrip.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto flex-1">
                  {/* Trip Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-bold text-indigo-600">
                            ₹{selectedTrip.budget.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <Users className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Travelers</p>
                          <p className="font-bold text-green-600">
                            {selectedTrip.participants}/
                            {selectedTrip.maxParticipants}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                        <CalendarDays className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Dates</p>
                          <p className="font-bold text-orange-600">
                            {selectedTrip.dates}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Trip Highlights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrip.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 rounded-full text-sm font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      Detailed Itinerary
                    </h4>
                    <div className="space-y-3">
                      {selectedTrip.itinerary.map((day, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 flex-1">{day}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                      Join the Adventure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
