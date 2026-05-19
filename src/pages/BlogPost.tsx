import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import BlogHeader from '../components/BlogHeader';
import TableOfContents from '../components/TableOfContents';
import BlogCTA from '../components/BlogCTA';
import BlogCard from '../components/BlogCard';
import { PrimoIcon } from '../components/PrimoIcon';
import { getPostBySlug, getRelatedPosts } from '../lib/blog';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7' };

const MD: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: () => null,
  h2: ({ children, id, ...props }) => (
    <h2 id={id} style={{
      fontFamily: "'Mulish', sans-serif",
      fontSize: 'clamp(24px, 3vw, 32px)',
      fontWeight: 800,
      color: C.navy,
      marginTop: 56,
      marginBottom: 20,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      scrollMarginTop: 100,
    }} {...props}>{children}</h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} style={{
      fontFamily: "'Mulish', sans-serif",
      fontSize: 'clamp(18px, 2.2vw, 22px)',
      fontWeight: 700,
      color: C.navy,
      marginTop: 36,
      marginBottom: 14,
      lineHeight: 1.3,
      scrollMarginTop: 100,
    }} {...props}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: "'Mulish', sans-serif",
      fontSize: 17,
      lineHeight: 1.75,
      color: C.navy,
      opacity: 0.88,
      marginBottom: 22,
    }}>{children}</p>
  ),
  a: ({ children, href }) => (
    <a href={href} style={{
      color: C.orange,
      fontWeight: 600,
      textDecoration: 'underline',
      textUnderlineOffset: 3,
    }}>{children}</a>
  ),
  strong: ({ children }) => (
    <strong style={{ color: C.navy, fontWeight: 800 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', opacity: 0.95 }}>{children}</em>
  ),
  ul: ({ children }) => (
    <ul style={{
      paddingLeft: 28,
      marginBottom: 24,
      fontFamily: "'Mulish', sans-serif",
      fontSize: 17,
      lineHeight: 1.7,
      color: C.navy,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      paddingLeft: 28,
      marginBottom: 24,
      fontFamily: "'Mulish', sans-serif",
      fontSize: 17,
      lineHeight: 1.7,
      color: C.navy,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 10, opacity: 0.88, paddingLeft: 4 }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: `4px solid ${C.orange}`,
      paddingLeft: 24,
      margin: '36px 0',
      fontStyle: 'italic',
      fontSize: 19,
      color: C.navy,
      lineHeight: 1.6,
      opacity: 0.85,
    }}>{children}</blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre style={{
          background: C.navy,
          color: C.cream,
          padding: 20,
          borderRadius: 8,
          overflowX: 'auto',
          margin: '24px 0',
        }}>
          <code style={{ fontSize: 14, fontFamily: 'monospace', lineHeight: 1.6 }}>{children}</code>
        </pre>
      );
    }
    return (
      <code style={{
        background: `${C.navy}18`,
        color: C.navy,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'monospace',
      }}>{children}</code>
    );
  },
  table: ({ children }) => (
    <div style={{
      overflowX: 'auto',
      margin: '32px 0',
      borderRadius: 8,
      border: `1px solid ${C.navy}26`,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'Mulish', sans-serif",
        fontSize: 15,
      }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{
      background: C.navy,
      color: C.cream,
      padding: '14px 18px',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: '14px 18px',
      borderBottom: `1px solid ${C.navy}18`,
      color: C.navy,
      opacity: 0.9,
    }}>{children}</td>
  ),
  hr: () => (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${C.navy}18`,
      margin: '48px 0',
    }} />
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} loading="lazy"
      style={{ width: '100%', borderRadius: 12, margin: '32px 0', objectFit: 'cover' }} />
  ),
};

function BlogFooter() {
  return (
    <footer style={{ background: C.navy, padding: '48px clamp(20px,5vw,60px) 32px' }}>
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
          <a href="mailto:primostudio.us@gmail.com" style={{ fontFamily: "'Mulish',sans-serif", fontSize: 13, color: `${C.cream}77`, textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontFamily: "'Mulish',sans-serif", fontSize: 12, color: `${C.cream}44` }}>
          © 2025 Primo AI Studio · El Paso, TX
        </div>
      </div>
    </footer>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;
  const related = slug ? getRelatedPosts(slug, 3) : [];

  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | Primo AI Studio Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.coverImage || 'https://primostudio.us/og-image.jpg'} />
        <meta property="og:url" content={`https://primostudio.us/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <link rel="canonical" href={`https://primostudio.us/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          image: post.coverImage || 'https://primostudio.us/og-image.jpg',
          author: { '@type': 'Organization', name: 'Primo AI Studio', url: 'https://primostudio.us' },
          publisher: {
            '@type': 'Organization', name: 'Primo AI Studio',
            logo: { '@type': 'ImageObject', url: 'https://primostudio.us/logo.png' },
          },
          datePublished: post.date,
          dateModified: post.date,
          mainEntityOfPage: `https://primostudio.us/blog/${post.slug}`,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://primostudio.us/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://primostudio.us/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://primostudio.us/blog/${post.slug}` },
          ],
        })}</script>
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish', sans-serif" }}>
        <BlogHeader />

        {/* Article hero */}
        <section style={{
          padding: 'clamp(60px, 10vh, 100px) clamp(20px, 5vw, 60px) clamp(40px, 6vh, 60px)',
          maxWidth: 800,
          margin: '0 auto',
        }}>
          <span style={{
            display: 'inline-block',
            background: C.orange,
            color: C.cream,
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 20,
            fontFamily: "'Mulish', sans-serif",
          }}>{post.category}</span>

          <h1 style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            color: C.navy,
            lineHeight: 1.1,
            marginTop: 0,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>{post.title}</h1>

          <p style={{
            fontFamily: "'Mulish', sans-serif",
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: C.navy,
            opacity: 0.7,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: 24,
          }}>{post.description}</p>

          <div style={{
            display: 'flex',
            gap: 16,
            fontSize: 13,
            color: C.navy,
            opacity: 0.6,
            fontFamily: "'Mulish', sans-serif",
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <PrimoIcon name="calendar" size={16} />
              {formattedDate}
            </span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <PrimoIcon name="readtime" size={16} />
              {post.readTime}
            </span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <PrimoIcon name="author" size={16} />
              {post.author}
            </span>
          </div>
        </section>

        {/* Cover image */}
        {post.coverImage && (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,60px) 48px' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              loading="eager"
              style={{ width: '100%', borderRadius: 20, maxHeight: 400, objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* 2-column grid: article + TOC sidebar */}
        <section
          className="blog-content-grid"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 clamp(20px, 5vw, 60px) 80px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 60,
          }}
        >
          {/* Main article column */}
          <article id="article-body" style={{ maxWidth: 720, width: '100%', minWidth: 0 }}>
            {/* Mobile TOC (hidden on desktop via CSS) */}
            <TableOfContents contentId="article-body" variant="mobile" />

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
              components={MD}
            >
              {post.content}
            </ReactMarkdown>

            <BlogCTA />
          </article>

          {/* Desktop TOC sidebar (hidden on mobile via CSS) */}
          <aside className="blog-toc-aside" style={{ display: 'none' }}>
            <TableOfContents contentId="article-body" variant="desktop" />
          </aside>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section style={{
            background: `${C.navy}08`,
            padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,60px)',
            borderTop: `1px solid ${C.navy}10`,
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h3 style={{
                margin: '0 0 32px',
                fontFamily: "'Mulish',sans-serif",
                fontSize: 22, fontWeight: 800, color: C.navy,
              }}>
                Continue reading
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
                gap: 'clamp(20px,3vw,32px)',
              }}>
                {related.map(p => <BlogCard key={p.slug} post={p} />)}
              </div>
            </div>
          </section>
        )}

        <BlogFooter />
      </div>
    </>
  );
}
