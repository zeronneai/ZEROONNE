
import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll'; // To keep consistency with other sections

interface EditorialTransitionProps {
  id: string;
}

export const EditorialTransition: React.FC<EditorialTransitionProps> = ({ id }) => {
  return (
    <section id={id} className="pt-16 pb-0 px-6 md:px-16 max-w-screen-xl mx-auto text-center">
      <AnimateOnScroll delay={0}> {/* Starts animating when it scrolls into view */}
        <p className="text-4xl md:text-5xl lg:text-6xl tracking-widest uppercase text-gray-500 font-bold mb-10">
          Our Methodology
        </p>
        <div className="w-16 h-px bg-gray-300 mx-auto mt-0" aria-hidden="true"></div>
      </AnimateOnScroll>
    </section>
  );
};
