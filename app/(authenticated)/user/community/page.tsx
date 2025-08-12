"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  Heart,
  Eye,
  Clock,
  Star,
  Loader2,
} from "lucide-react";

// Types based on your Prisma schema
type TripStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "COMPLETED";
type ActivityType =
  | "SIGHTSEEING"
  | "CULTURE"
  | "ADVENTURE"
  | "ENTERTAINMENT"
  | "FOOD_AND_DRINK"
  | "SHOPPING"
  | "RELAXATION"
  | "FESTIVAL"
  | "OUTDOOR"
  | "SPORTS"
  | "OTHER";

interface User {
  id: string;
  email: string;
  profile: {
    displayName: string;
    avatarUrl: string;
    bio?: string;
  };
}

interface City {
  id: string;
  name: string;
  country: {
    name: string;
    code: string;
  };
}

interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverMedia: {
    url: string;
    altText?: string;
  };
  status: TripStatus;
  startDate: string;
  endDate: string;
  owner: User;
  stops: {
    city: City;
  }[];
  activities: {
    type: ActivityType;
  }[];
  publicView: {
    viewCount: number;
  };
  favorites: { id: string }[];
  createdAt: string;
}

// Simulate React Query response
interface InfiniteQueryResult {
  data: {
    pages: { trips: Trip[]; nextCursor: number | null }[];
    pageParams: number[];
  };
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const fetchTrips = async (
  cursor: number = 0,
  limit: number = 9,
  searchQuery: string = "",
  sortBy: string = "newest",
  filterBy: string = "all"
): Promise<{ trips: Trip[]; nextCursor: number | null }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allTrips = generateAllTrips();

  // Apply filters
  let filtered = allTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.stops.some((stop) =>
        stop.city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "popular")
      return matchesSearch && trip.publicView.viewCount > 500;
    if (filterBy === "recent")
      return (
        matchesSearch &&
        new Date(trip.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

    return matchesSearch;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "popular":
        return b.publicView.viewCount - a.publicView.viewCount;
      case "favorites":
        return b.favorites.length - a.favorites.length;
      default:
        return 0;
    }
  });

  const startIndex = cursor * limit;
  const endIndex = startIndex + limit;
  const trips = filtered.slice(startIndex, endIndex);
  const nextCursor = endIndex < filtered.length ? cursor + 1 : null;

  return { trips, nextCursor };
};

// Custom hook that simulates React Query's useInfiniteQuery
const useInfiniteTrips = (
  searchQuery: string,
  sortBy: string,
  filterBy: string
): InfiniteQueryResult => {
  const [data, setData] = useState<{
    pages: { trips: Trip[]; nextCursor: number | null }[];
    pageParams: number[];
  }>({
    pages: [],
    pageParams: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await fetchTrips(0, 9, searchQuery, sortBy, filterBy);
      setData({
        pages: [result],
        pageParams: [0],
      });
      setHasNextPage(result.nextCursor !== null);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortBy, filterBy]);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);

    try {
      const lastPage = data.pages[data.pages.length - 1];
      const nextCursor = lastPage?.nextCursor;

      if (nextCursor !== null && nextCursor !== undefined) {
        const result = await fetchTrips(
          nextCursor,
          9,
          searchQuery,
          sortBy,
          filterBy
        );
        setData((prev) => ({
          pages: [...prev.pages, result],
          pageParams: [...prev.pageParams, nextCursor],
        }));
        setHasNextPage(result.nextCursor !== null);
      }
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [
    data.pages,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    sortBy,
    filterBy,
  ]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};

