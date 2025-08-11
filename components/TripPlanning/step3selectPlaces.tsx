"use client";

import { useState } from "react";

export default function Step3SelectPlaces({
  aiPlaces,
  onNext,
}: {
  aiPlaces: any[];
  onNext: (selected: any[]) => void;
}) {
  const [selected, setSelected] = useState<any[]>([]);

  const togglePlace = (place: any) => {
    setSelected((prev) =>
      prev.some((p) => p.placeName === place.placeName)
        ? prev.filter((p) => p.placeName !== place.placeName)
        : [...prev, place]
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 3: Select Places</h2>
      {aiPlaces.map((p, i) => (
        <div
          key={i}
          onClick={() => togglePlace(p)}
          className={`border p-2 cursor-pointer ${
            selected.includes(p) ? "bg-blue-100" : ""
          }`}
        >
          <strong>{p.placeName}</strong> – {p.description}
        </div>
      ))}
      <button onClick={() => onNext(selected)}>Next →</button>
    </div>
  );
}
