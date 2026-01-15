
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';

interface HowWeWorkProps {
  id: string;
}

export const HowWeWork: React.FC<HowWeWorkProps> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [dotPositions, setDotPositions] = useState<number[]>([]);
  const [isSectionInView, setIsSectionInView] = useState(false); // Tracks if the whole section is in view

  // Ref to hold the current activeStep value to avoid stale closures in callbacks
  const currentActiveStepRef = useRef(activeStep);
  useEffect(() => {
    currentActiveStepRef.current = activeStep;
  }, [activeStep]);

  const stepsContent = [
    {
      title: 'Strategy',
      description: 'We define objectives, conduct market research, and outline a tailored roadmap for your vision.',
    },
    {
      title: 'Build',
      description: 'Our team crafts, designs, and develops cutting-edge solutions with precision and innovation.',
    },
    {
      title: 'Launch',
      description: 'We deploy your project with meticulous care, ensuring a smooth and impactful market entry.',
    },
  ];

  // 1. Observer for the entire HowWeWork section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Consider visible if 10% is in view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // 2. Effect to dynamically calculate dot positions relative to the section
  // This should run once initially, then on window resize, and after a short delay for animations to settle.
  useEffect(() => {
    const calculatePositions = () => {
      if (sectionRef.current) {
        const newPositions: number[] = [];
        const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;

        stepRefs.forEach(ref => {
          if (ref.current) {
            // Calculate top position relative to the start of the section
            const elementTopRelativeToSection = (ref.current.getBoundingClientRect().top + window.scrollY) - sectionTop;
            newPositions.push(elementTopRelativeToSection);
          }
        });
        setDotPositions(newPositions);
      }
    };

    calculatePositions(); // Initial calculation
    const resizeObserver = new ResizeObserver(calculatePositions);
    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }
    // A small delay to ensure elements have rendered and taken their final positions after AnimateOnScroll
    const timeout = setTimeout(calculatePositions, 200);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeout);
    };
  }, [sectionRef.current]); // Depend on sectionRef.current to re-run if the section element itself changes (unlikely)


  // 3. Callback function to handle scroll and resize events for active step detection
  const handleScrollOrResize = useCallback(() => {
    if (!isSectionInView) {
      // If the section is not in view, ensure activeStep is null.
      if (currentActiveStepRef.current !== null) {
        setActiveStep(null);
      }
      return;
    }

    let newActiveStepIndex: number | null = null;
    const viewportMid = window.innerHeight * 0.4; // A custom threshold (40% from top of viewport)

    // Iterate through stepRefs to find the currently active step
    for (let i = 0; i < stepRefs.length; i++) {
      const ref = stepRefs[i];
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // A step is considered active if its top edge is at or above our custom viewportMid point
        // AND its bottom edge is still visible (meaning we haven't scrolled completely past it).
        // We take the *first* one that meets this criteria when scanning from top to bottom.
        if (rect.top <= viewportMid && rect.bottom > 0) {
          newActiveStepIndex = i;
          break; // Found the highest step whose top has crossed the 'active' line
        }
      }
    }

    // Special handling for the very top of the section (Strategy)
    // If no step explicitly crossed the 'viewportMid' line, but the section itself is visible
    // and its top is near or above the viewportMid, then default to 'Strategy' (index 0).
    if (newActiveStepIndex === null && sectionRef.current) {
      const sectionRect = sectionRef.current.getBoundingClientRect();
      if (sectionRect.top <= viewportMid && sectionRect.bottom > 0) {
        newActiveStepIndex = 0; // Default to Strategy
      }
    }

    // Update the state only if the new active step is different
    if (newActiveStepIndex !== null && newActiveStepIndex !== currentActiveStepRef.current) {
      setActiveStep(newActiveStepIndex);
    } else if (newActiveStepIndex === null && currentActiveStepRef.current !== null) {
        // This case can happen if we scroll very fast, or are between sections.
        // If the section is still visible, but no step is 'active' per the criteria,
        // and we are not completely off-screen, try to keep an active state or revert to 0 if at top.
        const sectionRect = sectionRef.current?.getBoundingClientRect();
        if (sectionRect && sectionRect.top <= viewportMid && sectionRect.bottom > 0) {
            if (currentActiveStepRef.current !== 0) { // If it's not already Strategy, try to set to 0.
                setActiveStep(0);
            }
        }
    }
  }, [isSectionInView, stepRefs, sectionRef]); // Dependencies for useCallback: stepRefs and sectionRef are stable

  // 4. Effect to attach and cleanup scroll/resize event listeners
  useEffect(() => {
    // When the section first comes into view, ensure Strategy is active
    if (isSectionInView && activeStep === null) {
        setActiveStep(0);
    }

    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    handleScrollOrResize(); // Initial check when section loads or becomes visible

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isSectionInView, handleScrollOrResize]); // isSectionInView and handleScrollOrResize are dependencies


  return (
    <section id={id} ref={sectionRef} className="py-32 px-6 md:px-16 max-w-screen-xl mx-auto relative">
      <AnimateOnScroll delay={0}>
        <div 
          className="text-3xl md:text-4xl lg:text-5xl tracking-widest uppercase mb-12 font-bold text-zero-black"
          style={{ textShadow: '0px 0px 8px rgba(0,0,0,0.1)' }}
        >
          How we work
        </div>
      </AnimateOnScroll>

      <div className="flex relative">
        {/* Scroll Indicator (visible on medium and larger screens) */}
        <div className="hidden md:block absolute left-0 w-8 pl-4 top-0 bottom-0">
          {/* Static gray vertical line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200"></div>

          {/* Dynamic black filling line */}
          {dotPositions.length > 0 && activeStep !== null && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-zero-black transition-all duration-500 ease-out`}
              style={{
                top: `${dotPositions[0]}px`, // Starts at the top of the first dot
                height: `${(dotPositions[activeStep] - dotPositions[0]) + 8}px`, // Extends to the center of the active dot (dot height 16px, so +8)
              }}
            ></div>
          )}

          {/* Dots for each step */}
          {dotPositions.map((top, index) => (
            <div
              key={index}
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center border-2 bg-zero-white transition-colors duration-300 ease-out"
              style={{
                top: `${top}px`,
                borderColor: activeStep !== null && index <= activeStep ? 'var(--zero-black)' : 'var(--gray-200)',
              }}
              aria-hidden="true"
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ease-out ${
                  activeStep !== null && index <= activeStep ? 'bg-zero-black' : 'bg-gray-200'
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Steps Content */}
        <div className="flex-1 md:ml-16 space-y-24 md:space-y-32">
          {stepsContent.map((step, index) => (
            <div key={index} ref={stepRefs[index]} className="relative">
              <AnimateOnScroll delay={index * 100 + 100}> {/* Staggered animation with slight delay */}
                <h3 className="text-3xl font-medium mb-4">{step.title}</h3>
                <p className="text-lg text-zero-accent max-w-2xl">{step.description}</p>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
      {/* NEW: Absolute positioned logo */}
      <img
        src="https://i.imgur.com/3NLb0nl.jpeg"
        alt="Zero Onne Logo"
        className="hidden md:block absolute right-0 md:right-16 top-1/2 -translate-y-1/2 w-auto h-auto max-w-[40%] max-h-[80vh] z-10"
        aria-hidden="true"
      />
    </section>
  );
};