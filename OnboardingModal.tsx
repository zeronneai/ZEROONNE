import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ─────────────────────────────────────────────────────────────────
const LEAD_EMAIL = 'zeronne.ai@gmail.com';

const LOGO_URL =
  'https://res.cloudinary.com/dsprn0ew4/image/upload/v1778360725/ChatGPT_Image_May_9_2026_03_04_56_PM_hdfdcd.png';

const ALL_SERVICES = [
  'Web Platforms',
  'AI Automation',
  'AI Integration',
  'Brand Identity',
  'AI Video Ads',
  'Content Marketing',
];

const QUESTIONS = [
  {
    id: 1,
    question: 'Which of these is currently eating up the most time in your business each week?',
    options: [
      'Answering the same customer questions over and over',
      'Following up with leads manually',
      'Creating content (social, emails, etc.)',
      'Manual data entry / admin work',
      'All of the above',
    ],
  },
  {
    id: 2,
    question: 'How many leads do you estimate slip through the cracks each month because no one followed up fast enough?',
    options: [
      "0–5 (we've got it handled)",
      '5–20',
      '20–50',
      "50+ (it's bleeding money)",
      "Honestly, I don't even track it",
    ],
  },
  {
    id: 3,
    question: 'Your top 3 competitors are already using AI to respond to leads in under 60 seconds, generate content daily, and qualify prospects 24/7. Where do you stand?',
    options: [
      "We're ahead of them",
      'About the same',
      'Behind, and I know it',
      "I have no idea what they're doing",
    ],
  },
  {
    id: 4,
    question: 'If you could reclaim 15–20 hours a week starting next month, what would you do with it?',
    options: [
      'Close more deals / focus on revenue',
      'Finally work ON the business, not in it',
      'Spend it with family / get my life back',
      'Scale to the next level',
    ],
  },
  {
    id: 5,
    question: "What's the #1 thing holding you back from implementing AI in your business right now?",
    options: [
      "I don't know where to start",
      "I tried tools (ChatGPT, etc.) but couldn't make them work for MY business",
      'No time to figure it out',
      'Worried about cost',
      "Honestly, I've been procrastinating",
    ],
  },
  {
    id: 6,
    question: 'How much do you think one missed customer or unanswered lead costs your business?',
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
    question: 'When you imagine your business 12 months from now WITHOUT AI handling the heavy lifting — what does that look like?',
    options: [
      'Same as today (stuck)',
      'Burned out and behind',
      'Losing ground to competitors',
      'I refuse to let that happen — I need to move now',
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

// ── Email builder ─────────────────────────────────────────────────────────────
function buildEmail(
  answers: string[],
  entrySource: 'bubble' | 'getstarted',
  services: string[],
): string {
  const entryPoint =
    entrySource === 'bubble' ? 'Clicked on service bubble' : 'GET STARTED button';
  const servicesLine =
    entrySource === 'bubble'
      ? `SERVICE OF INTEREST: ${services[0] ?? '—'}`
      : `SERVICES OF INTEREST: ${services.join(', ') || '—'}`;

  return [
    'New lead completed the Primo AI Studio questionnaire.',
    '',
    `ENTRY POINT: ${entryPoint}`,
    servicesLine,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'QUESTIONNAIRE RESULTS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'Q1 — Biggest time drain:',
    answers[0] ?? '—',
    '',
    'Q2 — Monthly leads slipping through:',
    answers[1] ?? '—',
    '',
    'Q3 — vs Competitors:',
    answers[2] ?? '—',
    '',
    "Q4 — What they'd do with 15–20 hrs/week:",
    answers[3] ?? '—',
    '',
    'Q5 — #1 barrier to AI adoption:',
    answers[4] ?? '—',
    '',
    'Q6 — Cost of one missed lead:',
    answers[5] ?? '—',
    '',
    'Q7 — Business in 12 months without AI:',
    answers[6] ?? '—',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Follow up within 24 hours.',
    'Primo AI Studio',
  ].join('\n');
}

// ── Shared button style helper ────────────────────────────────────────────────
function NextButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
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
          fontFamily: 'Arial, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.35 : 1,
          transition: 'background 0.2s ease, opacity 0.2s ease',
        }}
      >
        {label}
      </button>
    </div>
  );
}

// ── Service card (multi-select step 0) ────────────────────────────────────────
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
        fontFamily: 'Arial, sans-serif',
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

