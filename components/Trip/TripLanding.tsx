"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar, MapPin, Clock, Archive } from "lucide-react";
// import { format } from "date-fns";
import TripCard from "./TripCard";
import Link from "next/link";

interface Media {
  url: string;
  altText: string | null;
}

interface Trip {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  privacy: string;
  createdAt: string;
  updatedAt: string;
  coverMedia: Media | null;
}

interface TripsResponse {
  upcoming: Trip[];
  ongoing: Trip[];
  completed: Trip[];
  archived: Trip[];
}

const fetchTrips = async (): Promise<TripsResponse> => {
  const response = await fetch("/api/user/trip/overview");
  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }
  return response.json();
};

const Trip: React.FC = () => {
  const {
    data: trips,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded-lg w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-orange-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            Failed to load your trips. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const renderTripSection = (
    title: string,
    trips: Trip[],
    icon: React.ReactNode,
    emptyMessage: string
  ) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
          {trips.length}
        </span>
      </div>

      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-orange-200">
          <div className="text-orange-300 text-4xl mb-4">📍</div>
          <p className="text-gray-500 font-medium">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              My Trips
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage and explore your travel adventures
            </p>
          </div>

          <Link
            href="/user/trips/create"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Trip
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Upcoming",
              count: trips?.upcoming?.length || 0,
              color: "bg-blue-500",
              icon: "🗓️",
            },
            {
              label: "Ongoing",
              count: trips?.ongoing?.length || 0,
              color: "bg-green-500",
              icon: "✈️",
            },
            {
              label: "Completed",
              count: trips?.completed?.length || 0,
              color: "bg-orange-500",
              icon: "🎯",
            },
            {
              label: "Archived",
              count: trips?.archived?.length || 0,
              color: "bg-gray-500",
              icon: "📦",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-orange-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trip Sections */}
        {trips?.ongoing &&
          trips.ongoing.length > 0 &&
          renderTripSection(
            "Currently Traveling",
            trips.ongoing,
            <MapPin className="w-6 h-6 text-green-600" />,
            "No ongoing trips"
          )}

        {renderTripSection(
          "Upcoming Adventures",
          trips?.upcoming || [],
          <Calendar className="w-6 h-6 text-blue-600" />,
          "No upcoming trips planned yet"
        )}

        {renderTripSection(
          "Completed Journeys",
          trips?.completed || [],
          <Clock className="w-6 h-6 text-orange-600" />,
          "No completed trips yet"
        )}

        {renderTripSection(
          "Archived Trips",
          trips?.archived || [],
          <Archive className="w-6 h-6 text-gray-600" />,
          "No archived trips"
        )}
      </div>
    </div>
  );
};

export default Trip;
