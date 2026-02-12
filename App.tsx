import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, RevealProps } from './types';

// --- ANIMATION WRAPPER ---
const Reveal: React.FC<RevealProps> = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// --- COUNTER COMPONENT ---
const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1.5; // seconds
    const increment = target / (duration * 60);
    
    const handle = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(handle);
  }, [target]);

  return <span>{count}%</span>;
};

// --- GROWTH IMPACT SECTION COMPONENT ---
const GrowthImpactSection = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="py-40 px-8 relative z-10 flex items-center justify-center min-h-[500px]">
      <div className="max-w-4xl w-full text-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            // --- ESTADO PRE-CLICK ---
            <motion.div
              key="pre-click"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="cursor-pointer group"
              onClick={() => setRevealed(true)}
            >
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight mb-8">
                How much <span className="italic">growth</span> is your brand <br /> 
                sacrificing by ignoring AI?
              </h2>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block"
              >
                <button className="bg-white/5 border border-[#7000FF]/50 px-8 py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase group-hover:bg-[#7000FF] group-hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(112,0,255,0.2)]">
                  Click to reveal the gap
                </button>
              </motion.div>
            </motion.div>
          ) : (
            // --- ESTADO REVELADO (EL DATO) ---
            <motion.div
              key="post-click"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 text-[#7000FF] mb-6"
              >
                <span className="text-[10px] tracking-[0.5em] font-bold uppercase">The Advantage</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce">
                  <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <h3 className="text-[12vw] md:text-[10vw] font-black leading-none tracking-tighter text-white mb-6">
                <span className="text-[#7000FF]"><Counter target={45} /></span> FASTER
              </h3>
              
              <p className="text-xl md:text-2xl font-light opacity-60 max-w-2xl mx-auto">
                Companies integrating AI-driven creative strategies see an average 
                surge in digital authority within the first 12 months.
              </p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={(e) => { e.stopPropagation(); setRevealed(false); }}
                className="mt-12 text-[9px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
              >
                ← Back to question
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const services: Service[] = [
    { 
      id: '01', 
      title: 'AI STRATEGY', 
      desc: 'We architect the intelligent core of your business future.', 
      detail: 'From custom LLM integration to predictive analytics, we design the roadmap for your AI transformation.' 
    },
    { 
      id: '02', 
      title: 'LUXURY LANDINGS', 
      desc: 'High-conversion interfaces powered by cognitive psychology.', 
      detail: 'Our landing pages aren’t just beautiful; they use AI-driven heatmaps to ensure every pixel converts.' 
    },
    { 
      id: '03', 
      title: 'CREATIVE AUTOMATION', 
      desc: 'Scaling content production without losing human soul.', 
      detail: 'Custom diffusion models trained specifically on your brand’s visual DNA for infinite, consistent assets.' 
    }
  ];

  const servicesList = [
    "Web Design", "Web Hosting", "App Design", "UI Design", "UX", 
    "Custom Software", "AI Video", "AI Graphic Design", "AI Images", 
    "AI Upscaling", "AI Creative Strategy", "AI Automation", 
    "AI Education", "AI Integration", "AI Installation"
  ];

  const projects = [
    { 
      id: '01', 
      title: 'HOUSE OF KINGS', 
      category: 'Immersive Web Experience',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770931913/Remove_the_loose_4k_202602100841_ed1o70.jpg'
    },
    { 
      id: '02', 
      title: 'AMO CAFE', 
      category: 'Sensory Brand Identity',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770932056/Generate_this_image_4k_202602121532_oyxlid.jpg'
    },
    { 
      id: '03', 
      title: 'ALEXBOOTS', 
      category: 'High-Fidelity E-Commerce',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770931913/A_detailed_cinematic_4k_202602091405_lnlgb5.jpg'
    },
    { 
      id: '04', 
      title: 'THECOCREATIVE HUB', 
      category: 'Innovation Platform',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770932085/A_photorealistic_wide_4k_202602121534_zixtsc.jpg'
    }
  ];

  return (
    <div className="bg-[#000000] text-white font-sans selection:bg-[#7000FF] selection:text-white min-h-screen relative">
      
      {/* --- GLOBAL VIDEO BACKGROUND WITH FADE-IN --- */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}  
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }} 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
        >
          <source src="https://res.cloudinary.com/dsprn0ew4/video/upload/v1770924915/Generate_a_cinematic_1080p_202602121329_eiuxgx.mp4" type="video/mp4" />
        </video>
        {/* Overlay para asegurar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </motion.div>

      <div className="relative z-10">
        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-xl font-bold tracking-[0.3em] cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            ZERONNE<span className="text-[#7000FF]">.</span>
          </motion.div>
          
          {/* Botón de Pestaña de Servicios */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-[#7000FF] transition-all z-[101]"
          >
            {isMenuOpen ? "Close" : "Our Services +"}
          </button>

          <button 
            onClick={() => setIsContactOpen(true)}
            className="hidden md:block bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#7000FF] hover:text-white transition-all"
          >
            Contact
          </button>
        </nav>

        {/* --- DROPDOWN DE LOS 15 SERVICIOS (Centered Modal) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="w-full max-w-5xl bg-[#0A0A0A] p-8 md:p-12 rounded-[2rem] border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 shadow-2xl shadow-[#7000FF]/20 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {servicesList.map((service, index) => (
                  <button 
                    key={index}
                    onClick={() => { 
                      setSelectedService({
                          id: `EXP-${index + 1}`,
                          title: service, 
                          desc: "Specialized solution by Zeronne AI Studio.",
                          detail: "We harness the power of advanced artificial intelligence to deliver this service with maximizing efficiency and creativity. Contact us to discuss your bespoke requirements."
                      }); 
                      setIsMenuOpen(false); 
                    }}
                    className="text-left text-[11px] uppercase tracking-tighter opacity-60 hover:opacity-100 hover:text-[#7000FF] transition-all py-2 border-b border-white/5 pb-2"
                  >
                    {service}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CONTACT FORM MODAL --- */}
        <AnimatePresence>
          {isContactOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              onClick={() => setIsContactOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="relative w-full max-w-2xl bg-[#0A0A0A] p-8 md:p-16 rounded-[2rem] border border-white/10 shadow-2xl shadow-[#7000FF]/10"
                onClick={(e) => e.stopPropagation()}
              >
                 <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setIsContactOpen(false)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-3xl font-light tracking-tight mb-2">Start a <span className="text-[#7000FF]">Project</span></h3>
                  <p className="text-white/40 text-sm">Tell us about your vision. We will guide you from there.</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsContactOpen(false); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">Name</label>
                       <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">Project Name</label>
                       <input 
                        type="text" 
                        placeholder="Project Title" 
                        className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">Email</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">Project Description</label>
                    <textarea 
                      placeholder="Briefly describe your idea, goals, or requirements..." 
                      rows={4} 
                      className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light resize-none"
                    ></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#7000FF] hover:text-white transition-all duration-300"
                  >
                    Submit Proposal
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- HERO SECTION --- */}
        <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
          {/* Deep Glow Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7000FF]/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7000FF]/5 rounded-full blur-[150px]"></div>
          </div>

          <div className="z-10 text-center relative">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.2 }}
              className="text-[12px] tracking-[0.5em] uppercase mb-4 block"
            >
              Evolution is not optional
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter"
            >
              CRAFTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#7000FF]">INTELLIGENCE</span>
            </motion.h1>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1.5 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#7000FF] to-transparent mt-12 max-w-4xl mx-auto"
            />
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 15, 0] }}
            transition={{ 
              opacity: { delay: 1.5, duration: 1 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
            }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#7000FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- WORK / FEATURED (INFINITE CAROUSEL) --- */}
        <section id="work" className="py-20 border-b border-white/5 overflow-hidden">
           <div className="px-8 max-w-[1400px] mx-auto mb-12">
               <Reveal>
                   <div className="flex flex-col md:flex-row justify-between items-end">
                       <div>
                          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#7000FF] mb-4">Selected Work</h2>
                          <h3 className="text-4xl md:text-5xl font-light tracking-tight">Digital <span className="italic">Frontiers</span></h3>
                       </div>
                       <div className="hidden md:block text-[10px] tracking-widest opacity-40 uppercase">
                           2023 — 2025
                       </div>
                   </div>
               </Reveal>
           </div>
           
           <div className="relative w-full">
               {/* Gradients to fade edges */}
               <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
               <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

               <motion.div 
                  className="flex w-max"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                      duration: 30, 
                      ease: "linear", 
                      repeat: Infinity 
                  }}
               >
                   {[...projects, ...projects].map((project, index) => (
                       <div 
                           key={`${project.id}-${index}`} 
                           className="relative pr-8" // Use padding for spacing to avoid flex gap loop glitch
                       >
                           <div className="group relative w-[80vw] md:w-[40vw] aspect-video bg-[#080808] border border-white/5 rounded-2xl overflow-hidden cursor-pointer">
                               {/* Image Background */}
                               <img 
                                   src={project.image} 
                                   alt={project.title} 
                                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                               />
                               
                               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                               <div className="absolute bottom-0 left-0 p-8 z-20">
                                   <div className="text-[10px] text-[#7000FF] tracking-widest mb-2">CASE STUDY {project.id}</div>
                                   <div className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{project.title}</div>
                                   <div className="text-[10px] text-white/40 tracking-widest mt-2 uppercase">{project.category}</div>
                               </div>
                           </div>
                       </div>
                   ))}
               </motion.div>
           </div>
        </section>

        {/* --- SERVICES BENTO GRID --- */}
        <section id="services" className="py-32 px-8 max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#7000FF] mb-4">What we do</h2>
            <h3 className="text-4xl md:text-6xl font-light mb-20 tracking-tight">Our Core <span className="italic">Capabilities</span></h3>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ backgroundColor: "rgba(112, 0, 255, 0.03)" }}
                onClick={() => setSelectedService(service)}
                className="group p-10 border border-white/5 bg-[#080808] rounded-[2rem] cursor-pointer transition-all duration-500 hover:border-[#7000FF]/30 hover:shadow-[0_0_30px_rgba(112,0,255,0.05)]"
              >
                <div className="text-[#7000FF] font-mono mb-12 text-sm">{service.id}</div>
                <h4 className="text-2xl font-bold mb-6 tracking-tight group-hover:text-[#7000FF] transition-colors">{service.title}</h4>
                <p className="text-white/40 font-light leading-relaxed mb-10 text-sm md:text-base">{service.desc}</p>
                <div className="flex items-center gap-3 text-[10px] tracking-widest font-bold">
                  VIEW PROJECT <span className="w-8 h-[1px] bg-white group-hover:bg-[#7000FF] group-hover:w-12 transition-all"></span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- HOW WE WORK --- */}
        <section className="py-32 bg-white text-black rounded-[3rem] md:rounded-[4rem] relative z-10 mx-4 md:mx-8 mb-20">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-[10px] tracking-[0.5em] text-[#7000FF] mb-20 uppercase font-bold text-center">The Blueprint</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">STRATEGY</h4>
                <p className="opacity-70">Deep dive into your ecosystem to identify AI leverage points.</p>
              </div>
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">BUILD</h4>
                <p className="opacity-70">Agile development of your custom intelligent solution.</p>
              </div>
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">LAUNCH</h4>
                <p className="opacity-70">Deployment and continuous optimization for maximum ROI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHO WE WORK WITH (MARQUEE) --- */}
        <section className="py-24 border-t border-white/10 overflow-hidden relative z-10">
           <div className="relative w-full">
               <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

               <div className="flex whitespace-nowrap">
                 <motion.div 
                   animate={{ x: ["0%", "-50%"] }} 
                   transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                   className="flex"
                 >
                   {[1, 2].map((i) => (
                      <div key={i} className="flex gap-20 text-6xl md:text-8xl font-black opacity-20 pr-20 items-center">
                       <span>SMALL BUSINESS</span> <span>PERSONAL BRANDS</span> <span>GROWTH FIRMS</span> <span className="text-[#7000FF] opacity-100">EVERYONNE</span>
                     </div>
                   ))}
                 </motion.div>
               </div>
           </div>
        </section>

        {/* --- WHY ZERONNE (Interactive Growth Impact) --- */}
        <GrowthImpactSection />

        {/* --- AGENCY DEFINITION --- */}
        <section className="pb-32 px-8 text-center relative z-10">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-light max-w-5xl mx-auto leading-relaxed text-white/80">
              <span className="text-[#7000FF] font-bold">ZERO ONNE</span> is a next-gen <span className="text-[#7000FF] font-bold">AI agency</span> focused on <span className="text-[#7000FF] font-bold">creative</span> and <span className="text-[#7000FF] font-bold">workflow optimization</span>.
            </h3>
          </Reveal>
        </section>

        {/* --- MODAL SYSTEM --- */}
        <AnimatePresence>
          {selectedService && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-[#0A0A0A] p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] max-w-3xl w-full border border-white/10 relative overflow-hidden shadow-2xl shadow-[#7000FF]/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setSelectedService(null)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-[#7000FF] font-mono text-xs tracking-wider">Service Details</span>
                <h3 className="text-3xl md:text-5xl font-bold mt-4 mb-8 tracking-tight">{selectedService.title}</h3>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-12 font-light italic border-l-2 border-[#7000FF] pl-6">
                  "{selectedService.detail}"
                </p>
                <button 
                  onClick={() => { setSelectedService(null); setIsContactOpen(true); }}
                  className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#7000FF] hover:text-white transition-all duration-300"
                >
                  Enquire Now
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

     import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', vision: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // --- CONFIGURACIÓN ---
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYXP1v61GmER-YyYw8blra98IT4uhV8wMcGfAqGuDXmMrbBun3QxymELE-qcrEQnu2/exec";
    const WHATSAPP_NUMBER = "5216142857193"; // Tu número con código de país (ej. 521 para México)

    // 1. Enviar a Google Sheets (Silencioso)
    try {
      const formBody = new URLSearchParams();
      formBody.append('name', formData.name);
      formBody.append('email', formData.email);
      formBody.append('vision', formData.vision);

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necesario para Google Scripts
        body: formBody
      });
    } catch (error) {
      console.error("Error saving to sheets", error);
    }

    // 2. Preparar y abrir WhatsApp
    const message = `*NEW LEAD - ZERONNE*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Vision:* ${formData.vision}`;
    const whatsappUrl = `https://wa.me/${+5216142857193}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsSending(false);
    alert("Data secured and WhatsApp opening...");
  };

  return (
    <section id="contact" className="py-40 bg-[#0A0A0A] rounded-t-[4rem] z-10 relative">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black tracking-tighter mb-4 italic">CONNECT.</h2>
          <p className="opacity-40 uppercase tracking-[0.3em] text-[10px]">Direct line to the future</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <textarea 
            placeholder="What is your vision?" 
            rows="4" 
            required
            className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors"
            onChange={(e) => setFormData({...formData, vision: e.target.value})}
          ></textarea>
          
          <button 
            type="submit" 
            disabled={isSending}
            className="w-full bg-[#7000FF] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.5em] text-[10px] mt-10 hover:shadow-[0_0_50px_rgba(112,0,255,0.4)] transition-all"
          >
            {isSending ? "SYNCING..." : "INITIALIZE CONTACT"}
          </button>
        </form>
      </div>
    </section>
  );
}

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 p-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-black">
          <div className="text-[10px] tracking-[0.5em] font-bold opacity-30">ZERONNE © 2026</div>
          <div className="flex gap-8 text-[9px] tracking-widest uppercase opacity-40">
            <a href="https://instagram.com/zeronne.ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#7000FF] transition-colors">Instagram</a>
            <a href="https://www.facebook.com/zeronneai/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7000FF] transition-colors">Facebook</a>
            <a href="mailto:zeronne.ai@gmail.com" className="hover:text-[#7000FF] transition-colors">Email</a>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-light text-white/20 italic">Designed by AI. Built for Humans.</div>
        </footer>
      </div>
    </div>
  );
}
