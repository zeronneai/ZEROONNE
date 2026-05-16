import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwBcw13L-Yn96Yg-AeIpUCRgHKUxQFXgZ9f1dxZX5KgYQzylO_-g16TBcIoeVGLtPls/exec';

const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778360725/ChatGPT_Image_May_9_2026_03_04_56_PM_hdfdcd.png';

const ALL_SERVICES = [
  'AI Agents',
  'Done-For-You Automations',
  'AI Content Creation',
  'Brand AI',
  'Custom Software',
  'Voice & Chat Bots',
];

const QUESTIONS = [
  {
    id: 1,
    question: 'Which of these is currently eating up the most time in your business each week?',
    options: [
      'Answering the same questions over and over',
      'Following up with leads (and dropping some)',
      'Creating content (or not creating it)',
      'Manual data entry / admin work',
      'Honestly? All of the above',
    ],
  },
  {
    id: 2,
    question: 'How many leads do you estimate slip through each month because nobody followed up fast enough?',
    options: [
      "0–5 (we're handling it)",
      '5–20 (it stings)',
      '20–50 (it hurts)',
      "50+ (we're hemorrhaging money)",
      "I honestly don't even track it",
    ],
  },
  {
    id: 3,
    question: 'Your competitors are already using AI to respond to leads in 60 seconds, post content daily, and qualify prospects 24/7. Where do you stand?',
    options: [
      "We're ahead of them",
      'About the same',
      'Behind, and I know it',
      "I have no idea what they're doing (and I'd rather not)",
    ],
  },
  {
    id: 4,
    question: 'If you got back 15–20 hours a week starting next month, what would you do with it?',
    options: [
      'Close more deals / focus on revenue',
      'Finally work ON the business, not in it',
      'Spend it with my family',
      'Scale to the next level',
    ],
  },
  {
    id: 5,
    question: "What's the #1 thing holding you back from using AI right now?",
    options: [
      "I don't know where to start",
      "I tried tools (ChatGPT etc) but couldn't make them work for MY business",
      'I literally have no time to figure this out',
      "I'm worried about the cost",
      "Honestly? I keep putting it off",
    ],
  },
  {
    id: 6,
    question: 'How much do you think one missed customer or unanswered lead actually costs you?',
    options: [
      'Under $500',
      '$500–$2,000',
      '$2,000–$10,000',
      '$10,000+',
      'More than I want to admit',
    ],
  },
  {
    id: 7,
    question: 'Imagine your business 12 months from now WITHOUT AI handling the heavy lifting. What does that look like?',
    options: [
      'Same as today (stuck)',
      'Burned out and behind',
      'Losing ground to competitors',
      'I refuse to let that happen — I need to move now',
    ],
  },
  {
    id: 8,
    question: "Last one: what's your business's current monthly revenue?",
    sub: "This helps us recommend the right starting point. We're not here to upsell — we're here to fit.",
    options: [
      'Pre-revenue / just starting',
      'Under $5K/month',
      '$5K–$20K/month',
      '$20K–$50K/month',
      '$50K–$150K/month',
      '$150K+/month',
    ],
  },
];

const MODAL_CSS = `
  .primo-modal {
    background: #eae2b7;
    border-radius: 20px;
    max-width: 560px;
    width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.30);
  }
  .primo-modal-scroll {
    padding: 40px 36px 0;
    overflow-y: auto;
    flex: 1;
  }
  .primo-modal-progress {
    padding: 12px 36px 20px;
    background: #eae2b7;
    border-top: 1px solid rgba(26,58,74,0.08);
    flex-shrink: 0;
  }
  .primo-service-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 4px;
  }
  @media (max-width: 768px) {
    .primo-modal { width: 95vw; max-height: 92vh; }
    .primo-modal-scroll { padding: 28px 20px 0; }
    .primo-modal-progress { padding: 10px 20px 18px; }
    .primo-q-text { font-size: 17px !important; }
    .primo-option { font-size: 13px !important; padding: 12px 14px !important; }
    .primo-service-grid { grid-template-columns: 1fr; }
  }
`;

