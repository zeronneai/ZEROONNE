import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import OnboardingModal, { ModalEntry } from './OnboardingModal';

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  navy:   '#1a3a4a',
  orange: '#f26419',
  yellow: '#f5b800',
  green:  '#8bbe6e',
  cream:  '#eae2b7',
};

// ── Float keyframes ───────────────────────────────────────────────────────────
const FLOAT_DATA: Record<number, { x: number[]; y: number[]; duration: number }> = {
  1: { x: [0,  6, -4, -8,  0], y: [0,  -8, -14,  -6,  0], duration: 4.2 },
  2: { x: [0, -7,  5,  9,  0], y: [0, -10, -16,  -5,  0], duration: 3.8 },
  3: { x: [0,  8,  3, -6,  0], y: [0,  -6, -12,  -8,  0], duration: 4.6 },
  4: { x: [0, -9, -5,  4,  0], y: [0,  -7, -15, -10,  0], duration: 3.5 },
  5: { x: [0,  7, -3, -8,  0], y: [0, -11, -17,  -7,  0], duration: 4.9 },
  6: { x: [0, -6,  7,  4,  0], y: [0,  -9, -13,  -5,  0], duration: 4.1 },
};

const BUBBLE_CSS = `
.bbl {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%; border-radius: 50%;
}
`;

