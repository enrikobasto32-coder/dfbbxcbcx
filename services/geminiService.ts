import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Resolve API key from Vite (browser) or Node env for dev/preview
const apiKey =
  (typeof import.meta !== "undefined" ? import.meta.env.VITE_API_KEY : undefined) ||
  (typeof process !== "undefined" ? (process as any).env?.API_KEY : undefined);

if (!apiKey) {
  throw new Error("Gemini API key missing. Set VITE_API_KEY in .env.local and restart dev server.");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// Constants for Model Configuration
const ANALYSIS_MODEL = 'gemini-3-pro-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';

export const analyzeReviews = async (reviews: string): Promise<AnalysisResult> => {
  // Define the schema for the structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: {
        type: Type.STRING,
        description: "A comprehensive executive summary of the reviews, highlighting key findings.",
      },
      actionItems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
        },
        description: "Top 3 actionable areas for improvement.",
      },
      sentimentTrend: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            score: { type: Type.NUMBER, description: "Sentiment score between -1 (negative) and 1 (positive)." },
            snippet: { type: Type.STRING, description: "A short text snippet representative of this data point." },
          },
        },
        description: "A chronological or sequential sentiment analysis of the reviews.",
      },
      keywords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            count: { type: Type.INTEGER },
            category: { type: Type.STRING, enum: ["praise", "complaint"] },
          },
        },
        description: "Most frequent keywords categorized as praise or complaint.",
      },
    },
    required: ["executiveSummary", "actionItems", "sentimentTrend", "keywords"],
  };

  try {
    const prompt = `
      Analyze the following batch of customer reviews.
      1. Generate a sentiment trend line over the sequence of reviews (simulate time if dates are missing).
      2. Identify the most frequent keywords for complaints and praises.
      3. Write a professional executive summary.
      4. List exactly 3 specific, actionable areas for improvement.

      Reviews:
      ${reviews.substring(0, 100000)} // Limit to avoid context window issues if extremely large, though 3-pro handles a lot.
    `;

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: {
          thinkingBudget: 32768, // Max thinking budget for deep analysis
        },
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const createChatSession = (contextData?: string) => {
  const systemInstruction = `
    You are Sentimo's AI assistant. You help users understand customer sentiment data.
    ${contextData ? `Here is the context of the reviews currently being analyzed: ${contextData.substring(0, 5000)}...` : ''}
    Answer questions about these reviews, sentiment analysis concepts, or general business advice.
    Be concise, professional, and helpful.
  `;

  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction,
    },
  });
};
