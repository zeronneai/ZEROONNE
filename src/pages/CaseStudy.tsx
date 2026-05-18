import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import BlogHeader from '../components/BlogHeader';
import { getCaseStudyBySlug, getOtherCaseStudies } from '../lib/caseStudies';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800' };
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Markdown component overrides — same visual voice as BlogPost
const MD: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: () => null,
  h2: ({ children, id, ...props }) => (
    <h2 id={id} style={{
      fontFamily: "'Mulish', sans-serif",
      fontSize: 'clamp(22px,2.8vw,30px)', fontWeight: 800,
      color: C.navy, marginTop: 52, marginBottom: 18,
      lineHeight: 1.2, scrollMarginTop: 100,
    }} {...props}>{children}</h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} style={{
      fontFamily: "'Mulish', sans-serif",
      fontSize: 'clamp(17px,2vw,21px)', fontWeight: 700,
      color: C.navy, marginTop: 32, marginBottom: 12,
      lineHeight: 1.3, scrollMarginTop: 100,
    }} {...props}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: "'Mulish', sans-serif", fontSize: 16,
      lineHeight: 1.8, color: C.navy, opacity: 0.88, marginBottom: 20,
    }}>{children}</p>
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: C.orange, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: 24, marginBottom: 20, lineHeight: 1.8 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: 24, marginBottom: 20, lineHeight: 1.8 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ fontFamily: "'Mulish', sans-serif", fontSize: 16, color: C.navy, opacity: 0.88, marginBottom: 8, lineHeight: 1.7 }}>
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 800, color: C.navy }}>{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      margin: '32px 0', padding: '20px 24px',
      borderLeft: `4px solid ${C.orange}`,
      background: `${C.orange}0a`, borderRadius: '0 12px 12px 0',
      fontStyle: 'italic', fontSize: 17, lineHeight: 1.7,
      color: C.navy,
    }}>
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre style={{
          background: `${C.navy}08`, borderRadius: 12,
          padding: '20px 24px', overflowX: 'auto',
          marginBottom: 24, border: `1px solid ${C.navy}14`,
        }}>
          <code style={{ fontFamily: 'monospace', fontSize: 14, color: C.navy, lineHeight: 1.7 }}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code style={{
        fontFamily: 'monospace', fontSize: 14,
        background: `${C.navy}0d`, padding: '2px 6px', borderRadius: 4,
        color: C.navy,
      }}>
        {children}
      </code>
    );
  },
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid ${C.navy}18`, margin: '40px 0' }} />
  ),
};

function CaseStudyFooter() {
  return (
    <footer style={{ background: C.navy, padding: '48px clamp(20px,5vw,60px) 32px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: 24,
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 16, fontWeight: 900, color: C.cream, marginBottom: 6 }}>
            Primo AI Studio
          </div>
          <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, fontStyle: 'italic', fontWeight: 500, color: `${C.cream}88`, maxWidth: 300, lineHeight: 1.4 }}>
            The AI partner you can trust, like that family member you can always count on.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <Link to="/"             style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Home</Link>
          <Link to="/blog"         style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Blog</Link>
          <Link to="/case-studies"          style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: C.cream,         textDecoration: 'none', fontWeight: 700 }}>Case Studies</Link>
          <Link to="/ai-automation-el-paso" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Services</Link>
          <Link to="/faq"                   style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>FAQ</Link>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2026 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const cs = slug ? getCaseStudyBySlug(slug) : null;
  const others = slug ? getOtherCaseStudies(slug) : [];

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
    window.scrollTo(0, 0);
  }, [slug]);

  if (!cs) return <Navigate to="/case-studies" replace />;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    author: {
      '@type': 'Organization',
      name: 'Primo AI Studio',
      '@id': 'https://primostudio.us/#organization',
    },
    publisher: { '@id': 'https://primostudio.us/#organization' },
    datePublished: cs.datePublished,
    dateModified:  cs.datePublished,
    about: { '@type': 'Service', name: 'Custom AI and Web Development' },
    mentions: cs.techStack.map(t => ({ '@type': 'SoftwareApplication', name: t })),
  };

  return (
    <>
      <Helmet>
        <title>{cs.metaTitle || `${cs.client} | Case Study | Primo AI Studio`}</title>
        <meta name="description" content={cs.metaDescription} />
        <link rel="canonical" href={`https://primostudio.us/case-studies/${cs.slug}`} />
        <meta property="og:title"       content={cs.metaTitle || cs.title} />
        <meta property="og:description" content={cs.metaDescription} />
        <meta property="og:url"         content={`https://primostudio.us/case-studies/${cs.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader />

        {/* ── Hero ── */}
        <section style={{ background: C.navy, padding: 'clamp(60px,10vh,120px) clamp(20px,5vw,60px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {/* Back link */}
            <Link to="/case-studies" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32,
              fontFamily: "'Mulish',sans-serif", fontSize: 13, fontWeight: 700,
              color: `${C.cream}77`, textDecoration: 'none',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={e => (e.currentTarget.style.color = `${C.cream}77`)}
            >
              ← All case studies
            </Link>

            {/* Industry badge */}
            <div style={{
              display: 'inline-block', marginBottom: 20,
              background: `${C.orange}22`, color: C.orange,
              borderRadius: 999, padding: '4px 14px',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {cs.industry}
            </div>

            <h1 style={{
              margin: '0 0 16px',
              fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 900, color: C.cream, lineHeight: 1.1,
            }}>
              {cs.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, marginBottom: 32 }}>
              {[
                { label: 'Client',   value: cs.client },
                { label: 'Timeline', value: cs.timeline },
                { label: 'Investment', value: cs.investment },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${C.cream}55`, marginBottom: 4 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: `${C.cream}cc` }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Services tags */}
            {cs.services.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cs.services.map(svc => (
                  <span key={svc} style={{
                    padding: '5px 14px', borderRadius: 999,
                    border: `1px solid rgba(234,226,183,0.2)`,
                    fontSize: 12, fontWeight: 600, color: `${C.cream}99`,
                  }}>
                    {svc}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Key result callout ── */}
        {cs.keyResult && (
          <div style={{ background: C.orange, padding: 'clamp(20px,3vh,36px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: `${C.cream}bb`,
                marginBottom: 8,
              }}>
                KEY RESULT
              </div>
              <div style={{
                fontSize: 'clamp(18px,2.8vw,28px)', fontWeight: 900,
                color: C.cream, lineHeight: 1.25,
              }}>
                {cs.keyResult}
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,6vh,80px) clamp(20px,5vw,60px)' }}>

          {/* Tech stack chips */}
          {cs.techStack.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${C.navy}66`, marginBottom: 12 }}>
                TECH STACK
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cs.techStack.map(tech => (
                  <span key={tech} style={{
                    padding: '6px 16px', borderRadius: 999,
                    background: `${C.navy}0d`, border: `1px solid ${C.navy}18`,
                    fontSize: 13, fontWeight: 700, color: C.navy,
                    letterSpacing: '0.02em',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Markdown body */}
          <div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
              components={MD}
            >
              {cs.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* ── CTA ── */}
        <section style={{ background: C.navy, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
              WANT RESULTS LIKE THESE?
            </p>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: C.cream, lineHeight: 1.15 }}>
              Let's build yours.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 16, color: `${C.cream}aa`, lineHeight: 1.6 }}>
              Start with a free 20-min AI Opportunity Scorecard. We'll show you where the biggest ROI is before you spend a dollar.
            </p>
            <a
              href="mailto:primostudio.us@gmail.com"
              style={{
                display: 'inline-block', padding: '14px 32px', borderRadius: 999,
                background: C.orange, color: C.cream,
                fontFamily: "'Mulish',sans-serif", fontSize: 15, fontWeight: 800,
                textDecoration: 'none', letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Book a free call →
            </a>
          </div>
        </section>

        {/* ── Other case studies ── */}
        {others.length > 0 && (
          <div style={{ background: C.cream, padding: 'clamp(48px,6vh,72px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <p style={{ margin: '0 0 24px', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                MORE CASE STUDIES
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {others.map(other => (
                  <Link key={other.slug} to={`/case-studies/${other.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', borderRadius: 16, padding: '24px',
                      border: `1.5px solid rgba(26,58,74,0.1)`,
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = C.orange;
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(26,58,74,0.1)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${C.navy}66`, marginBottom: 8 }}>
                        {other.industry}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: C.navy, marginBottom: 8 }}>{other.client}</div>
                      {other.keyResult && (
                        <div style={{ fontSize: 13, color: C.orange, fontWeight: 700 }}>{other.keyResult}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <CaseStudyFooter />
      </div>
    </>
  );
}
