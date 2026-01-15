
import React from 'react';

interface ChatbotToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatbotToggle: React.FC<ChatbotToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-zero-black text-zero-white rounded-full shadow-lg flex items-center justify-center text-sm font-medium hover:bg-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 transition-colors"
    >
      {isOpen ? 'X' : 'Chat'}
    </button>
  );
};
