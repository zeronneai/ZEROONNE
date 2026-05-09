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

// ── Bounce Card ──────────────────────────────────────────────────────────────
function BounceCard({
  children,
  gradient,
  panelContent,
  flex,
}: {
  children: React.ReactNode;
  gradient: string;
  panelContent: React.ReactNode;
  flex: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 0.96, rotate: '-0.8deg' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        flex,
        minWidth: 0,
        minHeight: 300,
        borderRadius: 20,
        background: '#FFFFFF',
        padding: 28,
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        border: '1px solid #F0EBE4',
      }}
    >
      {children}
      <motion.div
        animate={{ y: hovered ? 14 : 32, rotate: hovered ? 2 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 14,
          right: 14,
          top: 120,
          borderRadius: '16px 16px 0 0',
          background: gradient,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {panelContent}
      </motion.div>
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
    accent: '#C9A97A',
    bg: '#FDF8F2',
    border: '#EDE0CC',
    // card config
    cardTitle: 'AI Integration',
    cardDesc: 'Connect AI to your existing workflow in days, not months. Smarter decisions, zero disruption.',
    gradient: 'linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)',
    textColor: '#5B21B6',
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
    cardTitle: 'Content Marketing',
    cardDesc: 'Scale campaigns across every channel with AI-driven copy, visuals, and strategy — on autopilot.',
    gradient: 'linear-gradient(135deg, #FEF9C3 0%, #FDE047 80%)',
    textColor: '#854D0E',
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
    cardTitle: 'AI Video Ads',
    cardDesc: 'Premium, high-converting video ads produced at speed. No agency delays, no creative bottlenecks.',
    gradient: 'linear-gradient(135deg, #FFE4E6 0%, #FDA4AF 100%)',
    textColor: '#9F1239',
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
    cardTitle: 'Brand Identity',
    cardDesc: 'A distinctive identity built by AI — naming, positioning, and visual systems that make you unforgettable.',
    gradient: 'linear-gradient(135deg, #F3E8FF 0%, #D8B4FE 100%)',
    textColor: '#6B21A8',
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
    cardTitle: 'Web Platforms',
    cardDesc: 'High-performance sites deployed in days. Conversion-optimized, visually premium, built to scale fast.',
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
    textColor: '#1E40AF',
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
    cardTitle: 'AI Automation',
    cardDesc: 'Eliminate repetitive tasks forever with custom workflows. Let AI run your operations while you grow.',
    gradient: 'linear-gradient(135deg, #FFEDD5 0%, #FCA560 100%)',
    textColor: '#9A3412',
  },
];

const RING_RADIUS = 175;
const BUBBLE = 82;
const CENTER = 165;

// ── App ───────────────────────────────────────────────────────────────────────
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
    <div style={{ background: '#FAFAF8', fontFamily: "'Nunito', 'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          background: '#FFFFFF',
        }}
      >
        {/* Ring Container */}
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
              background: '#FFFFFF',
              boxShadow: '0 0 0 1px #EAE4DC, 0 8px 40px rgba(201,169,122,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            whileHover={{ boxShadow: '0 0 0 2px #C9A97A, 0 12px 48px rgba(201,169,122,0.22)' }}
            transition={{ duration: 0.25 }}
            title="Follow us on Instagram"
          >
            <img
              src={LOGO_URL}
              alt="Primo AI Studio"
              style={{ width: '78%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </motion.a>
        </div>

        {/* Description Card */}
        <div
          style={{
            marginTop: scale < 1 ? totalSize * (1 - scale) * 0.5 + 24 : 36,
            width: '100%',
            maxWidth: 400,
            minHeight: 100,
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
                  padding: '22px 26px',
                  background: activeService.bg,
                  borderRadius: 20,
                  border: `1px solid ${activeService.border}`,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 800, color: activeService.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {activeService.name}
                </p>
                <p style={{ fontSize: 14, color: '#7A7268', lineHeight: 1.75, fontWeight: 400, margin: 0 }}>
                  {activeService.description}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 11, color: '#C8BFB4', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', fontWeight: 600, margin: 0 }}
              >
                Tap a service to explore
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* GET STARTED — Magnetic Button */}
        <div style={{ marginTop: 32 }}>
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
                background: '#C9A97A',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(201,169,122,0.30)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              whileHover={{ background: '#B8956A', boxShadow: '0 8px 36px rgba(201,169,122,0.45)' }}
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
      </div>

      {/* ══════════════════════════════════════════
          SERVICES — BOUNCY CARDS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1080, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A97A', margin: 0 }}>
            What we do
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#1C1917', margin: 0, lineHeight: 1.15 }}>
            Scale faster with our{' '}
            <span style={{ color: '#A89888' }}>AI-powered solutions</span>
          </h2>
        </div>

        {/* Row 1: small | large */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <BounceCard
            flex={1.1}
            gradient={SERVICES[0].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[0].textColor, margin: '0 0 8px' }}>
                  Seamless AI
                </p>
                <p style={{ fontSize: 13, color: SERVICES[0].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[0].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[0].cardTitle}</h3>
          </BounceCard>

          <BounceCard
            flex={2}
            gradient={SERVICES[1].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[1].textColor, margin: '0 0 8px' }}>
                  Smart Content
                </p>
                <p style={{ fontSize: 13, color: SERVICES[1].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[1].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[1].cardTitle}</h3>
          </BounceCard>
        </div>

        {/* Row 2: large | small */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <BounceCard
            flex={2}
            gradient={SERVICES[2].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[2].textColor, margin: '0 0 8px' }}>
                  Premium Video
                </p>
                <p style={{ fontSize: 13, color: SERVICES[2].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[2].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[2].cardTitle}</h3>
          </BounceCard>

          <BounceCard
            flex={1.1}
            gradient={SERVICES[3].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[3].textColor, margin: '0 0 8px' }}>
                  Distinct Brand
                </p>
                <p style={{ fontSize: 13, color: SERVICES[3].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[3].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[3].cardTitle}</h3>
          </BounceCard>
        </div>

        {/* Row 3: equal | equal */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <BounceCard
            flex={1}
            gradient={SERVICES[4].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[4].textColor, margin: '0 0 8px' }}>
                  Fast Websites
                </p>
                <p style={{ fontSize: 13, color: SERVICES[4].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[4].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[4].cardTitle}</h3>
          </BounceCard>

          <BounceCard
            flex={1}
            gradient={SERVICES[5].gradient}
            panelContent={
              <>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: SERVICES[5].textColor, margin: '0 0 8px' }}>
                  Zero Manual Work
                </p>
                <p style={{ fontSize: 13, color: SERVICES[5].textColor, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
                  {SERVICES[5].cardDesc}
                </p>
              </>
            }
          >
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>{SERVICES[5].cardTitle}</h3>
          </BounceCard>
        </div>
      </section>

    </div>
  );
}
