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
const DOT_LABELS = ['The System','Built For You','Client Journey','Pricing','The Data','Your 90 Days','Get Started'];

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
      <div style={{ fontSize: 15, fontWeight: 800, color: C.cream, marginBottom: 12, lineHeight: 1.3 }}>{card.title}</div>
      <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.7)', lineHeight: 1.55, marginBottom: 18 }}>{card.hook}</div>
      <div style={{
        display: 'inline-block', background: `${card.color}22`,
        border: `1px solid ${card.color}55`, borderRadius: 999,
        padding: '4px 12px', fontSize: 11, fontWeight: 700,
        color: card.color === C.navy ? C.cream : card.color, letterSpacing: '0.05em',
      }}>
        {card.pkg}
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

// ── Section 1 — The System ────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Audit & Strategy', desc: 'We map your existing stack, identify AI-ready touchpoints, and build a tailored growth blueprint.' },
  { num: '02', title: 'Build & Integrate', desc: 'Our team deploys AI tools directly into your workflows — no rebuilding, no downtime.' },
  { num: '03', title: 'Activate & Launch', desc: 'Your content engine, automations, and campaigns go live. Real output from day one.' },
  { num: '04', title: 'Optimize & Scale', desc: 'We track what moves the needle and double down — continuous iteration, compounding results.' },
];

function Section1({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [tooltip, setTooltip] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="funnel-section-0" ref={ref} style={{
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
          <AnimatedHeading text="Stop guessing. Start growing." color={C.navy} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 520, lineHeight: 1.6 }}
          >
            A four-step process that turns AI from a buzzword into your biggest competitive advantage.
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
              <div style={{ fontSize: 38, fontWeight: 900, color: C.orange, lineHeight: 1, marginBottom: 16, fontFamily: "'Mulish',sans-serif" }}>{step.num}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.cream, marginBottom: 10, lineHeight: 1.2 }}>{step.title}</div>
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
  { icon: 'healthcare' as IconName, title: 'Healthcare & Wellness', hook: 'Patients want answers fast. AI gives them — before the appointment.', pkg: 'AI Automation + Content Marketing', color: C.green },
  { icon: 'legal' as IconName, title: 'Legal & Professional Services', hook: 'Trust is earned in seconds online. AI builds the brand that converts.', pkg: 'Brand Identity + Web Platforms', color: C.yellow },
  { icon: 'realestate' as IconName, title: 'Real Estate & Finance', hook: 'Every day without AI is leads going to your competitor.', pkg: 'AI Integration + Video Ads', color: C.orange },
  { icon: 'ecommerce' as IconName, title: 'E-Commerce & Retail', hook: 'Personalization at scale is the only edge left. AI delivers it.', pkg: 'Content Marketing + AI Automation', color: C.navy },
  { icon: 'education' as IconName, title: 'Education & Coaching', hook: 'Your expertise is the product. AI makes it infinitely scalable.', pkg: 'Brand Identity + Content Marketing', color: C.green },
];

