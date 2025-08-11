"use client";

export default function Step4CreateTrip({
  tripData,
  selectedPlaces,
}: {
  tripData: any;
  selectedPlaces: any[];
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 4: Review & Create</h2>
      <p>
        <strong>Country:</strong> {tripData.country}
      </p>
      <p>
        <strong>Dates:</strong> {tripData.startDate} – {tripData.endDate}
      </p>
      <p>
        <strong>Description:</strong> {tripData.description}
      </p>
      <h3 className="mt-4 font-semibold">Selected Places:</h3>
      <ul>
        {selectedPlaces.map((p, i) => (
          <li key={i}>{p.placeName}</li>
        ))}
      </ul>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Create Trip
      </button>
    </div>
  );
}
