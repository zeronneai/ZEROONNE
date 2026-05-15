import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// PALETA DE COLORES
// ============================================
const C = {
  cream: '#eae2b7',
  navy: '#1a3a4a',
  orange: '#f26419',
  yellow: '#f5b800',
  green: '#8bbe6e',
};

// ============================================
// DATA DE SERVICIOS
// ============================================
const SERVICES = [
  {
    id: 1,
    label: 'AI\nIntegration',
    name: 'AI Integration',
    description:
      'Plug AI directly into your existing stack. Automate key decisions, eliminate bottlenecks, and unlock new efficiencies — without rebuilding from scratch.',
    bg: C.green,
    text: C.navy,
    keyPoints: ['Custom APIs', 'Workflows', 'Zero rebuild'],
  },
  {
    id: 2,
    label: 'Content\nMarketing',
    name: 'AI Content Marketing',
    description:
      'Scale content creation with intelligent automation. Consistent, high-quality output across every channel — in a fraction of the time.',
    bg: C.orange,
    text: C.cream,
    keyPoints: ['Multi-channel', 'Brand voice', 'Daily output'],
  },
  {
    id: 3,
    label: 'AI Video\nAds',
    name: 'AI Video Production',
    description:
      'Premium video ads crafted by AI. Fast deployment, high conversion rates, and zero agency delays. Your brand, always on.',
    bg: C.navy,
    text: C.cream,
    keyPoints: ['Premium', 'Fast deploy', 'High convert'],
  },
  {
    id: 4,
    label: 'Brand\nIdentity',
    name: 'Brand Identity',
    description:
      'AI-powered visual identity that stands apart. Naming, positioning, and design systems engineered for modern markets and lasting recall.',
    bg: C.yellow,
    text: C.navy,
    keyPoints: ['Naming', 'Design system', 'Built to last'],
  },
  {
    id: 5,
    label: 'Web\nPlatforms',
    name: 'Web Platforms',
    description:
      'High-performance landing pages and web platforms deployed in days. Conversion-optimized, visually premium, and built to scale.',
    bg: C.orange,
    text: C.cream,
    keyPoints: ['Optimized', 'Premium', 'Scalable'],
  },
  {
    id: 6,
    label: 'AI\nAutomation',
    name: 'AI Automation',
    description:
      'Eliminate repetitive work forever. Custom AI workflows handle your operations, nurturing, and reporting so you can focus on growth.',
    bg: C.yellow,
    text: C.navy,
    keyPoints: ['Workflows', 'Auto ops', 'Growth focus'],
  },
];

// ============================================
// HOOK: mobile detection
// ============================================
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
interface PrimoOrbitProps {
  onStartForm: (serviceName: string) => void;
  logoUrl: string;
}