function Section2({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="funnel-section-1" ref={ref} style={{
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
          <AnimatedHeading text="Built for businesses like yours." color={C.cream} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(234,226,183,0.6)', maxWidth: 500, lineHeight: 1.6 }}
          >
            We've built AI systems for every vertical. Here's how we think about yours.
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
  { label: 'Discovery',        icon: 'discovery'        as IconName, title: 'They find you',                    body: 'AI-powered content and ads bring qualified traffic to your door — people already looking for what you offer.' },
  { label: 'First Impression', icon: 'firstimpression'  as IconName, title: 'You captivate instantly',           body: 'Your AI-built brand creates instant trust. They stay, they read, they want more.' },
  { label: 'Nurture',          icon: 'nurture'          as IconName, title: 'AI keeps them warm',               body: 'Automated sequences and always-on content keep your brand top of mind between touchpoints.' },
  { label: 'Conversion',       icon: 'conversion'       as IconName, title: 'The right offer at the right time', body: 'AI identifies buying signals and surfaces the perfect offer — no guesswork, no generic blasts.' },
  { label: 'Delivery',         icon: 'delivery'         as IconName, title: 'Effortless fulfillment',            body: 'Integrated AI tools handle onboarding and communication — premium experience without extra overhead.' },
  { label: 'Retention',        icon: 'retention'        as IconName, title: 'They stay and grow',               body: 'Smart re-engagement campaigns and upsell sequences keep clients in your ecosystem longer.' },
  { label: 'Advocacy',         icon: 'advocacy'         as IconName, title: 'Clients become fans',              body: 'Automated referral and testimonial systems turn happy clients into your loudest growth channel.' },
  { label: 'Mastery',          icon: 'mastery'          as IconName, title: 'You scale with confidence',        body: 'Every stage is measured and compounding. You\'re not guessing anymore — you\'re growing on purpose.' },
];

function Section3({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  return (
    <SpineSection
      id="funnel-section-2"
      bg={C.cream} textColor={C.navy} labelColor={C.orange}
      supLabel="Client Journey"
      heading="From first click to lifelong client."
      subtitle="Eight stages. Every one powered by AI. Every one designed to compound."
      cards={JOURNEY_CARDS}
      ctaLabel="Map my client journey →"
      onCta={() => onOpenForm()}
    />
  );
}

// ── Section 4 — Pricing ───────────────────────────────────────────────────────
const PRICING_CARDS = [
  { name: 'AI Audit', price: '$497', period: 'one-time', badge: null, color: C.cream, bg: C.navy, desc: 'A deep-dive into your business. We map every AI opportunity and hand you a prioritized roadmap.', features: ['2-hour strategy session','Full AI opportunity map','Priority action plan','Tool recommendations'], cta: 'Start with an audit' },
  { name: 'Sprint', price: '$2,500', period: '/month', badge: 'Most Popular', color: C.navy, bg: C.orange, desc: 'One focused service, maximum impact. Ideal for businesses ready to activate a single AI capability.', features: ['Choose 1 core service','Full implementation','30-day activation','Monthly optimization'], cta: 'Launch my sprint' },
  { name: 'Growth', price: '$4,500', period: '/month', badge: null, color: C.cream, bg: C.navy, desc: 'Two to three services working together. Compound results from your first integrated AI system.', features: ['2–3 core services','Integrated strategy','Bi-weekly calls','Full analytics dashboard'], cta: 'Build my growth system' },
  { name: 'Scale', price: '$8,000', period: '/month', badge: null, color: C.navy, bg: C.yellow, desc: 'Full Primo system activation. Every service, every channel, compounding every month.', features: ['All 6 services','Dedicated AI strategist','Weekly performance reviews','Priority support & SLA'], cta: 'Activate the full system' },
  { name: 'Enterprise', price: 'Custom', period: '', badge: null, color: C.cream, bg: C.navy, desc: 'For organizations with unique requirements. We build around your architecture, team, and goals.', features: ['Custom scope','On-site option','Dedicated account team','Flexible contract terms'], cta: "Let's talk" },
];

const POPULAR_IDX = 1;

function Section4({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();

  return (
    <section id="funnel-section-3" ref={ref} style={{
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
          <AnimatedHeading text="Choose your starting point." color={C.cream} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(234,226,183,0.6)', maxWidth: 480, lineHeight: 1.6 }}
          >
            Every engagement is built to compound. Start where it makes sense for you.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'clamp(20px,3vw,40px)', marginBottom: 48 }}>
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
                  background: card.bg, borderRadius: 22, padding: '32px 24px',
                  display: 'flex', flexDirection: 'column',
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
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${card.color}99`, marginBottom: 8 }}>{card.name}</div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.price}</span>
                  {card.period && <span style={{ fontSize: 13, fontWeight: 500, color: `${card.color}88`, marginLeft: 4 }}>{card.period}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 400, color: `${card.color}bb`, lineHeight: 1.55, marginBottom: 20 }}>{card.desc}</div>
                <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {card.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, fontWeight: 500, color: `${card.color}cc` }}>
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
  { to: 75, suffix: '%', label: 'of SMBs that adopt AI report faster growth within 6 months.', color: C.orange },
  { to: 25, suffix: '%', label: 'average reduction in operational costs after AI integration.', color: C.yellow },
  { to: 100, suffix: '%', label: 'of our clients see measurable results within the first sprint.', color: C.green },
];

function Section5() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="funnel-section-4" ref={ref} style={{
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
          <AnimatedHeading text="We know your market." color={C.navy} center />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: '20px auto 0', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 480, lineHeight: 1.6 }}
          >
            The numbers aren't hypothetical. They're what happens when AI is deployed with intent.
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
              <div style={{ fontSize: 'clamp(56px,8vw,96px)', fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: 16, fontFamily: "'Mulish',sans-serif" }}>
                <Counter to={stat.to} suffix={stat.suffix} color={stat.color} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 400, color: 'rgba(234,226,183,0.68)', lineHeight: 1.55 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 6 — 90-Day Timeline (Spine) ──────────────────────────────────────
const MILESTONE_CARDS: SpineCard[] = [
  { label: 'Day 1',  icon: 'strategycall'  as IconName, title: 'Strategy call & AI audit',    body: 'We align on goals, assess your stack, and define the exact scope of your sprint.' },
  { label: 'Day 7',  icon: 'roadmap'       as IconName, title: 'Roadmap delivered',           body: 'A complete, prioritized action plan is in your hands — clear path forward.' },
  { label: 'Day 14', icon: 'launch'        as IconName, title: 'First deliverables live',      body: 'Initial assets, automations, or content pieces are deployed and generating real output.' },
  { label: 'Day 30', icon: 'sprint'        as IconName, title: 'Full sprint activation',       body: 'Every element of your chosen services is running. We\'re tracking, measuring, and iterating.' },
  { label: 'Day 60', icon: 'optimization'  as IconName, title: 'Optimization review',          body: 'Data drives our next moves. We double down on what\'s working and eliminate what isn\'t.' },
  { label: 'Day 90', icon: 'scale'         as IconName, title: 'Scale decision point',         body: 'You\'ve seen results. Now we plan the next phase — more services, more channels, more growth.' },
];

function Section6({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  return (
    <SpineSection
      id="funnel-section-5"
      bg={C.navy} textColor={C.cream} labelColor={C.orange}
      supLabel="Your 90 Days"
      heading="Your first 90 days with Primo."
      subtitle="Not a theory. A timeline. Here's exactly what happens after you sign on."
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
    <section id="funnel-section-6" ref={ref} style={{
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
            Ready to make<br />AI human?
          </h2>
          <p style={{ margin: '0 0 48px', fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 400, color: 'rgba(234,226,183,0.85)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Every day you wait is a day your competitor uses AI against you. Let's change that today.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            <CtaBtn label="Get Started Now →" onClick={() => onOpenForm()} variant="ghost" />
            <CtaBtn label="Book a free audit first" onClick={() => onOpenForm('AI Audit')} variant="outline" />
          </div>
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
            <p style={{ margin: '4px 0 0', fontSize: 'clamp(11px,1.3vw,13px)', fontStyle: 'italic', fontWeight: 500, color: 'rgba(234,226,183,0.6)', lineHeight: 1.4, maxWidth: 260 }}>
              The AI partner you can trust, like that family member you can always count on.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['AI Integration','Content Marketing','AI Video Ads','Brand Identity','Web Platforms','AI Automation'].map(s => (
                <div key={s} style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)' }}>{s}</div>
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
              <a href="/blog"
                style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.75)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.orange; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,226,183,0.75)'; }}
              >
                Blog &amp; Insights →
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(234,226,183,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)' }}>© 2025 Primo AI Studio. All rights reserved.</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)', fontStyle: 'italic' }}>The AI partner you can trust, like that family member you can always count on.™</div>
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
    for (let i = 0; i < 7; i++) {
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
      <Section1 onOpenForm={onOpenForm} />
      <Section2 onOpenForm={onOpenForm} />
      <Section3 onOpenForm={onOpenForm} />
      <Section4 onOpenForm={onOpenForm} />
      <Section5 />
      <Section6 onOpenForm={onOpenForm} />
      <Section7 onOpenForm={onOpenForm} />
      <Footer />
    </>
  );
}
