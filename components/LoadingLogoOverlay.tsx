
import React from 'react';

interface LoadingLogoOverlayProps {
  isOpen: boolean;
  onAnimationComplete: () => void;
  logoBase64: string; // Pass the logo as a prop for reusability
}

export const LoadingLogoOverlay: React.FC<LoadingLogoOverlayProps> = ({
  isOpen,
  onAnimationComplete,
  logoBase64,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 transition-opacity duration-300 ease-out"
      aria-hidden={!isOpen}
    >
      <img
        src={logoBase64}
        alt="Zero Onne Logo"
        className="w-24 h-24 md:w-32 md:h-32 opacity-0 animate-logo-reveal filter invert" // 'filter invert' makes a white logo on black background
        onAnimationEnd={onAnimationComplete}
        aria-label="Zero Onne Logo Revealing"
      />
    </div>
  );
};
