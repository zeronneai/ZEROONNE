
import { GoogleGenAI, Chat } from "@google/genai";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY as per coding guidelines.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let aiInstance: GoogleGenAI | null = null;

// Initialize GoogleGenAI
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    // As per coding guidelines, the API key is assumed to be pre-configured, valid, and accessible.
    // The application must not ask the user for it under any circumstances, and it's a hard requirement.
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
