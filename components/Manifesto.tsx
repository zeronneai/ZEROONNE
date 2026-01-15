
import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';

interface ManifestoProps { // New interface for id prop
  id: string;
}

export const Manifesto: React.FC<ManifestoProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 px-6 md:px-16 max-w-screen-xl mx-auto">
      <AnimateOnScroll delay={0}>
        <div className="text-sm tracking-widest uppercase mb-12"></div>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <p className="text-3xl font-normal max-w-4xl tracking-tight">
          We believe simplicity is not the absence of complexity,
          but the result of precision.
        </p>
      </AnimateOnScroll>
    </section>
  );
};