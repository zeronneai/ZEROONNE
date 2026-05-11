import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// ── Magnetic Button ──────────────────────────────────────────────────────────
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

// ── Data ─────────────────────────────────────────────────────────────────────
const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778360725/ChatGPT_Image_May_9_2026_03_04_56_PM_hdfdcd.png';

const SERVICES = [
  {
    id: 1,
    label: 'AI\nIntegration',
    name: 'AI Integration',
    description:
      'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',
    accent: '#1a3a5c',
    bg: '#b8cce4',
    border: '#7a9dc4',
  },
  {
    id: 2,
    label: 'Content\nMarketing',
    name: 'AI Content Marketing',
    description:
      'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',
    accent: '#1a2a40',
    bg: '#b4c4d8',
    border: '#7090b8',
  },
  {
    id: 3,
    label: 'AI Video\nAds',
    name: 'AI Video Production',
    description:
      'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',
    accent: '#2a4020',
    bg: '#c4d4b8',
    border: '#8aaa70',
  },
  {
    id: 4,
    label: 'Brand\nIdentity',
    name: 'Brand Identity',
    description:
      'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',
    accent: '#3d2060',
    bg: '#d4c8e8',
    border: '#a890d4',
  },
  {
    id: 5,
    label: 'Web\nPlatforms',
    name: 'Web Platforms',
    description:
      'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',
    accent: '#3d3570',
    bg: '#c8c4e8',
    border: '#9990d4',
  },
  {
    id: 6,
    label: 'AI\nAutomation',
    name: 'AI Automation',
    description:
      'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',
    accent: '#1e4d3a',
    bg: '#b8d4c8',
    border: '#7aaa94',
  },
];

// Desktop constants
const D_RING_RADIUS = 175;
const D_BUBBLE = 82;
const D_CENTER = 165;
const D_TOTAL = D_RING_RADIUS * 2 + D_BUBBLE + 60;
const D_BUBBLE_FONT = 9.5;

const POPUP_W_DESKTOP = 224;
const POPUP_H_APPROX = 148;

interface PopupState {
  id: number;
  top: number;
  left: number;
  origin: string;
  mobile: boolean;
  width: number;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<number | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
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

  // ── Responsive sizes ────────────────────────────────────────────────────────
  // Mobile uses 65vw to match the flex max-height/max-width constraint
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

  // Desktop-only scale (safety net for narrow desktop windows)
  const desktopScale = isMobile ? 1 : Math.min(1, (windowWidth - 32) / D_TOTAL);

  const activeService = SERVICES.find((s) => s.id === active) ?? null;

