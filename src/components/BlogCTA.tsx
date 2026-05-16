import React, { useState } from 'react';
import OnboardingModal, { ModalEntry } from '../../OnboardingModal';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800' };

export default function BlogCTA() {
  const [modalEntry, setModalEntry] = useState<ModalEntry | null>(null);

  return (
    <>
      <div style={{
        marginTop: 80,
        background: C.orange,
        borderRadius: 24,
        padding: 'clamp(40px,6vh,64px) clamp(32px,5vw,56px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle floating shapes */}
        {[
          { w: 200, h: 200, top: -60, right: -40 },
          { w: 120, h: 120, bottom: -40, left: 20 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: s.w, height: s.h,
            borderRadius: '50%',
            background: C.cream,
            opacity: 0.07,
            top: s.top, right: s.right,
            bottom: s.bottom, left: s.left,
            pointerEvents: 'none',
          }} />
        ))}

        <p style={{
          margin: '0 0 8px',
          fontFamily: "'Mulish', sans-serif",
          fontSize: 11, fontWeight: 800, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: `${C.cream}bb`,
        }}>
          Free · 5 Minutes · No Pitch
        </p>

        <h2 style={{
          margin: '0 0 16px',
          fontFamily: "'Mulish', sans-serif",
          fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900,
          color: C.cream, lineHeight: 1.1,
        }}>
          Reading is fun. Implementing is what pays.
        </h2>

        <p style={{
          margin: '0 auto 36px',
          fontFamily: "'Mulish', sans-serif",
          fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400,
          color: `${C.cream}cc`, lineHeight: 1.6, maxWidth: 520,
        }}>
          Take the free 5-minute Scorecard and we'll tell you exactly which of these strategies fits your business.
        </p>

        <button
          onClick={() => setModalEntry({ source: 'getstarted' })}
          style={{
            height: 52, padding: '0 36px', borderRadius: 999,
            background: C.cream, color: C.navy,
            border: 'none', cursor: 'pointer',
            fontFamily: "'Mulish', sans-serif",
            fontSize: 13, fontWeight: 900, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
          }}
        >
          Take the free Scorecard →
        </button>

        <p style={{
          margin: '16px 0 0',
          fontFamily: "'Mulish', sans-serif",
          fontSize: 12, fontStyle: 'italic',
          color: `${C.cream}99`, textAlign: 'center',
        }}>
          5 minutes. Free. No 'follow-up sequence' — just one honest report.
        </p>
      </div>

      <OnboardingModal entry={modalEntry} onClose={() => setModalEntry(null)} />
    </>
  );
}
