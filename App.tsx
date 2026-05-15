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

// ── Float keyframes (Framer Motion) ───────────────────────────────────────────
const FLOAT_DATA: Record<number, { x: number[]; y: number[]; duration: number }> = {
  1: { x: [0,  6, -4, -8,  0], y: [0,  -8, -14,  -6,  0], duration: 4.2 },
  2: { x: [0, -7,  5,  9,  0], y: [0, -10, -16,  -5,  0], duration: 3.8 },
  3: { x: [0,  8,  3, -6,  0], y: [0,  -6, -12,  -8,  0], duration: 4.6 },
  4: { x: [0, -9, -5,  4,  0], y: [0,  -7, -15, -10,  0], duration: 3.5 },
  5: { x: [0,  7, -3, -8,  0], y: [0, -11, -17,  -7,  0], duration: 4.9 },
  6: { x: [0, -6,  7,  4,  0], y: [0,  -9, -13,  -5,  0], duration: 4.1 },
};

// Shared orbit rotation transition — same params on rotator AND per-button counter so they stay in sync
const orbitTransition = (frozen: boolean) =>
  frozen
    ? ({ duration: 0.6, ease: 'easeOut' } as const)
    : ({ duration: 60, repeat: Infinity, ease: 'linear' } as const);

// ── Minimal bubble CSS ────────────────────────────────────────────────────────
const BUBBLE_CSS = `
.bbl {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%; border-radius: 50%;
}
`;

// ── Popup CTA ─────────────────────────────────────────────────────────────────
function GetStartedCTA({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', width: '100%', marginTop: 12, padding: '10px 20px',
        borderRadius: 50, border: 'none',
        background: hov ? C.navy : C.orange, color: C.cream,
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s ease',
      }}>
      Get Started →
    </button>
  );
}

