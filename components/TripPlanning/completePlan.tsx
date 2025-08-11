"use client";

import { useState } from "react";
import Step1CreateForm from "./step1createForm";
import Step2AIRecommendation from "./step2AIRecommendation";
import Step3SelectPlaces from "./step3selectPlaces";
import Step4CreateTrip from "./step4createTrip";

export default function Stepper() {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState<any>(null);
  const [aiPlaces, setAiPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);

  return (
    <div className="max-w-xl mx-auto">
      {step === 1 && (
        <Step1CreateForm
          onNext={(data) => {
            setTripData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2AIRecommendation
          tripData={tripData}
          onNext={(places) => {
            setAiPlaces(places);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3SelectPlaces
          aiPlaces={aiPlaces}
          onNext={(selected) => {
            setSelectedPlaces(selected);
            setStep(4);
          }}
        />
      )}
      {step === 4 && (
        <Step4CreateTrip tripData={tripData} selectedPlaces={selectedPlaces} />
      )}
    </div>
  );
}
