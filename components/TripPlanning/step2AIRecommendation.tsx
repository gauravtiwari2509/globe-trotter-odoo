"use client";

import { useState } from "react";
import { getPlaces } from "@/lib/gemini/getPlaces";

export default function Step2AIRecommendation({
  tripData,
  onNext,
}: {
  tripData: any;
  onNext: (places: any[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAIPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPlaces(tripData);
      setPlaces(result.places);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: AI Recommendations</h2>
      <button onClick={fetchAIPlaces} disabled={loading}>
        {loading ? "Generating..." : "Get AI Recommendations"}
      </button>
      {error && <p className="text-red-500">{error}</p>}

      {places.length > 0 && (
        <div>
          <ul>
            {places.map((p, i) => (
              <li key={i}>
                <strong>{p.placeName}</strong> – {p.description} (Best:{" "}
                {p.bestTimeToVisit})
              </li>
            ))}
          </ul>
          <button onClick={() => onNext(places)}>Next →</button>
        </div>
      )}
    </div>
  );
}
