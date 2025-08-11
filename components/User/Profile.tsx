"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  FaEdit,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

type UserProfile = {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: {
    phoneNo: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    locale: string | null;
    preferences: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

const fetchUserProfile = async (): Promise<UserProfile> => {
  const res = await axios.get("/api/user/profile");
  return res.data.userProfile;
};

export default function ProfilePage() {
  const [editField, setEditField] = useState<string | null>(null);

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 text-orange-600 font-michroma">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-orange-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading profile...
      </div>
    );
  }

  if (isError || !userProfile) {
    toast.error(error?.message || "Profile not found.");
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 text-red-600 font-michroma">
        Profile not found.
      </div>
    );
  }

  const profileData = userProfile.profile;

  const renderValueWithEdit = (
    label: string,
    value: string,
    field: string | null,
    icon: React.ReactNode
  ) => (
    <div className="flex items-center justify-between py-2 border-b border-orange-100 last:border-b-0">
      <span className="flex items-center text-gray-600">
        {icon}
        <span className="font-medium text-gray-800 ml-2">{label}:</span>
      </span>
      <div className="flex items-center gap-2">
        <span className="text-gray-700">{value}</span>
        {field && (
          <FaEdit
            className="cursor-pointer text-orange-500 hover:text-orange-600 transition-colors"
            onClick={() => setEditField(field)}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-br from-orange-50 to-white text-gray-800 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 w-full max-w-4xl p-8 transform transition-transform duration-500 hover:scale-[1.01]">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start space-y-6 md:space-y-0 md:space-x-8 mb-8 pb-8 border-b border-orange-100">
          <div className="relative group">
            {profileData?.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Avatar"
                className="w-36 h-36 rounded-full border-4 border-orange-500 shadow-lg object-cover transition-all duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-36 h-36 rounded-full bg-orange-100 text-orange-500 text-6xl font-bold border-4 border-orange-500 transition-all duration-300 group-hover:scale-105">
                {profileData?.displayName?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={() => setEditField("avatarUrl")}
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <FaEdit className="text-lg" />
            </button>
          </div>
          <div className="text-center md:text-left mt-4 md:mt-0">
            <h2 className="text-4xl font-bold font-michroma text-orange-600 flex items-center justify-center md:justify-start gap-3 mb-1">
              {profileData?.displayName || "No Name"}
              <FaEdit
                className="cursor-pointer text-xl text-gray-400 hover:text-orange-500 transition-colors"
                onClick={() => setEditField("displayName")}
              />
            </h2>
            <p className="text-gray-600 font-tektur text-lg flex items-center gap-2 justify-center md:justify-start">
              {profileData?.bio || "No bio set"}
              <FaEdit
                className="cursor-pointer text-sm text-gray-400 hover:text-orange-500 transition-colors"
                onClick={() => setEditField("bio")}
              />
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
          {renderValueWithEdit(
            "Email",
            userProfile.email,
            "email",
            <FaEnvelope className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Phone Number",
            profileData?.phoneNo || "Not provided",
            "phoneNo",
            <FaPhone className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Locale",
            profileData?.locale || "Not set",
            "locale",
            <FaGlobe className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Preferences",
            profileData?.preferences || "No preferences",
            "preferences",
            <FaStar className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Role",
            userProfile.role,
            null,
            <FaUserCircle className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Verified",
            userProfile.verified ? "Yes" : "No",
            null,
            userProfile.verified ? (
              <FaCheckCircle className="mr-2 text-green-500" />
            ) : (
              <FaTimesCircle className="mr-2 text-red-500" />
            )
          )}
          {renderValueWithEdit(
            "Account Created",
            new Date(userProfile.createdAt).toLocaleDateString(),
            null,
            <FaCalendarAlt className="mr-2 text-orange-400" />
          )}
        </div>
      </div>

      {/* Modal for editing */}
      {editField && (
        <EditProfileModal
          field={editField}
          currentValue={
            profileData && editField in profileData
              ? (profileData as any)[editField]
              : (userProfile as any)[editField]
          }
          onClose={() => setEditField(null)}
          onUpdated={refetch}
        />
      )}
    </section>
  );
}
