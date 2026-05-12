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

// ── CSS keyframes — floating bubble animations ────────────────────────────────
// Inner span handles float transform; outer motion.button handles rotation (no conflict)
const BREATHE_CSS = `
@keyframes float-1 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  25%  { transform: translate(6px,  -8px)  scale(1.03); }
  50%  { transform: translate(-4px, -14px) scale(1); }
  75%  { transform: translate(-8px, -6px)  scale(0.97); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@keyframes float-2 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  25%  { transform: translate(-7px, -10px) scale(0.97); }
  50%  { transform: translate(5px,  -16px) scale(1.03); }
  75%  { transform: translate(9px,  -5px)  scale(1); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@keyframes float-3 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  20%  { transform: translate(8px,  -6px)  scale(1.02); }
  50%  { transform: translate(3px,  -12px) scale(0.98); }
  80%  { transform: translate(-6px, -8px)  scale(1.02); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@keyframes float-4 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  30%  { transform: translate(-9px, -7px)  scale(1.03); }
  60%  { transform: translate(-5px, -15px) scale(0.97); }
  80%  { transform: translate(4px,  -10px) scale(1); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@keyframes float-5 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  25%  { transform: translate(7px,  -11px) scale(0.98); }
  55%  { transform: translate(-3px, -17px) scale(1.03); }
  75%  { transform: translate(-8px, -7px)  scale(1); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@keyframes float-6 {
  0%   { transform: translate(0px,   0px)  scale(1); }
  35%  { transform: translate(-6px, -9px)  scale(1.02); }
  65%  { transform: translate(7px,  -13px) scale(0.98); }
  85%  { transform: translate(4px,  -5px)  scale(1.01); }
  100% { transform: translate(0px,   0px)  scale(1); }
}
@media (max-width: 768px) {
  @keyframes float-1 {
    0%   { transform: translate(0px,  0px) scale(1); }
    25%  { transform: translate(3px, -4px) scale(1.03); }
    50%  { transform: translate(-2px,-7px) scale(1); }
    75%  { transform: translate(-4px,-3px) scale(0.97); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
  @keyframes float-2 {
    0%   { transform: translate(0px,  0px) scale(1); }
    25%  { transform: translate(-4px,-5px) scale(0.97); }
    50%  { transform: translate(3px, -8px) scale(1.03); }
    75%  { transform: translate(5px, -3px) scale(1); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
  @keyframes float-3 {
    0%   { transform: translate(0px,  0px) scale(1); }
    20%  { transform: translate(4px, -3px) scale(1.02); }
    50%  { transform: translate(2px, -6px) scale(0.98); }
    80%  { transform: translate(-3px,-4px) scale(1.02); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
  @keyframes float-4 {
    0%   { transform: translate(0px,  0px) scale(1); }
    30%  { transform: translate(-5px,-4px) scale(1.03); }
    60%  { transform: translate(-3px,-8px) scale(0.97); }
    80%  { transform: translate(2px, -5px) scale(1); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
  @keyframes float-5 {
    0%   { transform: translate(0px,  0px) scale(1); }
    25%  { transform: translate(4px, -6px) scale(0.98); }
    55%  { transform: translate(-2px,-9px) scale(1.03); }
    75%  { transform: translate(-4px,-4px) scale(1); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
  @keyframes float-6 {
    0%   { transform: translate(0px,  0px) scale(1); }
    35%  { transform: translate(-3px,-5px) scale(1.02); }
    65%  { transform: translate(4px, -7px) scale(0.98); }
    85%  { transform: translate(2px, -3px) scale(1.01); }
    100% { transform: translate(0px,  0px) scale(1); }
  }
}
.bbl { display:flex; align-items:center; justify-content:center; width:100%; height:100%; border-radius:50%; transition: transform 0.2s ease; }
.bbl-f1 { animation: float-1 4.2s ease-in-out infinite; }
.bbl-f2 { animation: float-2 3.8s ease-in-out infinite; }
.bbl-f3 { animation: float-3 4.6s ease-in-out infinite; }
.bbl-f4 { animation: float-4 3.5s ease-in-out infinite; }
.bbl-f5 { animation: float-5 4.9s ease-in-out infinite; }
.bbl-f6 { animation: float-6 4.1s ease-in-out infinite; }
.bbl:hover, .bbl-active { animation-play-state: paused !important; transform: translate(0,0) scale(1.1) !important; }
`;

// ── Magnetic Button ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 100, stiffness: 400 };

