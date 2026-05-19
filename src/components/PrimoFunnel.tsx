import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform,
  useMotionValue, useSpring, useReducedMotion,
  animate, LayoutGroup,
} from 'framer-motion';
import { PrimoIcon, IconName } from './PrimoIcon';

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  navy:   '#1a3a4a',
  orange: '#f26419',
  yellow: '#f5b800',
  green:  '#8bbe6e',
  cream:  '#eae2b7',
};

// ── Easings ───────────────────────────────────────────────────────────────────
const EASE_OUT:  [number,number,number,number] = [0.22, 1, 0.36, 1];
const EASE_MICRO:[number,number,number,number] = [0.34, 1.56, 0.64, 1];

// ── Global CSS ────────────────────────────────────────────────────────────────
const FUNNEL_CSS = `
  @media (max-width: 768px) { .dot-nav-desktop { display: none !important; } }
  @media (max-width: 768px) { .primo-comparison { grid-template-columns: 1fr !important; gap: 20px !important; } }
  @media (max-width: 768px) { .primos-grid { grid-template-columns: 1fr !important; gap: 20px !important; } }
  @keyframes spine-pulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);   box-shadow: 0 0 0 0   rgba(242,100,25,0.6); }
    50%      { transform: translate(-50%,-50%) scale(1.2); box-shadow: 0 0 0 8px rgba(242,100,25,0);   }
  }
  @keyframes ping-ring {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0;   }
  }
`;

// ── Interfaces ────────────────────────────────────────────────────────────────
interface PrimoFunnelProps { onOpenForm: (serviceName?: string) => void; }

