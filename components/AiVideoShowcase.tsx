
import React from 'react';

interface AiVideoShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiVideoShowcase: React.FC<AiVideoShowcaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 p-4 transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-label="Description of AI Video services"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-zero-white text-zero-black p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-showcase-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zero-black hover:text-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2 rounded-full p-1"
          aria-label="Close AI video showcase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-medium mb-8">AI Video Generation & Editing</h2>

        <div className="space-y-6">
          <p className="text-lg font-light text-zero-accent">
            Harness the power of AI to create stunning video content. We offer AI-driven solutions for generating captivating videos from text or images, as well as intelligent editing tools for post-production.
          </p>
          <p className="text-lg font-light text-zero-accent">
            From marketing campaigns to explainer videos, AI enhances creativity and accelerates production, allowing for rapid iteration and personalized content at scale.
          </p>
        </div>
      </div>
    </div>
  );
};
