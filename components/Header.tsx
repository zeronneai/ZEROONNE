
import React, { useState, useRef, useEffect } from 'react';
import { WebDesignShowcase } from './WebDesignShowcase';
import { WebHostingShowcase } from './WebHostingShowcase';
import { AppDesignShowcase } from './AppDesignShowcase';
import { UiDesignShowcase } from './UiDesignShowcase';
import { UxShowcase } from './UxShowcase';
import { CustomSoftwareShowcase } from './CustomSoftwareShowcase';
import { AiVideoShowcase } from './AiVideoShowcase';
import { AiGraphicDesignShowcase } from './AiGraphicDesignShowcase';
import { AiImagesShowcase } from './AiImagesShowcase';
import { AiUpscalingShowcase } from './AiUpscalingShowcase';
import { AiCreativeStrategyShowcase } from './AiCreativeStrategyShowcase';
import { AiAutomationShowcase } from './AiAutomationShowcase';
import { AiEducationShowcase } from './AiEducationShowcase';
import { AiIntegrationShowcase } from './AiIntegrationShowcase';
import { AiInstallationShowcase } from './AiInstallationShowcase';
// Z01_LOGO_BASE64 import removed as the logo is no longer displayed here

interface HeaderProps {
  onStartProjectClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartProjectClick }) => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // States for all new service showcases
  const [showWebDesignShowcase, setShowWebDesignShowcase] = useState(false);
  const [showWebHostingShowcase, setShowWebHostingShowcase] = useState(false);
  const [showAppDesignShowcase, setShowAppDesignShowcase] = useState(false);
  const [showUiDesignShowcase, setShowUiDesignShowcase] = useState(false);
  const [showUxShowcase, setShowUxShowcase] = useState(false);
  const [showCustomSoftwareShowcase, setShowCustomSoftwareShowcase] = useState(false);
  const [showAiVideoShowcase, setShowAiVideoShowcase] = useState(false);
  const [showAiGraphicDesignShowcase, setShowAiGraphicDesignShowcase] = useState(false);
  const [showAiImagesShowcase, setShowAiImagesShowcase] = useState(false);
  const [showAiUpscalingShowcase, setShowAiUpscalingShowcase] = useState(false);
  const [showAiCreativeStrategyShowcase, setShowAiCreativeStrategyShowcase] = useState(false);
  const [showAiAutomationShowcase, setShowAiAutomationShowcase] = useState(false);
  const [showAiEducationShowcase, setShowAiEducationShowcase] = useState(false);
  const [showAiIntegrationShowcase, setShowAiIntegrationShowcase] = useState(false);
  const [showAiInstallationShowcase, setShowAiInstallationShowcase] = useState(false);

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(prev => !prev);
  };

  const handleServiceClick = (setShowcase: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShowcase(true);
    setIsServicesDropdownOpen(false); // Close dropdown when a service is clicked
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-30 py-4 px-4 md:py-8 md:px-16 flex flex-wrap items-center justify-between bg-zero-white gap-x-4 gap-y-2">
        {/* "Let’s build something exceptional" button */}
        <div className="flex-none"> {/* Simplified classes */}
          <button
            onClick={onStartProjectClick}
            className="text-zero-black text-sm md:text-lg tracking-wider font-medium hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 rounded-md p-2 border-2 border-zero-black animate-pulse-subtle w-full text-center sm:w-auto"
            aria-label="Let's build something exceptional with Zero Onne"
            role="button"
            tabIndex={0}
          >
            Let’s build something exceptional
          </button>
        </div>

        {/* ZERO ONNE text */}
        <div className="flex-auto text-center"> {/* Simplified classes to let flexbox manage */}
          <span className="text-zero-black text-xl md:text-2xl font-bold uppercase tracking-widest z-10 block">
            ZERO ONNE
          </span>
        </div>

        {/* Services dropdown */}
        <div className="flex-none"> {/* Simplified classes */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleServicesDropdown}
              className="flex items-center gap-1 text-base font-medium text-zero-black hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 rounded-md p-2 w-full justify-center sm:w-auto"
              aria-expanded={isServicesDropdownOpen}
              aria-haspopup="true"
              aria-label="Open services menu"
            >
              Services
              <svg
                className={`h-4 w-4 transform transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isServicesDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-zero-white border border-gray-200 rounded-lg shadow-lg py-2 z-40 max-h-96 overflow-y-auto custom-scrollbar">
                {/* Web Services */}
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500">Web</div>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowWebDesignShowcase)}>Web Design</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowWebHostingShowcase)}>Web Hosting</button>
                
                {/* App & UI/UX */}
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500">App & UI/UX</div>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAppDesignShowcase)}>App Design</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowUiDesignShowcase)}>UI Design</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowUxShowcase)}>UX Design</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowCustomSoftwareShowcase)}>Custom Software</button>

                {/* AI Services */}
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500">AI</div>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiVideoShowcase)}>AI Video</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiGraphicDesignShowcase)}>AI Graphic Design</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiImagesShowcase)}>AI Images</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiUpscalingShowcase)}>AI Upscaling</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiCreativeStrategyShowcase)}>AI Creative Strategy</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiAutomationShowcase)}>AI Automation</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiEducationShowcase)}>AI Education</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiIntegrationShowcase)}>AI Integration</button>
                <button className="block w-full text-left px-4 py-2 text-zero-black hover:bg-gray-100 transition-colors" onClick={() => handleServiceClick(setShowAiInstallationShowcase)}>AI Installation</button>
              </div>
            )}
          </div>
        </div>

        {/* Render all new service showcases */}
        <WebDesignShowcase isOpen={showWebDesignShowcase} onClose={() => setShowWebDesignShowcase(false)} />
        <WebHostingShowcase isOpen={showWebHostingShowcase} onClose={() => setShowWebHostingShowcase(false)} />
        <AppDesignShowcase isOpen={showAppDesignShowcase} onClose={() => setShowAppDesignShowcase(false)} />
        <UiDesignShowcase isOpen={showUiDesignShowcase} onClose={() => setShowUiDesignShowcase(false)} />
        <UxShowcase isOpen={showUxShowcase} onClose={() => setShowUxShowcase(false)} />
        <CustomSoftwareShowcase isOpen={showCustomSoftwareShowcase} onClose={() => setShowCustomSoftwareShowcase(false)} />
        <AiVideoShowcase isOpen={showAiVideoShowcase} onClose={() => setShowAiVideoShowcase(false)} />
        <AiGraphicDesignShowcase isOpen={showAiGraphicDesignShowcase} onClose={() => setShowAiGraphicDesignShowcase(false)} />
        <AiImagesShowcase isOpen={showAiImagesShowcase} onClose={() => setShowAiImagesShowcase(false)} />
        <AiUpscalingShowcase isOpen={showAiUpscalingShowcase} onClose={() => setShowAiUpscalingShowcase(false)} />
        <AiCreativeStrategyShowcase isOpen={showAiCreativeStrategyShowcase} onClose={() => setShowAiCreativeStrategyShowcase(false)} />
        <AiAutomationShowcase isOpen={showAiAutomationShowcase} onClose={() => setShowAiAutomationShowcase(false)} />
        <AiEducationShowcase isOpen={showAiEducationShowcase} onClose={() => setShowAiEducationShowcase(false)} />
        <AiIntegrationShowcase isOpen={showAiIntegrationShowcase} onClose={() => setShowAiIntegrationShowcase(false)} />
        <AiInstallationShowcase isOpen={showAiInstallationShowcase} onClose={() => setShowAiInstallationShowcase(false)} />
      </header>
      {/* The fixed 'Let’s build something exceptional' button has been moved into the header component. */}
    </>
  );
};