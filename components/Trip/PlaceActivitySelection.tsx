"use client";
import { places } from "@/constants/PlacesData";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ErrorMessage } from "../ui/ErrorMessage";
const placeData = places;
export const PlaceActivitySelection = ({
  recommendations,
  onCreateTrip,
  onBack,
}: {
  recommendations: Recommendations;
  onCreateTrip: (tripPlan: TripPlan) => void;
  onBack: () => void;
}) => {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [validationError, setValidationError] = useState("");

  const handlePlaceToggle = (placeId: string) => {
    setSelectedPlaces((prev) => {
      if (prev.includes(placeId)) {
        const newSelected = prev.filter((id) => id !== placeId);
        const newActivities = { ...selectedActivities };
        delete newActivities[placeId];
        setSelectedActivities(newActivities);
        return newSelected;
      } else {
        return [...prev, placeId];
      }
    });
    setValidationError("");
  };

  const handleActivityToggle = (placeId: string, activityId: string) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [placeId]: {
        ...prev[placeId],
        [activityId]: !prev[placeId]?.[activityId],
      },
    }));
  };

  const getPlaceFromData = (
    recommendedPlace: RecommendedPlace
  ): PlaceData | undefined => {
    let matchedPlace = placeData.find(
      (p) => p.name.toLowerCase() === recommendedPlace.placeName.toLowerCase()
    );

    if (!matchedPlace) {
      matchedPlace = placeData.find(
        (p) =>
          p.name
            .toLowerCase()
            .includes(recommendedPlace.placeName.toLowerCase()) ||
          recommendedPlace.placeName
            .toLowerCase()
            .includes(p.name.toLowerCase())
      );
    }
    // @ts-ignore
    return matchedPlace;
  };

  const handleCreateTrip = () => {
    if (selectedPlaces.length === 0) {
      setValidationError("Please select at least one place for your trip.");
      return;
    }

    const tripPlan: TripPlan = {
      // @ts-ignore
      places: selectedPlaces.map((placeId) => {
        const place = placeData.find((p) => p.id === placeId)!;
        const placeActivities = selectedActivities[placeId] || {};
        const selectedPlaceActivities = place.activities.filter(
          (activity) => placeActivities[activity.id]
        );

        return {
          ...place,
          selectedActivities: selectedPlaceActivities,
        };
      }),
    };

    onCreateTrip(tripPlan);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Places & Activities
        </h2>
        <p className="text-gray-600">
          Choose the places you want to visit and activities you'd like to do
        </p>
      </div>

      {validationError && <ErrorMessage error={validationError} />}

      <div className="space-y-6">
        {recommendations.recommendedPlaces.map((recPlace, index) => {
          const fullPlaceData = getPlaceFromData(recPlace);

          if (!fullPlaceData) {
            return (
              <div
                key={index}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {recPlace.placeName}
                </h3>
                <p className="text-gray-600 mb-2">{recPlace.description}</p>
                <p className="text-yellow-600 font-medium">
                  This place is not available in our database yet. We're working
                  to add more destinations!
                </p>
              </div>
            );
          }

          const isPlaceSelected = selectedPlaces.includes(fullPlaceData.id);

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {fullPlaceData.name}
                    </h3>
                    <p className="text-gray-600">
                      {fullPlaceData.meta.description}
                    </p>
                    <p className="text-sm text-orange-600 font-medium">
                      Best time to visit:{" "}
                      {fullPlaceData.meta.best_time_to_visit}
                    </p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isPlaceSelected}
                      onChange={() => handlePlaceToggle(fullPlaceData.id)}
                      className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 font-medium">Select Place</span>
                  </label>
                </div>

                {isPlaceSelected && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-lg mb-3">
                      Available Activities
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {fullPlaceData.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold">
                                {activity.title}
                              </h5>
                              <p className="text-gray-600 text-sm mt-1">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>⏱️ {activity.avgDurationMin} min</span>
                                <span>
                                  💰{" "}
                                  {activity.price === 0
                                    ? "Free"
                                    : `₹${activity.price}`}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {activity.type}
                                </span>
                              </div>
                              {activity.meta.traveler_tips && (
                                <p className="text-xs text-green-600 mt-2">
                                  💡 {activity.meta.traveler_tips}
                                </p>
                              )}
                            </div>
                            <label className="ml-4">
                              <input
                                type="checkbox"
                                checked={
                                  selectedActivities[fullPlaceData.id]?.[
                                    activity.id
                                  ] || false
                                }
                                onChange={() =>
                                  handleActivityToggle(
                                    fullPlaceData.id,
                                    activity.id
                                  )
                                }
                                className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        {selectedPlaces.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex-1 mx-4">
            <h3 className="font-semibold text-lg mb-1">Trip Summary</h3>
            <p className="text-gray-700">
              {selectedPlaces.length} place(s) selected with{" "}
              {Object.values(selectedActivities).reduce(
                (total, placeActivities) =>
                  total + Object.values(placeActivities).filter(Boolean).length,
                0
              )}{" "}
              activities
            </p>
          </div>
        )}
        <button
          onClick={handleCreateTrip}
          disabled={selectedPlaces.length === 0}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
        >
          Create My Trip
        </button>
      </div>
    </div>
  );
};
