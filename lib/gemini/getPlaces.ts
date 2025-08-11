// lib/ai/getPlaces.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { places } from "@/constants/PlacesData";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API key is not set in environment variables!");
}

// Init Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt to instruct Gemini
const SYSTEM_PROMPT = `
You are an expert travel planner API.
You will receive:
1. User trip data (country, dates, description).
2. A list of known places and activities (placeData).

Your job:
- Recommend 5–8 places for the trip.
- Pick the best options from both the user's request & provided placeData.
- Output ONLY valid JSON in this format:

{
  "places": [
    {
      "placeName": "string",
      "description": "string, 2–3 sentences max",
      "bestTimeToVisit": "string, concise"
    }
  ]
}
- Ensure descriptions are concise and engaging.
- Never include extra keys or text outside the JSON.
`;


export async function getPlaces(tripData: {
  country: string;
  startDate: string;
  endDate: string;
  description: string;
}) {
  try {
    const payload = {
      userTripData: tripData,
      availablePlaces: places,
    };

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: JSON.stringify(payload) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        responseMimeType: "application/json",
      },
      systemInstruction: {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
    });

    const text = result.response.text();

    // Validate JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Gemini returned invalid JSON.");
    }

    if (!parsed?.places || !Array.isArray(parsed.places)) {
      throw new Error(
        "Invalid format: 'places' array missing in Gemini response."
      );
    }

    return parsed;
  } catch (error: any) {
    console.error("🚨 Error generating places from Gemini:", error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
}
