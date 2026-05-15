import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const C = {
  navy:   '#1a3a4a',
  orange: '#f26419',
  yellow: '#f5b800',
  green:  '#8bbe6e',
  cream:  '#eae2b7',
};

interface PrimoFunnelProps {
  onOpenForm: (serviceName?: string) => void;
}

// ── Dot Nav (desktop only) ────────────────────────────────────────────────────
const DOT_LABELS = [
  'The System',
  'Built For You',
  'Client Journey',
  'Pricing',
  'The Data',
  'Your 90 Days',
  'Get Started',
];

function DotNav({ activeSection }: { activeSection: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 14, zIndex: 200,
      }}
      className="dot-nav-desktop"
    >
      {DOT_LABELS.map((label, i) => (
        <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
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
          <motion.button
            onClick={() => {
              document.getElementById(`funnel-section-${i}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            animate={{
              width: activeSection === i ? 10 : 8,
              height: activeSection === i ? 10 : 8,
              background: activeSection === i ? C.orange : 'rgba(26,58,74,0.3)',
            }}
            transition={{ duration: 0.2 }}
            style={{
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              padding: 0, flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Section 1 — Stop guessing. Start growing. ─────────────────────────────────
const STEPS = [
  { num: '01', title: 'Audit & Strategy', desc: 'We map your existing stack, identify AI-ready touchpoints, and build a tailored growth blueprint.' },
  { num: '02', title: 'Build & Integrate', desc: 'Our team deploys AI tools directly into your workflows — no rebuilding, no downtime.' },
  { num: '03', title: 'Activate & Launch', desc: 'Your content engine, automations, and campaigns go live. Real output from day one.' },
  { num: '04', title: 'Optimize & Scale', desc: 'We track what moves the needle and double down — continuous iteration, compounding results.' },
];

function Section1({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <section id="funnel-section-0" ref={ref} style={{ background: C.cream, padding: '100px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 960, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>The System</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.navy, lineHeight: 1.1 }}>
            Stop guessing.<br />Start growing.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(26,58,74,0.7)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            A four-step process that turns AI from a buzzword into your biggest competitive advantage.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 56 }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                position: 'relative', background: C.navy, borderRadius: 20,
                padding: '36px 28px', cursor: 'default',
                boxShadow: tooltip === i ? '0 12px 40px rgba(26,58,74,0.18)' : '0 4px 16px rgba(26,58,74,0.08)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ fontSize: 38, fontWeight: 900, color: C.orange, lineHeight: 1, marginBottom: 16, fontFamily: "'Mulish', sans-serif" }}>{step.num}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.cream, marginBottom: 10, lineHeight: 1.2 }}>{step.title}</div>
              <AnimatePresence>
                {tooltip === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.8)', lineHeight: 1.5 }}
                  >
                    {step.desc}
                  </motion.div>
                )}
              </AnimatePresence>
              {tooltip !== i && (
                <div style={{ fontSize: 12, fontWeight: 600, color: C.orange, letterSpacing: '0.08em' }}>Hover to learn more →</div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <button
            onClick={() => onOpenForm()}
            style={{
              background: C.orange, color: C.cream, border: 'none', borderRadius: 999,
              padding: '16px 48px', fontSize: 13, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(242,100,25,0.35)',
              fontFamily: "'Mulish', sans-serif",
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            Start my growth plan →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 2 — Built for businesses like yours. ──────────────────────────────
const ICP_CARDS = [
  {
    icon: '🏥', title: 'Healthcare & Wellness',
    hook: 'Patients want answers fast. AI gives them — before the appointment.',
    pkg: 'AI Automation + Content Marketing',
    color: C.green,
  },
  {
    icon: '⚖️', title: 'Legal & Professional Services',
    hook: 'Trust is earned in seconds online. AI builds the brand that converts.',
    pkg: 'Brand Identity + Web Platforms',
    color: C.yellow,
  },
  {
    icon: '🏠', title: 'Real Estate & Finance',
    hook: 'Every day without AI is leads going to your competitor.',
    pkg: 'AI Integration + Video Ads',
    color: C.orange,
  },
  {
    icon: '🛍️', title: 'E-Commerce & Retail',
    hook: 'Personalization at scale is the only edge left. AI delivers it.',
    pkg: 'Content Marketing + AI Automation',
    color: C.navy,
  },
  {
    icon: '🎓', title: 'Education & Coaching',
    hook: 'Your expertise is the product. AI makes it infinitely scalable.',
    pkg: 'Brand Identity + Content Marketing',
    color: C.green,
  },
];

function Section2({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="funnel-section-1" ref={ref} style={{ background: C.navy, padding: '100px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Built For You</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}>
            Built for businesses<br />like yours.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(234,226,183,0.65)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            We've built AI systems for every vertical. Here's how we think about yours.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 56 }}>
          {ICP_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(234,226,183,0.05)', border: '1px solid rgba(234,226,183,0.1)',
                borderRadius: 20, padding: '32px 24px', cursor: 'default',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{card.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.cream, marginBottom: 12, lineHeight: 1.3 }}>{card.title}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.7)', lineHeight: 1.55, marginBottom: 18 }}>{card.hook}</div>
              <div style={{
                display: 'inline-block', background: `${card.color}22`, border: `1px solid ${card.color}55`,
                borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                color: card.color === C.navy ? C.cream : card.color, letterSpacing: '0.05em',
              }}>
                {card.pkg}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <button
            onClick={() => onOpenForm()}
            style={{
              background: 'transparent', color: C.cream, border: `2px solid ${C.cream}`,
              borderRadius: 999, padding: '15px 44px', fontSize: 13, fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: "'Mulish', sans-serif",
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.cream; b.style.color = C.navy; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'transparent'; b.style.color = C.cream; }}
          >
            See what we'd build for you →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 3 — From first click to lifelong client. ─────────────────────────
const JOURNEY_STAGES = [
  { stage: 'Discovery', icon: '👁️', title: 'They find you', body: 'AI-powered content and ads bring qualified traffic to your door — people who are already looking for what you offer.' },
  { stage: 'First Impression', icon: '⚡', title: 'You captivate instantly', body: 'Your AI-built brand and web platform create an instant sense of trust. They stay, they read, they want more.' },
  { stage: 'Nurture', icon: '🤝', title: 'AI keeps them warm', body: 'Automated sequences, personalized touches, and always-on content keep your brand top of mind between touchpoints.' },
  { stage: 'Conversion', icon: '🎯', title: 'The right offer at the right time', body: 'AI identifies buying signals and surfaces the perfect offer — no guesswork, no generic blasts.' },
  { stage: 'Delivery', icon: '🚀', title: 'Effortless fulfillment', body: 'Integrated AI tools handle onboarding, communication, and updates — you deliver a premium experience without extra overhead.' },
  { stage: 'Retention', icon: '🔄', title: 'They stay and grow', body: 'Smart re-engagement campaigns, loyalty triggers, and upsell sequences keep clients in your ecosystem longer.' },
  { stage: 'Advocacy', icon: '📣', title: 'Clients become fans', body: 'Automated referral and testimonial systems turn happy clients into your loudest growth channel.' },
  { stage: 'Mastery', icon: '🏆', title: 'You scale with confidence', body: 'Every stage is measured, optimized, and compounding. You\'re not guessing anymore — you\'re growing on purpose.' },
];

function Section3({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="funnel-section-2" ref={ref} style={{ background: C.cream, padding: '100px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Client Journey</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.navy, lineHeight: 1.1 }}>
            From first click to<br />lifelong client.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Eight stages. Every one powered by AI. Every one designed to compound.
          </p>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(26,58,74,0.12)', borderRadius: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {JOURNEY_STAGES.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                style={{ paddingLeft: 52, position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', left: 8, top: 16, width: 24, height: 24,
                  borderRadius: '50%', background: C.orange, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12,
                }}>
                  {stage.icon}
                </div>
                <div
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    background: expanded === i ? C.navy : 'white',
                    borderRadius: 14, padding: '16px 20px', cursor: 'pointer',
                    marginBottom: 8,
                    transition: 'background 0.2s',
                    border: `1px solid ${expanded === i ? 'transparent' : 'rgba(26,58,74,0.08)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: expanded === i ? C.orange : 'rgba(26,58,74,0.4)', marginBottom: 2 }}>
                        {stage.stage}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: expanded === i ? C.cream : C.navy }}>{stage.title}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: expanded === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: 18, color: expanded === i ? C.cream : 'rgba(26,58,74,0.3)', flexShrink: 0 }}
                    >
                      +
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingTop: 12, fontSize: 14, fontWeight: 400, color: 'rgba(234,226,183,0.8)', lineHeight: 1.6 }}>
                          {stage.body}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <button
            onClick={() => onOpenForm()}
            style={{
              background: C.orange, color: C.cream, border: 'none', borderRadius: 999,
              padding: '16px 48px', fontSize: 13, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(242,100,25,0.35)',
              fontFamily: "'Mulish', sans-serif",
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            Map my client journey →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 4 — Pricing ───────────────────────────────────────────────────────
const PRICING_CARDS = [
  {
    name: 'AI Audit',
    price: '$497',
    period: 'one-time',
    badge: null,
    color: C.cream,
    bg: C.navy,
    desc: 'A deep-dive into your business. We map every AI opportunity and hand you a prioritized roadmap.',
    features: ['2-hour strategy session', 'Full AI opportunity map', 'Priority action plan', 'Tool recommendations'],
    cta: 'Start with an audit',
  },
  {
    name: 'Sprint',
    price: '$2,500',
    period: '/month',
    badge: 'Most Popular',
    color: C.navy,
    bg: C.orange,
    desc: 'One focused service, maximum impact. Ideal for businesses ready to activate a single AI capability.',
    features: ['Choose 1 core service', 'Full implementation', '30-day activation', 'Monthly optimization'],
    cta: 'Launch my sprint',
  },
  {
    name: 'Growth',
    price: '$4,500',
    period: '/month',
    badge: null,
    color: C.cream,
    bg: C.navy,
    desc: 'Two to three services working together. Compound results from your first integrated AI system.',
    features: ['2–3 core services', 'Integrated strategy', 'Bi-weekly calls', 'Full analytics dashboard'],
    cta: 'Build my growth system',
  },
  {
    name: 'Scale',
    price: '$8,000',
    period: '/month',
    badge: null,
    color: C.navy,
    bg: C.yellow,
    desc: 'Full Primo system activation. Every service, every channel, compounding every month.',
    features: ['All 6 services', 'Dedicated AI strategist', 'Weekly performance reviews', 'Priority support & SLA'],
    cta: 'Activate the full system',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    badge: null,
    color: C.cream,
    bg: C.navy,
    desc: 'For organizations with unique requirements. We build around your architecture, team, and goals.',
    features: ['Custom scope', 'On-site option', 'Dedicated account team', 'Flexible contract terms'],
    cta: 'Let\'s talk',
  },
];

function Section4({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="funnel-section-3" ref={ref} style={{ background: C.navy, padding: '100px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Pricing</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}>
            Choose your<br />starting point.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(234,226,183,0.6)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Every engagement is built to compound. Start where it makes sense for you.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 }}>
          {PRICING_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              whileHover={{ y: -8 }}
              style={{
                background: card.bg, borderRadius: 22, padding: '32px 24px',
                display: 'flex', flexDirection: 'column', gap: 0,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {card.badge && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: C.navy, color: C.cream, borderRadius: 999,
                  padding: '4px 12px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {card.badge}
                </div>
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
                  marginTop: 'auto', background: card.bg === C.orange ? C.navy : C.orange,
                  color: C.cream, border: 'none', borderRadius: 999,
                  padding: '13px 20px', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Mulish', sans-serif",
                  transition: 'transform 0.15s, opacity 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
              >
                {card.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.4)', margin: 0 }}
        >
          All plans include a 30-day performance guarantee. No lock-in. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}

// ── Section 5 — We know your market. ─────────────────────────────────────────
const STATS = [
  { value: '75%', label: 'of SMBs that adopt AI report faster growth within 6 months.', color: C.orange },
  { value: '25%', label: 'average reduction in operational costs after AI integration.', color: C.yellow },
  { value: '100%', label: 'of our clients see measurable results within the first sprint.', color: C.green },
];

function Section5() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="funnel-section-4" ref={ref} style={{ background: C.cream, padding: '100px 24px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 960, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>The Data</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.navy, lineHeight: 1.1 }}>
            We know your market.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(26,58,74,0.65)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            The numbers aren't hypothetical. They're what happens when AI is deployed with intent.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
              style={{
                background: C.navy, borderRadius: 22, padding: '48px 32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'clamp(52px, 8vw, 72px)', fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: 16 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 15, fontWeight: 400, color: 'rgba(234,226,183,0.7)', lineHeight: 1.55 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 6 — Your first 90 days. ──────────────────────────────────────────
const MILESTONES = [
  { day: 'Day 1', title: 'Strategy call & AI audit', desc: 'We align on goals, assess your stack, and define the exact scope of your sprint.' },
  { day: 'Day 7', title: 'Roadmap delivered', desc: 'A complete, prioritized action plan is in your hands — no vague promises, just a clear path forward.' },
  { day: 'Day 14', title: 'First deliverables live', desc: 'Initial assets, automations, or content pieces are deployed and generating real output.' },
  { day: 'Day 30', title: 'Full sprint activation', desc: 'Every element of your chosen services is running. We\'re tracking, measuring, and iterating.' },
  { day: 'Day 60', title: 'Optimization review', desc: 'Data drives our next moves. We double down on what\'s working and eliminate what isn\'t.' },
  { day: 'Day 90', title: 'Scale decision point', desc: 'You\'ve seen results. Now we plan the next phase — more services, more channels, more growth.' },
];

function Section6({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="funnel-section-5" ref={ref} style={{ background: C.navy, padding: '100px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Your 90 Days</p>
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}>
            Your first 90 days<br />with Primo.
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 400, color: 'rgba(234,226,183,0.6)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Not a theory. A timeline. Here's exactly what happens after you sign on.
          </p>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(234,226,183,0.1)', borderRadius: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 * i }}
                style={{ paddingLeft: 52, position: 'relative', paddingBottom: 6 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.1 * i + 0.2 }}
                  style={{
                    position: 'absolute', left: 8, top: 18, width: 24, height: 24,
                    borderRadius: '50%', background: C.orange, border: `3px solid ${C.navy}`,
                    boxShadow: `0 0 0 2px ${C.orange}`,
                  }}
                />
                <div style={{
                  background: 'rgba(234,226,183,0.05)', border: '1px solid rgba(234,226,183,0.08)',
                  borderRadius: 14, padding: '20px 22px',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 6 }}>{m.day}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.cream, marginBottom: 8 }}>{m.title}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.65)', lineHeight: 1.6 }}>{m.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 56 }}
        >
          <button
            onClick={() => onOpenForm()}
            style={{
              background: C.orange, color: C.cream, border: 'none', borderRadius: 999,
              padding: '16px 48px', fontSize: 13, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(242,100,25,0.35)',
              fontFamily: "'Mulish', sans-serif",
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            Start my 90-day journey →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 7 — CTA Final ─────────────────────────────────────────────────────
function Section7({ onOpenForm }: { onOpenForm: (s?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="funnel-section-6" ref={ref} style={{ background: C.orange, padding: '120px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: C.cream, lineHeight: 1.05 }}>
            Ready to make<br />AI human?
          </h2>
          <p style={{ margin: '0 0 48px', fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 400, color: 'rgba(234,226,183,0.85)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Every day you wait is a day your competitor uses AI against you. Let's change that today.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={() => onOpenForm()}
              style={{
                background: C.cream, color: C.navy, border: 'none', borderRadius: 999,
                padding: '18px 52px', fontSize: 14, fontWeight: 900, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                fontFamily: "'Mulish', sans-serif",
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              Get Started Now →
            </button>
            <button
              onClick={() => onOpenForm('AI Audit')}
              style={{
                background: 'transparent', color: C.cream,
                border: `2px solid rgba(234,226,183,0.5)`, borderRadius: 999,
                padding: '17px 44px', fontSize: 14, fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'Mulish', sans-serif",
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.cream; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(234,226,183,0.5)'; }}
            >
              Book a free audit first
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.navy, padding: '64px 24px 40px', borderTop: '1px solid rgba(234,226,183,0.08)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.cream, marginBottom: 12, fontFamily: "'Mulish', sans-serif" }}>Primo AI Studio</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(234,226,183,0.5)', lineHeight: 1.7, maxWidth: 240 }}>
              AI-powered growth systems for modern businesses. Human strategy. Machine precision.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['AI Integration', 'Content Marketing', 'AI Video Ads', 'Brand Identity', 'Web Platforms', 'AI Automation'].map(s => (
                <div key={s} style={{ fontSize: 13, fontWeight: 500, color: 'rgba(234,226,183,0.55)', cursor: 'default' }}>{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Connect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Instagram', href: 'https://instagram.com/primoaistudio' },
                { label: 'LinkedIn', href: '#' },
                { label: 'hello@primoaistudio.com', href: 'mailto:hello@primoaistudio.com' },
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
        </div>
        <div style={{ borderTop: '1px solid rgba(234,226,183,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)' }}>
            © 2025 Primo AI Studio. All rights reserved.
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(234,226,183,0.3)' }}>
            AI, but make it human.™
          </div>
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
      <style>{`
        @media (max-width: 768px) { .dot-nav-desktop { display: none !important; } }
      `}</style>
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
