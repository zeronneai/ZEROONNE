
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Manifesto } from './components/Manifesto';
import { Cta } from './components/Cta';
import { Footer } from './components/Footer';
import { ChatbotToggle } from './components/ChatbotToggle';
import { Chatbot } from './components/Chatbot';
import { LoadingOverlay } from './components/LoadingOverlay'; 
import { HowWeWork } from './components/HowWeWork'; 
import { ContactForm } from './components/ContactForm'; 
import { WhyZeroOnne } from './components/WhyZeroOnne'; 
import { EditorialTransition } from './components/EditorialTransition'; // New import
// import { FloatingStartProjectButton } from './components/FloatingStartProjectButton'; // Removed import

// ScrollLine component import removed as requested

// SECTION_IDS array removed as it's no longer used by ScrollLine
const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true); 
  const [showContactForm, setShowContactForm] = useState(false); 

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {showLoadingOverlay && <LoadingOverlay onAnimationEnd={() => setShowLoadingOverlay(false)} />}
      
      {/* ScrollLine component rendering removed */}

      <Header onStartProjectClick={() => setShowContactForm(true)} />
      <main className="pt-24"> {/* Added padding to main to account for fixed header height */}
        <Hero id="hero-section" />
        <Services id="services-section" /> 
        {/* New Editorial Transition */}
        <EditorialTransition id="editorial-transition-section" /> {/* Insert here */}
        <HowWeWork id="how-we-work-section" />
        <WhyZeroOnne id="why-zero-onne-section" /> 
        {/* The "Start Your Project" button has been moved to the Header component */}
        <Manifesto id="manifesto-section" />
        <Cta id="cta-section" onStartProjectClick={() => setShowContactForm(true)} />
      </main>
      <Footer />
      <ChatbotToggle isOpen={isChatOpen} onToggle={toggleChat} />
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      {/* Render ContactForm globally */}
      <ContactForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} />
      {/* New: Floating "Start Project" button */}
      {/* <FloatingStartProjectButton onClick={() => setShowContactForm(true)} /> */}
    </div>
  );
};

export default App;