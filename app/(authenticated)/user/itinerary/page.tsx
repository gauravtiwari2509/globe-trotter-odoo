"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Filter,
  MoreHorizontal,
} from "lucide-react";

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  expense: string;
  expenseAmount?: number;
}

interface DaySection {
  day: number;
  date: string;
  dayName: string;
  activities: ActivityItem[];
}

const TravelItinerary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredActivities, setFilteredActivities] = useState<DaySection[]>(
    []
  );

  const itineraryData: DaySection[] = [
    {
      day: 1,
      date: "March 15, 2024",
      dayName: "Friday",
      activities: [
        {
          id: "1-1",
          time: "08:00",
          title: "Arrive at Narita Airport",
          description:
            "Land at NRT, collect luggage, and take the Narita Express to Tokyo Station",
          location: "Narita International Airport",
          expense: "¥3,020",
          expenseAmount: 3020,
        },
        {
          id: "1-2",
          time: "11:30",
          title: "Senso-ji Temple Visit",
          description:
            "Explore Tokyo's oldest temple in Asakusa district, walk through Nakamise Shopping Street",
          location: "Asakusa, Tokyo",
          expense: "Free",
          expenseAmount: 0,
        },
        {
          id: "1-3",
          time: "14:00",
          title: "Traditional Lunch at Daikokuya",
          description:
            "Experience authentic tempura at this 150-year-old restaurant",
          location: "Asakusa, Tokyo",
          expense: "¥4,500",
          expenseAmount: 4500,
        },
      ],
    },
    {
      day: 2,
      date: "March 16, 2024",
      dayName: "Saturday",
      activities: [
        {
          id: "2-1",
          time: "07:00",
          title: "Tsukiji Outer Market",
          description:
            "Fresh sushi breakfast and explore the bustling fish market atmosphere",
          location: "Tsukiji, Tokyo",
          expense: "¥3,200",
          expenseAmount: 3200,
        },
        {
          id: "2-2",
          time: "10:00",
          title: "Imperial Palace East Gardens",
          description:
            "Peaceful walk through historic gardens and ruins of Edo Castle",
          location: "Chiyoda, Tokyo",
          expense: "Free",
          expenseAmount: 0,
        },
        {
          id: "2-3",
          time: "15:30",
          title: "Shibuya Crossing & Shopping",
          description:
            "Experience the world's busiest pedestrian crossing and explore Shibuya's shopping districts",
          location: "Shibuya, Tokyo",
          expense: "¥8,000",
          expenseAmount: 8000,
        },
      ],
    },
    {
      day: 3,
      date: "March 17, 2024",
      dayName: "Sunday",
      activities: [
        {
          id: "3-1",
          time: "06:30",
          title: "Shinkansen to Kyoto",
          description:
            "High-speed bullet train journey from Tokyo to Kyoto (3 hours)",
          location: "Tokyo → Kyoto",
          expense: "¥13,320",
          expenseAmount: 13320,
        },
        {
          id: "3-2",
          time: "11:00",
          title: "Fushimi Inari Shrine",
          description:
            "Hike through thousands of vermillion torii gates up the mountain",
          location: "Fushimi, Kyoto",
          expense: "Free",
          expenseAmount: 0,
        },
        {
          id: "3-3",
          time: "16:00",
          title: "Gion District Walking Tour",
          description:
            "Explore the famous geisha district with traditional tea houses and shops",
          location: "Gion, Kyoto",
          expense: "¥2,500",
          expenseAmount: 2500,
        },
      ],
    },
    {
      day: 4,
      date: "March 18, 2024",
      dayName: "Monday",
      activities: [
        {
          id: "4-1",
          time: "08:00",
          title: "Arashiyama Bamboo Grove",
          description:
            "Walk through the ethereal bamboo forest and visit Tenryu-ji Temple",
          location: "Arashiyama, Kyoto",
          expense: "¥600",
          expenseAmount: 600,
        },
        {
          id: "4-2",
          time: "12:00",
          title: "Kiyomizu-dera Temple",
          description:
            "Visit the famous wooden temple with panoramic views of Kyoto",
          location: "Higashiyama, Kyoto",
          expense: "¥400",
          expenseAmount: 400,
        },
        {
          id: "4-3",
          time: "17:00",
          title: "Farewell Kaiseki Dinner",
          description:
            "Traditional multi-course Japanese dinner at a high-end restaurant",
          location: "Pontocho Alley, Kyoto",
          expense: "¥15,000",
          expenseAmount: 15000,
        },
      ],
    },
  ];

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredActivities(itineraryData);
    } else {
      const filtered = itineraryData
        .map((day) => ({
          ...day,
          activities: day.activities.filter(
            (activity) =>
              activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              activity.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              activity.location.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((day) => day.activities.length > 0);
      setFilteredActivities(filtered);
    }
  }, [searchTerm]);

  const totalActivities = itineraryData.reduce(
    (acc, day) => acc + day.activities.length,
    0
  );
  const totalBudget = itineraryData.reduce(
    (acc, day) =>
      acc +
      day.activities.reduce(
        (dayAcc, activity) => dayAcc + (activity.expenseAmount || 0),
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-light mb-2">
              Japan Cultural Discovery
            </h2>
            <p className="text-orange-100 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar size={16} />4 Days
              </span>
              <span>Tokyo & Kyoto</span>
              <span>March 2024</span>
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-x border-gray-200 px-6 py-4">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {totalActivities}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Activity size={14} />
                Activities
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                ¥{totalBudget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <DollarSign size={14} />
                Total Budget
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">32km</div>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <MapPin size={14} />
                Distance
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Content */}
        <div className="bg-white rounded-b-2xl border border-gray-200 p-8">
          {filteredActivities.map((day, dayIndex) => (
            <div key={day.day} className="relative mb-12 last:mb-0">
              {/* Day Header */}
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  Day {day.day}
                </div>
                <div className="ml-6 text-gray-600">
                  {day.date} • {day.dayName}
                </div>
              </div>

              {/* Activities */}
              <div className="relative">
                {day.activities.map((activity, activityIndex) => (
                  <div
                    key={activity.id}
                    className="relative flex items-start mb-6 last:mb-0 group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-20 top-6 w-4 h-4 bg-orange-400 rounded-full border-4 border-white shadow-lg z-10"></div>

                    {/* Dotted line */}
                    {activityIndex < day.activities.length - 1 && (
                      <div
                        className="absolute left-[88px] top-10 w-0.5 h-16 z-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to bottom, #fb923c 0px, #fb923c 8px, transparent 8px, transparent 16px)",
                          opacity: 0.6,
                        }}
                      ></div>
                    )}

                    {/* Time badge */}
                    <div className="w-20 text-center bg-orange-100 border border-orange-200 rounded-xl py-2 px-2 text-sm font-semibold text-orange-700 mr-6 flex-shrink-0">
                      {activity.time}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer group-hover:translate-x-2 border-l-4 border-l-orange-400">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {activity.description}
                      </p>

                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <div className="flex items-center text-orange-600 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {activity.location}
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          {activity.expense}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Connection line to next day */}
                {dayIndex < filteredActivities.length - 1 && (
                  <div
                    className="absolute left-[88px] -bottom-6 w-0.5 h-12 z-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, #fb923c 0px, #fb923c 8px, transparent 8px, transparent 16px)",
                      opacity: 0.3,
                    }}
                  ></div>
                )}
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                No activities found
              </div>
              <p className="text-gray-500">
                Try searching for different keywords
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .group:hover .group-hover\\:translate-x-2 {
          transform: translateX(8px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TravelItinerary;
