import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import OnboardingModal, { ModalEntry } from './OnboardingModal';
import PrimoOrbit from './src/components/PrimoOrbit';

const C = {
  navy:   '#1a3a4a',
  orange: '#f26419',
  cream:  '#eae2b7',
};

const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778787182/Logo__pr___icon___mo_____pr__and_202605141259_ydscgi.jpg';

// ── Magnetic Button ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 100, stiffness: 400 };

function MagneticButton({ children, distance = 0.55 }: { children: React.ReactNode; distance?: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_CONFIG); const sy = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      if (hovered) { x.set((e.clientX - cx) * distance); y.set((e.clientY - cy) * distance); }
      else { x.set(0); y.set(0); }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [hovered, distance, x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [modalEntry, setModalEntry]   = useState<ModalEntry | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = windowWidth <= 768;

  const openModalFromPopup = (serviceName: string) =>
    setModalEntry({ source: 'bubble', service: serviceName });

  const handleModalClose = () => setModalEntry(null);

  return (
    <>
      <div style={{
        ...(isMobile
          ? { height: '100svh', padding: '16px 20px 24px', justifyContent: 'space-between' }
          : { minHeight: '100vh', padding: '24px 16px', justifyContent: 'center', gap: 0 }),
        backgroundImage: `url('${isMobile
          ? 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778613216/Genera_esta_misma_imagen_pero_202605121305_zeudsg.jpg'
          : 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778608740/Background_image_for_website_or_202605121158_cfvxcq.jpg'
        }')`,
        backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: "'Mulish', -apple-system, sans-serif", boxSizing: 'border-box',
      }}>

        {/* ══ Block 1: Heading ══ */}
        <div style={{ flexShrink: 0, textAlign: 'center', marginTop: 0, marginBottom: isMobile ? 0 : 20, maxWidth: 640, padding: '0 16px' }}>
          <p style={{ margin: '0 0 14px', fontFamily: "'Mulish', -apple-system, sans-serif", fontSize: 'clamp(32px, 5.5vw, 54px)', fontWeight: 800, color: C.navy, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            AI, but make it{' '}<span style={{ fontStyle: 'italic', color: C.orange }}>human.</span>
          </p>
          <p style={{ margin: '0 auto', fontFamily: "'Mulish', -apple-system, sans-serif", fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 400, color: C.navy, opacity: 0.65, lineHeight: 1.55, maxWidth: 580 }}>
            AI is everywhere. We cut through the noise — the right tools, the right setup, and a partner who genuinely wants you to win.
          </p>
        </div>

        {/* ══ Block 2: Orbit ══ */}
        <div style={isMobile
          ? { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '8px 0' }
          : { width: '100%', maxWidth: 680, padding: '0 20px' }
        }>
          <PrimoOrbit
            onStartForm={openModalFromPopup}
            logoUrl={LOGO_URL}
          />
        </div>

        {/* ══ Block 3: Hint + Button ══ */}
        <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,58,74,0.4)', lineHeight: 1 }}>
            Tap a service to explore
          </p>
          <MagneticButton>
            <motion.button
              onClick={() => setModalEntry({ source: 'getstarted' })}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: isMobile ? '11px 28px' : '16px 44px', borderRadius: 999,
                background: C.orange, color: C.cream, fontSize: 13, fontWeight: 800,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                boxShadow: '0 4px 24px rgba(242,100,25,0.40)',
                cursor: 'pointer', userSelect: 'none', border: 'none',
                fontFamily: "'Mulish', -apple-system, sans-serif",
              }}
              whileHover={{ background: C.navy, color: C.cream, boxShadow: '0 8px 36px rgba(26,58,74,0.40)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Get Started
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 2 }}>
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </MagneticButton>
        </div>

      </div>

      <OnboardingModal entry={modalEntry} onClose={handleModalClose} />
    </>
  );
}
