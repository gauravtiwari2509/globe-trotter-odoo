"use client";

import { useState } from "react";

import type { TripData } from "@/zodSchemas/tripCreation";
import { TripInputForm } from "./TripInputForm";
import { AIRecommendations } from "./AiRecommendation";
import { PlaceActivitySelection } from "./PlaceActivitySelection";
import { TripCreation } from "./TripCreation";

// Step 0: Trip Input Form Component

// Step 1: AI Recommendations Component (unchanged from original)

// Step 2: Place and Activity Selection Component (enhanced with validation)

// Main TripPlan Component (unchanged)
export function TripPlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [recommendations, setRecommendations] =
    useState<Recommendations | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const handleTripDataProceed = (data: TripData) => {
    setTripData(data);
    setCurrentStep(1);
  };

  const handleRecommendationsProceed = (
    recommendationData: Recommendations
  ) => {
    setRecommendations(recommendationData);
    setCurrentStep(2);
  };

  const handleCreateTrip = (plan: TripPlan) => {
    setTripPlan(plan);
    setCurrentStep(3);
  };

  const handleTripComplete = () => {
    setCurrentStep(0);
    setTripData(null);
    setRecommendations(null);
    setTripPlan(null);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {currentStep > 0 && currentStep < 4 && (
        <div className="bg-white shadow-sm py-4">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-24 h-1 mx-4 ${
                        currentStep > step ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>AI Recommendations</span>
              <span>Select Places</span>
              <span>Create Trip</span>
            </div>
          </div>
        </div>
      )}

      <div className={currentStep === 0 ? "" : "py-8"}>
        {currentStep === 0 && (
          <TripInputForm onProceed={handleTripDataProceed} />
        )}

        {currentStep === 1 && tripData && (
          <AIRecommendations
            tripData={tripData}
            onProceed={handleRecommendationsProceed}
            onBack={handleBack}
          />
        )}

        {currentStep === 2 && recommendations && (
          <PlaceActivitySelection
            recommendations={recommendations}
            onCreateTrip={handleCreateTrip}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && tripPlan && tripData && (
          <TripCreation
            tripPlan={tripPlan}
            tripData={tripData}
            onComplete={handleTripComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <TripPlan />;
}