import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import BlogHeader from '../components/BlogHeader';

const C = {
  navy:   '#1a3a4a',
  orange: '#f26419',
  cream:  '#eae2b7',
  yellow: '#f5b800',
  green:  '#8bbe6e',
};
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FAQItem {
  slug: string;
  question: string;
  answer: string | React.ReactNode;
}

interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        slug: 'what-does-an-ai-agency-actually-do',
        question: 'What does an AI agency actually do?',
        answer:
          'An AI agency designs, builds, and installs AI-powered systems for businesses. Unlike software tools you buy off-the-shelf (ChatGPT, Jasper, etc.), an AI agency creates custom solutions specific to your operations — chatbots trained on your business, workflow automations, content systems, etc. Primo AI Studio specifically focuses on bilingual AI for El Paso-area businesses.',
      },
      {
        slug: 'difference-between-ai-automation-and-chatbot',
        question: "What's the difference between AI automation and a chatbot?",
        answer:
          'A chatbot is one specific AI tool that handles conversations. AI automation is a broader system that may include chatbots, document processing, content generation, reporting, and workflow integrations — all working together. Chatbots are tactical solutions; automation is strategic infrastructure.',
      },
      {
        slug: 'will-ai-replace-my-employees',
        question: 'Will AI replace my employees?',
        answer:
          "No, when implemented correctly. We design AI systems to remove the work your team hates (data entry, after-hours messages, repetitive admin) so they can focus on revenue-generating work. Most of our clients have grown headcount after working with us, not shrunk it.",
      },
      {
        slug: 'what-if-my-industry-is-too-specific-for-ai',
        question: 'What if my industry is too specific or niche for AI?',
        answer:
          "Most industries benefit from AI somewhere. We've built systems for: law firms, fitness brands, baseball academies, restaurants, real estate, e-commerce, course creators, dental practices. If your industry has repetitive admin, bilingual customer service, or content needs, AI helps. If it doesn't, we'll tell you.",
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Packages',
    items: [
      {
        slug: 'how-much-does-an-ai-agency-cost-in-el-paso',
        question: 'How much does an AI agency cost in El Paso?',
        answer:
          "AI agency pricing in El Paso ranges from $150/month (basic chatbot maintenance) to $10,000+/month (full custom AI infrastructure). Primo AI Studio's services start at $497 for a one-time AI Audit and scale from $2,500/month (one system) to $8,000/month (multi-department AI infrastructure).",
      },
      {
        slug: 'whats-included-in-the-497-ai-audit',
        question: "What's included in the $497 AI Audit?",
        answer:
          "Our $497 Clarity Audit includes: a 60-minute discovery call, a complete operational audit of your business workflows, identification of the highest-ROI AI automation opportunities, custom ROI projections, and a 90-day implementation roadmap. The roadmap is yours to keep, even if you don't continue working with us.",
      },
      {
        slug: 'why-is-growth-tier-4500-per-month',
        question: 'Why is your Growth tier $4,500/month?',
        answer:
          'That price reflects three integrated AI systems (not just one) running across your business, plus a custom dashboard with your KPIs, workflow automation across departments, 60-day post-launch support, and monthly check-ins. Most businesses recover this cost in 30-60 days through time savings and revenue growth.',
      },
      {
        slug: 'do-you-offer-payment-plans',
        question: 'Do you offer payment plans?',
        answer:
          'Yes, for projects over $5,000 we can split into 2-3 payments. Monthly retainers (Sprint, Growth, Scale) are billed monthly without lock-in contracts.',
      },
    ],
  },
  {
    id: 'services',
    label: 'Services & Capabilities',
    items: [
      {
        slug: 'what-tools-do-you-use',
        question: 'What tools do you use? (ChatGPT, Claude, Gemini, others)',
        answer:
          'We use whichever model best fits the task. Claude (Anthropic) for nuanced reasoning and bilingual content. GPT (OpenAI) for broad general-purpose tasks. Gemini (Google) for some multimodal tasks. We also use specialized models (ElevenLabs for voice, Replicate for image generation, etc.). Most clients never need to know — we handle the model selection.',
      },
      {
        slug: 'can-i-just-buy-chatgpt-instead',
        question: 'Can I just buy ChatGPT instead?',
        answer:
          'Sometimes that\'s the right answer. If your need is "I want to draft emails faster" — ChatGPT alone is fine. If your need is "I want my business to run more efficiently" — you need infrastructure around AI, not just the tool. We\'ll help you figure out which is which on the Scorecard call.',
      },
      {
        slug: 'do-you-offer-training-for-my-team',
        question: 'Do you offer training for my team?',
        answer:
          'Yes, every project includes team training (typically 2 hours, in English or Spanish). For larger organizations, we offer extended training programs as part of Scale tier.',
      },
    ],
  },
  {
    id: 'bilingual',
    label: 'Bilingual & Cross-Border',
    items: [
      {
        slug: 'atienden-a-clientes-en-espanol',
        question: '¿Atienden a clientes en español?',
        answer:
          'Sí, completamente. Todas nuestras llamadas, contratos, briefings, soporte y entregas pueden hacerse 100% en español. Nuestro equipo es bilingüe nativo. Podemos facturar en USD o coordinar pagos en pesos mexicanos.',
      },
      {
        slug: 'do-you-serve-businesses-in-ciudad-juarez-or-chihuahua',
        question: 'Do you serve businesses in Ciudad Juárez or Chihuahua?',
        answer:
          "Yes. We've built systems for businesses with operations in Ciudad Juárez and Chihuahua. We understand cross-border tax considerations at a high level, USMCA compliance basics, and bilingual customer service requirements. For specific legal/accounting matters, we partner with cross-border specialists.",
      },
      {
        slug: 'what-makes-you-bilingual-by-default',
        question: 'What makes you "bilingual by default"?',
        answer:
          "Every system we build is architected for both languages from day one — not translated as an afterthought. Our chatbots detect spanglish. Our content engines write Mexican-Spanish that sounds local. Our intake forms work in either language. We've trained our internal models on regional context.",
      },
    ],
  },
  {
    id: 'process',
    label: 'Process & Timeline',
    items: [
      {
        slug: 'how-long-does-a-typical-project-take',
        question: 'How long does a typical project take?',
        answer: (
          <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.8 }}>
            <li>AI Audit: 7-10 days from kickoff to delivered report</li>
            <li>Sprint (one AI system): 30 days</li>
            <li>Growth (three integrated systems): 60-90 days</li>
            <li>Custom software/SaaS: 90-150 days</li>
            <li>Mobile apps: 120-180 days including app store submission</li>
          </ul>
        ),
      },
      {
        slug: 'how-do-we-communicate-during-a-project',
        question: 'How do we communicate during a project?',
        answer:
          "Slack channel for daily/async communication. Weekly 30-min check-in call. Monthly written progress report. You can also text/WhatsApp the founder directly during active projects — we believe in family-energy access.",
      },
      {
        slug: 'what-if-im-not-happy-with-the-work',
        question: "What if I'm not happy with the work?",
        answer:
          "Two safeguards: (1) the AI Audit fee is refunded if we don't find at least $5,000/year of automation opportunity, (2) monthly retainers have no lock-in — you can cancel anytime with 30 days notice. We've never had to issue an audit refund, and our retainer churn is under 10% annually.",
      },
      {
        slug: 'who-owns-the-code-and-ip-after-a-project',
        question: 'Who owns the code and IP after a project?',
        answer:
          "You. Always. You get the GitHub repo, deployment access, database credentials, and full documentation. We never hold code hostage. You can take it to another agency or your in-house team at any point.",
      },
      {
        slug: 'how-do-i-start-working-with-you',
        question: 'How do I start working with you?',
        answer: (
          <>
            Three options:
            <ol style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.8 }}>
              <li><strong>Free Scorecard call (20 min):</strong> Best if you're just exploring AI for your business.</li>
              <li><strong>Paid AI Audit ($497):</strong> Best if you're ready to implement and want a custom roadmap.</li>
              <li><strong>Direct project inquiry:</strong> Best if you know exactly what you want built → <a href="mailto:primostudio.us@gmail.com" style={{ color: C.orange }}>Contact us</a></li>
            </ol>
          </>
        ),
      },
    ],
  },
  {
    id: 'roi',
    label: 'Results & ROI',
    items: [
      {
        slug: 'how-quickly-do-clients-see-roi',
        question: 'How quickly do clients see ROI?',
        answer:
          'Most clients break even within 60 days. Some within 30. The fastest ROI typically comes from automating high-volume admin work (lead qualification, customer support) where time savings are immediate and measurable.',
      },
      {
        slug: 'can-you-guarantee-specific-results',
        question: 'Can you guarantee specific results?',
        answer:
          "We can guarantee process and effort. We can show you projected ROI math based on your specific business. We can show you what other El Paso businesses in similar situations have achieved. We won't promise specific revenue numbers because too many variables are outside our control (your market, your team's adoption, your sales process).",
      },
      {
        slug: 'whats-the-typical-time-savings-for-businesses',
        question: "What's the typical time-savings for businesses?",
        answer:
          'On average, our clients save 60-80 hours per week of human work after implementation. This time gets redirected to revenue-generating activities or strategic work. The biggest wins tend to be: bilingual customer service (25 hrs/week), lead qualification (18 hrs/week), content production (10 hrs/week).',
      },
    ],
  },
];

