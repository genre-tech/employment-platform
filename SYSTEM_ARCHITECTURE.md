# System Architecture & System Design

The AI-Powered Career Readiness & Employability Platform is designed to be highly scalable, secure, and intelligent, focusing heavily on Artificial Intelligence integrations for personalized recommendations and career tooling.

## 1. Technology Stack

*   **Frontend (Presentation Layer):** Next.js 15 (App Router), React 19, Tailwind CSS v4, GSAP (for animations). Vibe: "Apple-esque Liquid Glass".
*   **Backend (API Layer):** Next.js Server Actions & Route Handlers (`/api/*`), deployed as serverless edge functions.
*   **Database & Auth (Data Layer):** Supabase (PostgreSQL).
    *   `pgvector` for semantic search (embedding-based matching).
    *   Row Level Security (RLS) for data protection.
    *   Supabase Storage for resumes and certificates.
*   **AI Engine:** Google Gemini API (via `@google/genai` SDK) for mock interviews, resume parsing, and career recommendations.

## 2. Core System Components

### A. AI Mock Interview Engine
1. **Flow:** User starts an interview -> System calls `/api/gemini/interview` -> Gemini generates the first question based on the user's role -> User answers via text/voice -> Gemini evaluates and generates the next question.
2. **State Management:** The conversation history is maintained on the client and passed to the server for context in subsequent turns.
3. **Data Logging:** Interview transcripts and final evaluation scores are saved to the Database for progress tracking.

### B. Resume Parser & Evaluator
1. **Flow:** User uploads a PDF -> File is stored in Supabase Storage -> Backend extracts text (using a serverless PDF parser) -> Text is sent to Gemini API -> Structured JSON response (skills, experience gaps, ATS score) is returned.
2. **Integration:** Mapped against market demands to recommend specific courses via the Recommendation Engine.

### C. Opportunity & Recommendation Engine
1. **Flow:** User profile (skills + goals) is converted to a vector embedding.
2. **Matching:** `pgvector` compares the user's embedding against available jobs and courses.
3. **Data Sourcing:** Job and course data is synchronized periodically from **API Setu** and internal platforms.



## 3. Security & Deployment

### Security Design
*   **Authentication:** JWT-based authentication handled by Supabase Auth.
*   **Authorization:** All database access is governed by PostgreSQL Row Level Security (RLS). Users can only query and mutate their own data.
*   **API Security:** Next.js Route Handlers validate session tokens before executing expensive AI operations (Gemini API) to prevent abuse and manage rate limits.

### Deployment Architecture
*   **Hosting:** Vercel (Optimized for Next.js App Router).
*   **Edge Network:** Vercel Edge Cache for static assets and CDN routing.
*   **Database Hosting:** Supabase Managed Cloud.

## 4. API Integrations

1.  **Google Gemini API:** 
    *   Endpoint: `gemini-2.5-flash` for fast, conversational interactions (interviews).
    *   Endpoint: `gemini-2.5-pro` for deep analytical tasks (resume parsing and career path generation).
2.  **API Setu (Govt. Portals):** 
    *   Cron jobs periodically fetch latest listings from directory.apisetu.gov.in.
    *   Data is standardized and stored in the `JOBS` table for fast retrieval and vector search.
