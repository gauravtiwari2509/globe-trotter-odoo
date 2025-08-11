"use client";
import { ArrowLeft } from "lucide-react";
import { ErrorMessage } from "../ui/ErrorMessage";
import { getPlacesRecommendations } from "@/lib/utils/trip-plan-page-utility";
import { useState } from "react";
import { TripData } from "@/zodSchemas/tripCreation";

export const AIRecommendations = ({
  tripData,
  onProceed,
  onBack,
}: {
  tripData: TripData;
  onProceed: (recommendations: Recommendations) => void;
  onBack: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<Recommendations | null>(null);
  const [error, setError] = useState("");

  const generateRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPlacesRecommendations(tripData);
      setRecommendations(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (recommendations) {
      onProceed(recommendations);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Travel Recommendations
        </h2>
        <p className="text-gray-600">
          Let our AI suggest the best places for your trip
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Trip Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Country:</span> {tripData.country}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {tripData.startDate}{" "}
            to {tripData.endDate}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Description:</span>{" "}
            {tripData.description}
          </div>
        </div>
      </div>

      {!recommendations && (
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
          >
            {loading
              ? "Generating Recommendations..."
              : "Get AI Recommendations"}
          </button>
        </div>
      )}

      {error && (
        <ErrorMessage error={error} onRetry={generateRecommendations} />
      )}

      {recommendations && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">AI Suggestions</h3>
            <p className="text-blue-800">{recommendations.suggestions}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recommended Places</h3>
            <div className="grid gap-4">
              {recommendations.recommendedPlaces.map((place, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <h4 className="font-semibold text-lg">{place.placeName}</h4>
                  <p className="text-gray-600 mt-1">{place.description}</p>
                  {place.bestTimeToVisit && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">
                        Best Time to Visit:{" "}
                      </span>
                      <span className="text-sm text-gray-600">
                        {place.bestTimeToVisit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleProceed}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Proceed to Select Places & Activities
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
