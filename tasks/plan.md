# Implementation Plan: AI-Powered Career Readiness Platform

## Overview
A Next.js web application connecting students to careers using Supabase (Auth, DB, Vector) and Google Gemini (AI parsing/recommendations), adhering to strict minimalist backend principles and AWWWARDS-level frontend design (GSAP, Bento).

## Architecture Decisions (Ponytail & GPT-Taste)
- **Framework**: Next.js App Router.
- **UI & Motion**: Tailwind CSS, Shadcn UI, and GSAP. High-end minimal editorial style.
- **Backend**: Supabase handles Auth, DB, and Storage. No custom Express/Node backend (YAGNI). API routes in Next.js only when proxying Gemini or API Setu is required.
- **AI**: Google Gemini API via server actions/API routes for Resume parsing and Mock Interviews.
- **Search**: Supabase `pgvector` for semantic job matching.

## Task List

### Phase 1: Foundation & Scaffold
- [ ] Task 1: Initialize Next.js project with Tailwind, Shadcn UI, and GSAP. Define strict typography and GSAP scroll utility.
- [ ] Task 2: Setup Supabase client and database schema (Users, Profiles, Jobs).

### Checkpoint: Foundation
- [ ] App builds locally. Supabase connection verified. UI typography scale tested.

### Phase 2: Auth & Profile (Attention/Hero)
- [ ] Task 3: Implement Supabase Auth (Email/Google) and Landing Page (Cinematic Hero + GSAP reveals).
- [ ] Task 4: Student Profile Form (Academic record capture).

### Checkpoint: Profile
- [ ] User can log in and save profile data to Supabase.

### Phase 3: Career Guidance & Resume AI
- [ ] Task 5: Integrate Gemini API. Build Resume Upload (Supabase Storage) & Parse (Gemini).
- [ ] Task 6: Build AI Career Path & Skill Gap Recommendation view (Gapless Bento Grid layout).

### Checkpoint: Intelligence
- [ ] Resume uploads extract text. Gemini returns structured JSON career recommendations.

### Phase 4: Opportunities & Mock Interviews
- [ ] Task 7: Job & Internship Matching UI (Supabase pgvector / API Setu fallback mock).
- [ ] Task 8: AI Mock Interview Chat Interface (Gemini conversational streaming).

### Checkpoint: Complete
- [ ] All PRD features functional. GSAP hover/scroll physics validated.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Prompt hallucination | High | Use structured outputs (JSON schema) for Gemini API calls. |
| GSAP Scroll issues | Med | Wrap main in `overflow-x-hidden`. Strict pinning rules. |

## Open Questions
- Do we have API keys for Supabase and Gemini ready to inject into `.env.local`?
- For the hackathon demo, should we seed mock jobs into Supabase rather than live API Setu integration to guarantee reliability? (Ponytail says: yes, mock it first).
