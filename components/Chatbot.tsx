
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, initChatSession } from '../utils/gemini';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any | null>(null); // To store the chat session
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session when component mounts or becomes visible
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = initChatSession();
      // Optionally add an initial greeting from the AI
      setMessages([{ id: 'welcome', text: 'Hello! How can I help you today?', sender: 'ai' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to the bottom of the chat history when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading || !chatSessionRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiLoadingMessageId = Date.now().toString() + '_loading';
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: aiLoadingMessageId, text: '...', sender: 'ai', isTyping: true },
    ]);

    try {
      let fullResponse = '';
      const stream = await sendMessageToGemini(chatSessionRef.current, input);

      for await (const chunk of stream) {
        const textChunk = chunk.text || '';
        fullResponse += textChunk;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiLoadingMessageId
              ? { ...msg, text: fullResponse, isTyping: true }
              : msg
          )
        );
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiLoadingMessageId
            ? { ...msg, isTyping: false } // Mark as not typing when stream completes
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiLoadingMessageId
            ? { ...msg, text: 'Error de configuración', isTyping: false } // Updated error message
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      className={`fixed z-40 bg-zero-white flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${
          isOpen
            ? 'bottom-0 left-0 right-0 top-0 lg:bottom-24 lg:right-8 lg:left-auto lg:top-auto lg:min-h-[600px] lg:max-h-[90vh] lg:w-96 lg:border lg:border-gray-300 lg:rounded-lg lg:shadow-xl'
            : 'w-0 h-0'
        }
      `}
      role="dialog"
      aria-hidden={!isOpen}
      aria-labelledby="chatbot-header"
    >
      {isOpen && (
        <>
          <div id="chatbot-header" className="flex justify-between items-center bg-zero-black text-zero-white p-4 rounded-t-lg">
            <h2 className="text-lg font-medium">Zero AI</h2>
            <button onClick={onClose} aria-label="Close chat" className="text-zero-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zero-white focus:ring-offset-2 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-zero-accent text-zero-white' : 'bg-gray-100 text-zero-black'
                  }`}
                >
                  {msg.text}
                  {msg.isTyping && <span className="animate-pulse">...</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow bg-zero-black text-zero-white border border-zero-black rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zero-accent"
              aria-label="Chat input"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-zero-black text-zero-white px-4 py-2 rounded-md hover:bg-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 transition-colors"
              disabled={isLoading || input.trim() === ''}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};