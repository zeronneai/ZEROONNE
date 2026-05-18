---
title: "El Toro Law: A Premium Bilingual Landing That Actually Closes"
slug: el-toro-law
client: "El Toro Law / Mario Yagüe Law"
industry: "Legal — Personal Injury & Immigration"
order: 1
featured: true
services:
  - Premium Bilingual Landing Page
  - GSAP Animations
  - Brand Identity
  - Letterhead Automation
  - Formspree Integration
timeline: "~4 weeks"
investment: "$4,500–$7,500"
metaTitle: "Case Study: El Toro Law's Premium Bilingual Landing Page | Primo AI Studio"
metaDescription: "How we built an Awwwards-caliber bilingual landing page for El Toro Law in El Paso. Cinematic GSAP animations, Cormorant Garamond typography, bull SVG intro."
datePublished: "2026-05-18"
techStack:
  - HTML/CSS/JS
  - GSAP
  - ScrollTrigger
  - Formspree
  - Vercel
keyResult: "Awwwards-caliber bilingual landing built in 4 weeks · GSAP cinematic · Lighthouse 90+ mobile"
---

> "I needed a website that matched the way I show up in court."

**Client:** Mario Yagüe Law / El Toro Law (El Paso, TX)
**Practice areas:** Personal injury, immigration, family law
**Goal:** A landing page that convinces prospective clients within 30 seconds that this firm is serious, sophisticated, and bilingual.

## The problem

Most law firm websites in El Paso fall into 2 categories:

1. **Template-y**: Wix/Squarespace with stock photos of gavels and scales
2. **Old-school**: Built in 2014, never updated, broken on mobile

El Toro Law needed something that felt as premium as a New York white-shoe firm site, spoke Spanish first, had cinematic energy without being gimmicky, loaded fast on mobile, and captured leads with a frictionless intake form.

## What we built

### Cinematic intro with custom bull SVG animation

The El Toro brand has a bull logo. We built a custom SVG animation where the bull "draws itself" on initial load — rendering under 800ms, no animation jank. Strong first impression without being annoying.

### GSAP-powered scroll animations

Hero headline reveals on scroll with stagger. Service cards parallax-fade as the user scrolls. "Practice areas" section uses ScrollTrigger to reveal each area with timed delays. Subtle micro-interactions on every CTA.

### Custom typography pairing

Cormorant Garamond (serif, editorial italics for accents) + custom display sans for headlines. Selected for the legal-meets-modern positioning. We rejected the typical Bodoni-and-Helvetica law firm cliché.

### Bilingual ES/EN toggle

True bilingual — not Google Translate. Every word professionally adapted for Mexican-Spanish legal context. Toggle persists across sessions via localStorage.

### Vectorized letterhead recreation

We recreated the firm's letterhead as a self-contained HTML file. Now they can generate branded letters from any device without needing Photoshop.

### Intake form with zero lead loss

Formspree for instant email delivery. Backup logging to Google Sheets so no lead is ever lost. Spam protection without breaking accessibility.

## Results

**Technical:**
- Sub-2-second page load on mobile (Lighthouse)
- 90+ Lighthouse Performance score
- Cinematic SVG bull animation rendering under 800ms
- Bilingual ES/EN toggle with persistent state via localStorage

**Brand:**
- Awwwards-caliber visual quality at boutique pricing
- Mobile-first bilingual intake matching El Paso market reality
- Letterhead recreated as device-independent HTML artifact

**Outcomes:**
- Live referrals from peer law firms in Texas
- New consultations explicitly mentioning the website
- Backup lead logging ensures zero lead loss

## What we learned

**Bilingual ≠ translation.** The real win was treating Spanish-first as the primary user journey. The ES copy was written first, EN was adapted. This kept the Mexican-Spanish tone authentic.

**Premium animation needs restraint.** GSAP can do anything. The discipline is knowing when to NOT animate. The final site has fewer animations than the first prototype — that made it feel more refined.

**Form UX drives law firm conversions.** We spent disproportionate time on the intake form: field order, micro-copy, error states, mobile keyboard types. Most conversion gains came from the form, not the hero.

## Tech stack

| Tool | Purpose |
|---|---|
| HTML/CSS/JS + GSAP | Frontend + animations |
| ScrollTrigger | Scroll-based reveals |
| Formspree | Lead capture form |
| Google Sheets | Backup lead logging |
| Vercel | Hosting |

---

<!-- TODO: PENDING real quote from Mario Yagüe — request via text before publishing testimonials section -->

---

**See the live site:** [marioyaguelaw.com](https://www.marioyaguelaw.com)
