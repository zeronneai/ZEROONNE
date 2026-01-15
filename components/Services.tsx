
import React, { useState } from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { BrandShowcase } from './BrandShowcase';
import { CreativeShowcase } from './CreativeShowcase'; // Import new showcase
import { DigitalShowcase } from './DigitalShowcase'; // Import new showcase

interface ServiceItemProps {
  title: string;
  description: string;
  onClick?: () => void;
  isClickable?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, description, onClick, isClickable }) => {
  const baseClasses = "service p-6 border border-gray-200 rounded-lg";
  const clickableClasses = "cursor-pointer hover:bg-gray-50 transition-colors";

  return (
    <div
      className={`${baseClasses} ${isClickable ? clickableClasses : ''}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Learn more about ${title}` : undefined}
    >
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-base text-zero-accent">{description}</p>
    </div>
  );
};

interface ServicesProps { // New interface for id prop
  id: string;
}

export const Services: React.FC<ServicesProps> = ({ id }) => {
  const [showBrandShowcase, setShowBrandShowcase] = useState(false);
  const [showCreativeShowcase, setShowCreativeShowcase] = useState(false); // New state for Creative Tech
  const [showDigitalShowcase, setShowDigitalShowcase] = useState(false);   // New state for Digital Exp

  return (
    <section id={id} className="py-32 px-6 md:px-16 max-w-screen-xl mx-auto">
      <AnimateOnScroll delay={0}>
        <div 
          className="text-3xl md:text-4xl lg:text-5xl tracking-widest uppercase mb-12 font-bold text-zero-black"
          style={{ textShadow: '0px 0px 8px rgba(0,0,0,0.1)' }}
        >
          What we do
        </div>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <ServiceItem
            title="Brand Systems"
            description="Visual identities, symbols and scalable brand architectures."
            onClick={() => setShowBrandShowcase(true)}
            isClickable={true}
          />
          <ServiceItem
            title="Creative Technology"
            description="AI-driven content, automation and intelligent workflows."
            onClick={() => setShowCreativeShowcase(true)} // Make clickable
            isClickable={true}
          />
          <ServiceItem
            title="Digital Experiences"
            description="Landing pages, interfaces and high-impact digital presence."
            onClick={() => setShowDigitalShowcase(true)} // Make clickable
            isClickable={true}
          />
        </div>
      </AnimateOnScroll>

      <BrandShowcase isOpen={showBrandShowcase} onClose={() => setShowBrandShowcase(false)} />
      <CreativeShowcase isOpen={showCreativeShowcase} onClose={() => setShowCreativeShowcase(false)} />
      <DigitalShowcase isOpen={showDigitalShowcase} onClose={() => setShowDigitalShowcase(false)} />
    </section>
  );
};