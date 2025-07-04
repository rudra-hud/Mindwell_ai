
import { GoogleGenAI } from "@google/genai";
import { getAnalysisPrompt, getInsightsPrompt, getGoalRefinementPrompt, getDailyQuotePrompt } from '../constants';
import { GeminiAnalysis, JournalEntry, InsightsSummary, DailyQuote } from '../types';

// Initialize the GoogleGenAI client, assuming API_KEY is in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(text: string): T | null => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Original text from AI:", text);
        return null;
    }
}

export const getEmotionalAnalysis = async (userInput: string): Promise<GeminiAnalysis | null> => {
    try {
        const prompt = getAnalysisPrompt(userInput);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });
        
        const analysis = parseJsonResponse<GeminiAnalysis>(response.text);
        if (!analysis || !analysis.emotion || !analysis.response || !analysis.suggestions || !analysis.extractedKeywords) {
            console.error("Invalid analysis format from API. Received:", response.text);
            throw new Error("Invalid analysis format from API");
        }
        return analysis;
    } catch (error) {
        console.error("Error getting emotional analysis:", error);
        return null;
    }
};

export const getInsights = async (entries: JournalEntry[]): Promise<InsightsSummary | null> => {
    try {
        const entriesString = entries
            .map(e => `Date: ${new Date(e.timestamp).toLocaleDateString()}\nMood: ${e.mood}\nEntry: ${e.userContent}\nTags: ${e.activityTags.join(', ')}\n`)
            .join('---\n');
        
        const prompt = getInsightsPrompt(entriesString);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                temperature: 0.8,
            },
        });

        const summary = parseJsonResponse<InsightsSummary>(response.text);
        if(!summary || !summary.topTriggers || !summary.moodPatterns || !summary.positiveHighlight || !summary.actionableSuggestion) {
            console.error("Invalid insights format from API. Received:", response.text);
            throw new Error("Invalid insights format from API");
        }
        return summary;
    } catch (error) {
        console.error("Error getting weekly insights:", error);
        return null;
    }
};

export const getRefinedGoal = async (userInput: string): Promise<string | null> => {
    try {
        const prompt = getGoalRefinementPrompt(userInput);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });

        const result = parseJsonResponse<{ refinedGoal: string }>(response.text);
        if(!result || typeof result.refinedGoal !== 'string') {
            console.error("Invalid goal refinement format from API. Received:", response.text);
            throw new Error("Invalid goal refinement format from API");
        }
        return result.refinedGoal;
    } catch (error) {
        console.error("Error getting goal refinement:", error);
        return null;
    }
};

export const getDailyQuote = async (): Promise<DailyQuote | null> => {
    try {
        const prompt = getDailyQuotePrompt();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                temperature: 1,
            },
        });

        const result = parseJsonResponse<DailyQuote>(response.text);
        if(!result || typeof result.quote !== 'string' || typeof result.author !== 'string') {
            console.error("Invalid daily quote format from API. Received:", response.text);
            throw new Error("Invalid daily quote format from API");
        }
        return result;
    } catch (error) {
        console.error("Error getting daily quote:", error);
        return null;
    }
};