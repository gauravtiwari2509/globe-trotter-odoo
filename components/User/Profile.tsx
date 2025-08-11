"use client";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
  FaUpload,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import { activityTypes, supportedLocales } from "@/constants/constant";
import { useSession } from "next-auth/react";

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

type UserPreferences = {
  budget: "low" | "mid" | "high" | null;
  activities: string[];
};

const LocaleDropdown = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLocales = useMemo(() => {
    if (!search) return supportedLocales;
    return supportedLocales.filter(
      (locale) =>
        locale.name.toLowerCase().includes(search.toLowerCase()) ||
        locale.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedLocaleName =
    supportedLocales.find((loc) => loc.code === value)?.name || "Select Locale";

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="w-full text-left border border-gray-300 rounded-md p-2 flex items-center justify-between bg-white text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLocaleName}</span>
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          <div className="p-2 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search locale..."
                className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ul className="py-1">
            {filteredLocales.map((locale) => (
              <li
                key={locale.code}
                className="px-4 py-2 cursor-pointer hover:bg-orange-100"
                onClick={() => {
                  onChange(locale.code);
                  setIsOpen(false);
                }}
              >
                {locale.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const [editField, setEditField] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [editingPreferences, setEditingPreferences] = useState<UserPreferences>(
    {
      budget: null,
      activities: [],
    }
  );
  const [editingLocale, setEditingLocale] = useState<string | null>(null);

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get("/api/user/profile");
      return res.data.userProfile;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Updated mutation for profile field updates (text and JSON)
  const updateProfileMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: any }) => {
      // Use PATCH method
      await axios.patch("/api/user/update-profile", { userId, [field]: value });
    },
    onSuccess: () => {
      toast.success("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setEditField(null);
      setEditingPreferences({ budget: null, activities: [] });
      setEditingLocale(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update profile.");
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      await axios.post("/api/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("Avatar uploaded.");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setSelectedFile(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to upload avatar.");
    },
  });

  useEffect(() => {
    if (editField === "preferences" && userProfile?.profile?.preferences) {
      try {
        const parsedPrefs: UserPreferences = JSON.parse(
          userProfile.profile.preferences
        );
        setEditingPreferences(parsedPrefs);
      } catch (e) {
        console.error("Failed to parse preferences JSON", e);
        setEditingPreferences({ budget: null, activities: [] });
      }
    }
    if (editField === "locale" && userProfile?.profile?.locale) {
      setEditingLocale(userProfile.profile.locale);
    }
  }, [editField, userProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError || !userProfile) {
    toast.error(error?.message || "Failed to load profile.");
    return (
      <div className="min-h-screen flex justify-center items-center">
        Error loading profile
      </div>
    );
  }

  const profileData = userProfile.profile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleSave = () => {
    if (!editField) return;

    if (editField === "preferences") {
      updateProfileMutation.mutate({
        field: editField,
        value: JSON.stringify(editingPreferences),
      });
      return;
    }

    if (editField === "locale") {
      if (!editingLocale) {
        toast.error("Please select a locale.");
        return;
      }
      updateProfileMutation.mutate({ field: editField, value: editingLocale });
      return;
    }

    if (!inputValue) return;
    updateProfileMutation.mutate({ field: editField, value: inputValue });
  };

  const getPreferenceDisplay = () => {
    try {
      const prefs: UserPreferences = profileData?.preferences
        ? JSON.parse(profileData.preferences)
        : null;
      if (!prefs) return "None";
      const budget = prefs.budget
        ? `${
            prefs.budget.charAt(0).toUpperCase() + prefs.budget.slice(1)
          } Budget`
        : "";
      const activities =
        prefs.activities.length > 0 ? prefs.activities.join(", ") : "";
      return [budget, activities].filter(Boolean).join(" | ") || "None";
    } catch (e) {
      console.error("Failed to parse preferences display", e);
      return "Invalid Data";
    }
  };

  const getLocaleDisplay = () => {
    const localeCode = profileData?.locale;
    if (!localeCode) return "Not set";
    const locale = supportedLocales.find((loc) => loc.code === localeCode);
    return locale ? locale.name : localeCode;
  };

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
            className="cursor-pointer text-orange-500 hover:text-orange-600"
            onClick={() => {
              setEditField(field);
              if (field !== "preferences" && field !== "locale") {
                setInputValue(
                  (profileData as any)?.[field] ??
                    (userProfile as any)?.[field] ??
                    ""
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );

  const renderEditModalContent = () => {
    if (editField === "preferences") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Budget</h3>
          <div className="flex gap-4">
            {["low", "mid", "high"].map((budget) => (
              <label key={budget} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  value={budget}
                  checked={editingPreferences.budget === budget}
                  onChange={() =>
                    setEditingPreferences((prev) => ({
                      ...prev,
                      budget: budget as "low" | "mid" | "high",
                    }))
                  }
                  className="form-radio text-orange-500"
                />
                <span className="ml-2 capitalize">{budget}</span>
              </label>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6">Activities</h3>
          <div className="grid grid-cols-2 gap-2">
            {activityTypes.map((activity) => (
              <label
                key={activity}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={editingPreferences.activities.includes(activity)}
                  onChange={(e) => {
                    setEditingPreferences((prev) => {
                      const newActivities = e.target.checked
                        ? [...prev.activities, activity]
                        : prev.activities.filter((a) => a !== activity);
                      return { ...prev, activities: newActivities };
                    });
                  }}
                  className="form-checkbox text-orange-500 rounded"
                />
                <span className="ml-2 capitalize">
                  {activity.replace(/_/g, " ").toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (editField === "locale") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Locale</h3>
          <LocaleDropdown value={editingLocale} onChange={setEditingLocale} />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border border-orange-300 rounded-md p-2 mb-4"
      />
    );
  };

  return (
    <section className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-br from-orange-50 to-white text-gray-800 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 w-full max-w-4xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-6 mb-6">
          <div className="relative group">
            {profileData?.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Avatar"
                className="w-36 h-36 rounded-full border-4 border-orange-500 object-cover"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-4xl font-bold border-4 border-orange-500">
                {profileData?.displayName?.charAt(0) || "U"}
              </div>
            )}
            <label
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 cursor-pointer"
              htmlFor="avatarUpload"
            >
              <FaUpload />
            </label>
            <input
              type="file"
              id="avatarUpload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {profileData?.displayName || "No Name"}
              <FaEdit
                className="cursor-pointer text-gray-400 hover:text-orange-500"
                onClick={() => {
                  setEditField("displayName");
                  setInputValue(profileData?.displayName || "");
                }}
              />
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              {profileData?.bio || "No bio"}
              <FaEdit
                className="cursor-pointer text-sm text-gray-400 hover:text-orange-500"
                onClick={() => {
                  setEditField("bio");
                  setInputValue(profileData?.bio || "");
                }}
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
          {renderValueWithEdit(
            "Email",
            userProfile.email,
            "email",
            <FaEnvelope className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Phone",
            profileData?.phoneNo || "Not set",
            "phoneNo",
            <FaPhone className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Locale",
            getLocaleDisplay(),
            "locale",
            <FaGlobe className="mr-2 text-orange-400" />
          )}
          {renderValueWithEdit(
            "Preferences",
            getPreferenceDisplay(),
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
            "Our Relationship since",
            new Date(userProfile.createdAt).toLocaleDateString(),
            null,
            <FaCalendarAlt className="mr-2 text-orange-400" />
          )}
        </div>
      </div>

      {editField && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
            </h2>
            {renderEditModalContent()}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditField(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="px-4 py-2 rounded-lg bg-orange-500 cursor-pointer text-white hover:bg-orange-600 disabled:bg-orange-300"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
