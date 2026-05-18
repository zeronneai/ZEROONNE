---
title: "Brenda Jazmín: From Influencer to Owned Course Platform"
slug: brenda-jazmin-cake-pump
client: "Brenda Jazmín (@brendaa_jazmin)"
industry: "Fitness / Creator Economy"
order: 3
featured: false
services:
  - Custom Course Platform
  - Stripe Checkout & Webhooks
  - Supabase Backend
  - Claude API Integration
  - AI Vision Companion App
timeline: "~6 weeks"
investment: "$12,000–$20,000"
metaTitle: "Case Study: Brenda Jazmín's Owned Course Platform | Primo AI Studio"
metaDescription: "How we built a fully-owned Kajabi alternative for Mexican fitness influencer Brenda Jazmín — custom video player, progress tracking, Stripe integration, and AI companion app."
datePublished: "2026-05-18"
techStack:
  - React
  - Vite
  - Supabase
  - Stripe
  - Claude API
  - Vercel
keyResult: "Fully-owned Kajabi alternative · Claude API companion app · bilingual native UX · no monthly SaaS fees"
---

> "No quiero pagar Kajabi por siempre. Quiero que sea mío."

**Client:** Brenda Jazmín (@brendaa_jazmin) — Mexican fitness influencer
**Goal:** Replace Kajabi with a fully-owned course platform for "Cake Pump Workout"
**Stack:** React + Vite + Supabase + Stripe + Claude API + Vercel serverless proxy

## The problem

Brenda built an engaged audience in the Mexican fitness niche and was ready to sell her signature program. Like most creators, her options were:

- **Kajabi/Thinkific:** Easy to launch, but ~$150–300/month in perpetuity plus transaction fees on some tiers
- **Stan Store / Linktree:** Inexpensive but limited customization and basic UX
- **Custom build:** Higher upfront investment, owned forever

She chose owned. We built.

## What we built

### Page 1 · Landing / Sales page

Cinematic hero with brand video. Hook copy written in Mexican Spanish — Brenda's voice, not translated. Social proof carousel with transformation photos. Curriculum preview. Bilingual testimonials. Sticky CTA on mobile. Stripe-powered checkout integration.

### Page 2 · Checkout

Direct Stripe integration — no third-party processor middleman. One-page checkout. Auto-creates user account on successful payment. Email confirmation in Spanish. Tax handling for MX/US buyers.

### Page 3 · Course content platform

Video player with progress tracking (resumes where you left off). Module/lesson structure with marked-complete states. Downloadable materials (PDFs, calendars). Notes section per lesson. Bilingual UI. Mobile-optimized — most fitness customers watch on phones during workouts.

### Bonus: "Brenda AI Vision" companion app

Separate app with 8-step onboarding flow (goals, current fitness state, preferences). Personalized workout plans generated via Claude API. Personalized meal plans, also AI-generated and bilingual. Progress check-ins.

**Critical architecture note:** Claude API integration requires a serverless proxy — direct browser → Anthropic API calls fail due to CORS. We built the proxy as a Vercel serverless function. Now standard in our internal playbook for all future AI integrations.

### Vercel Root Directory configuration

Vercel's Root Directory setting caused the initial deploy to fail due to the monorepo structure. Fix: explicit Root Directory in Vercel project settings + `vercel.json` with correct output config. Now standard in all our deploys.

## Results

**Ownership:**
- Fully owned platform — no monthly SaaS fees to Kajabi or Thinkific
- Complete customer data ownership (emails, behavior, completion rates)
- Branded experience matching Brenda's aesthetic, not a template's

**Technical delivery:**
- Launch-ready in 6 weeks
- Bilingual native UX — Spanish-first, not translated
- AI Vision companion app as post-purchase upsell, increasing customer LTV
- Vercel serverless proxy pattern documented for reuse across future AI projects

**Creator economics:**
- One-time investment replaces indefinite SaaS subscription
- Direct Stripe integration eliminates middleman transaction fees
- Customer data stays with Brenda, not a platform

## What we learned

**Own vs. rent math depends on audience size.** For creators with a large, engaged following like Brenda, the custom build pays back within months. For smaller audiences, off-the-shelf tools still make sense. We tell clients honestly which category they're in.

**AI API integration needs a server layer.** The CORS limitation isn't obvious until you hit it. Building the serverless proxy added ~2 hours but unblocked the Claude API integration entirely. Now it's day-one infrastructure on every AI project.

**Bilingual UX means Spanish-first, not bilingual-second.** Writing the Spanish copy first, then adapting to English, produces a fundamentally different result than translating. The voice stays authentic.

## Tech stack

| Tool | Purpose |
|---|---|
| React + Vite + Framer Motion | Frontend |
| Supabase | Auth + database + video storage |
| Stripe Checkout + Webhooks | Payments |
| Claude API (via Vercel serverless proxy) | AI workout + meal plan generation |
| Bunny.net | Video hosting |
| Vercel | Hosting + serverless functions |

---

<!-- TODO: PENDING real quote from Brenda Jazmín — request via DM before publishing testimonials section -->
