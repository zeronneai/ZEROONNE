
import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';

interface WhyZeroOnneProps { // New interface for id prop
  id: string;
}

export const WhyZeroOnne: React.FC<WhyZeroOnneProps> = ({ id }) => {
  return (
    <section id={id} className="py-40 px-6 md:px-16 bg-zero-black text-zero-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <AnimateOnScroll delay={0} threshold={0.1}>
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-24 md:mb-32 text-gray-400">Why Zero Onne</h2>
        </AnimateOnScroll>

        {/* Statement 1 */}
        <AnimateOnScroll delay={200} threshold={0.1}>
          <p className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-16 md:mb-24">
            Speed without shortcuts
          </p>
        </AnimateOnScroll>

        {/* Statement 2 */}
        <AnimateOnScroll delay={400} threshold={0.1}>
          <p className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-16 md:mb-24">
            Design over templates
          </p>
        </AnimateOnScroll>

        {/* Statement 3 */}
        <AnimateOnScroll delay={600} threshold={0.1}>
          <p className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Systems, not content
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};