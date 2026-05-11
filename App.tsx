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

const RING_RADIUS = 175;
const BUBBLE = 82;
const CENTER = 165;
const POPUP_W = 224;
const POPUP_H = 148; // approx height for clamping

// ── Popup state type ──────────────────────────────────────────────────────────
interface PopupState {
  id: number;
  top: number;
  left: number;
  origin: string;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [popup, setPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    const resize = () => {
      const vw = window.innerWidth;
      const totalSize = RING_RADIUS * 2 + BUBBLE + 60;
      setScale(Math.min(1, (vw - 32) / totalSize));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const totalSize = RING_RADIUS * 2 + BUBBLE + 60;
  const activeService = SERVICES.find((s) => s.id === active) ?? null;
  const invScale = 1 / scale;

  // ── Dynamic popup positioning ─────────────────────────────────────────────
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
    const btnCx = btn.left + btn.width / 2;
    const btnCy = btn.top + btn.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top: number;
    let left: number;
    let origin: string;

    if (btnCy < vh * 0.3) {
      // Node in top band → popup appears below
      top = btn.bottom + 12;
      left = btnCx - POPUP_W / 2;
      origin = 'top center';
    } else if (btnCy > vh * 0.7) {
      // Node in bottom band → popup appears above
      top = btn.top - POPUP_H - 12;
      left = btnCx - POPUP_W / 2;
      origin = 'bottom center';
    } else if (btnCx < vw / 2) {
      // Node in left half → popup appears to the right
      top = btnCy - POPUP_H / 2;
      left = btn.right + 12;
      origin = 'left center';
    } else {
      // Node in right half → popup appears to the left
      top = btnCy - POPUP_H / 2;
      left = btn.left - POPUP_W - 12;
      origin = 'right center';
    }

    // Clamp within viewport
    left = Math.max(8, Math.min(left, vw - POPUP_W - 8));
    top = Math.max(8, Math.min(top, vh - POPUP_H - 8));

    setActive(svc.id);
    setPopup({ id: svc.id, top, left, origin });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f7ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', 'Inter', sans-serif",
        padding: '24px 16px',
        gap: 0,
      }}
    >
      {/* ── Tagline ── */}
      <div style={{ textAlign: 'center', marginBottom: 20, maxWidth: 320, padding: '0 8px' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.5, letterSpacing: '0.01em' }}>
          Best time to adapt AI is now.
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 400, color: '#6e6a8a', lineHeight: 1.55 }}>
          We make it simple to use and easy to understand.
        </p>
      </div>

      {/* ── Ring Container ── */}
      <div
        style={{
          position: 'relative',
          width: totalSize,
          height: totalSize,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
          marginBottom: scale < 1 ? -(totalSize * (1 - scale)) : 0,
        }}
      >
        {/* Orbit path */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: (RING_RADIUS + BUBBLE / 2) * 2,
            height: (RING_RADIUS + BUBBLE / 2) * 2,
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
            const cx = Math.cos(rad) * RING_RADIUS;
            const cy = Math.sin(rad) * RING_RADIUS;
            const isActive = active === svc.id;

            return (
              <motion.button
                key={svc.id}
                onClick={(e) => handleBubbleClick(e, svc)}
                style={{
                  position: 'absolute',
                  top: `calc(50% - ${BUBBLE / 2}px + ${cy}px)`,
                  left: `calc(50% - ${BUBBLE / 2}px + ${cx}px)`,
                  width: BUBBLE,
                  height: BUBBLE,
                  borderRadius: '50%',
                  background: isActive ? svc.accent : svc.bg,
                  border: `1.5px solid ${isActive ? svc.accent : svc.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9.5px',
                  fontWeight: isActive ? 800 : 700,
                  color: isActive ? '#FFFFFF' : svc.accent,
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.35,
                  padding: '10px',
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
            width: CENTER,
            height: CENTER,
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
            style={{ width: '78%', height: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </motion.a>

        {/* Hint — only shown when no service is active */}
        <AnimatePresence>
          {!active && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: '11%',
                left: '50%',
                transform: `translateX(-50%) scale(${invScale})`,
                transformOrigin: '50% 50%',
                fontSize: 10,
                color: '#9990d4',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                margin: 0,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              Tap a service to explore
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── GET STARTED — Magnetic Button ── */}
      <div style={{ marginTop: 20 }}>
        <MagneticButton>
          <motion.a
            href="mailto:zeronne.ai@gmail.com?subject=Let%27s%20Get%20Started&body=Hi%20Primo%20AI%20Studio%2C%0A%0AI%27d%20love%20to%20learn%20more%20about%20your%20services."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px 44px',
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 2 }}>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </MagneticButton>
      </div>

      {/* ── Dynamic popup — fixed, near clicked node ── */}
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
              width: POPUP_W,
              transformOrigin: popup.origin,
              zIndex: 200,
              background: '#ffffff',
              borderRadius: 14,
              border: `1.5px solid ${activeService.border}`,
              padding: '16px 15px',
              boxShadow: '0 8px 32px rgba(30,20,80,0.16), 0 2px 8px rgba(30,20,80,0.10)',
              pointerEvents: 'none',
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
