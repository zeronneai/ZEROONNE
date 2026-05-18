---
title: "Torque Performance: From Paper Schedules to a Full Member Platform"
slug: torque-performance
client: "Torque Performance"
industry: "Sports Training / Youth Baseball Academy"
order: 2
featured: false
services:
  - Custom Web Platform
  - Stripe Subscriptions & Webhooks
  - Supabase Backend
  - Clerk Authentication
  - Mobile Responsiveness
timeline: "~3 months"
investment: "$15,000–$25,000"
metaTitle: "Case Study: How Torque Performance Automated Baseball Training Operations | Primo AI Studio"
metaDescription: "See how we built Torque Performance's full member platform — self-serve parent portal, 16 Stripe price IDs, Supabase RLS, Clerk auth. Zero manual payment reconciliation."
datePublished: "2026-05-18"
techStack:
  - React
  - Vite
  - Supabase
  - Clerk
  - Stripe
  - Vercel
keyResult: "Self-serve member platform · 16 Stripe price IDs · Supabase RLS + Clerk auth · zero manual payment reconciliation"
---

**Client:** Torque Performance (baseball training academy, El Paso TX)
**Goal:** Replace manual admin with a self-serve member platform for parents and players
**Stack:** React + Vite + Supabase + Clerk + Stripe + Vercel
**Timeline:** ~3 months

## The problem

Torque Performance is a baseball training academy serving youth athletes. Like most local academies, they ran on:

- Paper notebooks for session schedules
- WhatsApp groups for parent communication
- Manual Stripe links for payments (no automation)
- Spreadsheets for tracking attendance
- Email-back-and-forth for waivers and contracts

The result: admin work was consuming significant founder time, and scaling past the current family base meant either hiring office staff or rebuilding the entire operational backend.

They chose to rebuild the backend.

## What we built

### Parent + player portal

Branded login with Clerk authentication. Each family sees their own kids, sessions remaining, and upcoming bookings. Real-time updates when sessions are deducted via check-in. Mobile-responsive — most parents check from their phones.

### Self-serve Stripe checkout — 16 price points

Four packages × four billing intervals = 16 Stripe Price IDs, all mapped automatically:

- 10-session pack, 20-session pack, monthly unlimited, group training
- Each available as one-time or recurring
- `client_reference_id` encoding pattern: `userId__kidName__priceId` — the webhook knows exactly who and what to credit
- Zero manual reconciliation

### Complete Stripe webhook integration

`player_memberships` table in Supabase tracks every active membership. Webhook fires on `checkout.session.completed`, decodes the reference ID, creates or updates the membership. Includes failure handling, retry logic, and idempotency keys. Refunds and cancellations automatically sync membership status.

### Session check-in + decrement

Admin-only interface, separated by RLS policies. Coach taps player name → confirms session → balance decrements in real-time. Full audit log of every session deducted — disputes resolved by reviewing the log, not memory.

### Waiver & contract flow

Parent must accept the waiver before Stripe checkout opens. Modal intercepts the checkout button. Acceptance logged with timestamp and IP for legal protection. Re-accepts on contract updates.

### Admin/parent RLS with proper type handling

Solved a Supabase RLS edge case using `::text` cast for ID type mismatches — admins can edit any record, parents can only edit their own. All auth scenarios tested. Documented in-repo so future maintainers don't rediscover the issue.

### Mobile-first responsive pass

Complete redesign across all major components. Most parents sign up and check balances from their phones — the experience is built around that reality.

## Results

**Technical infrastructure:**
- Fully self-serve member portal for parents and players
- 16 Stripe price IDs mapped across 4 packages × 4 billing intervals
- Stripe webhooks handle 100% of payment reconciliation automatically
- Real-time session balance tracking with full audit log
- Supabase RLS policies enforce admin/parent permission boundaries
- Waiver/contract acceptance intercepts checkout before payment

**Operational impact:**
- Manual paper schedules replaced with searchable, mobile-friendly digital infrastructure
- Founder admin time redirected from data entry to coaching and business development
- Session balance disputes resolved via audit log instead of memory or paper notes
- Parents self-serve common questions without founder involvement

**Scalability:**
- Architecture supports significant growth in family count on current infrastructure
- No additional admin headcount needed as the academy grows

## What we learned

**Stripe webhooks need a debug layer.** The `client_reference_id` encoding pattern is clean until you need to trace which membership got credited for a parent with three kids. We built admin tooling to inspect and replay webhook events alongside the integration. Lesson: always build the debug UI with the feature.

**Supabase RLS is powerful but precise.** The `::text` cast for ID type mismatches is the kind of detail that costs hours without prior knowledge. Every RLS policy is documented in the repo so future maintainers have context.

**Mobile-first isn't optional for local services.** Almost every parent signed up from their phone. Building desktop-first and adapting would have failed the core user.

## Tech stack

| Tool | Purpose |
|---|---|
| React + Vite | Frontend |
| Clerk | Authentication |
| Supabase (Postgres + RLS) | Database + permissions |
| Stripe Checkout + Webhooks | Payments + reconciliation |
| Vercel | Hosting + edge functions for webhooks |

---

<!-- TODO: PENDING real quote from Torque Performance founder — request via text before publishing testimonials section -->