// ── Plain-text helper for FAQPage schema ──────────────────────────────────────
function extractText(node: React.ReactNode): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    const child = extractText(el.props.children);
    if (el.type === 'li') return child.trim() + '.';
    return child;
  }
  return '';
}
function answerToPlainText(answer: string | React.ReactNode): string {
  if (typeof answer === 'string') return answer;
  return extractText(answer).replace(/\s+/g, ' ').trim();
}

// ── Footer ────────────────────────────────────────────────────────────────────
function FAQFooter() {
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
          <Link to="/"     style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Home</Link>
          <Link to="/blog" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Blog</Link>
          <Link to="/case-studies"          style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Case Studies</Link>
          <Link to="/ai-automation-el-paso" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Services</Link>
          <Link to="/faq"                   style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: C.cream,         textDecoration: 'none', fontWeight: 700 }}>FAQ</Link>
          <a href="mailto:primostudio.us@gmail.com" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2026 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FAQ() {
  const initialOpen = new Set(FAQ_DATA.map(cat => cat.items[0].slug));
  const [openItems, setOpenItems] = useState<Set<string>>(initialOpen);
  const [activeTab, setActiveTab] = useState(FAQ_DATA[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    setOpenItems(prev => new Set([...prev, hash]));
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }, []);

  const toggle = (slug: string) =>
    setOpenItems(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const schemaEntity = FAQ_DATA.flatMap(cat =>
    cat.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: answerToPlainText(item.answer) },
    }))
  );

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Primo AI Studio | El Paso, TX</title>
        <meta name="description" content="Everything you wanted to know about working with Primo AI Studio. Pricing, process, bilingual capabilities, AI ROI — 22 honest answers from your primos." />
        <link rel="canonical" href="https://primostudio.us/faq" />
        <meta property="og:title"       content="FAQ | Primo AI Studio — El Paso's AI Agency" />
        <meta property="og:description" content="22 honest answers about AI agency pricing, process, bilingual services, and ROI in El Paso." />
        <meta property="og:url"         content="https://primostudio.us/faq" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type':    'FAQPage',
          mainEntity: schemaEntity,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://primostudio.us/' },
            { '@type': 'ListItem', position: 2, name: 'FAQ',  item: 'https://primostudio.us/faq' },
          ],
        })}</script>
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section style={{ background: C.navy, padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
            >
              HONEST ANSWERS FROM YOUR PRIMOS
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
              style={{ margin: '0 0 20px', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              style={{ margin: 0, fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: `${C.cream}bb`, lineHeight: 1.6 }}
            >
              If you're considering working with us, you probably have questions.
              Here are the ones we get most often — answered straight, no marketing speak.
            </motion.p>
          </div>
        </section>

        {/* ── Sticky category tabs ──────────────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: C.cream, borderBottom: `1px solid rgba(26,58,74,0.1)`,
          overflowX: 'auto',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', gap: 8,
            padding: '14px clamp(20px,5vw,60px)',
            minWidth: 'max-content',
          }}>
            {FAQ_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                style={{
                  height: 36, padding: '0 18px', borderRadius: 999,
                  border:     `1.5px solid ${activeTab === cat.id ? C.orange : 'rgba(26,58,74,0.2)'}`,
                  background: activeTab === cat.id ? C.orange : 'transparent',
                  color:      activeTab === cat.id ? C.cream  : `${C.navy}99`,
                  fontFamily: "'Mulish',sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.06em', cursor: 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FAQ sections ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(48px,7vh,96px) clamp(20px,5vw,60px)' }}>
          {FAQ_DATA.map((cat, ci) => (
            <section
              key={cat.id}
              id={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              style={{
                marginBottom: ci < FAQ_DATA.length - 1 ? 'clamp(56px,9vh,96px)' : 0,
                scrollMarginTop: 72,
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                style={{
                  margin: '0 0 20px',
                  fontSize: 'clamp(17px,2.2vw,22px)', fontWeight: 900, color: C.navy,
                  paddingBottom: 12, borderBottom: `2px solid ${C.orange}`,
                }}
              >
                {cat.label}
              </motion.h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cat.items.map((item, ii) => {
                  const isOpen = openItems.has(item.slug);
                  return (
                    <motion.div
                      key={item.slug}
                      id={item.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: ii * 0.06 }}
                      style={{
                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                        border: `1.5px solid ${isOpen ? C.orange : 'rgba(26,58,74,0.1)'}`,
                        transition: 'border-color 0.2s',
                        scrollMarginTop: 80,
                      }}
                    >
                      <button
                        onClick={() => toggle(item.slug)}
                        aria-expanded={isOpen}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', gap: 16,
                          padding: 'clamp(16px,2.5vw,22px)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left', fontFamily: "'Mulish',sans-serif",
                        }}
                      >
                        <span style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>
                          <a
                            href={`#${item.slug}`}
                            onClick={e => e.stopPropagation()}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            {item.question}
                          </a>
                        </span>
                        <span style={{
                          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                          background:  isOpen ? C.orange : 'rgba(26,58,74,0.08)',
                          color:       isOpen ? C.cream  : C.navy,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, fontWeight: 300, lineHeight: 1,
                          transform:  isOpen ? 'rotate(45deg)' : 'none',
                          transition: 'all 0.25s',
                          userSelect: 'none',
                        }}>
                          +
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{    height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: EASE_OUT }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{
                              padding: '0 clamp(16px,2.5vw,22px) clamp(16px,2.5vw,22px)',
                              fontSize: 'clamp(14px,1.6vw,15px)', fontWeight: 400,
                              color: `${C.navy}cc`, lineHeight: 1.75,
                            }}>
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section style={{
          background: C.navy,
          padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,60px)',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            style={{ maxWidth: 560, margin: '0 auto' }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
              STILL HAVE QUESTIONS?
            </p>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: C.cream, lineHeight: 1.15 }}>
              Ask us directly.
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 16, color: `${C.cream}aa`, lineHeight: 1.6 }}>
              We answer everything personally. No bots. (That's our policy — even though we build bots for a living.)
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
              Send us your question →
            </a>
          </motion.div>
        </section>

        <FAQFooter />
      </div>
    </>
  );
}