// ── Option item (single-select questions) ─────────────────────────────────────
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
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        fontWeight: selected ? 600 : 400,
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
      {/* "Let's find your fit" chip */}
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        border: '1.5px solid #1a3a4a',
        color: '#1a3a4a',
        fontFamily: 'Arial, sans-serif',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Let's find your fit
      </span>

      <p className="primo-q-text" style={{
        fontFamily: 'Georgia, serif',
        fontSize: 22,
        fontWeight: 700,
        color: '#1a3a4a',
        lineHeight: 1.35,
        margin: '0 0 6px',
      }}>
        Which services are you interested in?
      </p>
      <p style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: 12,
        color: 'rgba(26,58,74,0.45)',
        margin: '0 0 24px',
      }}>
        Select all that apply.
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
  const isLast = stepIndex === QUESTIONS.length - 1;

  return (
    <motion.div
      key={`q-${stepIndex}`}
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -30, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ paddingBottom: 24 }}
    >
      {/* Service chip — only shown for Flujo A */}
      {chipLabel && (
        <span style={{
          display: 'inline-block',
          background: '#f26419',
          color: '#eae2b7',
          fontFamily: 'Arial, sans-serif',
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

      {/* Step counter */}
      <p style={{
        margin: '0 0 12px',
        fontSize: 11,
        letterSpacing: '0.2em',
        color: '#f26419',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 600,
      }}>
        {String(stepIndex + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
      </p>

      {/* Question text */}
      <p className="primo-q-text" style={{
        fontFamily: 'Georgia, serif',
        fontSize: 20,
        fontWeight: 700,
        color: '#1a3a4a',
        lineHeight: 1.4,
        margin: '0 0 28px',
      }}>
        {q.question}
      </p>

      {/* Options */}
      {q.options.map((opt) => (
        <OptionItem
          key={opt}
          text={opt}
          selected={selected === opt}
          onSelect={() => onSelect(selected === opt ? '' : opt)}
        />
      ))}

      <NextButton
        label={isLast ? "Let's get started! →" : 'Next →'}
        disabled={!selected}
        onClick={onNext}
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
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1a3a4a', margin: '0 0 10px', lineHeight: 1.3 }}>
        We'll be in touch soon.
      </p>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: 'rgba(26,58,74,0.6)', margin: '0 0 32px' }}>
        Your primo is already working on it.
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
          fontFamily: 'Arial, sans-serif',
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
  service?: string; // only Flujo A
}

interface OnboardingModalProps {
  entry: ModalEntry | null;
  onClose: () => void;
}

export default function OnboardingModal({ entry, onClose }: OnboardingModalProps) {
  const isOpen = entry !== null;

  // step: -1 = service selection (Flujo B only), 0–6 = questions, 7 = thank-you
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const [selected, setSelected] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset state whenever modal opens with a new entry
  useEffect(() => {
    if (!entry) return;
    setAnswers(Array(7).fill(''));
    setSelected('');
    if (entry.source === 'getstarted') {
      setStep(-1);
      setSelectedServices([]);
    } else {
      setStep(0);
      setSelectedServices(entry.service ? [entry.service] : []);
    }
  }, [entry]);

  const handleClose = () => {
    onClose();
  };

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc],
    );
  };

  const handleNext = () => {
    if (step === -1) {
      // Flujo B: service selection → first question
      if (selectedServices.length === 0) return;
      setStep(0);
      return;
    }

    if (!selected) return;

    const newAnswers = [...answers];
    newAnswers[step] = selected;
    setAnswers(newAnswers);

    if (step === QUESTIONS.length - 1) {
      // Last question: fire mailto
      const subject = 'New Lead — Primo AI Studio Questionnaire';
      const body = buildEmail(newAnswers, entry!.source, selectedServices);
      window.location.href = `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    setSelected('');
    setStep((s) => s + 1);
  };

  const isThankYou = step === QUESTIONS.length;
  const isServiceSelect = step === -1;

  // Progress bar
  const progressPct = isThankYou ? 100 : isServiceSelect ? 0 : ((step + 1) / QUESTIONS.length) * 100;
  const progressLabel = isServiceSelect ? 'Intro' : `Step ${step + 1} of ${QUESTIONS.length}`;

  // Chip for Flujo A persists through all question steps
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
                    fontFamily: 'Arial, sans-serif',
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
                    fontFamily: 'Arial, sans-serif',
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
