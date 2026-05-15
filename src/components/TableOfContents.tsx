import React, { useEffect, useState } from 'react';

const C = { navy: '#1a3a4a', orange: '#f26419' };

interface Heading { id: string; text: string; level: number; }

interface Props {
  contentId: string;
  variant?: 'mobile' | 'desktop';
}

export default function TableOfContents({ contentId, variant }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Small delay so rehype-slug has time to add IDs
    const timer = setTimeout(() => {
      const el = document.getElementById(contentId);
      if (!el) return;
      const nodes = el.querySelectorAll('h2, h3');
      const items: Heading[] = [];
      nodes.forEach((node) => {
        if (node.id) {
          items.push({
            id: node.id,
            text: node.textContent || '',
            level: node.tagName === 'H2' ? 2 : 3,
          });
        }
      });
      setHeadings(items);
    }, 100);
    return () => clearTimeout(timer);
  }, [contentId]);

  useEffect(() => {
    if (headings.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  if (headings.length === 0) return null;

  const list = (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {headings.map(({ id, text, level }) => (
        <li key={id}>
          <button
            onClick={() => scrollTo(id)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Mulish', sans-serif", fontSize: 13,
              fontWeight: active === id ? 700 : 400,
              color: active === id ? C.orange : `${C.navy}aa`,
              lineHeight: 1.45, padding: '4px 0',
              paddingLeft: level === 3 ? 16 : 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (active !== id) (e.currentTarget as HTMLElement).style.color = C.navy; }}
            onMouseLeave={e => { if (active !== id) (e.currentTarget as HTMLElement).style.color = `${C.navy}aa`; }}
          >
            {text}
          </button>
        </li>
      ))}
    </ul>
  );

  if (variant === 'mobile') {
    return (
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: `${C.navy}08`, border: `1px solid ${C.navy}18`, borderRadius: 12,
            padding: '12px 16px', cursor: 'pointer',
            fontFamily: "'Mulish', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy,
          }}
        >
          On this page {mobileOpen ? '↑' : '↓'}
        </button>
        {mobileOpen && (
          <div style={{
            marginTop: 8, padding: '16px 20px',
            background: `${C.navy}06`, border: `1px solid ${C.navy}18`, borderRadius: 12,
          }}>
            {list}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'desktop') {
    return (
      <div style={{
        position: 'sticky', top: 100,
        maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
        paddingLeft: 24,
        borderLeft: `2px solid ${C.navy}18`,
      }}>
        <p style={{
          margin: '0 0 16px',
          fontFamily: "'Mulish', sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: `${C.navy}66`,
        }}>
          On this page
        </p>
        {list}
      </div>
    );
  }

  // Legacy: render both (no variant specified)
  return (
    <>
      <style>{`
        .toc-legacy-mobile { display: none; }
        .toc-legacy-desktop { display: block; }
        @media (max-width: 900px) {
          .toc-legacy-mobile { display: block; }
          .toc-legacy-desktop { display: none; }
        }
      `}</style>
      <div className="toc-legacy-mobile" style={{ marginBottom: 32 }}>
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: `${C.navy}08`, border: `1px solid ${C.navy}18`, borderRadius: 12,
            padding: '12px 16px', cursor: 'pointer',
            fontFamily: "'Mulish', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy,
          }}
        >
          On this page {mobileOpen ? '↑' : '↓'}
        </button>
        {mobileOpen && (
          <div style={{ marginTop: 8, padding: '16px 20px', background: `${C.navy}06`, border: `1px solid ${C.navy}18`, borderRadius: 12 }}>
            {list}
          </div>
        )}
      </div>
      <aside className="toc-legacy-desktop" style={{
        position: 'sticky', top: 84,
        maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
        padding: '24px 0 24px 24px',
        borderLeft: `2px solid ${C.navy}18`,
        width: 220, flexShrink: 0,
      }}>
        <p style={{ margin: '0 0 16px', fontFamily: "'Mulish', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${C.navy}66` }}>
          On this page
        </p>
        {list}
      </aside>
    </>
  );
}
