
import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';

interface CtaProps { 
  id: string;
  onStartProjectClick: () => void; // Add prop for button click handler
}

export const Cta: React.FC<CtaProps> = ({ id, onStartProjectClick }) => {
  return (
    <section id={id} className="py-40 px-6 md:px-16 bg-zero-black text-zero-white">
      <AnimateOnScroll delay={0}>
        <div className="flex flex-col items-center gap-y-8"> {/* Changed to always flex-col, added items-center and gap-y-8 */}
          <h2 className="text-4xl md:text-[6vw] lg:text-7xl font-medium text-center"> {/* Removed mb-8 md:mb-0, added text-center */}
            Let’s build<br />what’s next.
          </h2>
          <button
            onClick={onStartProjectClick}
            className="bg-zero-white text-zero-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-200 hover:ring-2 hover:ring-zero-white hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-zero-white focus:ring-offset-2 transition-colors animate-pulse-subtle"
            aria-label="Start a project with Zero Onne"
          >
            Start a project
          </button>
        </div>
      </AnimateOnScroll>
    </section>
  );
};