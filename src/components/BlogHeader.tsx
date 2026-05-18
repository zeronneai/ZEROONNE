import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7' };

interface BlogHeaderProps {
  showBack?: boolean;
}

export default function BlogHeader({ showBack = true }: BlogHeaderProps) {
  useEffect(() => {
    // The homepage App component sets document.body.style.overflow = 'hidden'
    // as an inline style. Puppeteer captures this and it bleeds into prerendered
    // HTML for all subsequent routes served via the SPA index.html fallback.
    // Clear it here so every page using BlogHeader scrolls normally.
    document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: C.cream,
      borderBottom: '1px solid rgba(26,58,74,0.1)',
      padding: '0 clamp(20px,5vw,60px)',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img
          src="/android-chrome-192x192.png"
          alt="Primo AI Studio - #1 AI Agency in El Paso, Texas"
          style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%' }}
        />
        <span style={{
          fontFamily: "'Mulish', sans-serif", fontWeight: 900, fontSize: 15,
          color: C.navy, letterSpacing: '-0.02em',
        }}>
          Primo AI Studio
        </span>
      </Link>

      {/* Center: Blog label */}
      <span style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Mulish', sans-serif", fontSize: 12, fontWeight: 800,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: `${C.navy}66`,
      }}>
        Insights
      </span>

      {/* Right: back link */}
      {showBack && (
        <Link to="/" style={{
          fontFamily: "'Mulish', sans-serif", fontSize: 13, fontWeight: 700,
          color: `${C.navy}88`, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 4,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
          onMouseLeave={e => (e.currentTarget.style.color = `${C.navy}88`)}
        >
          ← Back to home
        </Link>
      )}
    </header>
  );
}
