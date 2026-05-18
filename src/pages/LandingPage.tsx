import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHeader from '../components/BlogHeader';
import { getLandingBySlug } from '../lib/landings';
import { getCaseStudyBySlug } from '../lib/caseStudies';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800' };

function LandingFooter() {
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
          <Link to="/case-studies" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Case Studies</Link>
          <Link to="/faq"          style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>FAQ</Link>
          <a href="mailto:primostudio.us@gmail.com" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2026 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const { pathname } = useLocation();
  const slug = pathname.slice(1);
  const landing = getLandingBySlug(slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!landing) return <Navigate to="/" replace />;

  const relatedStudies = landing.relatedCaseStudies
    .map(s => getCaseStudyBySlug(s))
    .filter((cs): cs is NonNullable<ReturnType<typeof getCaseStudyBySlug>> => cs !== null);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: landing.heroTitle,
    description: landing.metaDescription,
    provider: { '@id': 'https://primostudio.us/#organization' },
    areaServed: [
      { '@type': 'City', name: 'El Paso',        containedInPlace: { '@type': 'State',   name: 'Texas'  } },
      { '@type': 'City', name: 'Ciudad Juárez',  containedInPlace: { '@type': 'Country', name: 'México' } },
    ],
    url: `https://primostudio.us/${landing.slug}`,
  };

  const faqSchema = landing.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landing.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://primostudio.us/'                          },
      { '@type': 'ListItem', position: 2, name: landing.title,  item: `https://primostudio.us/${landing.slug}`           },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{landing.metaTitle}</title>
        <meta name="description"        content={landing.metaDescription} />
        <link rel="canonical"           href={`https://primostudio.us/${landing.slug}`} />
        <meta property="og:title"       content={landing.metaTitle} />
        <meta property="og:description" content={landing.metaDescription} />
        <meta property="og:url"         content={`https://primostudio.us/${landing.slug}`} />
        <meta property="og:type"        content="website" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader showBack={false} />

        {/* ── 1. Hero — navy ── */}
        <section style={{ background: C.navy, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange }}>
              {landing.targetKeyword}
            </p>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(30px,5vw,56px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}>
              {landing.heroTitle}
            </h1>
            <p style={{ margin: '0 0 40px', fontSize: 'clamp(15px,2vw,18px)', color: `${C.cream}bb`, lineHeight: 1.6 }}>
              {landing.heroSubtitle}
            </p>
            <a
              href="mailto:primostudio.us@gmail.com"
              style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 999, background: C.orange, color: C.cream, fontFamily: "'Mulish',sans-serif", fontSize: 15, fontWeight: 800, textDecoration: 'none', letterSpacing: '0.04em' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Book a Free Audit →
            </a>
          </div>
        </section>

        {/* ── 2. Problem — cream ── */}
        {(landing.problemIntro || landing.problemBullets.length > 0) && (
          <section style={{ background: C.cream, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                THE PROBLEM
              </p>
              {landing.problemIntro && (
                <p style={{ margin: '0 0 28px', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>
                  {landing.problemIntro}
                </p>
              )}
              {landing.problemBullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {landing.problemBullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 16, color: C.navy, lineHeight: 1.6 }}>
                      <span style={{ color: C.orange, fontWeight: 900, flexShrink: 0, marginTop: 2 }}>—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ── 3. Services — white ── */}
        {landing.services.length > 0 && (
          <section style={{ background: '#fff', padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>
              <p style={{ margin: '0 0 40px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                WHAT WE BUILD
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {landing.services.map((svc, i) => (
                  <div
                    key={i}
                    style={{ padding: '28px', borderRadius: 16, border: `1.5px solid ${i === 0 ? 'transparent' : `${C.navy}14`}`, background: i === 0 ? C.navy : '#fff', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.borderColor = C.orange; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; } }}
                    onMouseLeave={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.borderColor = `${C.navy}14`;  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; } }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: i === 0 ? C.cream : C.navy, marginBottom: 10, lineHeight: 1.3 }}>
                      {svc.title}
                    </div>
                    <div style={{ fontSize: 14, color: i === 0 ? `${C.cream}aa` : `${C.navy}88`, lineHeight: 1.6 }}>
                      {svc.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 4. Why El Paso — navy ── */}
        {(landing.whyElPaso || landing.whyElPasoPoints.length > 0) && (
          <section style={{ background: C.navy, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
                WHY EL PASO SPECIFICALLY
              </p>
              {landing.whyElPaso && (
                <p style={{ margin: '0 0 28px', fontSize: 'clamp(16px,2vw,19px)', color: `${C.cream}cc`, lineHeight: 1.7 }}>
                  {landing.whyElPaso}
                </p>
              )}
              {landing.whyElPasoPoints.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {landing.whyElPasoPoints.map((pt, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 16, color: `${C.cream}cc`, lineHeight: 1.6 }}>
                      <span style={{ color: C.orange, fontWeight: 900, flexShrink: 0, marginTop: 2 }}>→</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ── 5. See It In Action — cream ── */}
        {relatedStudies.length > 0 && (
          <section style={{ background: C.cream, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>
              <p style={{ margin: '0 0 32px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                SEE IT IN ACTION
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: relatedStudies.length === 1
                  ? 'minmax(0, 600px)'
                  : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
                ...(relatedStudies.length === 1 ? { maxWidth: 600 } : {}),
              }}>
                {relatedStudies.map(cs => (
                  <Link key={cs.slug} to={`/case-studies/${cs.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ background: '#fff', borderRadius: 16, padding: '28px', border: `1.5px solid ${C.navy}14`, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s, transform 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.orange; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${C.navy}14`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 999, background: `${C.navy}0d`, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${C.navy}77` }}>
                        {cs.industry}
                      </div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.navy, lineHeight: 1.2, fontFamily: "'Mulish',sans-serif" }}>
                        {cs.client}
                      </h3>
                      {cs.keyResult && (
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.orange, lineHeight: 1.4 }}>
                          {cs.keyResult}
                        </p>
                      )}
                      {cs.techStack.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {cs.techStack.slice(0, 4).map(tech => (
                            <span key={tech} style={{ padding: '4px 10px', borderRadius: 999, background: `${C.navy}0a`, border: `1px solid ${C.navy}14`, fontSize: 11, fontWeight: 700, color: `${C.navy}88` }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.02em' }}>
                        Read case study →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Transparent Pricing — white ── */}
        <section style={{ background: '#fff', padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.navy}66` }}>
              TRANSPARENT PRICING
            </p>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 900, color: C.navy, lineHeight: 1.15 }}>
              We don't hide what we charge.
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 16, color: `${C.navy}88`, lineHeight: 1.6 }}>
              Project-based and retainer options available. See all service tiers and what's included before the first conversation.
            </p>
            <Link
              to="/pricing"
              style={{ display: 'inline-block', padding: '13px 32px', borderRadius: 999, border: `2px solid ${C.navy}`, color: C.navy, fontFamily: "'Mulish',sans-serif", fontSize: 14, fontWeight: 800, textDecoration: 'none', letterSpacing: '0.04em', transition: 'background 0.2s, color 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = C.navy; el.style.color = C.cream; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = C.navy; }}
            >
              View pricing →
            </Link>
          </div>
        </section>

        {/* ── 7. FAQ — cream ── */}
        {landing.faq.length > 0 && (
          <section style={{ background: C.cream, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <p style={{ margin: '0 0 32px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                FREQUENTLY ASKED
              </p>
              <div>
                {landing.faq.map((item, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${C.navy}22` }}>
                    <button
                      onClick={() => setOpenFaq(prev => prev === i ? null : i)}
                      style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', gap: 16 }}
                    >
                      <span style={{ fontFamily: "'Mulish',sans-serif", fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>
                        {item.q}
                      </span>
                      <span style={{ fontSize: 22, color: C.orange, flexShrink: 0, fontWeight: 700, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block', lineHeight: 1 }}>
                        +
                      </span>
                    </button>
                    {openFaq === i && (
                      <div style={{ paddingBottom: 20 }}>
                        <p style={{ margin: 0, fontSize: 15, color: `${C.navy}99`, lineHeight: 1.7 }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 8. CTA — navy ── */}
        <section style={{ background: C.navy, padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
              READY TO START?
            </p>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: C.cream, lineHeight: 1.15 }}>
              Let's build yours.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 16, color: `${C.cream}aa`, lineHeight: 1.6 }}>
              Start with a free 20-min AI Opportunity Scorecard. We'll identify where the biggest impact is before you spend anything.
            </p>
            <a
              href="mailto:primostudio.us@gmail.com"
              style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 999, background: C.orange, color: C.cream, fontFamily: "'Mulish',sans-serif", fontSize: 15, fontWeight: 800, textDecoration: 'none', letterSpacing: '0.04em' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Book a free call →
            </a>
          </div>
        </section>

        <LandingFooter />
      </div>
    </>
  );
}
