// components/trip/TripCreation.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import {
  CreateTripRequest,
  createTripSchema,
  SelectedActivity,
  SelectedPlace,
  TripData,
} from "@/zodSchemas/tripCreation";
import LoaderWithText from "../LoaderWithText";
import { ErrorMessage } from "../ui/ErrorMessage";

// Types
interface TripPlan {
  places: Array<{
    id: string;
    name: string;
    meta: {
      description: string;
      theme: string;
      best_time_to_visit: string;
    };
    country: {
      name: string;
      code: string;
      currency: string;
    };
    selectedActivities: Array<{
      id: string;
      title: string;
      description: string;
      avgDurationMin: number;
      price: number;
      type: string;
    }>;
  }>;
}

interface CreatedTrip {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface TripCreationProps {
  tripPlan: TripPlan;
  tripData: TripData;
  onComplete: () => void;
  onBack: () => void;
}

export const TripCreation = ({
  tripPlan,
  tripData,
  onComplete,
  onBack,
}: TripCreationProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [createdTrip, setCreatedTrip] = useState<CreatedTrip | null>(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const createTripApi = async () => {
    setIsCreating(true);
    setError("");
    setValidationErrors([]);

    try {
      // Prepare the trip data according to the schema
      const tripTitle = `${
        tripData.country
      } Adventure - ${new Date().toLocaleDateString()}`;

      // Transform places to match the schema
      const transformedPlaces: SelectedPlace[] = tripPlan.places.map(
        (place, index) => ({
          cityId: place.id,
          name: place.name,
          order: index,
          arrival: tripData.startDate,
          departure: tripData.endDate,
          notes: `Exploring ${place.name} - ${place.meta.description}`,
          activities: place.selectedActivities.map(
            (activity): SelectedActivity => ({
              templateId: activity.id,
              title: activity.title,
              description: activity.description || "",
              durationMin: activity.avgDurationMin || 60,
              price: activity.price || 0,
              currency: place.country.currency || "USD",
            })
          ),
        })
      );

      const createTripPayload: CreateTripRequest = {
        title: tripTitle,
        description: tripData.description,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        privacy: "private",
        places: transformedPlaces,
      };

      console.log("Trip payload:", JSON.stringify(createTripPayload, null, 2));

      // Validate the payload
      const validationResult = createTripSchema.safeParse(createTripPayload);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(
          //@ts-ignore
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        setValidationErrors(errors);
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }

      const response = await fetch("/api/user/trip/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTripPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.validationErrors) {
          const errors = result.validationErrors.map(
            (err: any) => `${err.path.join(".")}: ${err.message}`
          );
          setValidationErrors(errors);
        }
        throw new Error(
          result.details || result.error || "Failed to create trip"
        );
      }

      setCreatedTrip(result.trip);
      setTripCreated(true);
    } catch (error: any) {
      console.error("Failed to create trip:", error);
      setError(error.message || "Failed to create trip. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Success view
  if (tripCreated && createdTrip) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Trip Created Successfully!
          </h2>
          <p className="text-green-700 mb-2">
            Your amazing {tripData.country} adventure is ready to go!
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-lg mb-2">Trip Details:</h3>
            <p>
              <strong>Title:</strong> {createdTrip.title}
            </p>
            <p>
              <strong>Status:</strong> {createdTrip.status}
            </p>
            <p>
              <strong>ID:</strong> {createdTrip.id}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                window.open(`/user/trips/all-trip`, "_blank")
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              View Trip
            </button>
            <button
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Create Another Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalPlaces = tripPlan.places.length;
  const totalActivities = tripPlan.places.reduce(
    (total, place) => total + place.selectedActivities.length,
    0
  );
  const estimatedCost = tripPlan.places.reduce(
    (total, place) =>
      total + place.selectedActivities.reduce((sum, act) => sum + act.price, 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Confirm Your Trip
        </h2>
        <p className="text-gray-600">
          Review your selections and create your trip
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <ErrorMessage error={error} onRetry={createTripApi} />
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 mr-2" />
            <div>
              <h4 className="font-semibold text-red-800 mb-2">
                Validation Errors:
              </h4>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Trip Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="font-medium">Destination:</span> {tripData.country}
          </div>
          <div>
            <span className="font-medium">Duration:</span>{" "}
            {new Date(tripData.startDate).toLocaleDateString()} to{" "}
            {new Date(tripData.endDate).toLocaleDateString()}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium">Description:</span>{" "}
            {tripData.description}
          </div>
        </div>

        {/* Trip Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Trip Summary:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded">
              <div className="text-2xl font-bold text-blue-600">
                {totalPlaces}
              </div>
              <div className="text-gray-600">Places to Visit</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-2xl font-bold text-green-600">
                {totalActivities}
              </div>
              <div className="text-gray-600">Activities Planned</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-2xl font-bold text-orange-600">
                ₹{estimatedCost}
              </div>
              <div className="text-gray-600">Estimated Cost</div>
            </div>
          </div>
        </div>

        {/* Places and Activities */}
        <h4 className="font-semibold text-lg mb-4">
          Selected Places & Activities
        </h4>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {tripPlan.places.map((place, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h5 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {place.name}
                <span className="text-sm text-gray-500 font-normal">
                  ({place.country.name})
                </span>
              </h5>
              <p className="text-gray-600 text-sm mb-3">
                {place.meta.description}
              </p>

              <div className="bg-gray-50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">
                    Activities ({place.selectedActivities.length})
                  </span>
                  <span className="text-xs text-gray-500">
                    Best time: {place.meta.best_time_to_visit}
                  </span>
                </div>

                {place.selectedActivities.length > 0 ? (
                  <div className="space-y-2">
                    {place.selectedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-start text-sm"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{activity.title}</span>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="text-xs text-gray-500">
                            {activity.avgDurationMin}min
                          </div>
                          <div className="font-medium text-sm">
                            {activity.price === 0
                              ? "Free"
                              : `₹${activity.price}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No activities selected
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-full transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50"
        >
          <ArrowLeft size={24} />
          Back to Selection
        </button>

        <button
          onClick={createTripApi}
          disabled={isCreating || totalActivities === 0}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Your Trip...
            </>
          ) : (
            "Create My Trip"
          )}
        </button>
      </div>

      {/* Disable button if no activities */}
      {totalActivities === 0 && (
        <p className="text-center text-sm text-red-500 mt-2">
          Please select at least one activity before creating your trip
        </p>
      )}

      {/* Loading Overlay */}
      {isCreating && (
        <LoaderWithText text="Creating your trip with all selected places and activities..." />
      )}
    </div>
  );
};
