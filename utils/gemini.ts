
import { GoogleGenAI, Chat } from "@google/genai";

// Define the API key directly as requested
const GEMINI_API_KEY = 'AIzaSyBWgS7G67Wn9BF4syOCk4SXnrHPo3yt-VM';

// Remove the process.env.API_KEY reference and warning, as the key is now hardcoded.

let aiInstance: GoogleGenAI | null = null;

// Initialize GoogleGenAI
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    if (!GEMINI_API_KEY) {
      // This case should ideally not be hit as GEMINI_API_KEY is hardcoded.
      // But it's good defensive programming.
      throw new Error("Gemini API Key is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiInstance;
}

// Initialize a new chat session
export function initChatSession(): Chat {
  const ai = getGenAI();
  const chat: Chat = ai.chats.create({
    model: 'gemini-3-flash-preview', // Using the recommended model for basic text tasks
    config: {
      systemInstruction: 'You are a helpful AI assistant for Zero Onne. Keep your responses concise and professional.',
    },
  });
  return chat;
}

// Send a message and get a streaming response
export async function sendMessageToGemini(chatSession: Chat, message: string) {
  if (!chatSession) {
    throw new Error("Chat session is not initialized.");
  }
  return chatSession.sendMessageStream({ message });
}