// ── Shared button ─────────────────────────────────────────────────────────────
function NextButton({
  label,
  disabled,
  submitting,
  onClick,
}: {
  label: string;
  disabled: boolean;
  submitting?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const opacity = submitting ? 0.6 : disabled ? 0.35 : 1;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered && !disabled ? '#1a3a4a' : '#f26419',
          color: '#eae2b7',
          border: 'none',
          borderRadius: 50,
          padding: '14px 32px',
          fontFamily: "'Mulish', -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity,
          transition: 'background 0.2s ease, opacity 0.2s ease',
        }}
      >
        {label}
      </button>
    </div>
  );
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({
  name,
  selected,
  onToggle,
}: {
  name: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: selected ? 'rgba(242,100,25,0.08)' : hovered ? 'rgba(242,100,25,0.04)' : '#fff',
        border: selected
          ? '2px solid #f26419'
          : `1.5px solid ${hovered ? '#f26419' : 'rgba(26,58,74,0.15)'}`,
        borderRadius: 12,
        padding: '14px 18px',
        cursor: 'pointer',
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: selected ? 600 : 400,
        color: '#1a3a4a',
        lineHeight: 1.35,
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}
    >
      {name}
      {selected && (
        <span style={{ color: '#f26419', fontWeight: 700, fontSize: 15, flexShrink: 0, marginLeft: 8 }}>
          ✓
        </span>
      )}
    </div>
  );
}

// ── Option item ───────────────────────────────────────────────────────────────
function OptionItem({
  text,
  selected,
  onSelect,
}: {
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="primo-option"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: selected ? 'rgba(242,100,25,0.08)' : hovered ? 'rgba(242,100,25,0.05)' : '#fff',
        border: selected
          ? '2px solid #f26419'
          : `1.5px solid ${hovered ? '#f26419' : 'rgba(26,58,74,0.15)'}`,
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 10,
        cursor: 'pointer',
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 14,
        fontWeight: selected ? 700 : 500,
        color: '#1a3a4a',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        lineHeight: 1.45,
      }}
    >
      {selected && (
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f26419', marginRight: 10, flexShrink: 0, display: 'inline-block' }} />
      )}
      {text}
    </div>
  );
}

// ── Step 0: service selection (Flujo B only) ──────────────────────────────────
function ServiceSelectionStep({
  selectedServices,
  onToggle,
  onNext,
}: {
  selectedServices: string[];
  onToggle: (s: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      key="step-select"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -30, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ paddingBottom: 24 }}
    >
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        border: '1.5px solid #1a3a4a',
        color: '#1a3a4a',
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        ✦ Tell us what's hurting
      </span>

      <p className="primo-q-text" style={{
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#1a3a4a',
        lineHeight: 1.35,
        margin: '0 0 6px',
      }}>
        Which services are you interested in?
      </p>
      <p style={{
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 12,
        color: 'rgba(26,58,74,0.45)',
        margin: '0 0 24px',
      }}>
        Pick all that apply. We'll figure out the right combo for you.
      </p>

      <div className="primo-service-grid">
        {ALL_SERVICES.map((svc) => (
          <ServiceCard
            key={svc}
            name={svc}
            selected={selectedServices.includes(svc)}
            onToggle={() => onToggle(svc)}
          />
        ))}
      </div>

      <NextButton
        label="Next →"
        disabled={selectedServices.length === 0}
        onClick={onNext}
      />
    </motion.div>
  );
}

