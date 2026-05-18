import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogHeader from '../components/BlogHeader';
import BlogCard from '../components/BlogCard';
import { getAllPosts } from '../lib/blog';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800', green: '#8bbe6e' };
const EASE_OUT: [number,number,number,number] = [0.22, 1, 0.36, 1];

const CATEGORY_ORDER = ['All', 'AI Tools', 'Case Studies', 'Marketing', 'Healthcare', 'Law Firms', 'Restaurants'];

function BlogFooter() {
  return (
    <footer style={{ background: C.navy, padding: '48px clamp(20px,5vw,60px) 32px', marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 16, fontWeight: 900, color: C.cream, marginBottom: 6 }}>Primo AI Studio</div>
          <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, fontStyle: 'italic', fontWeight: 500, color: `${C.cream}88`, maxWidth: 300, lineHeight: 1.4 }}>
            The AI partner you can trust, like that family member you can always count on.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <Link to="/" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Home</Link>
          <Link to="/blog" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: C.cream, textDecoration: 'none', fontWeight: 700 }}>Blog</Link>
          <Link to="/case-studies" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Case Studies</Link>
          <Link to="/faq"  style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>FAQ</Link>
          <a href="mailto:primostudio.us@gmail.com" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2025 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

export default function BlogIndex() {
  const allPosts = useMemo(() => getAllPosts(), []);
  const [activeCategory, setActiveCategory] = useState('All');

  const visibleCategories = useMemo(() => {
    const cats = new Set(allPosts.map(p => p.category).filter(Boolean));
    return CATEGORY_ORDER.filter(c => c === 'All' || cats.has(c));
  }, [allPosts]);

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, []);

  const featured = allPosts.find(p => p.featured);
  const filteredPosts = allPosts.filter(p => {
    if (p.featured) return false;
    if (activeCategory === 'All') return true;
    return p.category === activeCategory || p.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()));
  });

  const formattedDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Helmet>
        <title>AI Insights Blog | Primo AI Studio — El Paso's #1 AI Agency</title>
        <meta name="description" content="Practical AI strategies, local El Paso case studies, and human-first thinking for businesses ready to scale. New articles every week from Primo AI Studio." />
        <link rel="canonical" href="https://primostudio.us/blog" />
        <meta property="og:title" content="AI Insights Blog | Primo AI Studio" />
        <meta property="og:description" content="Practical AI strategies for El Paso businesses." />
        <meta property="og:url" content="https://primostudio.us/blog" />
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader />

        {/* Hero */}
        <section style={{
          background: C.navy,
          padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,60px)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}
            >
              WRITTEN BY YOUR PRIMOS
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
              style={{ margin: '0 0 20px', fontFamily: "'Mulish',sans-serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: C.cream, lineHeight: 1.1 }}
            >
              Insights from your primo.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              style={{ margin: 0, fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: `${C.cream}bb`, lineHeight: 1.6 }}
            >
              Real strategies, real numbers, zero jargon. Written by humans who'd rather you implement than read.
            </motion.p>
          </div>
        </section>

        {/* Category filters */}
        <div style={{
          background: C.cream, borderBottom: `1px solid rgba(26,58,74,0.08)`,
          padding: '0 clamp(20px,5vw,60px)',
          overflowX: 'auto',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, padding: '16px 0', minWidth: 'max-content' }}>
            {visibleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  height: 36, padding: '0 18px', borderRadius: 999,
                  border: `1.5px solid ${activeCategory === cat ? C.orange : 'rgba(26,58,74,0.2)'}`,
                  background: activeCategory === cat ? C.orange : 'transparent',
                  color: activeCategory === cat ? C.cream : `${C.navy}99`,
                  fontFamily: "'Mulish',sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.06em', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vh,80px) clamp(20px,5vw,60px)' }}>

          {/* Featured article */}
          {featured && activeCategory === 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              style={{ marginBottom: 'clamp(40px,6vh,80px)' }}
            >
              <Link to={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.navy, borderRadius: 24, overflow: 'hidden',
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(26,58,74,0.22)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  {featured.coverImage && (
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', minHeight: 240 }}>
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        loading="eager"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {/* Content */}
                  <div style={{ padding: 'clamp(32px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{
                      display: 'inline-block', alignSelf: 'flex-start',
                      background: C.orange, color: C.cream,
                      borderRadius: 999, padding: '4px 12px',
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginBottom: 20,
                    }}>
                      ★ Featured · {featured.category}
                    </div>
                    <h2 style={{
                      margin: '0 0 16px', fontFamily: "'Mulish',sans-serif",
                      fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900,
                      color: C.cream, lineHeight: 1.15,
                    }}>
                      {featured.title}
                    </h2>
                    <p style={{
                      margin: '0 0 28px', fontSize: 15, fontWeight: 400,
                      color: `${C.cream}bb`, lineHeight: 1.6,
                    }}>
                      {featured.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: `${C.cream}66` }}>
                        {formattedDate(featured.date)} · {featured.readTime}
                      </span>
                      <span style={{ color: C.orange, fontWeight: 800, fontSize: 14 }}>
                        Read article →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          {filteredPosts.length > 0 ? (
            <>
              {activeCategory !== 'All' || !featured ? null : (
                <p style={{ margin: '0 0 24px', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${C.navy}66` }}>
                  All articles
                </p>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'clamp(20px,3vw,32px)',
              }}>
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.07 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: `${C.navy}66` }}>
              <p style={{ fontSize: 16, fontWeight: 500 }}>No articles in this category yet.</p>
              <button
                onClick={() => setActiveCategory('All')}
                style={{ marginTop: 16, background: 'none', border: 'none', color: C.orange, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                View all articles →
              </button>
            </div>
          )}
        </div>

        <BlogFooter />
      </div>
    </>
  );
}
