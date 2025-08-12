"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  MapPin,
  Activity,
  TrendingUp,
  MoreVertical,
  UserCheck,
  Star,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

// Types
interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  profile: {
    displayName: string;
    avatarUrl: string;
    bio?: string;
  };
  verified: boolean;
  createdAt: string;
  lastActive: string;
  tripCount: number;
  status: "active" | "suspended" | "pending";
}

interface City {
  id: string;
  name: string;
  country: string;
  visitCount: number;
  popularity: number;
  growth: number;
  averageRating: number;
  tripCount: number;
}

interface ActivityData {
  id: string;
  type: string;
  name: string;
  popularity: number;
  bookingCount: number;
  averagePrice: number;
  rating: number;
  growth: number;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalTrips: number;
  totalRevenue: number;
  userGrowth: number;
  tripGrowth: number;
  revenueGrowth: number;
}

// Mock data generators
const generateUsers = (): User[] => {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Davis",
    "David Wilson",
    "Eva Brown",
    "Frank Miller",
    "Grace Taylor",
    "Henry Clark",
    "Iris White",
    "Jack Anderson",
  ];
  const roles: ("USER" | "ADMIN" | "MODERATOR")[] = [
    "USER",
    "USER",
    "USER",
    "ADMIN",
    "MODERATOR",
    "USER",
    "USER",
    "USER",
    "USER",
    "USER",
  ];
  const statuses: ("active" | "suspended" | "pending")[] = [
    "active",
    "active",
    "pending",
    "active",
    "active",
    "suspended",
    "active",
    "active",
    "active",
    "active",
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `${names[i].toLowerCase().replace(" ", ".")}@example.com`,
    role: roles[i],
    profile: {
      displayName: names[i],
      avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
      bio: "Travel enthusiast exploring the world",
    },
    verified: Math.random() > 0.2,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    lastActive: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    tripCount: Math.floor(Math.random() * 20) + 1,
    status: statuses[i],
  }));
};

const generateCities = (): City[] => {
  const cities = [
    { name: "Paris", country: "France" },
    { name: "Tokyo", country: "Japan" },
    { name: "New York", country: "USA" },
    { name: "London", country: "UK" },
    { name: "Barcelona", country: "Spain" },
    { name: "Bangkok", country: "Thailand" },
    { name: "Rome", country: "Italy" },
    { name: "Dubai", country: "UAE" },
    { name: "Sydney", country: "Australia" },
    { name: "Istanbul", country: "Turkey" },
  ];

  return cities.map((city, i) => ({
    id: `city-${i + 1}`,
    name: city.name,
    country: city.country,
    visitCount: Math.floor(Math.random() * 5000) + 1000,
    popularity: Math.floor(Math.random() * 100) + 1,
    growth: Math.floor(Math.random() * 40) - 10,
    averageRating: +(4.0 + Math.random() * 1).toFixed(1),
    tripCount: Math.floor(Math.random() * 500) + 100,
  }));
};

const generateActivities = (): ActivityData[] => {
  const activities = [
    { type: "SIGHTSEEING", name: "City Tours" },
    { type: "CULTURE", name: "Museum Visits" },
    { type: "ADVENTURE", name: "Hiking & Trekking" },
    { type: "FOOD_AND_DRINK", name: "Food Tours" },
    { type: "ENTERTAINMENT", name: "Shows & Events" },
    { type: "SHOPPING", name: "Shopping Tours" },
    { type: "RELAXATION", name: "Spa & Wellness" },
    { type: "OUTDOOR", name: "Nature Activities" },
  ];

  return activities.map((activity, i) => ({
    id: `activity-${i + 1}`,
    type: activity.type,
    name: activity.name,
    popularity: Math.floor(Math.random() * 100) + 1,
    bookingCount: Math.floor(Math.random() * 1000) + 100,
    averagePrice: Math.floor(Math.random() * 200) + 50,
    rating: +(4.0 + Math.random() * 1).toFixed(1),
    growth: Math.floor(Math.random() * 60) - 20,
  }));
};

const generateAnalytics = (): AnalyticsData => ({
  totalUsers: 12547,
  activeUsers: 8934,
  totalTrips: 3421,
  totalRevenue: 456789,
  userGrowth: 12.5,
  tripGrowth: 8.3,
  revenueGrowth: 15.7,
});

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const users = useMemo(() => generateUsers(), []);
  const cities = useMemo(() => generateCities(), []);
  const activities = useMemo(() => generateActivities(), []);
  const analytics = useMemo(() => generateAnalytics(), []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "suspended":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600 bg-purple-100";
      case "MODERATOR":
        return "text-blue-600 bg-blue-100";
      case "USER":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Tab content components
  const ManageUsersTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            ↗ +{analytics.userGrowth}% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">71% of total users</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-800">234</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">+18% vs last week</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verification Rate</p>
              <p className="text-2xl font-bold text-gray-800">87%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">High verification rate</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trips
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.profile.avatarUrl}
                        alt={user.profile.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.profile.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.tripCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-orange-600 hover:text-orange-900">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PopularCitiesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cities List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Top Destinations
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Most visited cities based on current user trends
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {cities.slice(0, 6).map((city, index) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-semibold text-orange-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{city.name}</p>
                      <p className="text-sm text-gray-500">{city.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {city.visitCount.toLocaleString()} visits
                    </p>
                    <p
                      className={`text-xs ${
                        city.growth > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {city.growth > 0 ? "↗" : "↘"} {Math.abs(city.growth)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Visit Trends
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              City popularity over time
            </p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Interactive chart showing city visit trends
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Data visualization would go here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PopularActivitiesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Popular Activities
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Most popular activities based on current user trend data
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.bookingCount} bookings
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">
                        {activity.rating}
                      </span>
                      <span
                        className={`text-xs ${
                          activity.growth > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ({activity.growth > 0 ? "+" : ""}
                        {activity.growth}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Analytics */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Activity Metrics
              </h3>
            </div>
            <div className="p-6">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    Activity distribution chart
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Revenue by Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Revenue trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(analytics.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            ↗ +{analytics.revenueGrowth}% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-3xl font-bold text-gray-800">
                {analytics.totalTrips.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            ↗ +{analytics.tripGrowth}% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Trip Value</p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(analytics.totalRevenue / analytics.totalTrips)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">Consistent value</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              User Growth Trends
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Monthly user acquisition and engagement analysis
            </p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gradient-to-br from-orange-50 to-red-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">
                  User Growth Analytics
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Interactive line charts showing user trends over time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Revenue Analysis
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Revenue breakdown and forecasting
            </p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Revenue Analytics</p>
                <p className="text-sm text-gray-500 mt-1">
                  Detailed revenue analysis across various points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mt-1">Admin Dashboard</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users, cities, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-orange-300 transition-all duration-200 shadow-sm">
                <Filter className="w-4 h-4" />
                Group by
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-orange-300 transition-all duration-200 shadow-sm">
                Filter
              </button>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-800 appearance-none cursor-pointer hover:border-orange-300 transition-all duration-200 shadow-sm"
              >
                <option value="newest">Sort by...</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          {[
            { id: "users", label: "Manage Users", icon: Users },
            { id: "cities", label: "Popular Cities", icon: MapPin },
            { id: "activities", label: "Popular Activities", icon: Activity },
            {
              id: "analytics",
              label: "User Trends and Analytics",
              icon: TrendingUp,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "users" && <ManageUsersTab />}
          {activeTab === "cities" && <PopularCitiesTab />}
          {activeTab === "activities" && <PopularActivitiesTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