// ── Question step ─────────────────────────────────────────────────────────────
function QuestionStep({
  stepIndex,
  chipLabel,
  selected,
  onSelect,
  onNext,
}: {
  stepIndex: number;
  chipLabel?: string;
  selected: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  const q = QUESTIONS[stepIndex];

  return (
    <motion.div
      key={`q-${stepIndex}`}
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -30, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ paddingBottom: 24 }}
    >
      {chipLabel && (
        <span style={{
          display: 'inline-block',
          background: '#f26419',
          color: '#eae2b7',
          fontFamily: "'Mulish', -apple-system, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          borderRadius: 20,
          marginBottom: 16,
        }}>
          ✦ {chipLabel.toUpperCase()}
        </span>
      )}

      <p style={{
        margin: '0 0 12px',
        fontSize: 11,
        letterSpacing: '0.2em',
        color: '#f26419',
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontWeight: 600,
      }}>
        {String(stepIndex + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
      </p>

      <p className="primo-q-text" style={{
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 20,
        fontWeight: 800,
        color: '#1a3a4a',
        lineHeight: 1.4,
        margin: '0 0 8px',
      }}>
        {q.question}
      </p>
      {(q as any).sub && (
        <p style={{
          fontFamily: "'Mulish', -apple-system, sans-serif",
          fontSize: 13,
          color: 'rgba(26,58,74,0.5)',
          margin: '0 0 20px',
          lineHeight: 1.5,
        }}>
          {(q as any).sub}
        </p>
      )}

      {q.options.map((opt) => (
        <OptionItem
          key={opt}
          text={opt}
          selected={selected === opt}
          onSelect={() => onSelect(selected === opt ? '' : opt)}
        />
      ))}

      <NextButton
        label="Next →"
        disabled={!selected}
        onClick={onNext}
      />
    </motion.div>
  );
}

// ── Contact step ──────────────────────────────────────────────────────────────
function ContactStep({
  answers,
  entrySource,
  selectedService,
  selectedServices,
  onConfirm,
}: {
  answers: string[];
  entrySource: 'bubble' | 'getstarted';
  selectedService?: string;
  selectedServices: string[];
  onConfirm: () => void;
}) {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = (v: string) => v.includes('@') && v.split('@')[1]?.includes('.');
  const isValid = name.trim() !== '' && business.trim() !== '' && isValidEmail(email);

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!business.trim()) newErrors.business = 'Business name is required.';
    if (!isValidEmail(email)) newErrors.email = 'Please enter a valid email address.';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);

    const payload = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || '',
      business,
      entryPoint: entrySource === 'bubble'
        ? 'Service bubble: ' + selectedService
        : 'GET STARTED button',
      services: entrySource === 'bubble'
        ? selectedService
        : selectedServices.join(', '),
      q1: answers[0] || '',
      q2: answers[1] || '',
      q3: answers[2] || '',
      q4: answers[3] || '',
      q5: answers[4] || '',
      q6: answers[5] || '',
      q7: answers[6] || '',
      q8_revenue: answers[7] || '',
      source: 'primoaistudio.com',
    };

    try {
      const params = new URLSearchParams();
      params.append('data', JSON.stringify(payload));
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });
    } catch (err) {
      console.log('Fetch error:', err);
    }

    setSubmitting(false);
    onConfirm();
  };

  const fieldStyle = (field: string): React.CSSProperties => ({
    display: 'block',
    width: '100%',
    background: '#ffffff',
    border: errors[field]
      ? '1.5px solid #e05555'
      : focused === field
        ? '2px solid #f26419'
        : '1.5px solid rgba(26,58,74,0.15)',
    borderRadius: 12,
    padding: '14px 18px',
    fontFamily: "'Mulish', -apple-system, sans-serif",
    fontSize: 14,
    color: '#1a3a4a',
    marginBottom: errors[field] ? 4 : 12,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  });

  const errorMsg = (field: string) =>
    errors[field] ? (
      <p style={{ fontSize: 11, color: '#e05555', marginTop: -8, marginBottom: 10, fontFamily: "'Mulish', -apple-system, sans-serif" }}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <motion.div
      key="contact"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -30, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ paddingBottom: 24 }}
    >
      <p className="primo-q-text" style={{
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#1a3a4a',
        margin: '0 0 6px',
      }}>
        Almost done. Where should your primo reach out?
      </p>
      <p style={{
        fontFamily: "'Mulish', -apple-system, sans-serif",
        fontSize: 13,
        color: '#1a3a4a',
        opacity: 0.5,
        margin: '0 0 28px',
      }}>
        We'll send your custom report within 24 hours. No spam, no list-selling, no nonsense.
      </p>

      <input
        type="text"
        placeholder="Your full name"
        value={name}
        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }); }}
        onFocus={() => setFocused('name')}
        onBlur={() => setFocused(null)}
        style={fieldStyle('name')}
      />
      {errorMsg('name')}

      <input
        type="text"
        placeholder="Your business name"
        value={business}
        onChange={(e) => { setBusiness(e.target.value); if (errors.business) setErrors({ ...errors, business: '' }); }}
        onFocus={() => setFocused('business')}
        onBlur={() => setFocused(null)}
        style={fieldStyle('business')}
      />
      {errorMsg('business')}

      <input
        type="email"
        placeholder="you@yourbusiness.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
        onFocus={() => setFocused('email')}
        onBlur={() => setFocused(null)}
        style={fieldStyle('email')}
      />
      {errorMsg('email')}

      <input
        type="tel"
        placeholder="+1 (000) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onFocus={() => setFocused('phone')}
        onBlur={() => setFocused(null)}
        style={fieldStyle('phone')}
      />

      <NextButton
        label={submitting ? 'Sending...' : "Let's get started! →"}
        disabled={!isValid || submitting}
        submitting={submitting}
        onClick={handleSubmit}
      />
    </motion.div>
  );
}

