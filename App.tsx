import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import OnboardingModal, { ModalEntry } from './OnboardingModal';
const PrimoFunnel = lazy(() => import('./src/components/PrimoFunnel'));

// FAQPage schema — homepage only. Kept here (not in index.html @graph) so it
// is scoped to the "/" route and doesn't bleed into prerendered subpages.
const HOMEPAGE_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://primostudio.us/#faq',
  'isPartOf': { '@id': 'https://primostudio.us/#website' },
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best AI agency in El Paso, Texas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primo AI Studio is the leading human-first AI agency in El Paso, helping local businesses implement AI Agents, Done-For-You Automations, AI Content Creation, Brand AI, Custom Software, and Voice & Chat Bots with practical, measurable results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Primo AI Studio located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primo AI Studio is headquartered at 601 N Mesa St Suite 1440, El Paso, TX 79901. We serve businesses across El Paso and the greater Texas region.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does Primo AI Studio offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer 6 core services: AI Agents, Done-For-You Automations, AI Content Creation, Brand AI, Custom Software, and Voice & Chat Bots — all designed to help El Paso businesses grow without spending time learning AI themselves.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to work with Primo AI Studio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primo offers a free AI Opportunity Scorecard, paid AI Audits starting at $497, monthly Sprints from $2,500/mo, Growth plans from $4,500/mo, Scale plans from $8,000/mo, and custom Enterprise pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Primo AI Studio offer bilingual services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Primo AI Studio operates bilingually in English and Spanish, perfectly suited for El Paso's bilingual market and cross-border business community.",
      },
    },
  ],
};

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

// Shared orbit rotation transition — identical params on rotator AND counter so they stay in sync
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
@keyframes pulse-glow {
  0%   { box-shadow: 0 0 0px 0px rgba(242,100,25,0.0),  0 0 0px  0px rgba(242,100,25,0.0); }
  40%  { box-shadow: 0 0 18px 6px rgba(242,100,25,0.65), 0 0 36px 12px rgba(242,100,25,0.25); }
  60%  { box-shadow: 0 0 18px 6px rgba(242,100,25,0.65), 0 0 36px 12px rgba(242,100,25,0.25); }
  100% { box-shadow: 0 0 0px 0px rgba(242,100,25,0.0),  0 0 0px  0px rgba(242,100,25,0.0); }
}
.bbl-bestseller {
  animation: pulse-glow 2.2s ease-in-out infinite;
}
@keyframes btn-pulse {
  0%   { box-shadow: 0 0 0px 0px rgba(242,100,25,0.0); }
  50%  { box-shadow: 0 0 12px 4px rgba(242,100,25,0.55); }
  100% { box-shadow: 0 0 0px 0px rgba(242,100,25,0.0); }
}
.learn-more-btn {
  animation: btn-pulse 2s ease-in-out infinite;
}
`;

// ── Sub-bubbles: 360° equilateral triangle around the expanded bubble ─────────
function SubBubbles({ btnCx, btnCy, points, isMobile }: {
  btnCx: number; btnCy: number; points: string[]; isMobile: boolean;
}) {
  const expandedRadius = isMobile
    ? Math.min(window.innerWidth * 0.5, 280) / 2
    : 150;
  const gap     = isMobile ? 52 : 80;
  const dist    = expandedRadius + gap;
  const size    = isMobile ? 75 : 90;
  const angles  = [-90, 30, 150]; // equilateral triangle: top, lower-right, lower-left
  const colors  = [
    { bg: C.cream,  text: C.navy  },
    { bg: C.green,  text: C.navy  },
    { bg: C.orange, text: C.cream },
  ];

  return (
    <>
      {points.map((point, i) => {
        const rad  = angles[i] * (Math.PI / 180);
        const dx   = Math.cos(rad) * dist;
        const dy   = Math.sin(rad) * dist;
        // Center is pre-validated in handleBubbleClick — no clamping needed
        const left = btnCx + dx;
        const top  = btnCy + dy;
        return (
          <motion.div
            key={`sub-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0 }}
            transition={{
              duration: 0.45, delay: 0.25 + i * 0.1,
              type: 'spring', stiffness: 180, damping: 16,
            }}
            style={{
              position: 'fixed',
              top, left,
              transform: 'translate(-50%, -50%)',
              width: size, height: size, borderRadius: '50%',
              background: colors[i].bg, color: colors[i].text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '10px',
              fontSize: isMobile ? '10px' : 'clamp(10px, 1.3vw, 11px)',
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 700, lineHeight: 1.25, letterSpacing: '0.02em',
              boxShadow: '0 6px 22px rgba(0,0,0,0.18)',
              pointerEvents: 'none', zIndex: 110,
            }}
          >
            {point}
          </motion.div>
        );
      })}
    </>
  );
}

