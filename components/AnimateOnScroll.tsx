
import React, { useRef, useEffect, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  threshold?: number; // How much of the item needs to be visible to trigger
  delay?: number; // Delay before animation starts (in ms)
}

export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  threshold = 0.1, // 10% of the element visible
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a delay before setting isVisible to true
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            // Optionally, stop observing once it's visible if it should only animate once
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
      }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, [threshold, delay]);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};
