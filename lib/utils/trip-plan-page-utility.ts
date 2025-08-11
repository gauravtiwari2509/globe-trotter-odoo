import { TripData } from "@/zodSchemas/tripCreation";
import { getPlaces } from "../gemini/getPlaces";

export async function getPlacesRecommendations(
  tripData: TripData
): Promise<Recommendations> {
  try {
    const parsed = await getPlaces(tripData);

    if (!parsed.places || !Array.isArray(parsed.places)) {
      throw new Error("Invalid response format from Gemini.");
    }

    return {
      recommendedPlaces: parsed.places,
      suggestions: "AI-generated suggestions based on your trip details.",
    };
  } catch (error: any) {
    console.error("Error generating places from Gemini:", error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
}