export default function PrimoOrbit({ onStartForm, logoUrl }: PrimoOrbitProps) {
  const [active, setActive] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const activeService = active !== null ? SERVICES.find(s => s.id === active) : null;

  const handleBubbleClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActive(active === id ? null : id);
  };

  const handleClose = () => setActive(null);

  // Cerrar con click fuera
  useEffect(() => {
    if (active === null) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.bubble-clickable')) {
        setActive(null);
      }
    };
    // delay para no cerrar inmediatamente al abrir
    const timer = setTimeout(() => {
      document.addEventListener('click', handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
    };
  }, [active]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: isMobile ? 360 : 620,
        aspectRatio: '1 / 1',
        margin: '0 auto',
      }}
    >
      {/* ============================================
          VISTA A: Orbit con burbujas girando
          ============================================ */}
      <motion.div
        animate={{
          opacity: active === null ? 1 : 0,
          scale: active === null ? 1 : 0.9,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: active === null ? 'auto' : 'none',
        }}
      >
        {/* Anillo punteado */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '88%',
            height: '88%',
            borderRadius: '50%',
            border: `1.5px dashed ${C.navy}33`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo central */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '28%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          <img
            src={logoUrl}
            alt="Primo AI Studio"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Rotor: las 6 burbujas giran como sistema */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          {SERVICES.map((svc, i) => {
            const angleDeg = (360 / SERVICES.length) * i - 90; // empieza arriba
            const angleRad = (angleDeg * Math.PI) / 180;
            const ringRadiusPct = 44; // % del contenedor

            // Posición en %
            const dx = Math.cos(angleRad) * ringRadiusPct;
            const dy = Math.sin(angleRad) * ringRadiusPct;

            return (
              <motion.button
                key={svc.id}
                className="bubble-clickable"
                onClick={(e) => handleBubbleClick(e, svc.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  position: 'absolute',
                  top: `calc(50% + ${dy}%)`,
                  left: `calc(50% + ${dx}%)`,
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? 72 : 105,
                  height: isMobile ? 72 : 105,
                  borderRadius: '50%',
                  background: svc.bg,
                  color: svc.text,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 8,
                  fontSize: isMobile ? 9.5 : 11,
                  fontWeight: 700,
                  fontFamily: "'Mulish', sans-serif",
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 1.25,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 6px 22px rgba(0,0,0,0.12)',
                  outline: 'none',
                }}
              >
                {/* Contra-rotación para que el texto se lea derecho */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {svc.label}
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ============================================
          VISTA B: Cluster expandido
          ============================================ */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            {/* BURBUJA CENTRAL EXPANDIDA */}
            <motion.div
              className="bubble-clickable"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 22,
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                background: activeService.bg,
                color: activeService.text,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '6%',
                boxShadow: '0 16px 50px rgba(0,0,0,0.22)',
                zIndex: 10,
              }}
            >
              {/* X cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '12%',
                  background: 'transparent',
                  border: 'none',
                  color: activeService.text,
                  opacity: 0.5,
                  fontSize: isMobile ? 16 : 20,
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: 4,
                  fontFamily: 'inherit',
                }}
                aria-label="Close"
              >
                ×
              </button>

              {/* Categoría */}
              <p
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  margin: 0,
                  marginBottom: '4%',
                  fontFamily: "'Mulish', sans-serif",
                }}
              >
                {activeService.name}
              </p>

              {/* Descripción */}
              <p
                style={{
                  fontSize: isMobile ? 9.5 : 12,
                  lineHeight: 1.45,
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: '6%',
                  maxWidth: '92%',
                  fontFamily: "'Mulish', sans-serif",
                }}
              >
                {activeService.description}
              </p>

              {/* Botón */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartForm(activeService.name);
                }}
                style={{
                  background: C.orange,
                  color: C.cream,
                  border: 'none',
                  borderRadius: 999,
                  padding: isMobile ? '7px 16px' : '10px 22px',
                  fontSize: isMobile ? 9 : 11,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: "'Mulish', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(242,100,25,0.35)',
                }}
              >
                Get Started →
              </button>
            </motion.div>

            {/* 3 SUB-BURBUJAS distribuidas en triángulo */}
            {activeService.keyPoints.map((point, i) => {
              // Triángulo perfecto: -90° (arriba), 30° (abajo-der), 150° (abajo-izq)
              const angles = [-90, 30, 150];
              const angleRad = (angles[i] * Math.PI) / 180;
              const distancePct = 38; // % del contenedor desde centro
              const dx = Math.cos(angleRad) * distancePct;
              const dy = Math.sin(angleRad) * distancePct;

              const palette = [
                { bg: C.cream, text: C.navy },
                { bg: C.green, text: C.navy },
                { bg: C.orange, text: C.cream },
              ];

              return (
                <motion.div
                  key={`sub-${i}`}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 230,
                    damping: 20,
                    delay: 0.25 + i * 0.1,
                  }}
                  style={{
                    position: 'absolute',
                    top: `calc(50% + ${dy}%)`,
                    left: `calc(50% + ${dx}%)`,
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 70 : 100,
                    height: isMobile ? 70 : 100,
                    borderRadius: '50%',
                    background: palette[i].bg,
                    color: palette[i].text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 8,
                    fontSize: isMobile ? 9 : 11,
                    fontFamily: "'Mulish', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                    boxShadow: '0 6px 22px rgba(0,0,0,0.18)',
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  {point}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