// ── AnimatedHeading ───────────────────────────────────────────────────────────
function AnimatedHeading({ text, color, size = 'clamp(32px,5vw,54px)', center = false }:
  { text: string; color: string; size?: string; center?: boolean }) {
  const words = text.split(' ');
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  return (
    <h2 ref={ref} style={{
      margin: 0, fontSize: size, fontWeight: 900, color, lineHeight: 1.1,
      display: 'flex', flexWrap: 'wrap', gap: '0.28em',
      justifyContent: center ? 'center' : undefined,
      fontFamily: "'Mulish', sans-serif",
    }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            initial={{ y: reduced ? 0 : '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay: i * 0.06 }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', color }: { to: number; suffix?: string; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(to); return; }
    const ctrl = animate(0, to, {
      duration: 1.8, ease: EASE_OUT,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, to, reduced]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── CTA Button (pill, consistent sizing) ──────────────────────────────────────
function CtaBtn({ label, onClick, variant = 'primary' }:
  { label: string; onClick: () => void; variant?: 'primary' | 'outline' | 'ghost' }) {
  const reduced = useReducedMotion();
  const styles: React.CSSProperties = {
    height: 48, padding: '0 28px', borderRadius: 50,
    fontSize: 'clamp(11px,1.3vw,13px)', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    cursor: 'pointer', border: 'none', fontFamily: "'Mulish', sans-serif",
    display: 'inline-flex', alignItems: 'center', gap: 8,
    ...(variant === 'primary'
      ? { background: C.orange, color: C.cream, boxShadow: '0 4px 24px rgba(242,100,25,0.38)' }
      : variant === 'outline'
      ? { background: 'transparent', color: C.cream, border: `2px solid rgba(234,226,183,0.5)` }
      : { background: C.cream, color: C.navy, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }),
  };
  return (
    <motion.button onClick={onClick} style={styles}
      whileHover={reduced ? {} : { scale: 1.04, boxShadow: '0 8px 32px rgba(242,100,25,0.45)' }}
      whileTap={reduced ? {} : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE_MICRO }}
    >
      {label}
    </motion.button>
  );
}

// ── DotNav ────────────────────────────────────────────────────────────────────
const DOT_LABELS = ['We Handle It','The System','Built For You','Client Journey','Pricing','The Data','Your 90 Days','Get Started'];

function DotNav({ activeSection }: { activeSection: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <LayoutGroup>
      <div className="dot-nav-desktop" style={{
        position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 14, zIndex: 200,
      }}>
        {DOT_LABELS.map((label, i) => (
          <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}
                  style={{
                    background: C.navy, color: C.cream, borderRadius: 6,
                    padding: '4px 10px', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', whiteSpace: 'nowrap',
                    fontFamily: "'Mulish', sans-serif",
                  }}
                >
                  {label}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => document.getElementById(`funnel-section-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative', width: 10, height: 10, borderRadius: '50%',
                border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
                background: activeSection === i ? C.orange : 'rgba(26,58,74,0.25)',
                transition: 'background 0.2s, transform 0.2s',
                transform: activeSection === i ? 'scale(1.2)' : 'scale(1)',
              }}
            >
              {activeSection === i && (
                <motion.span
                  layoutId="active-dot"
                  style={{
                    position: 'absolute', inset: -3, borderRadius: '50%',
                    border: `2px solid ${C.orange}`, background: 'transparent',
                  }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}

// ── Vertical Spine (Section 3 & 6) ───────────────────────────────────────────
interface SpineCard {
  label: string;
  icon: IconName;
  title: string;
  body: string;
}

function SpineSection({
  id, bg, textColor, labelColor, supLabel, heading, subtitle, cards, ctaLabel, onCta,
}: {
  id: string; bg: string; textColor: string; labelColor: string;
  supLabel: string; heading: string; subtitle: string;
  cards: SpineCard[]; ctaLabel: string; onCta: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);
  const reduced = useReducedMotion();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const spineLeft = isMobile ? 24 : '50%';

  return (
    <section id={id} ref={sectionRef} style={{
      background: bg, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vh,56px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: labelColor }}
          >
            {supLabel}
          </motion.p>
          <AnimatedHeading text={heading} color={textColor} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
            style={{
              margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400,
              color: `${textColor}aa`, maxWidth: 480, lineHeight: 1.6,
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Spine + cards */}
        <div style={{ position: 'relative', paddingBottom: 24 }}>

          {/* Track */}
          <div style={{
            position: 'absolute',
            left: spineLeft, top: 0, bottom: 0, width: 2,
            transform: isMobile ? 'none' : 'translateX(-50%)',
            background: `${textColor}12`,
          }}>
            <motion.div style={{
              width: '100%',
              height: reduced ? '100%' : lineH,
              background: `linear-gradient(180deg,${C.orange} 0%,${C.yellow} 50%,${C.green} 100%)`,
              boxShadow: `0 0 20px ${C.orange}55`,
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vw,40px)' }}>
            {cards.map((card, i) => {
              const side = isMobile ? 'right' : (i % 2 === 0 ? 'left' : 'right');
              return (
                <SpineCard key={i} card={card} index={i} side={side}
                  isMobile={isMobile} textColor={textColor} bg={bg} reduced={!!reduced} />
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: 56 }}
        >
          <CtaBtn label={ctaLabel} onClick={onCta} variant="primary" />
        </motion.div>
      </div>
    </section>
  );
}

function SpineCard({ card, index, side, isMobile, textColor, bg, reduced }:
  { card: SpineCard; index: number; side: 'left'|'right'; isMobile: boolean; textColor: string; bg: string; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} style={{
      display: 'flex',
      justifyContent: isMobile ? 'flex-end' : (side === 'left' ? 'flex-end' : 'flex-start'),
      paddingLeft: isMobile ? 48 : (side === 'right' ? 'calc(50% + 32px)' : undefined),
      paddingRight: isMobile ? undefined : (side === 'left' ? 'calc(50% + 32px)' : undefined),
      position: 'relative',
    }}>
      {/* Spine node */}
      <div style={{
        position: 'absolute',
        left: isMobile ? 24 : '50%',
        top: 28,
        width: 16, height: 16, borderRadius: '50%',
        background: `linear-gradient(135deg,${C.orange},${C.yellow})`,
        border: `3px solid ${bg}`,
        boxSizing: 'border-box',
        animation: `spine-pulse 2.5s ease-in-out infinite`,
        animationDelay: `${index * 0.4}s`,
      }} />

      {/* Card */}
      <motion.div
        initial={reduced ? {} : { opacity: 0, x: side === 'left' ? -60 : 60, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
        transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
        style={{
          background: textColor === C.cream ? 'rgba(234,226,183,0.06)' : 'white',
          border: `1px solid ${textColor === C.cream ? 'rgba(234,226,183,0.1)' : 'rgba(26,58,74,0.08)'}`,
          borderRadius: 18, padding: '24px 28px',
          maxWidth: 420, width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <PrimoIcon name={card.icon} size={44} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange }}>{card.label}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: textColor, marginBottom: 10, lineHeight: 1.25 }}>{card.title}</div>
        <div style={{ fontSize: 13, fontWeight: 400, color: `${textColor}99`, lineHeight: 1.65 }}>{card.body}</div>
      </motion.div>
    </div>
  );
}

// ── Magnetic Card (Section 2) ─────────────────────────────────────────────────
function MagneticCard({ card, delay }: { card: typeof ICP_CARDS[0]; delay: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-100,100],[8,-8]), { stiffness: 150, damping: 15 });
  const rotY = useSpring(useTransform(mx, [-100,100],[-8,8]), { stiffness: 150, damping: 15 });
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }, [mx, my, reduced]);

  const handleLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: EASE_OUT, delay }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: reduced ? 0 : rotX,
        rotateY: reduced ? 0 : rotY,
        transformStyle: 'preserve-3d',
        background: 'rgba(234,226,183,0.05)',
        border: '1px solid rgba(234,226,183,0.1)',
        borderRadius: 20, padding: '32px 24px', cursor: 'default',
      }}
      whileHover={reduced ? {} : { y: -8, boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}
    >
      <div style={{ marginBottom: 14 }}><PrimoIcon name={card.icon} size={56} /></div>
      <div style={{
        fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(16px, 1.9vw, 19px)',
        fontWeight: 800, color: C.cream, marginBottom: 12, lineHeight: 1.25,
        letterSpacing: '-0.01em',
      }}>
        {card.title}
      </div>
      <div style={{
        fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)',
        fontWeight: 500, color: 'rgba(234,226,183,0.8)', lineHeight: 1.55,
      }}>
        {card.hook}
      </div>
      <div style={{
        fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(13px, 1.6vw, 16px)',
        fontWeight: 700, fontStyle: 'italic', color: C.orange, lineHeight: 1.4,
        marginTop: 14, paddingTop: 14,
        borderTop: '1px solid rgba(234,226,183,0.15)',
      }}>
        {card.closing}
      </div>
    </motion.div>
  );
}

// ── Floating Shape (Section 7) ────────────────────────────────────────────────
function FloatingShape({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      initial={{ x, y, opacity: 0 }}
      animate={{ x: [x, x+30, x-20, x], y: [y, y-40, y+20, y], opacity: 0.07 }}
      transition={{ duration: 20, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', width: size, height: size, borderRadius: '50%',
        background: C.cream, pointerEvents: 'none',
      }}
    />
  );
}

// ── Section Intro — We Handle It ─────────────────────────────────────────────
const LEFT_ITEMS = [
  'Sit through 3 "discovery" calls',
  'Read 40-page technical proposals',
  'Learn what "MCP" and "RAG" mean',
  'Pretend you understood the architecture',
  "Approve invoices for things you can't pronounce",
  'Wait 6 months for "results"',
  'Realize nothing is actually working',
  'Pay for another agency to fix it',
];

const RIGHT_ITEMS = [
  "Tell us what's eating your time",
  "We tell you what we'll handle",
  'We build it',
  'You get your time back',
];

function SectionIntro({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const reduced = useReducedMotion();

  return (
    <section id="funnel-section-0" style={{
      background: C.cream,
      padding: 'clamp(80px, 14vh, 140px) clamp(20px, 5vw, 60px)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* Heading block */}
      <div style={{ maxWidth: 1000, textAlign: 'center', marginBottom: 'clamp(40px, 8vh, 80px)' }}>
        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(28px, 5.5vw, 56px)',
            fontWeight: 900,
            color: C.navy,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            marginTop: 0,
          }}
        >
          API keys. Webhooks. Deployments.<br />
          Vector databases. LLM fine-tuning.<br />
          SDKs. RAG pipelines.
        </motion.h2>

        <motion.p
          initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: C.orange,
            marginBottom: 24,
            marginTop: 0,
          }}
        >
          Yawn.
        </motion.p>

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.7, ease: EASE_OUT }}
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            fontWeight: 500,
            color: C.navy,
            opacity: 0.7,
            lineHeight: 1.6,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          If just reading those words made you want to close the tab, you found the right primo.
        </motion.p>
      </div>

      {/* Comparison grid */}
      <div className="primo-comparison" style={{
        width: '100%',
        maxWidth: 1100,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(20px, 3vw, 40px)',
      }}>

        {/* Left — what others make you do */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          style={{
            background: 'rgba(26,58,74,0.06)',
            border: '1px solid rgba(26,58,74,0.15)',
            borderRadius: 20,
            padding: 'clamp(28px, 4vw, 44px)',
          }}
        >
          <p style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 11, fontWeight: 800,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.navy, opacity: 0.5, marginBottom: 24, marginTop: 0,
          }}>
            What most agencies make you do
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {LEFT_ITEMS.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12,
                fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: C.navy, opacity: 0.75, lineHeight: 1.5 }}>
                <span style={{ color: C.navy, opacity: 0.4, flexShrink: 0, fontWeight: 700 }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — what you do with Primo */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
          style={{
            background: C.navy,
            borderRadius: 20,
            padding: 'clamp(28px, 4vw, 44px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Soft background circle */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180,
            borderRadius: '50%', background: C.orange, opacity: 0.08, pointerEvents: 'none' }} />

          <p style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 11, fontWeight: 800,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.orange, marginBottom: 24, marginTop: 0, position: 'relative',
          }}>
            What you do with Primo
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0,
            display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
            {RIGHT_ITEMS.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14,
                fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(15px, 1.8vw, 18px)',
                fontWeight: 600, color: C.cream, lineHeight: 1.5 }}>
                <span style={{
                  background: C.orange, color: C.cream,
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(234,226,183,0.15)',
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            fontStyle: 'italic', color: C.cream, opacity: 0.7,
            textAlign: 'center', position: 'relative', marginBottom: 0,
          }}>
            That&apos;s it. That&apos;s the process.
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7, ease: EASE_OUT }}
        style={{ marginTop: 'clamp(40px, 8vh, 80px)', textAlign: 'center' }}
      >
        <CtaBtn label="Tell us what's eating your time →" onClick={() => onOpenForm()} />
      </motion.div>

    </section>
  );
}

// ── Section LLM SEO + AEO — Flagship ─────────────────────────────────────────
const LLM_COLS = [
  {
    title: 'What We Build',
    bullets: [
      'Schema markup optimization that LLMs actually read',
      'Citation architecture so AI agents quote you, not your competition',
      'Content engineered for LLM extraction (FAQs, structured answers)',
      'Authority signals across your entire web presence',
    ],
  },
  {
    title: 'Without It',
    bullets: [
      "Customers ask AI 'who can help me?' — and you're not in the answer",
      'Your competitors get recommended by ChatGPT for your service',
      'Google traffic keeps shrinking as users switch to AI search',
      "You stay invisible to a generation that doesn't 'Google' anymore",
    ],
  },
  {
    title: "When It's Done Right",
    bullets: [
      'Your business name shows up when prospects ask AI for recommendations',
      'AI agents cite your content as the authoritative source',
      'You capture leads that Google never even saw',
      "First-mover advantage in a market most competitors haven't noticed",
    ],
  },
];

function SectionLLM({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const reduced = useReducedMotion();

  return (
    <section style={{
      background: C.orange,
      padding: 'clamp(72px,10vh,110px) clamp(20px,5vw,60px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(26,58,74,0.18) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vh,64px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{
              margin: '0 0 16px',
              fontFamily: "'Mulish', sans-serif",
              fontSize: 10, fontWeight: 800, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: `${C.cream}bb`,
            }}
          >
            OUR FLAGSHIP SERVICE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
            style={{
              margin: '0 0 20px',
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900,
              color: C.cream, lineHeight: 1.1, letterSpacing: '-0.02em',
            }}
          >
            Get Found by ChatGPT, Claude,<br />Perplexity, and Gemini.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{
              margin: '0 auto',
              maxWidth: 580,
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 400,
              color: `${C.cream}cc`, lineHeight: 1.65,
            }}
          >
            While your competitors optimize for Google, the future is asking AI.
            We make sure your business is the answer — not someone else&apos;s.
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(16px,2.5vw,28px)',
          marginBottom: 'clamp(36px,5vh,56px)',
        }}>
          {LLM_COLS.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.1 }}
              style={{
                background: C.cream,
                borderRadius: 18,
                padding: 'clamp(24px,3vw,36px)',
              }}
            >
              <div style={{
                fontFamily: "'Mulish', sans-serif",
                fontSize: 10, fontWeight: 800, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: C.orange,
                marginBottom: 16,
              }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.bullets.map((b, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    fontFamily: "'Mulish', sans-serif",
                    fontSize: 'clamp(13px,1.5vw,15px)', fontWeight: 500,
                    color: C.navy, lineHeight: 1.55, opacity: 0.88,
                  }}>
                    <span style={{ color: C.orange, flexShrink: 0, fontWeight: 800, marginTop: 2 }}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <motion.button
            onClick={() => onOpenForm('LLM Optimization')}
            whileHover={reduced ? {} : { scale: 1.04, boxShadow: '0 12px 40px rgba(26,58,74,0.28)' }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_MICRO }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.cream, color: C.navy,
              padding: '14px 36px', borderRadius: 999,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(11px,1.3vw,13px)', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              boxShadow: '0 4px 24px rgba(26,58,74,0.18)',
            }}
          >
            Book a Free Discovery Call →
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

// ── Section 1 — The System ────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Audit & Strategy', sub: 'We listen. You vent.', desc: "30 minutes on a call. You tell us what's eating your week. We tell you exactly what we can take off your plate. No 'discovery framework.' No pitch deck." },
  { num: '02', title: 'Build & Integrate', sub: 'We disappear for 2 weeks.', desc: "We build everything in the background. No daily Slack pings. No 'just need 30 minutes of your time.' You keep running your business. We keep building." },
  { num: '03', title: 'Activate & Launch', sub: 'Your business gets superpowers.', desc: "We turn it on. You see leads getting answered at 3am. Content posting itself. Reports landing in your inbox. The 15 hours of admin you used to do — gone." },
  { num: '04', title: 'Optimize & Scale', sub: 'We keep making it sharper.', desc: "Once one system runs itself, we add the next. Quarter by quarter, your business becomes AI-native — and you never had to learn what that means." },
];

function Section1({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [tooltip, setTooltip] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="funnel-section-1" ref={ref} style={{
      background: C.cream, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vh,56px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
          >
            The System
          </motion.p>
          <AnimatedHeading text="You don't need to learn AI. You need someone who already did." color={C.navy} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 620, lineHeight: 1.6 }}
          >
            Here's how we take you from 'I should probably look into AI' to 'my business basically runs itself' — in 4 moves.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'clamp(20px,3vw,40px)', marginBottom: 56 }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={reduced
                ? { duration: 0.3, delay: i * 0.07 }
                : { type: 'spring', stiffness: 200, damping: 16, delay: i * 0.15 }}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: 'relative', background: C.navy, borderRadius: 20,
                padding: '36px 28px', cursor: 'default', overflow: 'hidden',
                boxShadow: tooltip === i ? '0 16px 48px rgba(26,58,74,0.22)' : '0 4px 16px rgba(26,58,74,0.08)',
                transition: 'box-shadow 0.25s',
              }}
            >
              {/* Ripple ring */}
              {inView && !reduced && (
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: 40, height: 40, borderRadius: '50%',
                  border: `2px solid ${C.orange}`,
                  animation: `ping-ring 1.2s ease-out forwards`,
                  animationDelay: `${i * 0.18}s`,
                  pointerEvents: 'none',
                }} />
              )}
              <div style={{ fontSize: 38, fontWeight: 900, color: C.orange, lineHeight: 1, marginBottom: 12, fontFamily: "'Mulish',sans-serif" }}>{step.num}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.cream, marginBottom: 6, lineHeight: 1.2 }}>{step.title}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', color: `${C.cream}bb`, marginBottom: 10, lineHeight: 1.3 }}>{(step as any).sub}</div>
              <AnimatePresence>
                {tooltip === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.78)', lineHeight: 1.55 }}
                  >
                    {step.desc}
                  </motion.div>
                )}
              </AnimatePresence>
              {tooltip !== i && (
                <div style={{ fontSize: 12, fontWeight: 600, color: `${C.orange}99`, letterSpacing: '0.08em' }}>Hover to learn more →</div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.65 }}
          style={{ textAlign: 'center' }}
        >
          <CtaBtn label="Start my growth plan →" onClick={() => onOpenForm()} />
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 2 — Built For You ─────────────────────────────────────────────────
const ICP_CARDS = [
  { icon: 'healthcare' as IconName, title: 'Healthcare & Wellness Clinics',    hook: "You're booking patients, training staff, handling insurance. The last thing you need is to learn how to 'prompt engineer' an intake bot.",                                                 closing: 'We install it. You see patients.',          color: C.green  },
  { icon: 'legal'      as IconName, title: 'Legal & Professional Services',     hook: "Your billable hours are too valuable to spend on data entry, lead follow-up, or figuring out which AI tool won't hallucinate.",                                                              closing: 'We build the systems. You bill the hours.', color: C.yellow },
  { icon: 'realestate' as IconName, title: 'Real Estate & Finance',             hook: "Speed wins deals. You need to respond to leads in seconds, not 'when I get back to my desk.'",                                                                                              closing: 'We make your business answer 24/7. You close the deal.', color: C.orange },
  { icon: 'ecommerce'  as IconName, title: 'E-Commerce & Retail',               hook: "You're managing inventory, shipping, customer support, ads, and content. AI can run 4 of those for you. You probably know which 4.",                                                        closing: 'We set it up. You watch margins improve.',  color: C.cream  },
  { icon: 'education'  as IconName, title: 'Education & Coaching',               hook: "You sell knowledge — and your time is the bottleneck. AI agents can scale your expertise without scaling your hours.",                                                                      closing: 'We clone your process. You scale your impact.', color: C.green },
];

function Section2({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="funnel-section-2" ref={ref} style={{
      background: C.navy, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vh,56px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
          >
            Built For You
          </motion.p>
          <AnimatedHeading text="Built for owners who don't have time to become AI experts." color={C.cream} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 500, color: 'rgba(234,226,183,0.7)', maxWidth: 620, lineHeight: 1.55 }}
          >
            If you&apos;re growing a business, you&apos;re already wearing 12 hats. We&apos;re not going to hand you a 13th. We handle this one for you.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'clamp(20px,3vw,40px)', marginBottom: 56 }}>
          {ICP_CARDS.map((card, i) => (
            <MagneticCard key={i} card={card} delay={0.06 * i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <CtaBtn label="See what we'd build for you →" onClick={() => onOpenForm()} variant="outline" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 3 — Client Journey (Spine) ───────────────────────────────────────
const JOURNEY_CARDS: SpineCard[] = [
  { label: 'Discovery',        icon: 'discovery'        as IconName, title: 'Discovery',                        body: 'A 30-min call. No pitch deck. Just you telling us what\'s draining your week, and us telling you what we can handle.' },
  { label: 'First Impression', icon: 'firstimpression'  as IconName, title: 'First Impression',                 body: 'Within 5 days you get a one-page plan: what we\'ll build, what you\'ll save, what it\'ll cost. No jargon. No fluff.' },
  { label: 'Nurture',          icon: 'nurture'          as IconName, title: 'Build Phase',                      body: 'While we\'re building, you keep running your business. No 2-hour weekly check-ins. We don\'t need you to \'learn.\'' },
  { label: 'Conversion',       icon: 'conversion'       as IconName, title: 'First Win',                        body: 'Within 14-21 days, your first system is running. Real results, not slides. You see numbers change. That\'s the only deliverable that matters.' },
  { label: 'Delivery',         icon: 'delivery'         as IconName, title: 'Handoff (Without the Burden)',     body: 'You get the system. We keep the maintenance. You don\'t need to know what\'s under the hood. You just need it to work.' },
  { label: 'Retention',        icon: 'retention'        as IconName, title: 'Running Quietly',                  body: 'No 47 Slack channels. No \'where\'s that login again?\' emails. The system runs. We keep it running. You stay focused.' },
  { label: 'Advocacy',         icon: 'advocacy'         as IconName, title: 'They Start Asking How',            body: 'Your competitors notice your faster response times, your tighter margins, your team that suddenly has free hours. Let them wonder.' },
  { label: 'Mastery',          icon: 'mastery'          as IconName, title: 'Add the Next Layer',               body: 'Once one system runs itself, we add the next. One quarter at a time, your business becomes AI-native — without you ever learning what \'AI-native\' means.' },
];

function Section3({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  return (
    <SpineSection
      id="funnel-section-3"
      bg={C.cream} textColor={C.navy} labelColor={C.orange}
      supLabel="Client Journey"
      heading="From the first hello to running on autopilot."
      subtitle="Eight stages. We handle them all. You just show up to do what you do best."
      cards={JOURNEY_CARDS}
      ctaLabel="Map my client journey →"
      onCta={() => onOpenForm()}
    />
  );
}

// ── Section 4 — Pricing ───────────────────────────────────────────────────────
const PRICING_CARDS = [
  { name: 'AI Audit', price: '$497', period: 'one-time', badge: null, tagline: 'For the curious.', color: C.cream, bg: C.navy, desc: 'A deep-dive into your business. We map every workflow we can automate, calculate the ROI, and hand you a roadmap. Use it with us — or anywhere. Yours to keep.', features: ['Full operational audit','AI opportunity map','Custom ROI projections','90-day implementation roadmap'], cta: 'Book my audit →' },
  { name: 'Sprint', price: '$2,500', period: '/month', badge: null, tagline: 'For one painful bottleneck.', color: C.navy, bg: C.orange, desc: 'One system, fully built and installed in 30 days. Pick the workflow that\'s eating your time. We\'ll make it run itself.', features: ['1 fully-built AI system','Team training (under 2 hours)','30-day support','Plain-English documentation'], cta: 'Start a sprint →' },
  { name: 'Growth', price: '$4,500', period: '/month', badge: 'Most Popular', tagline: 'For real growth.', color: C.cream, bg: C.navy, desc: 'Three integrated systems running across your business. The package most owners pick when they\'re ready to scale operations without scaling headcount.', features: ['3 integrated AI systems','Custom dashboard with your KPIs','Workflow automation across departments','60-day support + monthly check-ins'], cta: "Let's grow →" },
  { name: 'Scale', price: '$8,000', period: '/month', badge: null, tagline: 'For going AI-native.', color: C.navy, bg: C.yellow, desc: 'Multi-department infrastructure. Custom agents, voice/chat bots, content engine, automated reporting. Built for businesses ready to compound their advantage every month.', features: ['Multi-department AI infrastructure','Custom agents + voice/chat bots','Content engine + automated reporting','Quarterly strategy sessions'], cta: 'Scale up →' },
  { name: 'Enterprise', price: 'Custom', period: '', badge: null, tagline: 'For full transformation.', color: C.cream, bg: C.navy, desc: "When AI isn't a project — it's how the business operates. Multi-location, multi-department, custom development. Built around your operation, not a template.", features: ['Custom-built for your operation','Dedicated team','White-glove implementation','Ongoing strategic partnership'], cta: 'Book strategy call →' },
];

const POPULAR_IDX = 2;

function Section4({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const pricingCols = winW >= 900 ? 'repeat(5, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(260px, 1fr))';

  return (
    <section id="funnel-section-4" ref={ref} style={{
      background: C.navy, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vh,56px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
          >
            Pricing
          </motion.p>
          <AnimatedHeading text="Pick where you start. We'll grow with you." color={C.cream} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(234,226,183,0.6)', maxWidth: 560, lineHeight: 1.6 }}
          >
            Most clients break even within 60 days. Some within 30. We'll show you the math before you sign anything.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: pricingCols, gap: 'clamp(12px,2vw,24px)', marginBottom: 48, alignItems: 'stretch' }}>
          {PRICING_CARDS.map((card, i) => {
            const isPopular = i === POPULAR_IDX;
            const delay = isPopular ? (PRICING_CARDS.length * 0.08) : (i * 0.08);
            const springConfig = isPopular
              ? { type: 'spring' as const, stiffness: 220, damping: 14, mass: 1.2, delay }
              : { duration: 0.75, ease: EASE_OUT, delay };
            return (
              <motion.div
                key={i}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={reduced ? { duration: 0.3 } : springConfig}
                whileHover={reduced ? {} : { y: -8 }}
                style={{
                  background: card.bg, borderRadius: 20, padding: 'clamp(20px,2.5vw,28px) clamp(16px,2vw,22px)',
                  display: 'flex', flexDirection: 'column',
                  height: '100%', minHeight: 460,
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isPopular ? `0 8px 48px ${C.orange}44` : '0 2px 12px rgba(0,0,0,0.12)',
                }}
              >
                {card.badge && (
                  <motion.div
                    initial={reduced ? {} : { scale: 0 }}
                    animate={inView ? { scale: [0, 1.15, 1] } : {}}
                    transition={reduced ? { duration: 0 } : { duration: 0.4, delay: delay + 0.4, ease: EASE_MICRO }}
                    style={{
                      position: 'absolute', top: 16, right: 16,
                      background: C.navy, color: C.cream, borderRadius: 999,
                      padding: '4px 12px', fontSize: 10, fontWeight: 800,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}
                  >
                    {card.badge}
                  </motion.div>
                )}
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${card.color}99`, marginBottom: 3 }}>{card.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, fontStyle: 'italic', color: `${card.color}cc`, marginBottom: 10 }}>{(card as any).tagline}</div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 'clamp(26px,3vw,34px)', fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.price}</span>
                  {card.period && <span style={{ fontSize: 11, fontWeight: 500, color: `${card.color}88`, marginLeft: 3 }}>{card.period}</span>}
                </div>
                <div style={{ fontSize: 12, fontWeight: 400, color: `${card.color}bb`, lineHeight: 1.5, marginBottom: 14 }}>{card.desc}</div>
                <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {card.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, fontWeight: 500, color: `${card.color}cc` }}>
                      <span style={{ color: card.bg === C.orange ? C.navy : C.orange, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onOpenForm(card.name)}
                  style={{
                    marginTop: 'auto', height: 44, padding: '0 20px', borderRadius: 50,
                    background: card.bg === C.orange ? C.navy : C.orange,
                    color: C.cream, border: 'none',
                    fontSize: 'clamp(11px,1.3vw,12px)', fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Mulish',sans-serif",
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.86'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                >
                  {card.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.35)', margin: 0 }}
        >
          All plans include a 30-day performance guarantee. No lock-in. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}

// ── Section 5 — Stats ─────────────────────────────────────────────────────────
const STATS = [
  { to: 75, suffix: '%', heading: 'of small businesses', label: 'are already using or exploring AI in 2026. The other 25% are about to be playing very expensive catch-up. Source: Reimagine Main Street.', color: C.orange },
  { to: 9, suffix: 'x', heading: 'more leads converted', label: "by businesses that respond in under 5 minutes vs over 30 minutes. AI doesn't sleep, doesn't take lunch, and doesn't drop the ball.", color: C.yellow },
  { to: 15, suffix: '+', heading: 'hours saved per week', label: "is what our average client gets back after their first Primo system goes live. That's a full working day, every week, for the rest of your business's life.", color: C.green },
];

function Section5() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="funnel-section-5" ref={ref} style={{
      background: C.cream, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px,4vh,56px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
          >
            The Data
          </motion.p>
          <AnimatedHeading text="The numbers your competitors don't want you to see." color={C.navy} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 560, lineHeight: 1.6 }}
          >
            These aren't projections. This is what happens to local businesses that stop guessing about AI and start using it.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'clamp(20px,3vw,40px)' }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.1 + i * 0.1 }}
              style={{ background: C.navy, borderRadius: 22, padding: '48px 32px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 'clamp(56px,8vw,96px)', fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: 8, fontFamily: "'Mulish',sans-serif" }}>
                <Counter to={stat.to} suffix={stat.suffix} color={stat.color} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: stat.color, marginBottom: 10, lineHeight: 1.3, fontFamily: "'Mulish',sans-serif" }}>{(stat as any).heading}</div>
              <div style={{ fontSize: 14, fontWeight: 400, color: 'rgba(234,226,183,0.68)', lineHeight: 1.55 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5b — Why El Paso Businesses Trust Primo ──────────────────────────
const TRUST_CARDS = [
  { title: 'Bilingual by default', text: "Every system we build works in English AND Spanish. No 'we'll add Spanish in phase 2.' It just works." },
  { title: 'We work on local time', text: "When you call, you don't get a queue from Bangalore. You get a human, in El Paso, who answers in under 4 hours." },
  { title: 'We know your competitors', text: "We know what's happening in El Paso, Juárez, Las Cruces. We're not building for 'small business owners' in general. We're building for YOUR market." },
];
const TRUST_ICONS: (IconName | null)[] = [null, 'clock', 'location'];

function Section5b() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="funnel-section-5b" style={{
      background: C.cream,
      padding: 'clamp(80px, 14vh, 140px) clamp(20px, 5vw, 60px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vh, 80px)' }}>
          <AnimatedHeading
            text="We're not a Silicon Valley agency that 'also serves' El Paso. We're from here. We work like you do."
            color={C.navy}
            center
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: `${C.navy}aa`, maxWidth: 560, lineHeight: 1.6 }}
          >
            Most agencies want to put you on a 45-day Slack-based onboarding. We'd rather meet you for coffee at L&J.
          </motion.p>
        </div>

        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
        }}>
          {TRUST_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE_OUT, delay: i * 0.1 }}
              style={{
                background: 'white',
                borderRadius: 22,
                padding: 'clamp(28px, 4vw, 40px)',
                boxShadow: '0 2px 16px rgba(26,58,74,0.07)',
                border: '1px solid rgba(26,58,74,0.07)',
              }}
            >
              <div style={{ marginBottom: 20, fontSize: 48, lineHeight: 1 }}>
                {TRUST_ICONS[i] ? <PrimoIcon name={TRUST_ICONS[i]!} size={64} /> : <span>🇲🇽🇺🇸</span>}
              </div>
              <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(16px, 1.9vw, 19px)', fontWeight: 800, color: C.navy, marginBottom: 12, lineHeight: 1.25 }}>
                {card.title}
              </div>
              <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 500, color: `${C.navy}bb`, lineHeight: 1.6 }}>
                {card.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5c — Meet your primos ────────────────────────────────────────────
function Section5c() {
  return (
    <section
      id="funnel-section-5c"
      style={{
        background: '#1a3a4a',
        padding: 'clamp(80px, 14vh, 140px) clamp(20px, 5vw, 60px)',
        color: '#eae2b7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decoración: i naranja gigante de fondo */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          left: '-8%',
          height: '80%',
          width: 'auto',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
        viewBox="0 0 400 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle cx="200" cy="140" r="78" fill="#f26419"/>
          <rect x="125" y="265" width="150" height="640" rx="75" fill="#f26419"/>
        </g>
      </svg>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 10vh, 100px)' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-block',
              fontFamily: "'Mulish', sans-serif",
              fontSize: 11, fontWeight: 800, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#f26419',
              background: 'rgba(242, 100, 25, 0.1)',
              padding: '6px 14px', borderRadius: 20,
              border: '1px solid rgba(242, 100, 25, 0.3)',
              marginBottom: 24,
            }}
          >
            ✦ Meet your primos
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900,
              lineHeight: 1.05, letterSpacing: '-0.025em',
              margin: '0 auto 24px', maxWidth: 900,
            }}
          >
            Same blood.{' '}
            <span style={{ color: '#f26419' }}>Same border.</span>{' '}
            Same mission.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(15px, 1.9vw, 18px)', fontWeight: 500,
              lineHeight: 1.6, color: 'rgba(234, 226, 183, 0.85)',
              maxWidth: 680, margin: '0 auto',
            }}
          >
            Two cousins, born in Chihuahua. Our moms are sisters.
            One built his life in El Paso. The other builds products
            from both sides of the border. We grew up watching family
            businesses work twice as hard for half the credit. So we
            decided to build the kind of AI partner we wished they
            had —{' '}
            <em style={{ color: '#f26419', fontStyle: 'italic', fontWeight: 700 }}>
              one you can actually trust.
            </em>
          </motion.p>
        </div>

        {/* GRID DE LOS 2 PRIMOS */}
        <div
          className="primos-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 4vw, 48px)' }}
        >
          {/* PRIMO 1 — FABIAN */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(234, 226, 183, 0.04)',
              border: '1px solid rgba(234, 226, 183, 0.1)',
              borderRadius: 24, padding: 'clamp(28px, 4vw, 44px)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              width: '100%', aspectRatio: '1 / 1', borderRadius: 16,
              overflow: 'hidden', marginBottom: 24, background: '#f26419', position: 'relative',
            }}>
              <img
                src="https://res.cloudinary.com/dsprn0ew4/image/upload/v1778952617/WhatsApp_Image_2026-05-16_at_11.18.11_AM_fxnbf0.jpg"
                alt="Fabian, Co-founder of Primo AI Studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{
                position: 'absolute', top: 14, left: 14,
                background: '#1a3a4a', color: '#eae2b7',
                padding: '4px 10px', borderRadius: 14,
                fontFamily: "'Mulish', sans-serif", fontSize: 10, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Strategy
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(24px, 3.2vw, 32px)', fontWeight: 900,
              color: '#eae2b7', margin: '0 0 4px', letterSpacing: '-0.02em',
            }}>
              Fabian
            </h3>

            <p style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(13px, 1.4vw, 14px)', fontWeight: 700,
              color: '#f26419', letterSpacing: '0.1em', textTransform: 'uppercase',
              margin: '0 0 20px',
            }}>
              Co-founder &amp; Head of Strategy
            </p>

            <p style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 500,
              lineHeight: 1.6, color: 'rgba(234, 226, 183, 0.8)',
              margin: '0 0 24px', flex: 1,
            }}>
              Founder of{' '}
              <strong style={{ color: '#eae2b7', fontWeight: 700 }}>ZERONNE</strong>,
              a digital studio shipping products for clients across industries. Obsessed
              with product, design, and the engineering it takes to make them work. Splits
              his life between Chihuahua and El Paso — and reads UX patterns the way some
              people read poetry.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
              {['Product', 'Design', 'Engineering', 'Strategy'].map(skill => (
                <span key={skill} style={{
                  fontFamily: "'Mulish', sans-serif", fontSize: 11, fontWeight: 700,
                  color: '#eae2b7', background: 'rgba(234, 226, 183, 0.1)',
                  padding: '5px 12px', borderRadius: 16, letterSpacing: '0.05em',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* PRIMO 2 — NADIM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(234, 226, 183, 0.04)',
              border: '1px solid rgba(234, 226, 183, 0.1)',
              borderRadius: 24, padding: 'clamp(28px, 4vw, 44px)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              width: '100%', aspectRatio: '1 / 1', borderRadius: 16,
              overflow: 'hidden', marginBottom: 24, background: '#1a3a4a', position: 'relative',
            }}>
              <img
                src="https://res.cloudinary.com/dsprn0ew4/image/upload/v1778952617/ChatGPT_Image_May_16_2026_11_25_59_AM_wsrbij.png"
                alt="Nadim, Co-founder & CEO of Primo AI Studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{
                position: 'absolute', top: 14, left: 14,
                background: '#f26419', color: '#eae2b7',
                padding: '4px 10px', borderRadius: 14,
                fontFamily: "'Mulish', sans-serif", fontSize: 10, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Operations
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(24px, 3.2vw, 32px)', fontWeight: 900,
              color: '#eae2b7', margin: '0 0 4px', letterSpacing: '-0.02em',
            }}>
              Nadim
            </h3>

            <p style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(13px, 1.4vw, 14px)', fontWeight: 700,
              color: '#f26419', letterSpacing: '0.1em', textTransform: 'uppercase',
              margin: '0 0 20px',
            }}>
              Co-founder &amp; CEO
            </p>

            <p style={{
              fontFamily: "'Mulish', sans-serif",
              fontSize: 'clamp(14px, 1.6vw, 16px)', fontWeight: 500,
              lineHeight: 1.6, color: 'rgba(234, 226, 183, 0.8)',
              margin: '0 0 24px', flex: 1,
            }}>
              Founder of{' '}
              <strong style={{ color: '#eae2b7', fontWeight: 700 }}>Purple Roots</strong>,
              a cinematography and marketing agency serving El Paso businesses.
              Lives and breathes the local market — knows which clients need what,
              how they buy, and what makes them stay. Outdoor type when he&apos;s not
              running operations.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
              {['Operations', 'Client Strategy', 'Marketing', 'Content'].map(skill => (
                <span key={skill} style={{
                  fontFamily: "'Mulish', sans-serif", fontSize: 11, fontWeight: 700,
                  color: '#eae2b7', background: 'rgba(234, 226, 183, 0.1)',
                  padding: '5px 12px', borderRadius: 16, letterSpacing: '0.05em',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 600,
            fontStyle: 'italic', color: 'rgba(234, 226, 183, 0.7)',
            textAlign: 'center', marginTop: 'clamp(40px, 6vh, 60px)',
            maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55,
          }}
        >
          We&apos;re not a &ldquo;team of senior consultants from McKinsey.&rdquo;
          We&apos;re two primos who know how PyMEs actually work —
          because we&apos;ve spent our lives around them.
        </motion.p>
      </div>
    </section>
  );
}

// ── Section 6 — 90-Day Timeline (Spine) ──────────────────────────────────────
const MILESTONE_CARDS: SpineCard[] = [
  { label: 'Day 1',  icon: 'strategycall'  as IconName, title: 'Strategy Call',           body: 'One call. One hour. We figure out the highest-leverage thing we can build for you. You leave with clarity.' },
  { label: 'Day 7',  icon: 'roadmap'       as IconName, title: 'Your Roadmap',            body: 'A one-page plan with deliverables, timelines, and exact ROI projections. Read it in 4 minutes. Sign with one click.' },
  { label: 'Day 14', icon: 'launch'        as IconName, title: 'First Deliverables Live', body: "Your first AI system is live and running. Real workflows. Real time saved. Not a 'demo.'" },
  { label: 'Day 30', icon: 'sprint'        as IconName, title: 'Full Sprint Activation',  body: 'Additional systems layer in. Your team starts noticing they have time again. You notice your bottom line moving.' },
  { label: 'Day 60', icon: 'optimization'  as IconName, title: 'Optimization Review',     body: "We measure everything. We tune what's underperforming. You see weekly reports written in plain English." },
  { label: 'Day 90', icon: 'scale'         as IconName, title: 'Scale Decision Point',    body: "Look at your numbers. Decide what to scale next. Or just keep what's working — your call." },
];

function Section6({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  return (
    <SpineSection
      id="funnel-section-6"
      bg={C.navy} textColor={C.cream} labelColor={C.orange}
      supLabel="Your 90 Days"
      heading="Your first 90 days with Primo, exactly."
      subtitle="No 'results in 6-12 months.' No 'depends on a lot of factors.' Here's exactly what happens, week by week."
      cards={MILESTONE_CARDS}
      ctaLabel="Start my 90-day journey →"
      onCta={() => onOpenForm()}
    />
  );
}

// ── Section 7 — CTA Final ─────────────────────────────────────────────────────
const SHAPES = [
  { x: 60,  y: 80,  size: 320, delay: 0   },
  { x: 700, y: 40,  size: 180, delay: 3   },
  { x: 200, y: 300, size: 120, delay: 6   },
  { x: 500, y: 200, size: 240, delay: 9   },
  { x: 100, y: 450, size: 80,  delay: 12  },
];

function Section7({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();

  return (
    <section id="funnel-section-7" ref={ref} style={{
      background: C.orange, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {!reduced && SHAPES.map((s, i) => <FloatingShape key={i} {...s} />)}

      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, color: C.cream, lineHeight: 1.05, fontFamily: "'Mulish',sans-serif" }}>
            Want your time back?
          </h2>
          <p style={{ margin: '0 0 48px', fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 400, color: 'rgba(234,226,183,0.85)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Take 5 minutes. Tell us what's eating your week. We'll tell you what we can handle for you.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            <CtaBtn label="Get started now →" onClick={() => onOpenForm()} variant="ghost" />
            <CtaBtn label="Just book a 15-min call" onClick={() => onOpenForm()} variant="outline" />
          </div>
          <p style={{ margin: '24px 0 0', fontFamily: "'Mulish',sans-serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(234,226,183,0.55)', textAlign: 'center' }}>
            No 'marketing follow-up.' No 47 sales emails. Just one honest conversation, in plain English.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.navy, padding: '64px clamp(20px,5vw,60px) 40px', borderTop: '1px solid rgba(234,226,183,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.cream, marginBottom: 8, fontFamily: "'Mulish',sans-serif" }}>Primo AI Studio</div>
            <p style={{ margin: '4px 0 6px', fontSize: 'clamp(11px,1.3vw,13px)', fontStyle: 'italic', fontWeight: 500, color: 'rgba(234,226,183,0.6)', lineHeight: 1.4, maxWidth: 260 }}>
              The AI partner you can trust, like that family member you can always count on.
            </p>
            <p style={{ margin: '0', fontSize: 'clamp(10px,1.2vw,12px)', fontWeight: 400, color: 'rgba(234,226,183,0.4)', lineHeight: 1.4, maxWidth: 260 }}>
              El Paso's #1 human-first AI agency. We handle the tech. You handle what you do best.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'AI Automation',           href: '/ai-automation-el-paso' },
                { label: 'AI for Law Firms',         href: '/ai-for-law-firms-el-paso' },
                { label: 'Bilingual Chatbots',       href: '/bilingual-ai-chatbots-el-paso' },
                { label: 'AI Content Marketing',     href: '/ai-content-marketing-el-paso' },
                { label: 'AI Web Development',       href: '/ai-web-development-el-paso' },
                { label: 'AI for Hispanic Businesses', href: '/ai-for-hispanic-businesses-el-paso' },
              ].map(s => (
                <a key={s.label} href={s.href}
                  style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.cream; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,226,183,0.55)'; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Connect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/primostudio.us' },
                { label: 'LinkedIn',  href: '#' },
                { label: 'primostudio.us@gmail.com', href: 'mailto:primostudio.us@gmail.com' },
              ].map(link => (
                <a key={link.label} href={link.href}
                  style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.cream; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,226,183,0.55)'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Hours</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <PrimoIcon name="clock" size={16} />
                Mon-Fri · 8:00 AM - 5:00 PM
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)' }}>Saturday · 10:00 AM - 5:00 PM</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)' }}>Sunday · Closed</div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.orange, marginBottom: 12 }}>Resources</div>
              {[
                { label: 'Blog & Insights →',  href: '/blog' },
                { label: 'Case Studies →',     href: '/case-studies' },
                { label: 'FAQ →',              href: '/faq' },
                { label: 'Free AI Scorecard →', href: '/blog' },
                { label: 'Book a Call →',       href: '#' },
              ].map(link => (
                <a key={link.label} href={link.href}
                  style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.75)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.orange; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,226,183,0.75)'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(234,226,183,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)' }}>© 2026 Primo AI Studio. Built in El Paso, Texas. 🌵</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)', fontStyle: 'italic' }}>Made by your primos, for businesses that don't have time.</div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PrimoFunnel({ onOpenForm }: PrimoFunnelProps) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (let i = 0; i < 8; i++) {
      const el = document.getElementById(`funnel-section-${i}`);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(i); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <style>{FUNNEL_CSS}</style>
      <DotNav activeSection={activeSection} />
      <SectionIntro onOpenForm={onOpenForm} />
      <SectionLLM onOpenForm={onOpenForm} />
      <Section1 onOpenForm={onOpenForm} />
      <Section2 onOpenForm={onOpenForm} />
      <Section3 onOpenForm={onOpenForm} />
      <Section4 onOpenForm={onOpenForm} />
      <Section5 />
      <Section5b />
      <Section5c />
      <Section6 onOpenForm={onOpenForm} />
      <Section7 onOpenForm={onOpenForm} />
      <Footer />
    </>
  );
}