// Generate a larger dataset for infinite scroll
const generateAllTrips = (): Trip[] => {
  const cities = [
    { name: "Paris", country: "France", code: "FR" },
    { name: "Tokyo", country: "Japan", code: "JP" },
    { name: "New York", country: "United States", code: "US" },
    { name: "London", country: "United Kingdom", code: "GB" },
    { name: "Barcelona", country: "Spain", code: "ES" },
    { name: "Bangkok", country: "Thailand", code: "TH" },
    { name: "Rome", country: "Italy", code: "IT" },
    { name: "Dubai", country: "UAE", code: "AE" },
    { name: "Sydney", country: "Australia", code: "AU" },
    { name: "Istanbul", country: "Turkey", code: "TR" },
    { name: "Amsterdam", country: "Netherlands", code: "NL" },
    { name: "Santorini", country: "Greece", code: "GR" },
    { name: "Bali", country: "Indonesia", code: "ID" },
    { name: "Marrakech", country: "Morocco", code: "MA" },
    { name: "Kyoto", country: "Japan", code: "JP" },
  ];

  const activityTypes: ActivityType[] = [
    "SIGHTSEEING",
    "CULTURE",
    "ADVENTURE",
    "ENTERTAINMENT",
    "FOOD_AND_DRINK",
    "SHOPPING",
    "RELAXATION",
    "FESTIVAL",
    "OUTDOOR",
    "SPORTS",
  ];

  const tripTitles = [
    "Ultimate European Adventure",
    "Cherry Blossom Dreams in Japan",
    "NYC Food & Culture Tour",
    "London Historical Journey",
    "Mediterranean Coastal Escape",
    "Southeast Asian Backpacking",
    "Ancient Rome & Modern Italy",
    "Luxury Dubai Experience",
    "Australian Outback Adventure",
    "Turkish Delights & History",
    "Scandinavian Northern Lights",
    "Bali Spiritual Retreat",
    "Swiss Alpine Adventure",
    "Moroccan Desert Expedition",
    "Greek Island Hopping",
    "Amsterdam Art & Culture",
    "Santorini Sunset Romance",
    "Balinese Temple Discovery",
    "Marrakech Medina Explorer",
    "Kyoto Garden Serenity",
    "Patagonian Wilderness Trek",
    "Iceland Ring Road Journey",
    "Vietnamese Street Food Tour",
    "Scottish Highland Castle Tour",
    "Peruvian Machu Picchu Expedition",
    "Egyptian Pyramid Quest",
    "Cambodian Angkor Discovery",
    "Rajasthani Palace Circuit",
    "Norwegian Fjord Cruise",
    "Chilean Wine Valley Tour",
    "Kenyan Safari Adventure",
    "New Zealand Lord of the Rings",
    "Brazilian Carnival Experience",
    "Chinese Silk Road Journey",
    "Russian Trans-Siberian Railway",
    "South African Garden Route",
    "Canadian Rocky Mountain High",
    "Mexican Yucatan Maya Trail",
    "Cuban Havana Time Capsule",
    "Portuguese Coastal Charm",
    "Polish Historical Heritage",
    "Hungarian Thermal Bath Relaxation",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const startDate = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const endDate = new Date(
      startDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000
    );

    return {
      id: `trip-${i + 1}`,
      title: tripTitles[i % tripTitles.length] || `Amazing Journey ${i + 1}`,
      slug: `trip-${i + 1}`,
      description: `Discover the wonders of ${randomCity.name} and surrounding areas. An unforgettable journey filled with culture, adventure, and amazing experiences that will create memories to last a lifetime.`,
      coverMedia: {
        url: `https://picsum.photos/seed/${i + 100}/800/600?random=${i}`,
        altText: `${tripTitles[i % tripTitles.length]} cover image`,
      },
      status: "PUBLISHED" as TripStatus,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      owner: {
        id: `user-${i + 1}`,
        email: `traveler${i + 1}@example.com`,
        profile: {
          displayName: `Traveler ${String.fromCharCode(65 + (i % 26))}`,
          avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
          bio: "Passionate traveler exploring the world",
        },
      },
      stops: [
        {
          city: {
            id: `city-${i + 1}`,
            name: randomCity.name,
            country: {
              name: randomCity.country,
              code: randomCity.code,
            },
          },
        },
      ],
      activities: Array.from(
        { length: Math.floor(Math.random() * 5) + 3 },
        () => ({
          type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        })
      ),
      publicView: {
        viewCount: Math.floor(Math.random() * 1000) + 50,
      },
      favorites: Array.from(
        { length: Math.floor(Math.random() * 20) },
        (_, j) => ({ id: `fav-${j}` })
      ),
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
};

const page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteTrips(searchQuery, selectedSort, selectedFilter);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all trips from all pages
  const allTrips = useMemo(() => {
    return data?.pages?.flatMap((page) => page.trips) || [];
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            {error?.message || "Failed to load trips"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mt-1">
                Discover amazing trips from our community
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {allTrips.length} trips loaded
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, activities, or trip titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              />
            </div>

            <div className="flex gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 shadow-sm ${
                  showFilters
                    ? "bg-orange-500 border-orange-500 text-white shadow-orange-500/25"
                    : "bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:shadow-md"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>

              {/* Sort Dropdown */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-gray-800 appearance-none cursor-pointer hover:border-orange-300 transition-all duration-200 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="favorites">Most Favorited</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
              {[
                { value: "all", label: "All Trips" },
                { value: "popular", label: "Popular" },
                { value: "recent", label: "Recent" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.value
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                      : "bg-white text-gray-700 hover:bg-orange-100 border border-orange-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing trips...</p>
            </div>
          </div>
        ) : allTrips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No trips found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTrips.map((trip, index) => (
                <div
                  key={`${trip.id}-${index}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-300 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 shadow-lg">
                    {/* Trip Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={trip.coverMedia.url}
                        alt={trip.coverMedia.altText || trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Duration Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-800">
                            {getDuration(trip.startDate, trip.endDate)}
                          </span>
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <div className="absolute top-4 right-4">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-200 group shadow-lg">
                          <Heart className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:fill-current" />
                        </button>
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {trip.publicView.viewCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {trip.favorites.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {trip.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {trip.description}
                        </p>
                      </div>

                      {/* Trip Info */}
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-sm">
                            {trip.stops
                              .map(
                                (stop) =>
                                  `${stop.city.name}, ${stop.city.country.name}`
                              )
                              .join(" • ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">
                            {formatDate(trip.startDate)} -{" "}
                            {formatDate(trip.endDate)}
                          </span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={trip.owner.profile.avatarUrl}
                            alt={trip.owner.profile.displayName}
                            className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {trip.owner.profile.displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(trip.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {(4.0 + Math.random() * 1).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="mt-12">
              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                    <p className="text-gray-600">Loading more trips...</p>
                  </div>
                </div>
              )}

              {!hasNextPage && allTrips.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 text-orange-700 rounded-full">
                    <span className="text-sm font-medium">
                      You've reached the end! 🎉
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
