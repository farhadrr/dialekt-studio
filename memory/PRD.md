# DialectStudio — AI Content Creator Hub

## Original Problem Statement
Fast, responsive website for AI content creators providing ready-to-use TikTok video scripts and AI image prompts focused on Arabic and Kurdish dialects. Homepage with three categories (TikTok Scripts, AI Prompts, Content Ideas), banner ad spaces, a Contact Us page, and full mobile optimization.

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui + framer-motion. Dark creator-studio aesthetic, RTL-first (Arabic default) with EN/AR/KU language switcher via LanguageContext.
- **Backend**: FastAPI + MongoDB (motor). Content library seeded on startup from `seed_data.py`.
- **AI**: Gemini `gemini-3-flash-preview` via emergentintegrations + Emergent LLM key for on-demand generation.

## User Personas
- Arabic/Kurdish TikTok creators needing ready scripts, hooks, and CTAs.
- AI visual artists needing Midjourney/Flux prompts rooted in regional aesthetics.
- Social media managers seeking dialect-specific content ideas.

## Core Requirements (static)
- Three category toolkits: TikTok Scripts, AI Prompts, Content Ideas.
- Curated, copyable library filterable by dialect (7 dialects: EG, LEV, GULF, IRQ, MAG Arabic + Sorani/Kurmanji Kurdish).
- On-demand AI generation (category + dialect + topic + vibe).
- Banner ad zones: leaderboard, in-feed (every 6 cards), sticky sidebar rectangle.
- Contact Us page with form.
- Fully mobile-responsive; bilingual RTL/LTR.

## Implemented (2026-06-13)
- Bilingual RTL/LTR UI with EN/AR/KU switcher (persisted).
- Homepage: hero, leaderboard ad, bento category grid, featured content.
- Library pages per category with dialect filter pills, in-feed + sidebar ads, copy-to-clipboard w/ toasts.
- AI Generator dialog (hero, library, sidebar) — streams Gemini output, copyable.
- Contact page form → persisted to MongoDB.
- 18 seeded content items across dialects. Backend & frontend tested 100%.

## Backlog / Remaining
- P1: Save/bookmark favorites (localStorage) — designed but not built.
- P1: Real ad network wiring (currently intentional placeholder zones).
- P2: Content detail page / share links.
- P2: Admin panel to manage library & view contact submissions.
- P2: Migrate FastAPI startup to lifespan handlers; tighten CORS for production.

## Next Tasks
- Bookmarking, more seeded content per dialect, admin content management.
