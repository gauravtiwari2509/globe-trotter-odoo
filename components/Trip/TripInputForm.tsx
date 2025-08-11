"use client"
import { ArrowRight } from "lucide-react";
import LoaderWithText from "../LoaderWithText";
import { TripData, tripDataSchema } from "@/zodSchemas/tripCreation";
import { useState } from "react";

export const TripInputForm = ({
  onProceed,
}: {
  onProceed: (tripData: TripData) => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TripData>({
    startDate: "",
    endDate: "",
    country: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const validateForm = (): boolean => {
    try {
      tripDataSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreating(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onProceed(formData);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: keyof TripData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-white text-gray-900">
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl"></div>

      {isCreating && <LoaderWithText text="Validating trip details..." />}

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl max-sm:text-xl font-bold text-orange-600">
            Create a New Trip
          </h2>
          <p className="text-sm text-gray-500">
            Fill out the details below to plan your next adventure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="startDate" className="block text-sm mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="w-1/2">
              <label htmlFor="endDate" className="block text-sm mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Enter your destination country"
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
            />
            {errors.country && (
              <p className="text-red-600 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm mb-1">
              Trip Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              placeholder="Describe what kind of trip you're planning..."
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 cursor-pointer bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg disabled:opacity-50"
          >
            {isCreating ? (
              "Validating..."
            ) : (
              <>
                <span>Next — Get AI Recommendations</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm font-semibold text-red-600">
            {message}
          </div>
        )}
      </div>
    </section>
  );
};