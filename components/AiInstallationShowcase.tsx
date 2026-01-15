
import React from 'react';

interface AiInstallationShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiInstallationShowcase: React.FC<AiInstallationShowcaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 p-4 transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-label="Description of AI Installation services"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-zero-white text-zero-black p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-showcase-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zero-black hover:text-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2 rounded-full p-1"
          aria-label="Close AI installation showcase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-medium mb-8">AI System Setup & Installation</h2>

        <div className="space-y-6">
          <p className="text-lg font-light text-zero-accent">
            We provide expert setup and installation services for AI systems, ensuring robust deployment and optimal performance. From configuring specialized hardware to deploying complex software environments, we handle the technical intricacies.
          </p>
          <p className="text-lg font-light text-zero-accent">
            Our service guarantees that your AI infrastructure is ready to empower your operations, integrating seamlessly into your existing technological landscape with minimal downtime.
          </p>
        </div>
      </div>
    </div>
  );
};
