
import { GoogleGenAI, Chat } from "@google/genai";

// Ensure the API key is available from environment variables
// In a real application, you might use a server-side proxy to protect your API key.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not defined. Please ensure process.env.API_KEY is set for Gemini API interaction.");
}

let aiInstance: GoogleGenAI | null = null;

// Initialize GoogleGenAI
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    if (!API_KEY) {
      throw new Error("Gemini API Key is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
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
