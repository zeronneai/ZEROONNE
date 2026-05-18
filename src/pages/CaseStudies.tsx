import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogHeader from '../components/BlogHeader';
import { getAllCaseStudies } from '../lib/caseStudies';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800', green: '#8bbe6e' };
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function CaseStudiesFooter() {
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
          <Link to="/"              style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Home</Link>
          <Link to="/blog"          style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Blog</Link>
          <Link to="/case-studies"  style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: C.cream,         textDecoration: 'none', fontWeight: 700 }}>Case Studies</Link>
          <Link to="/faq"           style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>FAQ</Link>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2026 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

export default function CaseStudies() {
  const studies = getAllCaseStudies();

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, []);

  return (
    <>
      <Helmet>
        <title>Case Studies | Primo AI Studio — Real Results for El Paso Businesses</title>
        <meta name="description" content="See real AI and web systems we've built for El Paso businesses. Torque Performance, El Toro Law, Brenda Jazmín — measurable results, real numbers." />
        <link rel="canonical" href="https://primostudio.us/case-studies" />
        <meta property="og:title"       content="Case Studies | Primo AI Studio" />
        <meta property="og:description" content="Real AI systems built for El Paso businesses — with real numbers." />
        <meta property="og:url"         content="https://primostudio.us/case-studies" />
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader />

        {/* ── Hero ── */}
        <section style={{ background: C.navy, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
            >
              REAL WORK. REAL RESULTS.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
              style={{ margin: '0 0 20px', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}
            >
              Case Studies
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              style={{ margin: 0, fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: `${C.cream}bb`, lineHeight: 1.6 }}
            >
              Not mockups. Not proposals. Systems we actually built — with numbers to show what changed.
            </motion.p>
          </div>
        </section>

        {/* ── Case study cards ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,7vh,96px) clamp(20px,5vw,60px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px,5vh,56px)' }}>
            {studies.map((cs, i) => (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.08 }}
              >
                <Link to={`/case-studies/${cs.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: i === 0 ? C.navy : '#fff',
                      borderRadius: 24,
                      padding: 'clamp(28px,4vw,48px)',
                      border: `1.5px solid ${i === 0 ? 'transparent' : 'rgba(26,58,74,0.1)'}`,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 'clamp(24px,4vw,48px)',
                      alignItems: 'center',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(26,58,74,0.14)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    {/* Left: metadata */}
                    <div>
                      {/* Industry badge */}
                      <div style={{
                        display: 'inline-block', marginBottom: 16,
                        background: i === 0 ? `${C.orange}22` : `${C.navy}0d`,
                        color: i === 0 ? C.orange : `${C.navy}99`,
                        borderRadius: 999, padding: '4px 14px',
                        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                      }}>
                        {cs.industry}
                      </div>
                      <h2 style={{
                        margin: '0 0 12px',
                        fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 900, lineHeight: 1.15,
                        color: i === 0 ? C.cream : C.navy,
                      }}>
                        {cs.client}
                      </h2>
                      <p style={{
                        margin: '0 0 20px',
                        fontSize: 14, fontWeight: 500,
                        color: i === 0 ? `${C.cream}99` : `${C.navy}88`,
                        lineHeight: 1.5,
                      }}>
                        {cs.timeline} · {cs.investment}
                      </p>
                      {/* Tech stack chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {cs.techStack.slice(0, 5).map(tech => (
                          <span key={tech} style={{
                            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: i === 0 ? 'rgba(234,226,183,0.12)' : 'rgba(26,58,74,0.07)',
                            color: i === 0 ? `${C.cream}cc` : `${C.navy}88`,
                            letterSpacing: '0.04em',
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: key result + CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {cs.keyResult && (
                        <div style={{
                          background: i === 0 ? 'rgba(242,100,25,0.15)' : `${C.orange}0f`,
                          borderLeft: `3px solid ${C.orange}`,
                          borderRadius: '0 12px 12px 0',
                          padding: '16px 20px',
                        }}>
                          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange, marginBottom: 6 }}>
                            KEY RESULT
                          </div>
                          <div style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, color: i === 0 ? C.cream : C.navy, lineHeight: 1.4 }}>
                            {cs.keyResult}
                          </div>
                        </div>
                      )}
                      <span style={{
                        alignSelf: 'flex-start',
                        color: C.orange, fontWeight: 800, fontSize: 14,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        Read case study →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section style={{ background: C.navy, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            style={{ maxWidth: 560, margin: '0 auto' }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
              WANT RESULTS LIKE THESE?
            </p>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: C.cream, lineHeight: 1.15 }}>
              Let's build yours.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 16, color: `${C.cream}aa`, lineHeight: 1.6 }}>
              Start with a free 20-min AI Opportunity Scorecard call. We'll show you where the biggest ROI is before you spend a dollar.
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
          </motion.div>
        </section>

        <CaseStudiesFooter />
      </div>
    </>
  );
}
