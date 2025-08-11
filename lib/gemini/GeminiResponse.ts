import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// const API_KEY = process.env.GEMINI_API_KEY;
// if (!API_KEY) {
//   console.error("GEMINI_API_KEY is not set in your .env file!");
//   process.exit(1);
// }

const genAI = new GoogleGenerativeAI("AIzaSyAfx8LdHK8QG2EWZkgzd4C7C25HxhQXpYE");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getPlacesInstruction =
  'You are an expert travel planner and API. Your task is to generate a JSON response based on a user\'s travel request. The JSON must contain a single key, \'places\', which holds an array of objects. Each object in the \'places\' array must have three keys: \'placeName\' (string), \'description\' (string), and \'bestTimeToVisit\' (string). The \'placeName\' should be the name of a place to visit. The \'description\' should be a concise and engaging summary of the place, no more than 2-3 sentences. The \'bestTimeToVisit\' should be a short, direct recommendation. Consider the user\'s country, dates, and tour description to suggest relevant places. Provide the complete JSON object and no other text. A valid response example would be: { "places": [ { "placeName": "Kyoto", "description": "A city known for its beautiful temples, serene gardens, geishas, and traditional wooden houses. It\'s a journey back in time to ancient Japan.", "bestTimeToVisit": "Spring or Autumn" }, { "placeName": "Tokyo", "description": "A bustling metropolis that seamlessly blends traditional culture with futuristic technology. Visit ancient shrines and neon-lit skyscrapers in one day.", "bestTimeToVisit": "Avoid rainy season" } ] }';

/**
 * Calls the Gemini API to get travel recommendations based on user input.
 * @param {object} tripData - An object containing country, start/end dates, and a tour description.
 * @returns {Promise<any>} A promise that resolves to the generated JSON content.
 */
async function getPlaces(tripData: any) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: JSON.stringify(tripData) }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
      systemInstruction: {
        role: "user",
        parts: [{ text: getPlacesInstruction }],
      },
    });

    const jsonResponse = result.response.text();
    return jsonResponse;
  } catch (error: any) {
    console.error("Error calling Gemini API to create trip:", error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
}

const createTripInstruction =
  'You are an expert travel planner. Your task is to create a day-wise itinerary in a specific JSON format. The user will provide a list of relevant places and activities from a database, along with their preferences (budget, duration, etc.). Your JSON response must be a single object with a \'trip\' key, which contains an array of objects. Each object in the array represents a day and must have a \'day\' (number), \'date\' (string, e.g., \'Day 1: October 26, 2025\'), and \'activities\' (array of strings) key. Use the provided data to suggest a logical sequence of activities. Ensure the itinerary is concise, practical, and fits the user\'s specified duration and budget. A valid JSON response example would be: { "trip": [ { "day": 1, "date": "Day 1: October 26, 2025", "activities": [ "Morning: Arrive and check into hotel.", "Afternoon: Visit the National Museum.", "Evening: Dinner at a local bistro." ] }, { "day": 2, "date": "Day 2: October 27, 2025", "activities": [ "Morning: Explore the city\'s historic market.", "Afternoon: Enjoy a cooking class.", "Evening: Attend a theater performance." ] } ] }';

/**
 * Creates a day-wise travel itinerary using the Gemini API based on user preferences.
 * @param {object[]} largeSetOfDataFromDB - An array of all possible places and activities.
 * @param {object} userEnteredData - An object with user preferences (places, activities, budget, duration).
 * @returns {Promise<string>} A promise that resolves to the generated JSON content.
 */
async function createTrip(largeSetOfDataFromDB: any[], userEnteredData: any) {
  try {
    const relevantData = largeSetOfDataFromDB.filter(
      (item) =>
        userEnteredData.places.includes(item.placeName) ||
        userEnteredData.activities.includes(item.activityName)
    );

    const fullPrompt = `${createTripInstruction} Database Data: ${JSON.stringify(
      relevantData
    )} User Preferences: ${JSON.stringify(
      userEnteredData
    )} Generate the day-wise itinerary in JSON format as per the instructions above.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    const jsonResponse = result.response.text();
    return jsonResponse;
  } catch (error: any) {
    console.error("Error calling Gemini API to create trip:", error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
}

export { getPlaces, createTrip };