// ── Expanded bubble — replaces the separate popup ─────────────────────────────
function ExpandedBubble({ svc, btnCx, btnCy, isMobile, windowWidth, onClose, onGetStarted }: {
  svc: typeof SERVICES[0];
  btnCx: number; btnCy: number;
  isMobile: boolean; windowWidth: number;
  onClose: () => void;
  onGetStarted: (name: string) => void;
}) {
  const size = isMobile
    ? Math.min(windowWidth * 0.75, 280)
    : 300; // fixed 300px circle on desktop

  const cx = btnCx;
  const cy = btnCy;

  return (
    <motion.div
      className="expanded-bubble"
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{   scale: 0.2, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top:  cy - size / 2,
        left: cx - size / 2,
        width: size, height: size,
        borderRadius: '50%', aspectRatio: '1 / 1',
        background: svc.nodeBg, color: svc.nodeText,
        padding: 'clamp(28px, 5vw, 40px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, textAlign: 'center',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.28)',
        zIndex: 100,
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: 12, right: 16,
          background: 'transparent', border: 'none',
          color: svc.nodeText, opacity: 0.5,
          fontSize: 20, lineHeight: 1, cursor: 'pointer',
          fontFamily: 'inherit', padding: 4,
        }}
      >×</button>

      {/* Service name */}
      <p style={{
        fontSize: 'clamp(9px, 1.2vw, 11px)',
        fontWeight: 800, letterSpacing: '0.13em',
        textTransform: 'uppercase', margin: 0, marginBottom: 4,
        color: svc.nodeText, opacity: 0.7,
      }}>
        {svc.name}
      </p>

      {/* Description */}
      <p style={{
        fontSize: 'clamp(10px, 1.3vw, 12px)',
        lineHeight: 1.45, margin: 0,
        color: svc.nodeText, fontWeight: 500, maxWidth: '100%',
      }}>
        {svc.description}
      </p>

      {/* Get Started */}
      <button
        onClick={(e) => { e.stopPropagation(); onGetStarted(svc.name); }}
        style={{
          marginTop: 10,
          background: C.orange, color: C.cream,
          border: 'none', borderRadius: 50,
          padding: '9px 20px',
          fontSize: 'clamp(9px, 1.2vw, 11px)',
          fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "'Mulish', sans-serif",
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(242,100,25,0.4)',
          transition: 'all 0.2s',
        }}
      >
        Get Started →
      </button>
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
  { id: 1, label: 'AI\nAgents',                name: 'AI Agents',                description: "Custom agents that track your numbers, send reports, and handle the boring stuff so you don't have to look at another dashboard ever again.",            nodeBg: C.green,  nodeText: C.navy,  floatIndex: 3, keyPoints: ['Automation',           'Agents',         'Done for You'],   bestSeller: false },
  { id: 2, label: 'LLM\nOptimization',         name: 'LLM Optimization',         description: 'Get found by AI search engines — ChatGPT, Perplexity, Gemini. We optimize your content and authority so AI recommends you first.',                     nodeBg: C.orange, nodeText: C.cream, floatIndex: 6, keyPoints: ['AI Search',            'SEO & AEO',      'Get Recommended'], bestSeller: true  },
  { id: 3, label: 'AI Content\nCreation',      name: 'AI Content Creation',      description: 'AI trained on YOUR brand voice — generating on-brand ideas, scripts, and edits. You film. We handle the rest (or we film for you too).',              nodeBg: C.navy,   nodeText: C.cream, floatIndex: 5, keyPoints: ['On-brand',             'Daily output',   'We edit too'],    bestSeller: false },
  { id: 4, label: 'Websites &\nFunnels',        name: 'Websites & Funnels',       description: 'High-converting landing pages, e-commerce stores, and full funnels — built fast, built to close.',                                                     nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 4, keyPoints: ['Landing Pages',        'E Commerce',     'Flash Turnarounds'], bestSeller: false },
  { id: 5, label: 'Custom\nSoftware',          name: 'Custom Software',          description: 'Custom websites, apps, and back-end systems. Built fast, built clean, built for your business — not a template.',                                       nodeBg: C.orange, nodeText: C.cream, floatIndex: 1, keyPoints: ['Web & apps',            'Built fast',     'Built for you'],  bestSeller: false },
  { id: 6, label: 'Voice & Chat\nBots',        name: 'Voice & Chat Bots',        description: '24/7 customer service bots and personal assistants that sound human, never sleep, and never call in sick.',                                             nodeBg: C.yellow, nodeText: C.navy,  floatIndex: 2, keyPoints: ['24/7 service',         'Sounds human',   'Bilingual'],      bestSeller: false },
];