  // ── Popup positioning ────────────────────────────────────────────────────────
  const handleBubbleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    svc: (typeof SERVICES)[0],
  ) => {
    if (active === svc.id) {
      setActive(null);
      setPopup(null);
      return;
    }

    const btn = e.currentTarget.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile) {
      const pw = Math.min(vw * 0.8, 300);
      setPopup({
        id: svc.id,
        top: (vh - POPUP_H_APPROX) / 2,
        left: (vw - pw) / 2,
        origin: 'center',
        mobile: true,
        width: pw,
      });
    } else {
      const btnCx = btn.left + btn.width / 2;
      const btnCy = btn.top + btn.height / 2;
      let top: number, left: number, origin: string;

      if (btnCy < vh * 0.3) {
        top = btn.bottom + 12; left = btnCx - POPUP_W_DESKTOP / 2; origin = 'top center';
      } else if (btnCy > vh * 0.7) {
        top = btn.top - POPUP_H_APPROX - 12; left = btnCx - POPUP_W_DESKTOP / 2; origin = 'bottom center';
      } else if (btnCx < vw / 2) {
        top = btnCy - POPUP_H_APPROX / 2; left = btn.right + 12; origin = 'left center';
      } else {
        top = btnCy - POPUP_H_APPROX / 2; left = btn.left - POPUP_W_DESKTOP - 12; origin = 'right center';
      }

      left = Math.max(8, Math.min(left, vw - POPUP_W_DESKTOP - 8));
      top = Math.max(8, Math.min(top, vh - POPUP_H_APPROX - 8));

      setPopup({ id: svc.id, top, left, origin, mobile: false, width: POPUP_W_DESKTOP });
    }

    setActive(svc.id);
  };

  const closePopup = () => { setActive(null); setPopup(null); };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        // Mobile: fill viewport exactly, no scroll
        ...(isMobile
          ? { height: '100svh', padding: '16px 20px 24px', justifyContent: 'space-between' }
          : { minHeight: '100vh', padding: '24px 16px', justifyContent: 'center', gap: 0 }
        ),
        background: '#f8f7ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Nunito', 'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ══ Block 1: Heading — flex-shrink: 0 ══ */}
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
          fontWeight: 600,
          color: '#1a1a2e',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}>
          Best time to adapt AI is now.
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: isMobile ? 13 : 16,
          fontWeight: 400,
          color: '#6b6490',
          lineHeight: 1.5,
        }}>
          We make it simple to use and easy to understand.
        </p>
      </div>

      {/* ══ Block 2: Orbit — flex:1 on mobile, centered ══ */}
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
              border: '1.5px dashed rgba(153,144,212,0.4)',
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
                <motion.button
                  key={svc.id}
                  onClick={(e) => handleBubbleClick(e, svc)}
                  style={{
                    position: 'absolute',
                    top: `calc(50% - ${bubbleSize / 2}px + ${cy}px)`,
                    left: `calc(50% - ${bubbleSize / 2}px + ${cx}px)`,
                    width: bubbleSize,
                    height: bubbleSize,
                    borderRadius: '50%',
                    background: isActive ? svc.accent : svc.bg,
                    border: `1.5px solid ${isActive ? svc.accent : svc.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${bubbleFontSize}px`,
                    fontWeight: isActive ? 800 : 700,
                    color: isActive ? '#FFFFFF' : svc.accent,
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    lineHeight: 1.35,
                    padding: '8px',
                    whiteSpace: 'pre-line',
                    boxShadow: isActive
                      ? '0 8px 24px rgba(80,60,140,0.30)'
                      : '0 4px 16px rgba(80,60,140,0.15), 0 1px 4px rgba(80,60,140,0.10)',
                    transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                    outline: 'none',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  whileHover={{ scale: 1.06, boxShadow: '0 8px 24px rgba(80,60,140,0.30)' }}
                  whileTap={{ scale: 0.96 }}
                >
                  {svc.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Center logo — Instagram link */}
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
              background: '#1a1a2e',
              boxShadow: '0 0 0 2px #3d3570, 0 8px 32px rgba(20,10,60,0.25), 0 2px 8px rgba(20,10,60,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            whileHover={{ boxShadow: '0 0 0 3px #9990d4, 0 8px 32px rgba(20,10,60,0.35), 0 2px 8px rgba(20,10,60,0.20)' }}
            transition={{ duration: 0.25 }}
            title="Follow us on Instagram"
          >
            <img
              src={LOGO_URL}
              alt="Primo AI Studio"
              style={{
                width: isMobile ? `clamp(50px, 13vw, 70px)` : '78%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </motion.a>
        </div>
      </div>

      {/* ══ Block 3: Hint + Button — flex-shrink: 0 ══ */}
      <div style={{
        flexShrink: 0,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Hint — static, outside orbit, hidden when service is active */}
        <p style={{
          margin: '0 0 12px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(153, 144, 212, 0.45)',
          textAlign: 'center',
          visibility: active ? 'hidden' : 'visible',
          lineHeight: 1,
        }}>
          Tap a service to explore
        </p>

        {/* GET STARTED */}
        <MagneticButton>
          <motion.a
            href="mailto:zeronne.ai@gmail.com?subject=Let%27s%20Get%20Started&body=Hi%20Primo%20AI%20Studio%2C%0A%0AI%27d%20love%20to%20learn%20more%20about%20your%20services."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: isMobile ? '11px 28px' : '16px 44px',
              borderRadius: 999,
              background: '#3d3570',
              color: '#f0eeff',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(61,53,112,0.35)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            whileHover={{ background: '#2a2050', boxShadow: '0 8px 36px rgba(61,53,112,0.50)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Get Started
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 2 }}>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </MagneticButton>
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {popup?.mobile && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closePopup}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(14, 8, 48, 0.50)',
              zIndex: 199,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Dynamic popup ── */}
      <AnimatePresence mode="wait">
        {popup && activeService && (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: popup.top,
              left: popup.left,
              width: popup.width,
              transformOrigin: popup.origin,
              zIndex: 200,
              background: '#ffffff',
              borderRadius: 14,
              border: `1.5px solid ${activeService.border}`,
              padding: '16px 15px',
              boxShadow: '0 8px 32px rgba(30,20,80,0.16), 0 2px 8px rgba(30,20,80,0.10)',
              pointerEvents: popup.mobile ? 'auto' : 'none',
            }}
          >
            <p style={{
              fontSize: 10,
              fontWeight: 800,
              color: activeService.accent,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              margin: '0 0 7px',
            }}>
              {activeService.name}
            </p>
            <p style={{
              fontSize: 12,
              color: '#3d3a5c',
              lineHeight: 1.65,
              fontWeight: 400,
              margin: 0,
            }}>
              {activeService.description}
            </p>
            {popup.mobile && (
              <button
                onClick={closePopup}
                style={{
                  marginTop: 12,
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  borderRadius: 8,
                  border: `1px solid ${activeService.border}`,
                  background: activeService.bg,
                  color: activeService.accent,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cerrar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
