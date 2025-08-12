import { z } from "zod";

// Base trip data schema
export const tripDataSchema = z
  .object({
    country: z.string().min(1, "Country is required"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),
    description: z.string().min(1, "Description is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Selected activity schema
export const selectedActivitySchema = z.object({
  templateId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  durationMin: z.number().optional(),
  price: z.number().optional(),
  currency: z.string().default("USD"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Selected place schema
export const selectedPlaceSchema = z.object({
  cityId: z.string(),
  name: z.string(),
  order: z.number(),
  arrival: z.string().optional(),
  departure: z.string().optional(),
  notes: z.string().optional(),
  activities: z.array(selectedActivitySchema),
});

// Create trip request schema
export const createTripSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),
    privacy: z.enum(["private", "public"]).default("private"),
    places: z
      .array(selectedPlaceSchema)
      .min(1, "At least one place is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// API response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const createTripResponseSchema = z.object({
  success: z.boolean(),
  trip: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    status: z.string(),
  }),
});

// Type exports
export type TripData = z.infer<typeof tripDataSchema>;
export type SelectedActivity = z.infer<typeof selectedActivitySchema>;
export type SelectedPlace = z.infer<typeof selectedPlaceSchema>;
export type CreateTripRequest = z.infer<typeof createTripSchema>;
export type CreateTripResponse = z.infer<typeof createTripResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
