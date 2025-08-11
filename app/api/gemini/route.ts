import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in your .env file!");
  process.exit(1);
}

// Initialize the GenAI client
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const systemInstructionForDM = "";

async function getPlaces(tripdata: any) {
  try {
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstructionForDM }],
      },
    });

    const result = await chat.sendMessageStream(tripdata);
    return result;
  } catch (error: any) {
    console.error("Error calling Gemini API to create trip:", error);
    throw new Error(
      `Gemini API error: ${
        error.message || "Error calling Gemini API while creating trip"
      }`
    );
  }
}

export default getPlaces;
