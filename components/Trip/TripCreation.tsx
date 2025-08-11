"use client"
import { CreateTripRequest, createTripSchema, SelectedActivity, SelectedPlace, TripData } from "@/zodSchemas/tripCreation";
import LoaderWithText from "../LoaderWithText";
import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ErrorMessage } from "../ui/ErrorMessage";

export const TripCreation = ({
  tripPlan,
  tripData,
  onComplete,
  onBack,
}: {
  tripPlan: TripPlan;
  tripData: TripData;
  onComplete: () => void;
  onBack: () => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [createdTrip, setCreatedTrip] = useState<any>(null);
  const [error, setError] = useState("");

  const createTripApi = async () => {
    setIsCreating(true);
    setError("");

    try {
      // Prepare the trip data according to the schema
      const tripTitle = `${tripData.country} Adventure`;

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
              description: activity.description,
              durationMin: activity.avgDurationMin,
              price: activity.price,
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

      // Validate the payload
      const validationResult = createTripSchema.safeParse(createTripPayload);
      if (!validationResult.success) {
        throw new Error(
          `Validation failed: ${validationResult.error.errors
            .map((e) => e.message)
            .join(", ")}`
        );
      }

      //todo: update with axios and react querry
      const response = await fetch("/api/user/trip/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTripPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to create trip"
        );
      }

      const result = await response.json();

      setCreatedTrip(result.trip);
      setTripCreated(true);
    } catch (error: any) {
      console.error("Failed to create trip:", error);
      setError(error.message || "Failed to create trip. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

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
                window.open(`/trips/${createdTrip.slug}`, "_blank")
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

      {error && <ErrorMessage error={error} onRetry={createTripApi} />}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="font-medium">Destination:</span> {tripData.country}
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

        <h4 className="font-semibold text-lg mb-4">
          Selected Places & Activities ({tripPlan.places.length} places)
        </h4>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {tripPlan.places.map((place, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h5 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {place.name}
              </h5>
              <p className="text-gray-600 text-sm">{place.meta.description}</p>
              <div className="mt-2">
                <span className="font-medium text-sm">
                  Selected Activities ({place.selectedActivities.length}):
                </span>
                {place.selectedActivities.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {place.selectedActivities.map((activity) => (
                      <li key={activity.id} className="flex justify-between">
                        <span>{activity.title}</span>
                        <span className="text-xs text-gray-500">
                          {activity.avgDurationMin}min •{" "}
                          {activity.price === 0 ? "Free" : `₹${activity.price}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No activities selected
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Trip Summary:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Places:</span>{" "}
              {tripPlan.places.length}
            </div>
            <div>
              <span className="font-medium">Activities:</span>{" "}
              {tripPlan.places.reduce(
                (total, place) => total + place.selectedActivities.length,
                0
              )}
            </div>
            <div>
              <span className="font-medium">Est. Cost:</span> ₹
              {tripPlan.places.reduce(
                (total, place) =>
                  total +
                  place.selectedActivities.reduce(
                    (sum, act) => sum + act.price,
                    0
                  ),
                0
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-12 rounded-full transition-colors flex items-center gap-2 text-lg disabled:opacity-50"
        >
          <ArrowLeft size={24} />
          Back
        </button>
        <button
          onClick={createTripApi}
          disabled={isCreating}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full transition-colors disabled:opacity-50 text-lg flex items-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Your Trip...
            </>
          ) : (
            "Create Trip"
          )}
        </button>
      </div>

      {isCreating && (
        <LoaderWithText text="Creating your trip with all selected places and activities..." />
      )}
    </div>
  );
};