// ── Sub-bubbles component — fixed positioning, no rotation inheritance ─────────
function SubBubbles({ btnCx, btnCy, angle, points, colors, isMobile, dist }: {
  btnCx: number; btnCy: number; angle: number;
  points: string[]; colors: { bg: string; text: string }[];
  isMobile: boolean; dist: number;
}) {
  const offsets = [-30, 0, 30]; // degrees around the outward angle
  return (
    <>
      {points.map((point, i) => {
        const a = angle + offsets[i] * (Math.PI / 180);
        return (
          <motion.div
            key={`sub-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
            style={{
              position: 'fixed',
              top:  btnCy + Math.sin(a) * dist,
              left: btnCx + Math.cos(a) * dist,
              transform: 'translate(-50%, -50%)',
              width:  isMobile ? 70 : 90,
              height: isMobile ? 70 : 90,
              borderRadius: '50%',
              background: colors[i]?.bg ?? C.cream,
              color:      colors[i]?.text ?? C.navy,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '8px',
              fontSize: isMobile ? '9px' : '10.5px',
              fontFamily: "'Mulish', -apple-system, sans-serif",
              fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.03em',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              pointerEvents: 'none', zIndex: 150,
            }}
          >
            {point}
          </motion.div>
        );
      })}
    </>
  );
}

// ── Complementary colors (avoids the active node's own color) ─────────────────
function getComplementaryColors(activeColor: string) {
  return [
    { bg: C.navy,   text: C.cream },
    { bg: C.orange, text: C.cream },
    { bg: C.yellow, text: C.navy  },
    { bg: C.green,  text: C.navy  },
    { bg: C.cream,  text: C.navy  },
  ].filter(c => c.bg !== activeColor).slice(0, 3);
}

// ── Popup tail (triangle pointing toward the active bubble) ───────────────────
function PopupTail({ origin }: { origin: string }) {
  const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0 };
  if (origin === 'left center')   return <div style={{ ...base, top: '50%', left: -12, transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: `8px solid ${C.navy}` }} />;
  if (origin === 'right center')  return <div style={{ ...base, top: '50%', right: -12, transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `8px solid ${C.navy}` }} />;
  if (origin === 'top center')    return <div style={{ ...base, left: '50%', top: -12, transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `8px solid ${C.navy}` }} />;
  if (origin === 'bottom center') return <div style={{ ...base, left: '50%', bottom: -12, transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${C.navy}` }} />;
  return null;
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
  { id: 1, label: 'AI\nIntegration',    name: 'AI Integration',       description: 'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',    nodeBg: C.green,  nodeText: C.navy,  floatIndex: 3, keyPoints: ['Custom API connections', 'Workflow automation',     'Zero rebuild needed']    },
  { id: 2, label: 'Content\nMarketing', name: 'AI Content Marketing', description: 'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',                       nodeBg: C.orange, nodeText: C.cream, floatIndex: 6, keyPoints: ['Multi-channel scaling',  'Brand-aligned voice',       'Daily output ready']      },
  { id: 3, label: 'AI Video\nAds',      name: 'AI Video Production',  description: 'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',                                     nodeBg: C.navy,   nodeText: C.cream, floatIndex: 5, keyPoints: ['Premium quality',          'Days not weeks',            'High conversion']         },
  { id: 4, label: 'Brand\nIdentity',    name: 'Brand Identity',       description: 'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',                      nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 4, keyPoints: ['Naming & positioning',    'Design systems',            'Built to last']           },
  { id: 5, label: 'Web\nPlatforms',     name: 'Web Platforms',        description: 'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',                              nodeBg: C.orange, nodeText: C.cream, floatIndex: 1, keyPoints: ['Conversion-optimized',    'Premium design',            'Built to scale']          },
  { id: 6, label: 'AI\nAutomation',     name: 'AI Automation',        description: 'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',                         nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 2, keyPoints: ['Custom workflows',         'Operations on autopilot',   'Focus on growth']         },
];

// Layout constants
const D_RING_RADIUS = 175;
const D_BUBBLE      = 82;
const D_TOTAL       = D_RING_RADIUS * 2 + D_BUBBLE + 60;
const D_BUBBLE_FONT = 9.5;
const POPUP_W_DESKTOP = 240;
const POPUP_W_MOBILE  = 180;
const POPUP_H_APPROX  = 180;

interface PopupState {
  id: number; top: number; left: number; origin: string; width: number;
  angleRad: number; btnCx: number; btnCy: number;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]           = useState<number | null>(null);
  const [popup, setPopup]             = useState<PopupState | null>(null);
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
      if (!t.closest('.service-node') && !t.closest('.service-popup')) {
        setActive(null); setPopup(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [modalEntry]);

  const isMobile     = windowWidth <= 768;
  const activeService = SERVICES.find(s => s.id === active) ?? null;

  const containerSize  = isMobile ? Math.min(0.65 * windowWidth, 300) : D_TOTAL;
  const bubbleSize     = isMobile ? Math.max(52, Math.min(0.13 * windowWidth, 72)) : D_BUBBLE;
  const ringRadius     = isMobile ? containerSize / 2 - bubbleSize / 2 - 6 : D_RING_RADIUS;
  const bubbleFontSize = isMobile ? Math.max(7, Math.min(0.018 * windowWidth, 10)) : D_BUBBLE_FONT;
  const desktopScale   = isMobile ? 1 : Math.min(1, (windowWidth - 32) / D_TOTAL);

  const subDist  = isMobile ? 75 : 100;
  const popupW   = isMobile ? POPUP_W_MOBILE : POPUP_W_DESKTOP;

  const frozen = active !== null; // convenient alias

  const handleModalClose = () => { setModalEntry(null); setActive(null); };

  const handleBubbleClick = (e: React.MouseEvent<HTMLButtonElement>, svc: (typeof SERVICES)[0]) => {
    e.stopPropagation();
    if (active === svc.id) { setActive(null); setPopup(null); return; }

    const btn    = e.currentTarget.getBoundingClientRect();
    const btnCx  = btn.left + btn.width / 2;
    const btnCy  = btn.top  + btn.height / 2;
    const vw = window.innerWidth, vh = window.innerHeight;

    // Real angle from orbit center → bubble at this moment
    const orbitEl   = document.querySelector('.orbit-container');
    const orbitRect = orbitEl?.getBoundingClientRect();
    const orbitCx   = orbitRect ? orbitRect.left + orbitRect.width  / 2 : btnCx;
    const orbitCy   = orbitRect ? orbitRect.top  + orbitRect.height / 2 : btnCy;
    const realAngle = Math.atan2(btnCy - orbitCy, btnCx - orbitCx);

    // Popup: place outward from orbit center, beyond the sub-bubbles
    const popupDist = subDist + 130;
    let popupLeft = btnCx + Math.cos(realAngle) * popupDist - popupW / 2;
    let popupTop  = btnCy + Math.sin(realAngle) * popupDist - POPUP_H_APPROX / 2;
    popupLeft = Math.max(8, Math.min(popupLeft, vw - popupW - 8));
    popupTop  = Math.max(8, Math.min(popupTop,  vh - POPUP_H_APPROX - 8));

    // Tail direction: popup is at angle from bubble → tail points back at bubble
    const deg = (realAngle * 180) / Math.PI;
    let origin: string;
    if      (deg > -45  && deg <  45)  origin = 'left center';
    else if (deg >= 45  && deg < 135)  origin = 'top center';
    else if (deg >= 135 || deg < -135) origin = 'right center';
    else                               origin = 'bottom center';

    setPopup({ id: svc.id, top: popupTop, left: popupLeft, origin, width: popupW, angleRad: realAngle, btnCx, btnCy });
    setActive(svc.id);
  };

  const closePopup = () => { setActive(null); setPopup(null); };
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

        {/* ══ Block 2: Orbit ══ */}
        <div style={isMobile ? { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '65vw', maxWidth: '65vw', alignSelf: 'center', margin: 'auto 0' } : {}}>
          <div
            className="orbit-container"
            style={{
              position: 'relative', width: containerSize, height: containerSize, flexShrink: 0,
              ...(!isMobile && desktopScale < 1 ? {
                transform: `scale(${desktopScale})`, transformOrigin: 'top center',
                marginBottom: -(D_TOTAL * (1 - desktopScale)),
              } : {}),
            }}
          >
            {/* Orbit path ring */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: (ringRadius + bubbleSize / 2) * 2, height: (ringRadius + bubbleSize / 2) * 2,
              transform: 'translate(-50%, -50%)', borderRadius: '50%',
              border: '1.5px dashed rgba(26,58,74,0.2)',
              opacity: frozen ? 0.4 : 1, transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }} />

            {/* ── Orbit rotator (single rotating wrapper) ── */}
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformOrigin: 'center center' }}
              animate={frozen ? { rotate: 0 } : { rotate: 360 }}
              transition={orbitTransition(frozen)}
            >
              {SERVICES.map((svc) => {
                const angle    = (360 / SERVICES.length) * SERVICES.indexOf(svc);
                const rad      = (Math.PI / 180) * angle;
                const cx       = Math.cos(rad) * ringRadius;
                const cy       = Math.sin(rad) * ringRadius;
                const isActive = active === svc.id;
                const float    = FLOAT_DATA[svc.floatIndex];

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
                      zIndex: isActive ? 10 : 1,
                    }}
                    whileTap={{ scale: 0.94 }}
                  >
                    {/* Counter-rotation: cancels the orbit-rotator so text stays upright */}
                    <motion.div
                      animate={frozen ? { rotate: 0 } : { rotate: -360 }}
                      transition={orbitTransition(frozen)}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {/* Float animation — springs to rest when frozen */}
                      <motion.div
                        animate={frozen ? { x: 0, y: 0 } : { x: float.x, y: float.y }}
                        transition={frozen
                          ? { type: 'spring', stiffness: 180, damping: 20 }
                          : { duration: float.duration, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span
                          className="bbl"
                          style={{
                            background: svc.nodeBg, fontSize: `${bubbleFontSize}px`,
                            fontWeight: 600, color: svc.nodeText,
                            letterSpacing: '0.04em', textAlign: 'center',
                            textTransform: 'uppercase', lineHeight: 1.35, whiteSpace: 'pre-line',
                            opacity:   frozen && !isActive ? 0.4 : 1,
                            filter:    frozen && !isActive ? 'saturate(0.6)' : 'none',
                            transform: isActive ? 'scale(1.15)' : 'scale(1)',
                            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
                            ...(isActive ? { boxShadow: `0 0 0 3px ${C.navy}, 0 8px 28px rgba(0,0,0,0.25)` } : {}),
                          }}
                        >
                          {svc.label}
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* ── Sub-bubbles — outside the rotator, fixed screen coords ── */}
            <AnimatePresence>
              {frozen && activeService && popup && (
                <SubBubbles
                  btnCx={popup.btnCx}
                  btnCy={popup.btnCy}
                  angle={popup.angleRad}
                  points={activeService.keyPoints}
                  colors={getComplementaryColors(activeService.nodeBg)}
                  isMobile={isMobile}
                  dist={subDist}
                />
              )}
            </AnimatePresence>

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

        {/* ── Service popup ── */}
        <AnimatePresence mode="wait">
          {popup && activeService && (
            <motion.div
              key={popup.id}
              className="service-popup"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 0.38 }}
              style={{
                position: 'fixed', top: popup.top, left: popup.left, width: popup.width,
                transformOrigin: popup.origin, zIndex: 200,
                background: C.navy, borderRadius: 22,
                padding: '10px 12px 12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                pointerEvents: 'auto', maxHeight: 180, overflowY: 'auto',
              }}
            >
              <PopupTail origin={popup.origin} />

              <button
                onClick={(e) => { e.stopPropagation(); closePopup(); }}
                style={{
                  position: 'absolute', top: 8, right: 10,
                  background: 'transparent', border: 'none', color: C.cream, opacity: 0.6,
                  fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '2px 4px',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                aria-label="Close"
              >×</button>

              <p style={{ fontSize: 10, fontWeight: 800, color: C.cream, letterSpacing: '0.13em', textTransform: 'uppercase', margin: '0 0 6px', paddingRight: 20 }}>
                {activeService.name}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(234,226,183,0.8)', lineHeight: 1.65, fontWeight: 400, margin: 0 }}>
                {activeService.description}
              </p>
              <GetStartedCTA onClick={(e) => { e.stopPropagation(); openModalFromPopup(activeService.name); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <OnboardingModal entry={modalEntry} onClose={handleModalClose} />
    </>
  );
}
