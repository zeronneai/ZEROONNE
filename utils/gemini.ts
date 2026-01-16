
import { GoogleGenAI, Chat } from "@google/genai";

// Define the API key from environment variable as requested
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let aiInstance: GoogleGenAI | null = null;

// Initialize GoogleGenAI
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    if (!GEMINI_API_KEY) {
      // Throw a specific error that can be caught and handled friendly in the UI
      throw new Error("API_KEY_NOT_CONFIGURED_FRIENDLY_MESSAGE");
    }
    aiInstance = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiInstance;
}

// Initialize a new chat session
export function initChatSession(): Chat {
  const ai = getGenAI(); // This might throw if API key is not configured
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