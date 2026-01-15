
import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  onAnimationEnd: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ onAnimationEnd }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Start the exit animation after a delay
    const animationDelay = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 1500); // Display for 1.5 seconds

    return () => clearTimeout(animationDelay);
  }, []);

  const handleAnimationEnd = () => {
    if (isAnimatingOut) {
      onAnimationEnd(); // Notify parent to remove from DOM
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-white transition-opacity duration-300 ease-out
        ${isAnimatingOut ? 'animate-loader-slide-down' : ''}
      `}
      onAnimationEnd={handleAnimationEnd}
      aria-hidden="true"
    >
      <div className="text-3xl tracking-widest font-medium opacity-0 animate-loader-text-appear">
        ZERO&nbsp;ONNE
      </div>
    </div>
  );
};
