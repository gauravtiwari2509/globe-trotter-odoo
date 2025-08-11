"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  field: string;
  currentValue: string;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditProfileModal({
  field,
  currentValue,
  onClose,
  onUpdated,
}: Props) {
  const [value, setValue] = useState(currentValue || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put("/api/user/updateprofile", { [field]: value });
      toast.success("Profile updated successfully");
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold text-orange-600 mb-4 font-michroma">
          Edit {field}
        </h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
