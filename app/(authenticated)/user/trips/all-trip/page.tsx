// src/components/trips/UserTripsPage.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Heart,
  AlertTriangle,
  Loader,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

interface Media {
  id: string;
  url: string;
  altText?: string | null;
}

interface Stop {
  id: string;
  city: {
    name: string;
  };
  order: number;
}

interface Trip {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  coverMedia?: Media | null;
  stops: Stop[];
  favorites: any[]; // Assuming favorites is an array
}

// --- Helper Components ---

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Loader className="w-12 h-12 animate-spin mb-4" />
    <p className="text-lg font-semibold">Loading Your Trips...</p>
    <p className="text-sm">Please wait a moment.</p>
  </div>
);

const ErrorDisplay = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
    <h3 className="text-xl font-bold mb-2">Oops! Something went wrong.</h3>
    <p className="mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
    >
      Try Again
    </button>
  </div>
);

const NoTripsDisplay = () => (
  <div className="text-center py-16 px-6 bg-gray-50 rounded-lg border-2 border-dashed">
    <PlusCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Trips Found</h2>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      It looks like you haven't created any trips yet. Start your next adventure
      now!
    </p>
    <a
      href="/create-trip" // Assuming you have a page to create trips
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 inline-block"
    >
      Create Your First Trip
    </a>
  </div>
);

const TripCard = ({ trip }: { trip: Trip }) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stopsSummary =
    trip.stops.length > 0
      ? trip.stops
          .map((stop) => stop.city.name)
          .slice(0, 3) // Show first 3 stops
          .join(" → ")
      : "No stops planned";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl flex flex-col">
      <div className="relative">
        <img
          src={
            trip.coverMedia?.url ??
            `https://placehold.co/600x400/cccccc/ffffff?text=${encodeURIComponent(
              trip.title
            )}`
          }
          alt={trip.coverMedia?.altText ?? `Cover image for ${trip.title}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/600x400/cccccc/ffffff?text=Image+Error`;
          }}
        />
        <span
          className={`absolute top-3 right-3 text-xs font-bold py-1 px-3 rounded-full text-white ${
            trip.status === "COMPLETED" ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {trip.status}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
          {trip.title}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        <div className="flex items-start text-gray-600 text-sm mb-5">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p className="line-clamp-2">{stopsSummary}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-red-500">
            <Heart className="w-5 h-5 mr-1" />
            <span className="text-sm font-semibold">
              {trip.favorites.length}
            </span>
          </div>
          <a
            href={`/user/itinerary`}
            className="text-sm font-bold text-orange-500 hover:text-orange-600"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const UserTripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const limit = 9; // Number of trips per page

  const fetchTrips = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/user/trip/get-all", {
        params: {
          page: currentPage,
          limit,
        },
      });
      const { trips: fetchedTrips, total, page: newPage } = response.data;
      setTrips(fetchedTrips);
      setTotalTrips(total);
      setTotalPages(Math.ceil(total / limit));
      setPage(newPage);
    } catch (err: any) {
      console.error("Failed to fetch trips:", err);
      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips(page);
  }, [page, fetchTrips]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={() => fetchTrips(page)} />;
    }
    if (trips.length === 0) {
      return <NoTripsDisplay />;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="mt-1 text-gray-600">
              Your adventures, all in one place.
            </p>
          </div>
          {!loading && !error && trips.length > 0 && (
            <p className="mt-4 md:mt-0 text-sm font-medium text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-800">{trips.length}</span> of{" "}
              <span className="font-bold text-gray-800">{totalTrips}</span>{" "}
              trips
            </p>
          )}
        </div>

        {/* Main Content Area */}
        {renderContent()}

        {/* Pagination Controls */}
        {!loading && !error && trips.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTripsPage;
