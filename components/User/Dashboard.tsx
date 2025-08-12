"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import LoaderWithText from "@/components/LoaderWithText";
import Link from "next/link";

type DashboardData = {
  stats: {
    totalTrips: number;
    totalFavorites: number;
    totalComments: number;
    totalActivities: number;
    totalExpenses: number;
  };
  recentTrips: Array<{ id: string; title: string; slug: string }>;
  recentFavorites: Array<{ id: string; trip: { title: string; slug: string } }>;
  preplannedTrips: Array<{
    id: string;
    title: string;
    slug: string;
    startDate: string;
    endDate: string;
  }>;
  previousTrips: Array<{
    id: string;
    title: string;
    slug: string;
    startDate: string;
    endDate: string;
  }>;
};

const data2 = {
  stats: {
    totalTrips: 12,
    totalFavorites: 5,
    totalComments: 18,
    totalActivities: 34,
    totalExpenses: 2100,
  },
  recentTrips: [
    {
      id: "trip1",
      title: "Summer in Spain",
      slug: "summer-in-spain",
    },
    {
      id: "trip2",
      title: "Tokyo Adventure",
      slug: "tokyo-adventure",
    },
    {
      id: "trip3",
      title: "Alaskan Cruise",
      slug: "alaskan-cruise",
    },
  ],
  recentFavorites: [
    {
      id: "fav1",
      trip: {
        title: "Romantic Paris",
        slug: "romantic-paris",
      },
    },
    {
      id: "fav2",
      trip: {
        title: "Safari in Kenya",
        slug: "safari-in-kenya",
      },
    },
  ],
  preplannedTrips: [
    {
      id: "pre1",
      title: "New Year in New York",
      slug: "new-year-in-new-york",
      startDate: "2026-01-01",
      endDate: "2026-01-05",
    },
    {
      id: "pre2",
      title: "Cherry Blossoms Japan",
      slug: "cherry-blossoms-japan",
      startDate: "2026-04-01",
      endDate: "2026-04-10",
    },
  ],
  previousTrips: [
    {
      id: "past1",
      title: "Weekend in Bali",
      slug: "weekend-in-bali",
      startDate: "2025-07-15",
      endDate: "2025-07-20",
    },
    {
      id: "past2",
      title: "Road Trip USA",
      slug: "road-trip-usa",
      startDate: "2025-06-01",
      endDate: "2025-06-14",
    },
    {
      id: "past3",
      title: "Mountains of Peru",
      slug: "mountains-of-peru",
      startDate: "2025-05-10",
      endDate: "2025-05-20",
    },
  ],
};

const fetchDashboard = async (): Promise<DashboardData> => {
  const resp = await axios.get("/api/user/dashboard");
  return data2;
};

const COLORS = ["#FFBB28", "#FF8042", "#0088FE", "#00C49F", "#FF6384"];

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboard,
  });

  if (isLoading) return <LoaderWithText text="Loading dashboard..." />;
  if (error) {
    toast.error("Failed to load dashboard.");
    return <span>An error occurred.</span>;
  }

  const {
    stats,
    recentTrips,
    recentFavorites,
    preplannedTrips,
    previousTrips,
  } = data2;

  // Prepare Recharts data
  const pieData = [
    { name: "Trips", value: stats.totalTrips },
    { name: "Favorites", value: stats.totalFavorites },
    { name: "Comments", value: stats.totalComments },
    { name: "Activities", value: stats.totalActivities },
    { name: "Expenses", value: stats.totalExpenses },
  ];

  return (
    <section className="py-10 bg-gradient-to-br from-orange-50 to-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Greeting */}
        <h1 className="text-3xl font-michroma text-orange-600">
          Welcome back, Traveler!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Object.entries(stats).map(([key, val]) => (
            <div
              key={key}
              className="bg-white rounded-xl shadow p-4 text-center border border-orange-100"
            >
              <h3 className="text-lg font-semibold capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </h3>
              <p className="text-2xl font-bold text-orange-600">{val}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-michroma text-gray-800 mb-4">
              Overview
            </h2>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={100}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Bar Chart: Upcoming vs Past */}
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-michroma text-gray-800 mb-4">
              Trip Timelines
            </h2>
            <BarChart
              width={400}
              height={300}
              data={[
                { name: "Upcoming", count: preplannedTrips.length },
                {
                  name: "Completed",
                  count:
                    data2.stats.totalTrips -
                    (previousTrips.length + preplannedTrips.length),
                },
                { name: "Past", count: previousTrips.length },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ReTooltip />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </div>
        </div>

        {/* Recent Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100">
            <h3 className="text-lg font-michroma mb-2">Recent Trips</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recentTrips.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/trip/${t.slug}`}
                    className="text-orange-600 hover:underline"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Favorites */}
          <div className="bg-white rounded-xl shadow p-6 border border-orange-100">
            <h3 className="text-lg font-michroma mb-2">Recent Favorites</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recentFavorites.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/trip/${f.trip.slug}`}
                    className="text-orange-600 hover:underline"
                  >
                    {f.trip.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/user/trips/create"
            className="px-6 py-3 bg-orange-600 text-white rounded-full font-michroma hover:bg-orange-700 transition"
          >
            Plan New Trip
          </Link>
          <Link
            href="/user/trips/all-trip"
            className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-full font-michroma hover:bg-gray-100 transition"
          >
            View All Trips
          </Link>
        </div>
      </div>
    </section>
  );
}
