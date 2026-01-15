
import React, { useState } from 'react';
import { AboutShowcase } from './AboutShowcase';
import { LoadingLogoOverlay } from './LoadingLogoOverlay';

// Base64 encoded logo for the Hero section.
// This is a placeholder for an actual SVG or image.
export const Z01_LOGO_BASE64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMjggMEM1Ny4zMzU5IDAgMCA1Ny4zMzU5IDAgMTI4QzAgMTk4LjY2NCA1Ny4zMzU5IDI1NiAxMjggMjU2QzE5OC42NjQgMjU2IDI1NiAxOTguNjY0IDI1NiAxMjhDMjU2IDU3LjMzNTkgMTk4LjY2NCAwIDEyOCAwWk0xMjguMDk0IDEzMS45MzhDMTE5LjA2MyAxMzEuOTM4IDExMS42MjUgMTI2Ljk2OSAxMDYuNzUgMTIwLjc4MUwxMjIuNjg4IDEwNC43NUwxMjguMDk0IDExMC42MjVMMTU4LjM0NCA1NS42MjVIMTUyLjUxNkwxMjguMDk0IDkzLjI1TDk3LjM3NSAzOS42ODhIMTAzLjE4OEwxNTguMzQ0IDE0My41VjEyMy40MDZIMTcwLjU2M1YxNzEuMTI1TDE2NS4xNTYgMTY1LjI1TDE0Mi41OTQgMTQyLjI1TDEzNi43MTkgMTQ4LjA5NEMxNDEuNzUgMTUyLjI1IDE0NS43MTkgMTU3LjA2MyAxNDUuNzE5IDE2Mi41QzE0NUsuNzE5IDE3MC4yNSAxMzkuMDMxIDE3Ni44MiAxMzEuMTg4IDE3Ni44MkMxMjMuNTYzIDE3Ni44MiAxMTcuMDYzIDE3MC4zMTMgMTE3LjA2MyAxNjIuNTE3LjA2MyAxNTYuODc1IDEyMC45MzggMTUyLjA2MyAxMjUuODEzIDE0Ny41NDRM中です。wMC41OTQgMTQyLjI1TDk4LjE4OCAxNjUuMzQ0TDkzLjE1NiAxNzEuMTI1TDg2LjY0MSAxMjMuNDA2VjE0My41SDc0LjQzOEw3NC40MzggNTUuNjI1SDY2LjY3NUwxMjEuMDMxIDQ5LjguODQ0TDEyNi42MjUgMjU1LjYyNUwxMDQuMzc1IDEyMC43ODExMTEuNDY5IDEyNi44NzUgMTIwLjc1IDEzMS40MzggMTMxLjkzOFNM中です。wMC41OTQgMTQyLjI1TDk4LjE4OCAxNjUuMzQ0TDkzLjE1NiAxNzEuMTI1TDg2LjY0MSAxMjMuNDA2VjE0My41SDc0LjQzOEw3NC40MzggNTUuNjI1SDY2LjY3NUwxMjEuMDMxIDQ5LjguODQ0TDEyNi42MjUgMjU1LjYyNUwxMDQuMzc1IDEyMC43ODExMTEuNDY5IDEyNi44NzUgMTIwLjc1IDEzMS40MzggMTMxLjkzOFWiIgZmlsbD0iYmx1ZSIvPgo8L3N2Zz4`;


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
      className="relative w-full h-screen text-zero-white flex flex-col items-center justify-center p-6 md:p-16 overflow-hidden" 
      style={{ backgroundImage: 'linear-gradient(to bottom, #000000 95%, transparent 100%)' }} // Apply gradient directly here
    >
      {/* Background image with blur, opacity, and new animation */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center bg-contain opacity-10 blur-sm animate-drift-and-breathe"
        style={{ backgroundImage: `url(https://i.imgur.com/UMlpuw7.png)` }}
        aria-hidden="true"
      ></div>

      {/* Removed the separate gradient fade div as per new instruction */}

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
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 leading-normal animate-reveal-left-to-right" // Changed mb-8 to mb-16
          style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
        >
          EASY AI SOLUTIONS FOR BUSINESSES AND PROFESSIONALS
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-medium mb-24 leading-relaxed animate-subheading-appear"> {/* Changed mb-16 to mb-24 and leading-normal to leading-relaxed */}
          HUMAN VISION. EFFICIENT INTELLIGENCE
        </p>
        <p className="text-lg md:text-xl lg:text-2xl font-light mb-32 max-w-2xl mx-auto animate-subheading-appear leading-relaxed"> {/* Changed mb-20 to mb-32 */}
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