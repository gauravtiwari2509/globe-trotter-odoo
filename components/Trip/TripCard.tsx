import React from "react";
import {
  format,
  differenceInDays,
  isPast,
  isFuture,
  isWithinInterval,
} from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Share,
  Archive,
  CheckCircle,
} from "lucide-react";

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

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const getStatusInfo = () => {
    const now = new Date();

    if (trip.status === "COMPLETED") {
      return {
        label: "Completed",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: "from-green-50 to-green-100",
      };
    }

    if (trip.status === "ARCHIVED") {
      return {
        label: "Archived",
        color: "bg-gray-100 text-gray-800",
        icon: <Archive className="w-4 h-4" />,
        bgColor: "from-gray-50 to-gray-100",
      };
    }

    if (!trip.startDate || !trip.endDate) {
      return {
        label: "Draft",
        color: "bg-orange-100 text-orange-800",
        icon: <Edit className="w-4 h-4" />,
        bgColor: "from-orange-50 to-orange-100",
      };
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (isWithinInterval(now, { start: startDate, end: endDate })) {
      return {
        label: "Ongoing",
        color: "bg-blue-100 text-blue-800",
        icon: <MapPin className="w-4 h-4" />,
        bgColor: "from-blue-50 to-blue-100",
      };
    }

    if (isFuture(startDate)) {
      const daysUntil = differenceInDays(startDate, now);
      return {
        label: daysUntil === 0 ? "Starting today" : `${daysUntil} days to go`,
        color: "bg-purple-100 text-purple-800",
        icon: <Clock className="w-4 h-4" />,
        bgColor: "from-purple-50 to-purple-100",
      };
    }

    return {
      label: "Past",
      color: "bg-gray-100 text-gray-800",
      icon: <Calendar className="w-4 h-4" />,
      bgColor: "from-gray-50 to-gray-100",
    };
  };

  const statusInfo = getStatusInfo();

  const formatDateRange = () => {
    if (!trip.startDate || !trip.endDate) return "Dates not set";

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const startStr = format(start, "MMM d");
    const endStr = format(
      end,
      start.getFullYear() === end.getFullYear() ? "MMM d, yyyy" : "MMM d, yyyy"
    );

    return `${startStr} - ${endStr}`;
  };

  const getDuration = () => {
    if (!trip.startDate || !trip.endDate) return null;

    const days =
      differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
    return days === 1 ? "1 day" : `${days} days`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-orange-100 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {trip.coverMedia?.url ? (
          <img
            src={trip.coverMedia.url}
            alt={trip.coverMedia.altText || trip.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${statusInfo.bgColor} flex items-center justify-center`}
          >
            <div className="text-6xl opacity-30">🏖️</div>
          </div>
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} backdrop-blur-sm`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </span>

            {/* Privacy Icon */}
            <div className="flex items-center gap-2">
              {trip.privacy === "private" ? (
                <EyeOff className="w-4 h-4 text-white/80" />
              ) : (
                <Eye className="w-4 h-4 text-white/80" />
              )}
              <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <MoreVertical className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>

          {/* Title at bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-bold leading-tight mb-1 line-clamp-2">
              {trip.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Date Range */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">{formatDateRange()}</span>
        </div>

        {/* Duration */}
        {getDuration() && (
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{getDuration()}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105">
            View Trip
          </button>
          <button className="p-2 border border-orange-200 hover:border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
            <Share className="w-4 h-4" />
          </button>
        </div>

        {/* Updated Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Updated {format(new Date(trip.updatedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
