"use client";

import { useState } from "react";

export default function Step1CreateForm({
  onNext,
}: {
  onNext: (tripData: any) => void;
}) {
  const [form, setForm] = useState({
    country: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Trip Details</h2>
      <input
        name="country"
        placeholder="Country"
        value={form.country}
        onChange={handleChange}
      />
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
      />
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Trip description"
        value={form.description}
        onChange={handleChange}
      />

      <button onClick={() => onNext(form)}>Next →</button>
    </div>
  );
}