// ── ExpandedCluster — two-view approach ───────────────────────────────────────
function ExpandedCluster({ service, onClose, onStart }: {
  service: typeof SERVICES[0];
  onClose: () => void;
  onStart: (name: string) => void;
}) {
  const angles = [-90, 30, 150]; // equilateral triangle: top, lower-right, lower-left
  const colors = [
    { bg: C.cream,  text: C.navy  },
    { bg: C.green,  text: C.navy  },
    { bg: C.orange, text: C.cream },
  ];

  return (
    <motion.div
      className="expanded-cluster"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* ── Central expanded bubble ── */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '45%', aspectRatio: '1 / 1',
            borderRadius: '50%',
            background: service.nodeBg, color: service.nodeText,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            padding: '7%',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '8%', right: '10%',
              background: 'transparent', border: 'none',
              color: service.nodeText, opacity: 0.45,
              fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: 4,
              fontFamily: 'inherit',
            }}
          >×</button>

          <p style={{
            fontSize: 'clamp(8px, 1vw, 10px)',
            fontWeight: 800, letterSpacing: '0.15em',
            textTransform: 'uppercase', opacity: 0.55,
            margin: 0, marginBottom: '5%',
          }}>
            {service.name}
          </p>

          <p style={{
            fontSize: 'clamp(10px, 1.25vw, 13px)',
            lineHeight: 1.5, fontWeight: 500,
            margin: 0, marginBottom: '7%', maxWidth: '95%',
          }}>
            {service.description}
          </p>

          <button
            onClick={() => onStart(service.name)}
            style={{
              background: C.orange, color: C.cream,
              border: 'none', borderRadius: 999,
              padding: 'clamp(7px, 1vw, 10px) clamp(16px, 2.5vw, 24px)',
              fontSize: 'clamp(9px, 1.1vw, 11px)',
              fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: "'Mulish', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(242,100,25,0.35)',
            }}
          >
            Get Started →
          </button>
        </motion.div>

        {/* ── 3 sub-bubbles in equilateral triangle ── */}
        {service.keyPoints.map((point, i) => {
          const rad = angles[i] * (Math.PI / 180);
          const dx  = Math.cos(rad) * 38; // 38% of container from center
          const dy  = Math.sin(rad) * 38;
          return (
            <motion.div
              key={`sub-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 + i * 0.08 }}
              style={{
                position: 'absolute',
                top:  `calc(50% + ${dy}%)`,
                left: `calc(50% + ${dx}%)`,
                transform: 'translate(-50%, -50%)',
                width: '22%', aspectRatio: '1 / 1',
                borderRadius: '50%',
                background: colors[i].bg, color: colors[i].text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '4%',
                fontSize: 'clamp(9px, 1.1vw, 11px)',
                fontFamily: "'Mulish', sans-serif",
                fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.02em',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                zIndex: 5,
              }}
            >
              {point}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

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

// ── Data ──────────────────────────────────────────────────────────────────────
const CENTER_LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778810517/replicame_ese_logo_sin_a%C3%B1adir_202605142001_xo3xpe.jpg';

const SERVICES = [
  { id: 1, label: 'AI\nIntegration',    name: 'AI Integration',       description: 'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',    nodeBg: C.green,  nodeText: C.navy,  floatIndex: 3, keyPoints: ['Custom API connections', 'Workflow automation',   'Zero rebuild needed']  },
  { id: 2, label: 'Content\nMarketing', name: 'AI Content Marketing', description: 'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',                       nodeBg: C.orange, nodeText: C.cream, floatIndex: 6, keyPoints: ['Multi-channel scaling',  'Brand-aligned voice',     'Daily output ready']    },
  { id: 3, label: 'AI Video\nAds',      name: 'AI Video Production',  description: 'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',                                     nodeBg: C.navy,   nodeText: C.cream, floatIndex: 5, keyPoints: ['Premium quality',        'Days not weeks',          'High conversion']       },
  { id: 4, label: 'Brand\nIdentity',    name: 'Brand Identity',       description: 'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',                      nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 4, keyPoints: ['Naming & positioning',  'Design systems',          'Built to last']         },
  { id: 5, label: 'Web\nPlatforms',     name: 'Web Platforms',        description: 'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',                              nodeBg: C.orange, nodeText: C.cream, floatIndex: 1, keyPoints: ['Conversion-optimized',  'Premium design',          'Built to scale']        },
  { id: 6, label: 'AI\nAutomation',     name: 'AI Automation',        description: 'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',                         nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 2, keyPoints: ['Custom workflows',       'Operations on autopilot', 'Focus on growth']       },
];

// Layout constants (orbit)
const D_RING_RADIUS = 175;
const D_BUBBLE      = 82;
const D_TOTAL       = D_RING_RADIUS * 2 + D_BUBBLE + 60;
const D_BUBBLE_FONT = 9.5;

const ORBIT_TRANSITION = { duration: 60, repeat: Infinity, ease: 'linear' } as const;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]           = useState<number | null>(null);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalEntry) return;
      const t = e.target as Element;
      if (active !== null && !t.closest('.expanded-cluster') && !t.closest('.service-node')) {
        setActive(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [active, modalEntry]);

  const isMobile      = windowWidth <= 768;
  const activeService = SERVICES.find(s => s.id === active) ?? null;
  const frozen        = active !== null;

  const containerSize  = isMobile ? Math.min(0.65 * windowWidth, 300) : D_TOTAL;
  const bubbleSize     = isMobile ? Math.max(52, Math.min(0.13 * windowWidth, 72)) : D_BUBBLE;
  const ringRadius     = isMobile ? containerSize / 2 - bubbleSize / 2 - 6 : D_RING_RADIUS;
  const bubbleFontSize = isMobile ? Math.max(7, Math.min(0.018 * windowWidth, 10)) : D_BUBBLE_FONT;
  const desktopScale   = isMobile ? 1 : Math.min(1, (windowWidth - 32) / D_TOTAL);

  const handleModalClose = () => { setModalEntry(null); setActive(null); };

  const handleBubbleClick = (e: React.MouseEvent<HTMLButtonElement>, svc: (typeof SERVICES)[0]) => {
    e.stopPropagation();
    if (active === svc.id) { setActive(null); return; }
    setActive(svc.id);
  };

  const closePopup        = () => setActive(null);
  const openModalFromPopup = (name: string) => { closePopup(); setModalEntry({ source: 'bubble', service: name }); };

  return (
    <>
      <style>{BUBBLE_CSS}</style>

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

        {/* ══ Block 2: Orbit stage ══ */}
        <div style={isMobile ? { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '65vw', maxWidth: '65vw', alignSelf: 'center', margin: 'auto 0' } : {}}>
          <div
            className="orbit-stage"
            style={{
              position: 'relative', width: containerSize, height: containerSize, flexShrink: 0,
              ...(!isMobile && desktopScale < 1 ? {
                transform: `scale(${desktopScale})`, transformOrigin: 'top center',
                marginBottom: -(D_TOTAL * (1 - desktopScale)),
              } : {}),
            }}
          >

            {/* ── VISTA A: Orbit (hidden when active) ── */}
            <motion.div
              animate={{
                opacity: frozen ? 0 : 1,
                scale:   frozen ? 0.85 : 1,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                pointerEvents: frozen ? 'none' : 'auto',
              }}
            >
              {/* Orbit path ring */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: (ringRadius + bubbleSize / 2) * 2, height: (ringRadius + bubbleSize / 2) * 2,
                transform: 'translate(-50%, -50%)', borderRadius: '50%',
                border: '1.5px dashed rgba(26,58,74,0.2)', pointerEvents: 'none',
              }} />

              {/* Single orbit rotator */}
              <motion.div
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformOrigin: 'center center' }}
                animate={{ rotate: 360 }}
                transition={ORBIT_TRANSITION}
              >
                {SERVICES.map((svc) => {
                  const angle = (360 / SERVICES.length) * SERVICES.indexOf(svc);
                  const rad   = (Math.PI / 180) * angle;
                  const cx    = Math.cos(rad) * ringRadius;
                  const cy    = Math.sin(rad) * ringRadius;
                  const float = FLOAT_DATA[svc.floatIndex];

                  return (
                    <motion.button
                      key={svc.id}
                      className="service-node"
                      onClick={(e) => handleBubbleClick(e, svc)}
                      style={{
                        position: 'absolute',
                        top:  `calc(50% - ${bubbleSize / 2}px + ${cy}px)`,
                        left: `calc(50% - ${bubbleSize / 2}px + ${cx}px)`,
                        width: bubbleSize, height: bubbleSize,
                        borderRadius: '50%', background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: 0, outline: 'none', overflow: 'visible',
                        zIndex: 1,
                      }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {/* Counter-rotation keeps labels upright */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={ORBIT_TRANSITION}
                        style={{ width: '100%', height: '100%' }}
                      >
                        {/* Float animation */}
                        <motion.div
                          animate={{ x: float.x, y: float.y }}
                          transition={{ duration: float.duration, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <span className="bbl" style={{
                            background: svc.nodeBg,
                            fontSize: `${bubbleFontSize}px`, fontWeight: 600,
                            color: svc.nodeText,
                            letterSpacing: '0.04em', textAlign: 'center',
                            textTransform: 'uppercase', lineHeight: 1.35, whiteSpace: 'pre-line',
                          }}>
                            {svc.label}
                          </span>
                        </motion.div>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Center logo */}
              <motion.a
                href="https://www.instagram.com/the.cocreativehub"
                target="_blank" rel="noopener noreferrer"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(110px, 26vw, 180px)', height: 'clamp(110px, 26vw, 180px)',
                  borderRadius: '50%', background: 'transparent', border: 'none', boxShadow: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, cursor: 'pointer', textDecoration: 'none',
                }}
                title="Follow us on Instagram"
              >
                <img src={CENTER_LOGO_URL} alt="Primo AI Studio"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', display: 'block' }} />
              </motion.a>
            </motion.div>

            {/* ── VISTA B: Expanded cluster ── */}
            <AnimatePresence>
              {frozen && activeService && (
                <ExpandedCluster
                  service={activeService}
                  onClose={closePopup}
                  onStart={openModalFromPopup}
                />
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ══ Block 3: Hint + Button ══ */}
        <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,58,74,0.4)', visibility: active ? 'hidden' : 'visible', lineHeight: 1 }}>
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
