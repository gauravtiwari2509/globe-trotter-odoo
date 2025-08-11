"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const toast = {
  success: (message: string) => console.log("Success:", message),
  error: (message: string) => console.error("Error:", message),
};
const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-right w-5 h-5"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 rounded-2xl">
    <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Zod schema for form validation
const tripSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    country: z.string().min(1, "Country is required"),
    description: z.string().min(1, "Description is required"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"], // Show error under the endDate input
  });

type TripInput = z.infer<typeof tripSchema>;

// The main component, now styled for a light theme
export function CreateTripForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TripInput>({
    resolver: zodResolver(tripSchema),
  });

  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: TripInput) => {
    console.log("Form submitted with data:", data);
    setIsCreating(true);
    setMessage("");

    // Simulating an async API call with a delay
    try {
      console.log("Submitting form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Trip created successfully!");
      setMessage("Trip created successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to create trip. Please try again.");
      setMessage("Failed to create trip. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-white text-gray-900">
      {/* Light theme background with subtle blurred shapes */}
      <div className="absolute top-1/5 left-1/3 w-72 h-72 bg-orange-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-200/50 rounded-full blur-3xl"></div>

      {isCreating && <Loader />}

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl max-sm:text-xl font-bold text-orange-600">
            Create a New Trip
          </h2>
          {/* Subdued text for the subtitle */}
          <p className="text-sm text-gray-500">
            Fill out the details below to plan your next adventure
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-10">
            {/* Start Date */}
            <div>
              {/* Label color */}
              <label htmlFor="startDate" className="block text-sm mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                {...register("startDate")}
                // Input field styling for light theme
                className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                {...register("endDate")}
                // Input field styling for light theme
                className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              {...register("country")}
              // Input field styling for light theme
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              placeholder="Enter your country"
            />
            {errors.country && (
              <p className="text-red-600 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              // Textarea styling for light theme
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
              placeholder="Describe your trip..."
            ></textarea>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 cursor-pointer bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg"
          >
            {isCreating ? (
              "Creating..."
            ) : (
              <>
                <span>Lets build your itineary</span> <ArrowRight />
              </>
            )}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm font-semibold">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
