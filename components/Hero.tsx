
import React, { useState } from 'react';
import { AboutShowcase } from './AboutShowcase';
import { LoadingLogoOverlay } from './LoadingLogoOverlay';

// Base64 encoded logo for the Hero section.
// This is a placeholder for an actual SVG or image.
export const Z01_LOGO_BASE64 = `https://i.imgur.com/SxbMJyB.png`;


interface HeroProps { 
  id: string;
}

export const Hero: React.FC<HeroProps> = ({ id }) => { 
  const [showAboutShowcase, setShowAboutShowcase] = useState(false);
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);

  const handleOpenAbout = () => {
    setShowLogoAnimation(true);
  };

  const handleLogoAnimationComplete = () => {
    setShowLogoAnimation(false);
    setShowAboutShowcase(true);
  };

  return (
    <section 
      id={id} 
      className="relative w-full h-screen text-zero-white flex flex-col items-center justify-center p-6 md:p-16 overflow-hidden bg-zero-black"
    >
      {/* MP4 Video Background */}
      <video
        src="https://i.imgur.com/pYqMHMF.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        title="Zero Onne Background Video"
      />

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 w-full h-full bg-zero-black opacity-70 z-10 hidden sm:block" aria-hidden="true"></div>

      <div className="relative z-20 text-center max-w-4xl">
        {/* Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] max-w-full rounded-full bg-white/5 blur-3xl z-0 animate-glow-pulse"
          aria-hidden="true"
        ></div>

        {/* New text added here */}
        <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest mb-10 animate-creative-studio-appear">
          CREATIVE AND AGENTIC AI STUDIO
        </p>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 leading-normal animate-reveal-left-to-right"
          style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
        >
          EASY AI SOLUTIONS FOR BUSINESSES AND PROFESSIONALS
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-medium mb-24 leading-relaxed animate-subheading-appear">
          HUMAN VISION. EFFICIENT INTELLIGENCE
        </p>
        <p className="text-lg md:text-xl lg:text-2xl font-light mb-32 max-w-2xl mx-auto animate-subheading-appear leading-relaxed">
          ZERO ONNE is a next-gen AI agency focused on creative and workflow optimization
        </p>
        <button
          onClick={handleOpenAbout}
          className="bg-zero-white text-zero-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-zero-white focus:ring-offset-2 transition-colors animate-pulse-subtle"
          aria-label="Learn more about Zero Onne"
        >
          About Zero Onne
        </button>
      </div>

      <AboutShowcase isOpen={showAboutShowcase} onClose={() => setShowAboutShowcase(false)} />
      <LoadingLogoOverlay 
        isOpen={showLogoAnimation} 
        onAnimationComplete={handleLogoAnimationComplete} 
        logoBase64={Z01_LOGO_BASE64} 
      />
    </section>
  );
};