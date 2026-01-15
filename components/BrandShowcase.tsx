
import React from 'react';

interface BrandShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const clientExamples = [
  { name: 'HOUSE OF KINGS', instagramHandle: 'HOUSEOFKINGSEP' },
  { name: 'KISSLAB', instagramHandle: 'KISSLAB.US' },
  { name: 'ALEXBOOTS', instagramHandle: 'ALEXBOOTSCOMPANY' },
  { name: 'CHINGON CUHT\'S', instagramHandle: 'CHINGONCUHTS' },
  { name: 'RANCHERS BOOT CO', instagramHandle: null }, // No Instagram handle provided for this one
];

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Render nothing if not open

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 p-4 transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-label="Examples of Brand Systems work"
      // Basic overlay click to close, ensure it doesn't close on content clicks
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-zero-white text-zero-black p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-showcase-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zero-black hover:text-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2 rounded-full p-1"
          aria-label="Close brand showcase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-medium mb-8">Our Work in Brand Systems</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientExamples.map((client, index) => (
            client.instagramHandle ? (
              <a
                key={index}
                href={`https://www.instagram.com/${client.instagramHandle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-4 rounded-md text-lg font-light text-center flex items-center justify-center min-h-[100px] border border-gray-200 cursor-pointer hover:bg-gray-200 hover:text-zero-black transition-colors focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2"
                aria-label={`View ${client.name} on Instagram`}
              >
                {client.name}
              </a>
            ) : (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-md text-lg font-light text-center flex items-center justify-center min-h-[100px] border border-gray-200"
              >
                {client.name}
              </div>
            )
          ))}
        </div>
        <p className="mt-8 text-sm text-center text-gray-600">
          This is a selection of our branding clients. More case studies available upon request.
        </p>
      </div>
    </div>
  );
};