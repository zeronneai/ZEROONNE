import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../lib/blog';

const C = { navy: '#1a3a4a', orange: '#f26419', cream: '#eae2b7' };
const EASE_OUT = 'cubic-bezier(0.22,1,0.36,1)';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 16,
        background: C.cream,
        border: `1px solid rgba(26,58,74,0.1)`,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: '100%',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(26,58,74,0.15)'
          : '0 2px 8px rgba(26,58,74,0.06)',
        transition: `transform 0.3s ${EASE_OUT}, box-shadow 0.3s ${EASE_OUT}`,
      }}>
        {/* Cover image */}
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: `transform 0.4s ${EASE_OUT}`,
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, ${C.navy} 0%, ${C.orange} 100%)`,
            }} />
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category chip */}
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start',
            background: C.orange, color: C.cream,
            borderRadius: 999, padding: '3px 10px',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 12,
            fontFamily: "'Mulish', sans-serif",
          }}>
            {post.category}
          </div>

          {/* Title */}
          <h3 style={{
            margin: '0 0 10px', fontFamily: "'Mulish', sans-serif",
            fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.title}
          </h3>

          {/* Description */}
          <p style={{
            margin: '0 0 20px', fontFamily: "'Mulish', sans-serif",
            fontSize: 13, fontWeight: 400, color: C.navy, opacity: 0.65,
            lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.description}
          </p>

          {/* Meta row */}
          <div style={{
            marginTop: 'auto', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'Mulish', sans-serif", fontSize: 12, fontWeight: 500,
              color: C.navy, opacity: 0.45,
            }}>
              {formattedDate} · {post.readTime}
            </span>
            <span style={{
              fontSize: 16, color: C.orange, fontWeight: 700,
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              transition: `transform 0.2s ${EASE_OUT}`,
            }}>
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