function MagneticButton({
  children,
  distance = 0.55,
}: {
  children: React.ReactNode;
  distance?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_CONFIG);
  const sy = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (hovered) {
        x.set((e.clientX - cx) * distance);
        y.set((e.clientY - cy) * distance);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [hovered, distance, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778360725/ChatGPT_Image_May_9_2026_03_04_56_PM_hdfdcd.png';

const SERVICES = [
  {
    id: 1,
    label: 'AI\nIntegration',
    name: 'AI Integration',
    description:
      'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',
    nodeBg: C.green,
    nodeText: C.navy,
    floatIndex: 3,
  },
  {
    id: 2,
    label: 'Content\nMarketing',
    name: 'AI Content Marketing',
    description:
      'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',
    nodeBg: C.orange,
    nodeText: C.cream,
    floatIndex: 6,
  },
  {
    id: 3,
    label: 'AI Video\nAds',
    name: 'AI Video Production',
    description:
      'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',
    nodeBg: C.navy,
    nodeText: C.cream,
    floatIndex: 5,
  },
  {
    id: 4,
    label: 'Brand\nIdentity',
    name: 'Brand Identity',
    description:
      'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',
    nodeBg: C.yellow,
    nodeText: C.navy,
    floatIndex: 4,
  },
  {
    id: 5,
    label: 'Web\nPlatforms',
    name: 'Web Platforms',
    description:
      'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',
    nodeBg: C.orange,
    nodeText: C.cream,
    floatIndex: 1,
  },
  {
    id: 6,
    label: 'AI\nAutomation',
    name: 'AI Automation',
    description:
      'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',
    nodeBg: C.yellow,
    nodeText: C.navy,
    floatIndex: 2,
  },
];

// Desktop constants
const D_RING_RADIUS = 175;
const D_BUBBLE = 82;
const D_CENTER = 165;
const D_TOTAL = D_RING_RADIUS * 2 + D_BUBBLE + 60;
const D_BUBBLE_FONT = 9.5;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<number | null>(null);
  const [modalEntry, setModalEntry] = useState<ModalEntry | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Clear active bubble when clicking outside (modal handles its own close)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalEntry) return;
      const target = e.target as Element;
      if (!target.closest('.service-node')) setActive(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [modalEntry]);

  const isMobile = windowWidth <= 768;

  const handleModalClose = () => {
    setModalEntry(null);
    setActive(null);
  };

  const containerSize = isMobile
    ? Math.min(0.65 * windowWidth, 300)
    : D_TOTAL;

  const bubbleSize = isMobile
    ? Math.max(52, Math.min(0.13 * windowWidth, 72))
    : D_BUBBLE;

  const centerSize = isMobile
    ? Math.max(70, Math.min(0.18 * windowWidth, 95))
    : D_CENTER;

  const ringRadius = isMobile
    ? containerSize / 2 - bubbleSize / 2 - 6
    : D_RING_RADIUS;

  const bubbleFontSize = isMobile
    ? Math.max(7, Math.min(0.018 * windowWidth, 10))
    : D_BUBBLE_FONT;

  const desktopScale = isMobile ? 1 : Math.min(1, (windowWidth - 32) / D_TOTAL);

  // ── Bubble click → opens modal in Flujo A ────────────────────────────────
  const handleBubbleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    svc: (typeof SERVICES)[0],
  ) => {
    e.stopPropagation();
    if (active === svc.id) {
      setActive(null);
      setModalEntry(null);
      return;
    }
    setActive(svc.id);
    setModalEntry({ source: 'bubble', service: svc.name });
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject breathing keyframes once */}
      <style>{BREATHE_CSS}</style>

      <div
        style={{
          ...(isMobile
            ? { height: '100svh', padding: '16px 20px 24px', justifyContent: 'space-between' }
            : { minHeight: '100vh', padding: '24px 16px', justifyContent: 'center', gap: 0 }
          ),
          backgroundImage: `url('${isMobile
            ? 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778613216/Genera_esta_misma_imagen_pero_202605121305_zeudsg.jpg'
            : 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778608740/Background_image_for_website_or_202605121158_cfvxcq.jpg'
          }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: "'Nunito', 'Inter', sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* ══ Block 1: Heading ══ */}
        <div style={{
          flexShrink: 0,
          textAlign: 'center',
          marginTop: 0,
          marginBottom: isMobile ? 0 : 20,
          maxWidth: isMobile ? '90vw' : 420,
          padding: '0 4px',
        }}>
          <p style={{
            margin: 0,
            fontSize: isMobile ? 'clamp(18px, 5vw, 24px)' : 28,
            fontWeight: 700,
            color: C.navy,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}>
            Best time to adapt AI is now.
          </p>
          <p style={{
            margin: '4px 0 0',
            fontSize: isMobile ? 13 : 16,
            fontWeight: 400,
            color: `rgba(26, 58, 74, 0.6)`,
            lineHeight: 1.5,
          }}>
            We make it simple to use and easy to understand.
          </p>
        </div>

        {/* ══ Block 2: Orbit ══ */}
        <div style={{
          ...(isMobile ? {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '65vw',
            maxWidth: '65vw',
            alignSelf: 'center',
            margin: 'auto 0',
          } : {}),
        }}>
          <div
            style={{
              position: 'relative',
              width: containerSize,
              height: containerSize,
              flexShrink: 0,
              ...(!isMobile && desktopScale < 1 ? {
                transform: `scale(${desktopScale})`,
                transformOrigin: 'top center',
                marginBottom: -(D_TOTAL * (1 - desktopScale)),
              } : {}),
            }}
          >
            {/* Orbit path */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: (ringRadius + bubbleSize / 2) * 2,
                height: (ringRadius + bubbleSize / 2) * 2,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `1.5px dashed rgba(26, 58, 74, 0.2)`,
                pointerEvents: 'none',
              }}
            />

            {/* Spinning ring */}
            <motion.div
              style={{ position: 'absolute', inset: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            >
              {SERVICES.map((svc) => {
                const angle = (360 / SERVICES.length) * SERVICES.indexOf(svc);
                const rad = (Math.PI / 180) * angle;
                const cx = Math.cos(rad) * ringRadius;
                const cy = Math.sin(rad) * ringRadius;
                const isActive = active === svc.id;

                return (
                  // Outer button: only handles position + counter-rotation + click
                  <motion.button
                    key={svc.id}
                    className="service-node"
                    onClick={(e) => handleBubbleClick(e, svc)}
                    style={{
                      position: 'absolute',
                      top: `calc(50% - ${bubbleSize / 2}px + ${cy}px)`,
                      left: `calc(50% - ${bubbleSize / 2}px + ${cx}px)`,
                      width: bubbleSize,
                      height: bubbleSize,
                      borderRadius: '50%',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                    whileTap={{ scale: 0.94 }}
                  >
                    {/* Inner span: visual + float animation (independent transform layer) */}
                    <span
                      className={`bbl bbl-f${svc.floatIndex}${isActive ? ' bbl-active' : ''}`}
                      style={{
                        background: svc.nodeBg,
                        fontSize: `${bubbleFontSize}px`,
                        fontWeight: 600,
                        color: svc.nodeText,
                        letterSpacing: '0.04em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        lineHeight: 1.35,
                        whiteSpace: 'pre-line',
                        ...(isActive ? {
                          boxShadow: `0 0 0 3px ${C.navy}, 0 8px 28px rgba(0,0,0,0.25)`,
                        } : {}),
                      }}
                    >
                      {svc.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Center logo */}
            <motion.a
              href="https://www.instagram.com/the.cocreativehub"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: centerSize,
                height: centerSize,
                borderRadius: '50%',
                background: C.navy,
                boxShadow: `0 0 0 2px ${C.cream}, 0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              whileHover={{ boxShadow: `0 0 0 3px ${C.cream}, 0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)` }}
              transition={{ duration: 0.25 }}
              title="Follow us on Instagram"
            >
              <img
                src={LOGO_URL}
                alt="Primo AI Studio"
                style={{
                  width: isMobile ? 'clamp(50px, 13vw, 70px)' : '78%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </motion.a>
          </div>
        </div>

        {/* ══ Block 3: Hint + Button ══ */}
        <div style={{
          flexShrink: 0,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}>
          <p style={{
            margin: '0 0 12px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: `rgba(26, 58, 74, 0.4)`,
            textAlign: 'center',
            visibility: active ? 'hidden' : 'visible',
            lineHeight: 1,
          }}>
            Tap a service to explore
          </p>

          <MagneticButton>
            <motion.button
              onClick={() => setModalEntry({ source: 'getstarted' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: isMobile ? '11px 28px' : '16px 44px',
                borderRadius: 999,
                background: C.orange,
                color: C.cream,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 24px rgba(242,100,25,0.40)',
                cursor: 'pointer',
                userSelect: 'none',
                border: 'none',
                fontFamily: "'Nunito', 'Inter', sans-serif",
              }}
              whileHover={{
                background: C.navy,
                color: C.cream,
                boxShadow: '0 8px 36px rgba(26,58,74,0.40)',
              }}
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

      {/* ── Onboarding modal ── */}
      <OnboardingModal entry={modalEntry} onClose={handleModalClose} />
    </>
  );
}