// ── Thank-you screen ──────────────────────────────────────────────────────────
function ThankYouScreen({ onClose }: { onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      key="thankyou"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ textAlign: 'center', padding: '24px 0 40px' }}
    >
      <img
        src={LOGO_URL}
        alt="Primo AI Studio"
        style={{
          width: 64,
          height: 64,
          objectFit: 'contain',
          marginBottom: 24,
          filter: 'sepia(1) saturate(4) hue-rotate(-10deg) brightness(0.95)',
        }}
      />
      <p style={{ fontFamily: "'Mulish', -apple-system, sans-serif", fontSize: 24, fontWeight: 700, color: '#1a3a4a', margin: '0 0 10px', lineHeight: 1.3 }}>
        We got it. Welcome to the Primo family.
      </p>
      <p style={{ fontFamily: "'Mulish', -apple-system, sans-serif", fontSize: 14, color: 'rgba(26,58,74,0.6)', margin: '0 0 32px', lineHeight: 1.55 }}>
        Your custom AI opportunity report is being prepared right now. Check your email within 24 hours — we'll outline exactly what we can handle for you, and what it'd take to get started.
      </p>
      <button
        onClick={onClose}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#1a3a4a' : 'transparent',
          border: '2px solid #1a3a4a',
          color: hovered ? '#eae2b7' : '#1a3a4a',
          borderRadius: 50,
          padding: '12px 32px',
          fontFamily: "'Mulish', -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        Close
      </button>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export interface ModalEntry {
  source: 'bubble' | 'getstarted';
  service?: string;
}

interface OnboardingModalProps {
  entry: ModalEntry | null;
  onClose: () => void;
}

// step -1 = service selection (Flujo B)
// step 0..QUESTIONS.length-1 = questions
// step QUESTIONS.length = contact step
// step QUESTIONS.length+1 = thank-you
const CONTACT_STEP = QUESTIONS.length;
const THANKYOU_STEP = QUESTIONS.length + 1;

export default function OnboardingModal({ entry, onClose }: OnboardingModalProps) {
  const isOpen = entry !== null;

  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''));
  const [selected, setSelected] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!entry) return;
    setAnswers(Array(QUESTIONS.length).fill(''));
    setSelected('');
    if (entry.source === 'getstarted') {
      setStep(-1);
      setSelectedServices([]);
    } else {
      setStep(0);
      setSelectedServices(entry.service ? [entry.service] : []);
    }
  }, [entry]);

  const handleClose = () => { onClose(); };

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc],
    );
  };

  const handleNext = () => {
    if (step === -1) {
      if (selectedServices.length === 0) return;
      setStep(0);
      return;
    }
    if (!selected) return;
    const newAnswers = [...answers];
    newAnswers[step] = selected;
    setAnswers(newAnswers);
    setSelected('');
    setStep((s) => s + 1);
  };

  const handleContactSubmit = () => { setStep(THANKYOU_STEP); };

  const isThankYou = step === THANKYOU_STEP;
  const isContact = step === CONTACT_STEP;
  const isServiceSelect = step === -1;

  const progressPct =
    isThankYou || isContact ? 100
    : isServiceSelect ? 0
    : ((step + 1) / QUESTIONS.length) * 100;

  const progressLabel =
    isContact ? 'Almost done!'
    : isServiceSelect ? 'Intro'
    : `Step ${step + 1} of ${QUESTIONS.length}`;

  const chipLabel = entry?.source === 'bubble' ? entry.service : undefined;

  return (
    <>
      <style>{MODAL_CSS}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 58, 74, 0.85)',
              zIndex: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              boxSizing: 'border-box',
            }}
          >
            <motion.div
              className="primo-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable content */}
              <div className="primo-modal-scroll">
                {/* × Close */}
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 18,
                    background: 'transparent',
                    border: 'none',
                    fontSize: 22,
                    lineHeight: 1,
                    color: '#1a3a4a',
                    opacity: 0.5,
                    cursor: 'pointer',
                    padding: '4px 6px',
                    fontFamily: "'Mulish', -apple-system, sans-serif",
                    zIndex: 1,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; }}
                  aria-label="Close"
                >
                  ×
                </button>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  {isThankYou ? (
                    <ThankYouScreen onClose={handleClose} />
                  ) : isContact ? (
                    <ContactStep
                      answers={answers}
                      entrySource={entry!.source}
                      selectedService={entry?.service}
                      selectedServices={selectedServices}
                      onConfirm={handleContactSubmit}
                    />
                  ) : isServiceSelect ? (
                    <ServiceSelectionStep
                      selectedServices={selectedServices}
                      onToggle={toggleService}
                      onNext={handleNext}
                    />
                  ) : (
                    <QuestionStep
                      stepIndex={step}
                      chipLabel={chipLabel}
                      selected={selected}
                      onSelect={setSelected}
                      onNext={handleNext}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Progress bar — hidden on thank-you */}
              {!isThankYou && (
                <div className="primo-modal-progress">
                  <p style={{
                    margin: '0 0 8px',
                    fontSize: 11,
                    color: 'rgba(26,58,74,0.5)',
                    textAlign: 'right',
                    letterSpacing: '0.1em',
                    fontFamily: "'Mulish', -apple-system, sans-serif",
                  }}>
                    {progressLabel}
                  </p>
                  <div style={{ background: 'rgba(26,58,74,0.12)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      background: '#f26419',
                      height: '100%',
                      borderRadius: 3,
                      width: `${progressPct}%`,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
