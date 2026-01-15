
import React from 'react';

interface DigitalShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalShowcase: React.FC<DigitalShowcaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 p-4 transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-label="Examples of Digital Experiences work"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-zero-white text-zero-black p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-showcase-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zero-black hover:text-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2 rounded-full p-1"
          aria-label="Close digital experiences showcase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-medium mb-8">Our Work in Digital Experiences</h2>

        <div className="space-y-6">
          <p className="text-lg font-light text-zero-accent">
            We craft immersive and impactful digital experiences, from intuitive landing pages and sophisticated web interfaces to comprehensive online platforms. Our focus is on seamless user journeys, engaging aesthetics, and robust functionality that converts curiosity into connection.
          </p>
          <p className="text-lg font-light text-zero-accent">
            Every digital touchpoint is designed with precision, ensuring that your brand's presence online is not just visible, but truly resonant. We combine strategic design with modern development practices to create digital assets that perform beautifully across all devices.
          </p>
          <ul className="list-disc list-inside text-zero-accent pl-4 space-y-2">
            <li>High-conversion landing pages</li>
            <li>Intuitive user interfaces (UI) and user experience (UX) design</li>
            <li>Interactive web applications</li>
            <li>Comprehensive digital brand presence development</li>
          </ul>
        </div>
        <p className="mt-8 text-sm text-center text-gray-600">
          Transform your digital footprint into an unforgettable experience.
        </p>
      </div>
    </div>
  );
};