// Layout constants
const D_RING_RADIUS = 155;
const D_BUBBLE      = 74;
const D_TOTAL       = D_RING_RADIUS * 2 + D_BUBBLE + 60;
const D_BUBBLE_FONT = 7.5;

interface ActiveState {
  id: number;
  btnCx: number;
  btnCy: number;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]               = useState<number | null>(null);
  const [popup, setPopup]                 = useState<ActiveState | null>(null);
  const [modalEntry, setModalEntry]       = useState<ModalEntry | null>(null);
  const [funnelUnlocked, setFunnelUnlocked] = useState(false);
  const funnelRef                         = useRef<HTMLDivElement>(null);
  const orbitRef                          = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth]     = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    // Re-assert after OnboardingModal's cleanup resets overflow to '' on close
    document.body.style.overflow = funnelUnlocked ? 'auto' : 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [funnelUnlocked, modalEntry]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalEntry) return;
      const t = e.target as Element;
      if (!t.closest('.service-node') && !t.closest('.expanded-bubble')) {
        setActive(null); setPopup(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [modalEntry]);

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, []);

  const isMobile      = windowWidth <= 768;
  const activeService = SERVICES.find(s => s.id === active) ?? null;

  const containerSize  = isMobile ? Math.min(0.68 * windowWidth, 320) : D_TOTAL;
  const bubbleSize     = isMobile ? Math.max(52, Math.min(0.13 * windowWidth, 72)) : D_BUBBLE;
  const ringRadius     = isMobile ? containerSize / 2 - bubbleSize / 2 - 6 : D_RING_RADIUS;
  const bubbleFontSize = isMobile ? Math.max(7, Math.min(0.018 * windowWidth, 10)) : D_BUBBLE_FONT;
  const desktopScale   = isMobile ? 1 : Math.min(1, (windowWidth - 32) / D_TOTAL);

  const frozen = active !== null;

  const handleModalClose = () => { setModalEntry(null); setActive(null); };

  const handleBubbleClick = (e: React.MouseEvent<HTMLButtonElement>, svc: (typeof SERVICES)[0]) => {
    e.stopPropagation();
    if (active === svc.id) { setActive(null); setPopup(null); return; }

    const iw = window.innerWidth;
    const ih = window.innerHeight;

    // Sub-bubble geometry (mirrors SubBubbles component)
    const expandedR = isMobile ? Math.min(iw * 0.5, 280) / 2 : 150;
    const gap       = isMobile ? 52 : 80;
    const dist      = expandedR + gap;
    const subSz     = isMobile ? 75 : 90;
    const pad       = 8;

    // Angles: -90° (top), 30° (lower-right), 150° (lower-left)
    // Bounding offsets: dy_min=-dist (top), dy_max=dist*sin30°=dist*0.5, dx_max=dist*cos30°≈dist*0.866
    const minCy = dist       + subSz / 2 + pad;
    const maxCy = ih - dist * 0.5 - subSz / 2 - pad;
    const minCx = dist * 0.866 + subSz / 2 + pad;
    const maxCx = iw - dist * 0.866 - subSz / 2 - pad;

    let centerX = iw / 2;
    let centerY = ih / 2;
    if (orbitRef.current) {
      const r = orbitRef.current.getBoundingClientRect();
      centerX = r.left + r.width  / 2;
      centerY = r.top  + r.height / 2;
    }
    const safeCx = Math.max(minCx, Math.min(maxCx, centerX));
    const safeCy = Math.max(minCy, Math.min(maxCy, centerY));

    setPopup({ id: svc.id, btnCx: safeCx, btnCy: safeCy });
    setActive(svc.id);
  };

  const closePopup        = () => { setActive(null); setPopup(null); };
  const openModalFromPopup = (name: string) => { closePopup(); setModalEntry({ source: 'bubble', service: name }); };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(HOMEPAGE_FAQ_SCHEMA)}</script>
      </Helmet>
      <style>{BUBBLE_CSS}</style>

      <div style={{
        height: '100svh', minHeight: '100svh',
        padding: isMobile ? '16px 20px 24px' : '24px 16px',
        justifyContent: 'space-between',
        background: '#eae2b7',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: "'Mulish', -apple-system, sans-serif", boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Decorative background "i" ── */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '8%',
            right: isMobile ? '-15%' : '2%',
            height: '160%',
            width: 'auto',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          viewBox="0 0 400 1000"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.07">
            <circle cx="200" cy="140" r="78" fill="#f26419"/>
            <rect x="125" y="265" width="150" height="640" rx="75" fill="#f26419"/>
          </g>
        </svg>

        {/* ══ Block 1: Heading + Subtitle ══ */}
        <div style={{ flexShrink: 0, textAlign: 'center', marginTop: 0, maxWidth: 640, padding: '0 16px', paddingBottom: 'clamp(4px, 0.8vh, 10px)', position: 'relative', zIndex: 1 }}>
          <h1 style={{ margin: 0, fontFamily: "'Mulish', -apple-system, sans-serif", fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, color: C.navy, lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            The AI partner you can trust,{' '}<span style={{ fontStyle: 'italic', color: C.orange }}>like that family member you can always count on.</span>
          </h1>
          <p style={{
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(13px, 1.6vw, 16px)',
            color: '#1a3a4a',
            opacity: 0.7,
            lineHeight: 1.5,
            maxWidth: 580,
            margin: '8px auto 0',
            textAlign: 'center',
          }}>
            We install practical AI systems for El Paso businesses so you recover time, stop missing leads, and avoid having to learn every new tool yourself.
          </p>
        </div>

        {/* ══ Block 2: Orbit ══ */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', minHeight: 0, overflow: 'visible', paddingTop: 'clamp(0px, 1vh, 16px)', paddingBottom: 0, marginTop: 'clamp(-8px, -1vh, 0px)', position: 'relative', zIndex: 1, ...(isMobile ? { maxHeight: '60vw', maxWidth: '60vw', alignSelf: 'center' } : {}) }}>
          <div
            ref={orbitRef}
            className="orbit-container"
            style={{
              position: 'relative', width: containerSize, height: containerSize, flexShrink: 0,
              ...(!isMobile && desktopScale < 1 ? {
                transform: `scale(${desktopScale}) translateY(-22px)`, transformOrigin: 'top center',
                marginBottom: -(D_TOTAL * (1 - desktopScale)),
              } : { transform: 'translateY(-22px)' }),
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

            {/* ── Single orbit rotator ── */}
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
                          className={`bbl${svc.bestSeller ? ' bbl-bestseller' : ''}`}
                          style={{
                            position: 'relative',
                            background: svc.nodeBg,
                            fontSize: `${bubbleFontSize}px`, fontWeight: 600,
                            color: svc.nodeText,
                            letterSpacing: '0.04em', textAlign: 'center',
                            textTransform: 'uppercase', lineHeight: 1.35, whiteSpace: 'pre-line',
                            // Active bubble is invisible — the expanded overlay covers it
                            opacity:    isActive ? 0 : (frozen ? 0.25 : 1),
                            filter:     !isActive && frozen ? 'saturate(0.4) blur(1px)' : 'none',
                            transform:  !isActive && frozen ? 'scale(0.85)' : 'scale(1)',
                            transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
                          }}
                        >
                          {svc.bestSeller && (
                            <span style={{
                              position: 'absolute', top: -6, right: -8,
                              background: C.cream, color: C.orange,
                              fontSize: `${Math.max(5, bubbleFontSize * 0.72)}px`,
                              fontWeight: 800, letterSpacing: '0.08em',
                              padding: '1px 4px', borderRadius: 4,
                              lineHeight: 1.3, textTransform: 'uppercase',
                              pointerEvents: 'none',
                            }}>NEW</span>
                          )}
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
              href="https://www.instagram.com/primostudio.us"
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
              <img src={CENTER_LOGO_URL} alt="Primo AI Studio - #1 AI Agency in El Paso, Texas"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', display: 'block' }} />
            </motion.a>
          </div>
        </div>

        {/* ══ Block 3: Hint + Button ══ */}
        <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.5vh, 14px)', marginBottom: 'clamp(28px, 5vh, 52px)', position: 'relative', zIndex: 10 }}>

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

          {/* Explore funnel unlock button */}
          {!funnelUnlocked && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onClick={() => {
                setFunnelUnlocked(true);
                setTimeout(() => funnelRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
              }}
              className="learn-more-btn"
              style={{
                marginTop: 4, background: 'transparent',
                border: `1.5px solid ${C.orange}`,
                borderRadius: 999,
                color: C.orange, fontSize: 11, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: "'Mulish', sans-serif",
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 18px',
              }}
              whileHover={{ backgroundColor: C.orange, color: C.cream }}
            >
              Learn More
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* ── Backdrop — sits below sub-bubbles and expanded bubble ── */}
        <AnimatePresence>
          {frozen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePopup}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(26, 58, 74, 0.15)',
                backdropFilter: 'blur(2px)',
                zIndex: 90,
                pointerEvents: 'auto',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Sub-bubbles — fixed coords, outside rotator ── */}
        <AnimatePresence>
          {frozen && activeService && popup && (
            <SubBubbles
              btnCx={popup.btnCx}
              btnCy={popup.btnCy}
              points={activeService.keyPoints}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        {/* ── Expanded bubble overlay (replaces popup) ── */}
        <AnimatePresence>
          {frozen && activeService && popup && (
            <ExpandedBubble
              svc={activeService}
              btnCx={popup.btnCx}
              btnCy={popup.btnCy}
              isMobile={isMobile}
              windowWidth={windowWidth}
              onClose={closePopup}
              onGetStarted={openModalFromPopup}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Sales Funnel (unlocked on demand) ── */}
      <div ref={funnelRef}>
        {funnelUnlocked && (
          <Suspense fallback={null}>
            <PrimoFunnel onOpenForm={(name) => setModalEntry({ source: 'bubble', service: name })} />
          </Suspense>
        )}
      </div>

      <OnboardingModal entry={modalEntry} onClose={handleModalClose} />
    </>
  );
}
