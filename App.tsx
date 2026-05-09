import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778360725/ChatGPT_Image_May_9_2026_03_04_56_PM_hdfdcd.png';

const SERVICES = [
  {
    id: 1,
    label: 'AI\nIntegration',
    name: 'AI Integration',
    description:
      'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',
    accent: '#C9A97A',
    bg: '#FDF8F2',
    border: '#EDE0CC',
  },
  {
    id: 2,
    label: 'Content\nMarketing',
    name: 'AI Content Marketing',
    description:
      'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',
    accent: '#8AA88D',
    bg: '#F3F7F3',
    border: '#CCDECE',
  },
  {
    id: 3,
    label: 'AI Video\nAds',
    name: 'AI Video Production',
    description:
      'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',
    accent: '#A88D8D',
    bg: '#F7F3F3',
    border: '#DECECE',
  },
  {
    id: 4,
    label: 'Brand\nIdentity',
    name: 'Brand Identity',
    description:
      'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',
    accent: '#8D8DAA',
    bg: '#F3F3F8',
    border: '#CECEDE',
  },
  {
    id: 5,
    label: 'Web\nPlatforms',
    name: 'Web Platforms',
    description:
      'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',
    accent: '#7A9AAF',
    bg: '#F2F5F8',
    border: '#C8D8E4',
  },
  {
    id: 6,
    label: 'AI\nAutomation',
    name: 'AI Automation',
    description:
      'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',
    accent: '#A89F7A',
    bg: '#F8F6F0',
    border: '#E0D8C0',
  },
];

const RING_RADIUS = 175;
const BUBBLE = 82;
const CENTER = 165;

export default function App() {
  const [active, setActive] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', 'Inter', sans-serif",
        padding: '32px 16px',
        gap: 0,
      }}
    >
      {/* ── Ring Container ── */}
      <div
        style={{
          position: 'relative',
          width: totalSize,
          height: totalSize,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}
      >
        {/* Faint orbit path */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: (RING_RADIUS + BUBBLE / 2) * 2,
            height: (RING_RADIUS + BUBBLE / 2) * 2,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1.5px dashed #EAE4DC',
            pointerEvents: 'none',
          }}
        />

        {/* Spinning ring */}
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        >
          {SERVICES.map((svc, i) => {
            const angle = (360 / SERVICES.length) * i;
            const rad = (Math.PI / 180) * angle;
            const cx = Math.cos(rad) * RING_RADIUS;
            const cy = Math.sin(rad) * RING_RADIUS;
            const isActive = active === svc.id;

            return (
              <motion.button
                key={svc.id}
                onClick={() => setActive(isActive ? null : svc.id)}
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
                    ? `0 6px 24px ${svc.accent}50`
                    : '0 2px 12px rgba(0,0,0,0.05)',
                  transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
                  outline: 'none',
                }}
                /* counter-rotate so text stays upright */
                animate={{ rotate: -360 }}
                transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.96 }}
              >
                {svc.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Center logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: CENTER,
            height: CENTER,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow:
              '0 0 0 1px #EAE4DC, 0 8px 40px rgba(201,169,122,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <img
            src={LOGO_URL}
            alt="Primo AI Studio"
            style={{
              width: '78%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* ── Description Card ── */}
      <div
        style={{
          marginTop: scale < 1 ? totalSize * (1 - scale) * 0.5 + 24 : 36,
          width: '100%',
          maxWidth: 400,
          minHeight: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {activeService ? (
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                padding: '24px 28px',
                background: activeService.bg,
                borderRadius: 20,
                border: `1px solid ${activeService.border}`,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: activeService.accent,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {activeService.name}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: '#7A7268',
                  lineHeight: 1.75,
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {activeService.description}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 11,
                color: '#C8BFB4',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Tap a service to explore
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
