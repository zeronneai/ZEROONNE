import React from 'react';
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
import { getPostBySlug, getRelatedPosts } from '../lib/blog';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7', yellow: '#f5b800' };

// Inline styles for markdown components
const MD: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h2: ({ children, ...props }) => (
    <h2 style={{
      fontFamily: "'Mulish',sans-serif", fontSize: 'clamp(22px,3vw,30px)',
      fontWeight: 800, color: C.navy, marginTop: 56, marginBottom: 20, lineHeight: 1.2,
    }} {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 style={{
      fontFamily: "'Mulish',sans-serif", fontSize: 'clamp(18px,2.4vw,22px)',
      fontWeight: 700, color: C.navy, marginTop: 40, marginBottom: 14,
    }} {...props}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: "'Mulish',sans-serif", fontSize: 17, lineHeight: 1.75,
      color: C.navy, opacity: 0.85, marginBottom: 22,
    }}>{children}</p>
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: C.orange, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>{children}</a>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 800, color: C.navy }}>{children}</strong>
  ),
  ul: ({ children }) => (
    <ul style={{
      paddingLeft: 24, marginBottom: 24,
      fontFamily: "'Mulish',sans-serif", fontSize: 17, lineHeight: 1.75, color: C.navy,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      paddingLeft: 24, marginBottom: 24,
      fontFamily: "'Mulish',sans-serif", fontSize: 17, lineHeight: 1.75, color: C.navy,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 10, opacity: 0.85 }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: `4px solid ${C.orange}`, paddingLeft: 24,
      margin: '32px 0', fontStyle: 'italic', fontSize: 19,
      color: C.navy, lineHeight: 1.6,
    }}>{children}</blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code style={{
          display: 'block', background: C.navy, color: C.cream,
          padding: '20px 24px', borderRadius: 12, fontSize: 14,
          fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.6,
          marginBottom: 24,
        }}>{children}</code>
      );
    }
    return (
      <code style={{
        background: `${C.navy}14`, color: C.navy,
        padding: '2px 6px', borderRadius: 4, fontSize: 14, fontFamily: 'monospace',
      }}>{children}</code>
    );
  },
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '32px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Mulish',sans-serif", fontSize: 15 }}>
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{ background: C.navy, color: C.cream, padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${C.navy}22`, color: C.navy }}>{children}</td>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid ${C.navy}18`, margin: '48px 0' }} />
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} loading="lazy"
      style={{ width: '100%', borderRadius: 16, margin: '32px 0', objectFit: 'cover' }} />
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
      </Helmet>

      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Mulish',sans-serif" }}>
        <BlogHeader />

        {/* Article header */}
        <section style={{
          background: C.cream, padding: 'clamp(60px,10vh,100px) clamp(20px,5vw,60px) clamp(40px,6vh,64px)',
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Category chip */}
            <div style={{
              display: 'inline-block', background: C.orange, color: C.cream,
              borderRadius: 999, padding: '4px 12px', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24,
            }}>
              {post.category}
            </div>

            <h1 style={{
              margin: '0 0 20px', fontFamily: "'Mulish',sans-serif",
              fontSize: 'clamp(30px,5vw,52px)', fontWeight: 900, color: C.navy, lineHeight: 1.1,
            }}>
              {post.title}
            </h1>

            <p style={{
              margin: '0 0 28px', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400,
              color: C.navy, opacity: 0.65, lineHeight: 1.6,
            }}>
              {post.description}
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
              fontSize: 13, color: `${C.navy}88`, fontWeight: 500,
            }}>
              <span>By {post.author}</span>
              <span>·</span>
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Cover image */}
        {post.coverImage && (
          <div style={{
            maxWidth: 900, margin: '0 auto',
            padding: '0 clamp(20px,5vw,60px) 48px',
          }}>
            <img
              src={post.coverImage}
              alt={post.title}
              loading="eager"
              style={{ width: '100%', borderRadius: 20, maxHeight: 420, objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Two-column layout */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 clamp(20px,5vw,60px) 80px',
          display: 'flex', gap: 56, alignItems: 'flex-start',
        }}>

          {/* Article content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile TOC */}
            <TableOfContents contentId="article-body" />

            <article id="article-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
                components={MD}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* CTA */}
            <BlogCTA />
          </div>

          {/* Desktop TOC (sticky sidebar) */}
          <TableOfContents contentId="article-body" />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section style={{
            background: `${C.navy}08`,
            padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,60px)',
            borderTop: `1px solid ${C.navy}10`,
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h3 style={{
                margin: '0 0 32px', fontFamily: "'Mulish',sans-serif",
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
