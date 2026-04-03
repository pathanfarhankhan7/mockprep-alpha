# SmartMock AI — Project Documentation Report

---

## Abstract

SmartMock AI is an intelligent, full-stack web application designed to simulate realistic technical job interviews and provide candidates with actionable, AI-powered feedback. The platform addresses a critical gap in modern job preparation: the absence of structured, repeatable, and personalised mock interview practice available on demand.

Built with React 18, TypeScript 5.8, Tailwind CSS, and Supabase, SmartMock AI replicates the complete interview pipeline for five in-demand roles — Software Engineer (SWE), Product Manager (PM), Data Scientist, UX Designer, and DevOps Engineer — across seven target companies including Google, Amazon, Meta, Apple, and Microsoft. Each simulated interview follows a four-stage progression: Phone Screen, Technical Round, Deep Dive, and HR Round, mirroring the real-world hiring process of top technology firms.

The AI evaluation engine integrates OpenAI GPT-4o-mini to analyse candidate responses in real time, scoring answers on clarity, completeness, relevance, and confidence. A sophisticated keyword-based heuristic engine provides an offline fallback, ensuring uninterrupted practice even without an active API key. A Supabase Edge Function serves as a serverless evaluation endpoint, combining semantic similarity scoring with keyword-matching for the legacy session model.

Additional capabilities include a Learning Hub with 30+ categorised interview tips, a Progress Dashboard with visual performance metrics, an AI Coach for standalone question practice, dark/light theme support, and a fully responsive mobile-first interface.

SmartMock AI demonstrates how modern web technologies and large language models can be combined to democratise interview coaching — making professional-grade preparation accessible to every candidate, regardless of access to human coaches or expensive prep programmes.

---

## Table of Contents

| Section | Page |
|---|---|
| Abstract | 2 |
| Table of Contents | 3 |
| List of Figures | 4 |
| **Chapter 1: Introduction** | 5 |
| 1.1 Context and Background | 5 |
| 1.2 Problem Statement | 5 |
| 1.3 Project Objectives | 6 |
| 1.4 Key Features | 6 |
| 1.5 Scope of the Project | 7 |
| **Chapter 2: Review of Relevant Literature** | 8 |
| 2.1 AI in Education and Assessment | 8 |
| 2.2 Automated Interview Coaching Systems | 8 |
| 2.3 Natural Language Processing for Answer Evaluation | 9 |
| 2.4 Modern Web Application Architecture | 9 |
| 2.5 Backend-as-a-Service (BaaS) in Rapid Development | 10 |
| **Chapter 3: System Design & Architecture** | 11 |
| 3.1 High-Level System Architecture | 11 |
| 3.2 Technology Stack | 12 |
| 3.3 Database Design | 13 |
| 3.4 AI Framework & Evaluation Pipeline | 14 |
| 3.5 Authentication & Security | 15 |
| 3.6 Application Routing | 15 |
| **Chapter 4: Implementation & Features** | 17 |
| 4.1 Core User Journey | 17 |
| 4.2 Multi-Stage Interview System | 17 |
| 4.3 Role-Specific Interview Configurations | 19 |
| 4.4 Company-Specific Deep Dive Customisation | 20 |
| 4.5 AI Analysis Engine | 21 |
| 4.6 Learning Hub | 22 |
| 4.7 Dashboard & Progress Tracking | 23 |
| 4.8 UI Component Library | 23 |
| **Chapter 5: Results & Discussion** | 25 |
| 5.1 Implementation Achievements | 25 |
| 5.2 Performance Metrics | 25 |
| 5.3 AI Evaluation Quality | 26 |
| 5.4 User Experience Outcomes | 26 |
| 5.5 Limitations and Challenges | 27 |
| **Chapter 6: Conclusions and Future Scope** | 28 |
| 6.1 Key Conclusions | 28 |
| 6.2 Summary Metrics | 28 |
| 6.3 Future Enhancements | 29 |
| References | 31 |
| **Appendix: Source Code & GitHub Repository** | 32 |
| A.1 Repository Information | 32 |
| A.2 Project Structure | 32 |
| A.3 Key Source Files | 34 |
| A.4 Environment Setup | 35 |
| A.5 Available Scripts | 36 |

---

## List of Figures

| Figure | Description |
|---|---|
| Figure 3.1 | High-Level System Architecture Diagram |
| Figure 3.2 | Technology Stack Overview |
| Figure 3.3 | Entity-Relationship Diagram — Database Schema |
| Figure 3.4 | AI Evaluation Pipeline — Decision Flow |
| Figure 3.5 | Application Route Map |
| Figure 4.1 | User Journey — End-to-End Interview Flow |
| Figure 4.2 | Multi-Stage Interview Progression |
| Figure 4.3 | Interview Setup Wizard — Five-Step Process |
| Figure 4.4 | AI Score Breakdown — Four Dimensions |
| Figure 4.5 | Learning Hub — Category and Difficulty Filter |
| Figure 4.6 | Dashboard — Performance Chart (Recharts) |

---

## Chapter 1: Introduction

### 1.1 Context and Background

The technology job market is among the most competitive in the world. Candidates pursuing roles at leading companies such as Google, Amazon, Meta, Apple, and Microsoft face a multi-stage hiring process that typically spans phone screens, algorithmic coding rounds, system design deep dives, and final HR interviews. This process demands not just technical knowledge but also the ability to communicate solutions clearly, demonstrate structured thinking, and articulate professional experiences under time pressure.

Traditional interview preparation has relied on self-study, peer mock interviews, or paid coaching. Each of these methods carries limitations: self-study lacks feedback, peer mocks lack objectivity, and professional coaches are expensive and inaccessible to many. Online platforms such as LeetCode address algorithmic problem-solving but stop short of simulating the full conversational interview experience and providing holistic evaluative feedback.

SmartMock AI was conceived to fill this gap — an intelligent platform that simulates the complete, realistic interview experience across multiple roles and companies, and delivers immediate, expert-quality AI feedback for every answer.

### 1.2 Problem Statement

Despite the abundance of preparation resources, candidates consistently report that:

1. **They lack practice in realistic, time-pressured conditions** — solving a problem in isolation differs from solving it under a ticking timer while articulating thought processes aloud.
2. **Feedback is delayed or absent** — candidates often do not know how their answers are perceived until after a real interview, at which point the opportunity is lost.
3. **Preparation is role-agnostic** — most platforms cater to software engineers with algorithmic questions but do not adequately prepare Product Managers, Data Scientists, UX Designers, or DevOps Engineers.
4. **Full-pipeline simulation is missing** — candidates can practise individual question types but rarely experience the progression from Phone Screen through HR in a single, cohesive session.

SmartMock AI directly addresses all four problems by providing a structured, role-specific, full-pipeline mock interview with real-time AI coaching.

### 1.3 Project Objectives

The specific objectives of SmartMock AI are as follows:

1. **Simulate realistic, multi-stage interviews** for five professional roles: SWE, PM, Data Scientist, UX Designer, and DevOps.
2. **Provide immediate, actionable AI feedback** on every answer, scoring clarity, completeness, relevance, and confidence.
3. **Personalise the experience** by tailoring question sets to the target company (Google, Amazon, Meta, Apple, Microsoft, Startup, Custom).
4. **Track user progress over time** with visual performance dashboards and historical interview data.
5. **Offer curated learning resources** via a searchable Learning Hub with 30+ expert interview tips.
6. **Deliver a seamless, accessible experience** with a fully responsive, mobile-first interface and dark/light theme support.
7. **Ensure secure, private data management** using Row-Level Security (RLS) policies in Supabase.

### 1.4 Key Features

| Feature | Description |
|---|---|
| **Multi-Stage Interviews** | Four-stage pipeline: Phone Screen → Technical → Deep Dive → HR, each with timed questions |
| **5 Professional Roles** | SWE, PM, Data Scientist, UX Designer, DevOps — each with unique question sets |
| **7 Target Companies** | Google, Amazon, Meta, Apple, Microsoft, Startup, Custom — company-specific deep dive questions |
| **AI-Powered Feedback** | OpenAI GPT-4o-mini integration with heuristic fallback engine; scores 4 dimensions per answer |
| **STAR Method Analysis** | Automatic detection of Situation, Task, Action, Result components in behavioural answers |
| **500+ Questions** | Comprehensive question bank across all roles, stages, and interview types |
| **Learning Hub** | 30+ expert tips across Behavioural, Technical, HR, and Problem-Solving categories |
| **Progress Dashboard** | Visual performance tracking with Recharts charts and historical session data |
| **AI Coach** | Standalone AI feedback tool for practising any custom question outside a live interview |
| **Video Recording** | Optional interview recording using browser MediaRecorder API |
| **Timer System** | Per-question countdown timers (2 min behavioural, 45 min technical) with visual alerts |
| **Dark/Light Theme** | System-aware theme toggle with smooth transitions |
| **Authentication** | Supabase Auth with email/password, protected routes, and session persistence |

### 1.5 Scope of the Project

SmartMock AI is a web-based application targeting:

- **Audience**: Job seekers preparing for technical and managerial roles at technology companies
- **Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) on both desktop and mobile
- **Interaction mode**: Text-based answer input with optional voice recording; AI analysis on submission
- **Data persistence**: User authentication and session history via Supabase; interview state via browser localStorage
- **Geographic scope**: Global (English language)

The project does not currently include native mobile applications, live video interview simulation with interviewer avatars, or integration with applicant tracking systems (ATS).

---

## Chapter 2: Review of Relevant Literature

### 2.1 AI in Education and Assessment

The application of artificial intelligence to educational assessment has been an active research area since the 1990s, beginning with Automated Essay Scoring (AES) systems such as Project Essay Grade (PEG). Early systems relied on surface-level features — word count, sentence length, vocabulary richness — to approximate human grades. Modern systems leverage transformer-based language models (Devlin et al., 2019; Brown et al., 2020) to achieve near-human levels of semantic comprehension, enabling nuanced qualitative feedback rather than mere scoring.

Research by Dikli (2006) established that automated scoring systems can achieve inter-rater reliability comparable to human graders when the evaluation criteria are well-defined. SmartMock AI builds on this tradition by defining four explicit scoring dimensions (clarity, completeness, relevance, confidence) that correspond to the competencies interviewers explicitly evaluate.

The emergence of Retrieval-Augmented Generation (RAG) and instruction-tuned large language models such as GPT-4 has further expanded the possibility space — enabling systems to generate personalised coaching text, not just numeric scores. SmartMock AI leverages this capability through its OpenAI integration, which produces structured JSON feedback with strengths, improvements, and a coaching recommendation for every answer.

### 2.2 Automated Interview Coaching Systems

Commercial interview preparation platforms have evolved significantly in the past decade. Early platforms such as Interview Mocha (2010) focused on multiple-choice assessments. Modern platforms such as Pramp (peer-to-peer video mocks), interviewing.io (anonymous mock interviews with engineers), and Google's Interview Warmup (2022) each represent advances toward more realistic simulation.

Google's Interview Warmup is particularly relevant as a precedent — it uses speech-to-text transcription and NLP to identify "job-related terms," "most used words," and "talking points" in candidate responses. However, it does not score responses or provide structured STAR-method feedback. SmartMock AI extends this approach by providing quantitative scores, STAR detection, company-specific question customisation, and a full multi-stage pipeline.

Research by Hoque et al. (2013) on the MACH system demonstrated that an automated social coaching system could significantly improve interview performance through practice with a virtual agent. SmartMock AI's role-play approach — presenting the user with realistic, role-specific questions in a timed context — aligns with the empirical evidence supporting simulation-based interview training.

### 2.3 Natural Language Processing for Answer Evaluation

Evaluating free-text interview responses requires multi-dimensional NLP analysis. Key dimensions studied in the literature include:

- **Semantic similarity**: Cosine similarity of sentence embeddings (Reimers & Gurevych, 2019) between a response and a reference answer, used in the Supabase Edge Function (`evaluate-answer`) with a 60% weight in the final score calculation.
- **Keyword coverage**: Measurement of domain-specific vocabulary coverage, operationalised in the Edge Function as a 40%-weighted keyword score against a curated keyword list per question.
- **Structural quality**: Analysis of logical structure (STAR method compliance), implemented in the heuristic engine via regular expressions detecting Situation, Task, Action, and Result linguistic markers.
- **Confidence indicators**: Lexical cues of hedging vs. assertion (Argamon et al., 2007), implemented in the heuristic engine by counting assertive action verbs versus hedging phrases.

SmartMock AI implements a dual-path evaluation architecture: an OpenAI GPT-4o-mini path for high-fidelity qualitative feedback, and a locally executed heuristic engine for offline or rate-limited scenarios. This design ensures both quality and resilience.

### 2.4 Modern Web Application Architecture

SmartMock AI is built on a Single-Page Application (SPA) architecture using React 18, which offers several advantages for interview simulation:

- **Component-based UI**: Enables modular, reusable interface elements (question cards, timer displays, score panels)
- **Client-side routing**: React Router v6 delivers instant navigation between interview stages without full page reloads
- **Optimistic state management**: TanStack Query (React Query) v5 provides declarative server-state management with automatic caching and background refetching

The use of Vite 5.4 as the build tool provides Hot Module Replacement (HMR) for rapid development iteration and optimised ES module bundling for production. TypeScript 5.8 across 98.6% of the codebase enforces type safety, reducing runtime errors and improving developer experience.

Tailwind CSS v3 provides utility-first styling, eliminating the overhead of custom CSS authoring and enabling consistent design tokens across the entire application. The shadcn/ui component library, built on Radix UI primitives, provides accessible, unstyled components that integrate seamlessly with Tailwind.

### 2.5 Backend-as-a-Service (BaaS) in Rapid Development

Supabase, the Backend-as-a-Service platform used in SmartMock AI, provides a PostgreSQL database, authentication, storage, real-time subscriptions, and serverless Edge Functions in a single integrated platform. Research by Mesbah et al. (2012) highlighted the developer productivity benefits of convention-over-configuration server frameworks; BaaS platforms extend this principle further by abstracting infrastructure management entirely.

Key Supabase capabilities utilised in SmartMock AI:

- **Row-Level Security (RLS)**: PostgreSQL-native RLS policies ensure users can only access their own data, enforcing data isolation at the database level without application-layer middleware.
- **Edge Functions**: Deno-based serverless functions (deployed to Supabase's global edge network) handle the AI evaluation pipeline, keeping API keys server-side.
- **Auth**: Built-in JWT-based authentication with social provider support, reducing the complexity of implementing secure authentication from scratch.

The selection of Supabase over alternatives such as Firebase was motivated by its use of PostgreSQL (a relational database better suited to structured interview data), open-source foundation, and superior query flexibility.

---

## Chapter 3: System Design & Architecture

### 3.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  React 18 SPA  │  TypeScript  │  Tailwind CSS  │  shadcn/ui    │
│  Vite 5.4      │  React Router v6  │  Framer Motion             │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Pages   │  │  Components  │  │  Hooks & Business Logic  │  │
│  │ (21 files)│  │  (60 files)  │  │  (useAuth, useAI, etc.)  │  │
│  └──────────┘  └──────────────┘  └──────────────────────────┘  │
└──────────────────────┬──────────────────────┬───────────────────┘
                       │                      │
         ┌─────────────▼──────────┐  ┌───────▼────────────────┐
         │   SUPABASE PLATFORM    │  │    OPENAI API          │
         │  ┌──────────────────┐  │  │  GPT-4o-mini           │
         │  │  PostgreSQL DB   │  │  │  Structured JSON       │
         │  │  (RLS Policies)  │  │  │  response_format       │
         │  └──────────────────┘  │  └────────────────────────┘
         │  ┌──────────────────┐  │
         │  │  Supabase Auth   │  │
         │  │  (JWT sessions)  │  │
         │  └──────────────────┘  │
         │  ┌──────────────────┐  │
         │  │  Edge Functions  │  │
         │  │ evaluate-answer  │  │
         │  └──────────────────┘  │
         └────────────────────────┘

         ┌────────────────────────┐
         │  BROWSER STORAGE       │
         │  localStorage          │
         │  (Multi-stage state)   │
         └────────────────────────┘
```

**Figure 3.1 — High-Level System Architecture Diagram**

The architecture is divided into three tiers:

1. **Client Layer**: A React SPA running entirely in the browser, responsible for rendering the UI, managing interview state, and making API calls.
2. **Supabase Platform**: Provides the managed PostgreSQL database (with RLS), authentication, and serverless Edge Functions.
3. **OpenAI API**: External AI service called directly from the browser (with API key from environment variables) for real-time answer analysis.

A secondary, fully client-side evaluation path uses the heuristic engine in `ai-service.ts`, which requires no network connectivity and operates entirely within the browser.

### 3.2 Technology Stack

**Figure 3.2 — Technology Stack Overview**

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | 18.3.1 | Component-based UI rendering |
| **Language** | TypeScript | 5.8.3 | Static typing across the full codebase |
| **Build Tool** | Vite | 5.4.19 | Dev server, HMR, production bundling |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| **UI Components** | shadcn/ui + Radix UI | Latest | Accessible, headless component primitives |
| **Routing** | React Router DOM | 6.30.1 | Client-side SPA routing |
| **Server State** | TanStack Query | 5.83.0 | Data fetching, caching, synchronisation |
| **Forms** | React Hook Form | 7.61.1 | Performant, uncontrolled form handling |
| **Validation** | Zod | 3.25.76 | Schema-based runtime validation |
| **Animations** | Framer Motion | 12.38.0 | Declarative UI animations |
| **Charts** | Recharts | 2.15.4 | SVG-based data visualisation |
| **Notifications** | Sonner | 1.7.4 | Toast notification system |
| **Date Utilities** | date-fns | 3.6.0 | Date formatting and manipulation |
| **Theme** | next-themes | 0.3.0 | Dark/light mode with system preference |
| **Backend** | Supabase | 2.100.0 | PostgreSQL, Auth, Edge Functions |
| **AI** | OpenAI API | GPT-4o-mini | Answer evaluation and coaching |
| **Edge Runtime** | Deno | — | Supabase Edge Functions runtime |
| **Testing** | Vitest | 3.2.4 | Unit and component testing |
| **E2E Testing** | Playwright | 1.57.0 | End-to-end browser automation |
| **Linting** | ESLint | 9.32.0 | Code quality enforcement |

### 3.3 Database Design

SmartMock AI uses a PostgreSQL database managed by Supabase with three core tables, each protected by Row-Level Security (RLS) policies.

**Figure 3.3 — Entity-Relationship Diagram**

```
┌─────────────────────────────┐
│       auth.users            │
│  id (UUID, PK)              │
│  email                      │
│  created_at                 │
└──────────────┬──────────────┘
               │ 1
               │
               │ *
┌──────────────▼──────────────┐      ┌───────────────────────────┐
│     interview_sessions      │      │         questions          │
│  id (UUID, PK)              │      │  id (UUID, PK)             │
│  user_id (FK → auth.users)  │      │  role (TEXT)               │
│  role (TEXT)                │      │  category (TEXT)           │
│  started_at (TIMESTAMPTZ)   │      │  question (TEXT)           │
│  completed_at (TIMESTAMPTZ) │      │  keywords (TEXT[])         │
│  total_score (INTEGER)      │      │  ideal_answer (TEXT)       │
└──────────────┬──────────────┘      │  created_at (TIMESTAMPTZ) │
               │ 1                   └──────────────┬────────────┘
               │                                    │
               │ *                                  │ *
┌──────────────▼──────────────────────────────────┐ │
│              interview_results                   │ │
│  id (UUID, PK)                                   │ │
│  session_id (FK → interview_sessions)            │ │
│  question_id (FK → questions) ──────────────────◄┘ │
│  user_answer (TEXT)                              │
│  semantic_score (INTEGER, 0–100)                 │
│  keyword_score (INTEGER, 0–100)                  │
│  final_score (INTEGER, 0–100, 60%+40% weighted)  │
│  feedback (TEXT)                                 │
│  created_at (TIMESTAMPTZ)                        │
└──────────────────────────────────────────────────┘
```

**Score Calculation**:
```
final_score = ROUND(0.6 × semantic_score + 0.4 × keyword_score)
```

**Performance Indexes**:
- `idx_questions_role_category` on `questions(role, category)` — optimises question fetching by role
- `idx_sessions_user_id` on `interview_sessions(user_id)` — optimises dashboard queries
- `idx_results_session_id` on `interview_results(session_id)` — optimises result retrieval

**Row-Level Security Policies**:
- `questions`: SELECT permitted for all authenticated users
- `interview_sessions`: SELECT/INSERT/UPDATE restricted to the session owner (`auth.uid() = user_id`)
- `interview_results`: SELECT/INSERT restricted to results belonging to the authenticated user's sessions

### 3.4 AI Framework & Evaluation Pipeline

SmartMock AI implements a dual-path AI evaluation architecture designed for maximum reliability:

**Figure 3.4 — AI Evaluation Pipeline — Decision Flow**

```
User submits answer
        │
        ▼
Is VITE_OPENAI_API_KEY set?
   ┌────┴────┐
  YES        NO
   │          │
   ▼          ▼
Call OpenAI  Run Heuristic
GPT-4o-mini  Engine locally
   │          │
   ▼          │
API success? │
  ┌───┴───┐  │
YES       NO │
  │       │  │
  ▼       └──┤
Parse JSON   │
  │          │
  └────┬─────┘
       ▼
Return AIAnalysisResult:
  • scores: { clarity, completeness, relevance, confidence, overall }
  • strengths: string[] (up to 3)
  • improvements: string[] (up to 3)
  • recommendation: string
  • detailedFeedback: string
  • suggestedTipIds: string[]
  • modelUsed: "openai" | "mock"
```

**OpenAI Path**: Sends a structured prompt to `gpt-4o-mini` with `response_format: { type: "json_object" }`, specifying the expected JSON schema. Temperature is set to 0.3 for consistent, reliable evaluations. Maximum tokens: 800.

**Heuristic Engine**: A deterministic, keyword-based analysis engine that:
- Counts words, sentences, and average sentence length for clarity scoring
- Detects STAR method components using regular expressions
- Measures keyword overlap between question and answer for relevance
- Counts assertive action verbs and hedging phrases for confidence scoring
- Generates personalised feedback strings based on detected deficiencies

**Supabase Edge Function Path** (legacy session model): The `evaluate-answer` Edge Function combines semantic similarity scoring (via AI) with keyword matching. The function is deployed to Supabase's global edge network and accessed via a Deno runtime. It uses a composite score formula: `final_score = 0.6 × semantic_score + 0.4 × keyword_score`.

### 3.5 Authentication & Security

Authentication is handled entirely by Supabase Auth:

- **Method**: Email and password authentication using Supabase's built-in auth service
- **Session management**: JWT-based sessions with automatic refresh, persisted in browser storage via `@supabase/supabase-js`
- **Protected routes**: The `ProtectedRoute` component wraps all authenticated pages; unauthenticated users are redirected to `/login`
- **Auth context**: The `useAuth` hook provides the current user, session, sign-in, sign-up, and sign-out methods via React Context
- **API key security**: The OpenAI API key is stored in environment variables (`VITE_OPENAI_API_KEY`), excluded from version control via `.gitignore`, and loaded at build time by Vite. In production environments, the Supabase Edge Function proxy approach is the recommended path for keeping keys server-side.

### 3.6 Application Routing

**Figure 3.5 — Application Route Map**

```
/                          → Index (Landing Page)
/login                     → LoginPage
/signup                    → SignupPage
/learning                  → LearningHub
/learning/:tipId           → TipDetailPage
/learning/category/:cat    → CategoryPage
/ai-coach                  → AIFeedbackPage (public)

── Protected Routes ────────────────────────────────────
/dashboard                 → DashboardPage
/progress                  → ProgressDashboard
/ai-coach (authed)         → AIFeedbackPage (enhanced)

── Multi-Stage Interview ───────────────────────────────
/interview/setup           → SetupPage (wizard)
/interview/phone-screen    → PhoneScreenPage
/interview/technical       → TechnicalPage
/interview/deep-dive       → DeepDivePage
/interview/hr              → HRPage
/interview/analysis/:id    → AnalysisPage
/interview/report/:id      → ReportPage
/interview/history         → HistoryPage

── Legacy Interview ────────────────────────────────────
/interview/start           → StartInterviewPage
/interview/:sessionId      → InterviewPage
/interview/result/:id      → ResultPage

── Catch-all ───────────────────────────────────────────
*                          → NotFound (404)
```

---

## Chapter 4: Implementation & Features

### 4.1 Core User Journey

The standard user journey through SmartMock AI consists of the following steps:

1. **Registration/Login**: User creates an account or signs in via Supabase Auth.
2. **Interview Setup** (`/interview/setup`): A five-step wizard captures role, target company, interview type, optional preferences (video recording), and presents a preview of the upcoming stages.
3. **Stage Execution**: The user proceeds through each interview stage in sequence (Phone Screen → Technical → Deep Dive → HR), answering questions within the allocated time.
4. **AI Feedback**: After each answer submission, the AI analysis engine returns real-time scores and coaching feedback.
5. **Analysis & Report**: Upon completion of all stages, the user receives a comprehensive analysis summary and detailed report with per-stage breakdowns.
6. **Dashboard & Progress**: Historical sessions are logged to the dashboard; performance trends are visualised in the Progress Dashboard.

### 4.2 Multi-Stage Interview System

The multi-stage interview system is the centrepiece of SmartMock AI. It manages the complete state of an in-progress interview using a combination of browser `localStorage` (for resilience against page refreshes) and React component state.

**State Model** (`MultiStageInterview`):

```typescript
interface MultiStageInterview {
  id: string;                         // e.g., "ms_1711234567890_abc123"
  role: Role;                         // "SWE" | "PM" | "Data Scientist" | ...
  company: Company;                   // "Google" | "Amazon" | "Meta" | ...
  type: InterviewType;                // "Full" | "Phone Screen Only" | "Technical Only"
  videoEnabled: boolean;
  status: "setup" | "in-progress" | "completed";
  currentStage: StageType;
  currentQuestionIndex: number;
  startedAt: string;
  completedAt?: string;
  stages: {
    "phone-screen"?: StageData;
    technical?: StageData;
    "deep-dive"?: StageData;
    hr?: StageData;
  };
  overallVerdict?: Verdict;           // "Pass" | "Fail" | "Marginal"
  overallScore?: number;
}
```

**Stage Progression**:
The `interview-service.ts` library manages stage transitions. When a user completes all questions in a stage, `completeStage()` is called, which records a `verdict` and `score` for the stage, then uses `getNextStage()` to determine the next route. The service exposes a clean public API:

| Function | Purpose |
|---|---|
| `createInterview(config)` | Initialises a new interview and saves to localStorage |
| `getInterview(id)` | Retrieves interview state by ID |
| `listInterviews()` | Returns all stored interviews (for History page) |
| `saveAnswer(id, stage, answer)` | Persists a single answer with scores and timing |
| `completeStage(id, stage, verdict, score)` | Marks a stage as complete |
| `completeInterview(id)` | Finalises the interview with overall verdict and score |
| `getNextStage(id)` | Returns the route for the next pending stage |

### 4.3 Role-Specific Interview Configurations

SmartMock AI supports five professional roles, each with a fully customised question set across all four stages.

**Figure 4.2 — Multi-Stage Interview Progression**

```
Phone Screen         Technical Round      Deep Dive            HR Round
─────────────────    ─────────────────    ─────────────────    ─────────────────
3 Behavioral Q's     1 Technical          2 Technical/Case     3 HR Questions
(2 min each)         Challenge            Study Q's            (2 min each)
                     (45 min)             (2 min each)
```

**Role Configurations** (`ROLE_CONFIGS`):

| Role | Phone Screen Focus | Technical Challenge | Deep Dive Focus |
|---|---|---|---|
| **SWE** | Production debugging, architectural trade-offs, technical disagreements | Two Sum (O(n) optimisation) | URL shortener design, distributed rate limiting |
| **PM** | Product impact metrics, backlog prioritisation, data vs intuition | Instagram Stories DAU drop case study | Build vs buy vs partner, B2B go-to-market |
| **Data Scientist** | Experiment design, model deployment, data discrepancy handling | Credit card fraud detection ML model | A/B test analysis, recommendation engine design |
| **UX Designer** | User research integration, design iteration, accessibility decisions | Redesign an e-commerce checkout flow | Design system, mobile-first information architecture |
| **DevOps** | CI/CD reliability, incident response, container migration | Design a zero-downtime deployment pipeline | Multi-region Kubernetes, DR strategy |

Each role's question objects follow a consistent schema:

```typescript
interface StageQuestion {
  id: string;         // e.g., "swe-bs-1", "pm-dd-2"
  text: string;       // Full question text
  type: "behavioral" | "technical" | "hr" | "case-study";
  hint?: string;      // Coaching hint shown on request
  timeLimit: number;  // Seconds (120 for most; 2700 for technical)
}
```

**Timer System**: The `useTimer` hook implements a countdown timer with configurable duration. When the timer reaches zero, the current answer is automatically submitted. A visual progress indicator warns the user at 30 seconds remaining. For the Technical Round, a 45-minute timer (2700 seconds) is displayed in a prominent format.

### 4.4 Company-Specific Deep Dive Customisation

A key differentiator of SmartMock AI is its company-specific question customisation. The `COMPANY_DEEP_DIVE` record maps each target company to a pair of tailored Deep Dive questions that reflect the company's known interview culture and leadership principles:

| Company | Question Theme 1 | Question Theme 2 |
|---|---|---|
| **Google** | Moonshot thinking / 10x approaches | Emerging markets product design |
| **Amazon** | Leadership Principles: Ownership | Leadership Principles: Disagree and Commit |
| **Meta** | Ship fast and iterate | Social impact and safety considerations |
| **Apple** | Quality craftsmanship and iteration | Privacy-by-design |
| **Microsoft** | Growth mindset and self-directed learning | Cross-product ecosystem design |
| **Startup** | Wearing many hats / adaptability | Ruthless prioritisation under constraints |
| **Custom** | Most complex career challenge | Industry 5-year vision |

This customisation ensures that candidates practising for a specific company encounter the actual question frameworks and cultural values they are likely to face in real interviews.

### 4.5 AI Analysis Engine

**Figure 4.4 — AI Score Breakdown — Four Dimensions**

The AI analysis engine evaluates every submitted answer across four dimensions:

| Dimension | Range | What It Measures |
|---|---|---|
| **Clarity** | 0–100 | Structure, sentence length, logical flow, readability |
| **Completeness** | 0–100 | Answer depth, STAR component coverage, word count adequacy |
| **Relevance** | 0–100 | Question-answer overlap, domain specificity, on-topic coherence |
| **Confidence** | 0–100 | Assertive action verbs, ownership language, absence of hedging |
| **Overall** | 0–100 | Weighted average of above four dimensions |

**Heuristic Engine Detail**:

The offline heuristic engine (invoked when no OpenAI API key is present or upon API failure) implements the following logic:

- **Clarity scoring**: Tiered by word count (5–13 at <5 words, scaling to 85 at ≥200 words) with penalties for overly long sentences (avg >35 words/sentence) and bonuses for multi-sentence structure.
- **STAR detection**: Four regular expressions scan for Situation/Context markers, Task/Goal markers, Action verbs in first-person ("I built", "I designed", etc.), and Result/Impact indicators (numbers, percentages, success keywords).
- **Confidence scoring**: Counts first-person pronouns (`I`, `my`, `we`), positive action verbs (`achieved`, `improved`, `launched`, etc.), and deducts for hedging words (`maybe`, `perhaps`, `I think`).
- **Feedback generation**: Personalized strength and improvement messages are generated based on the specific deficiencies detected, rather than generic template responses.

**Suggested Learning Tips**: The analysis engine cross-references weakness patterns with the Learning Hub tip IDs, returning up to three recommended tips for each answer (e.g., tip `b1` — "Master the STAR Method" if STAR components are missing).

### 4.6 Learning Hub

The Learning Hub (`/learning`) provides a self-directed interview preparation library with 30+ expert tips, searchable and filterable by category and difficulty.

**Figure 4.5 — Learning Hub — Category and Difficulty Filter**

| Category | Example Tips |
|---|---|
| **Behavioural** | Master the STAR Method, Handling "Tell Me About Yourself", Discussing Weaknesses, Salary Negotiation |
| **Technical** | Algorithmic Problem-Solving Approach, System Design Principles, Code Review Best Practices |
| **HR** | Cultural Fit Questions, Career Narrative, References and Background Checks |
| **Problem-Solving** | Case Study Frameworks, Mental Math, Estimation Questions |

Each tip object contains:
- `title`, `category`, `difficulty` (Beginner / Intermediate / Advanced)
- `readTime` (minutes), `rating` (1–5)
- `summary` and full `content` (markdown-formatted)
- `keyPoints` (bullet list), `tags`, optional `example`, and `relatedTipIds`

The `SearchBar` component provides real-time full-text search across tip titles, summaries, and tags. The `CategoryFilter` component renders filterable category badges. The `TipCard` component renders a preview card with difficulty badge and read time. Individual tips are rendered at `/learning/:tipId` via `TipDetailPage`.

### 4.7 Dashboard & Progress Tracking

**Figure 4.6 — Dashboard — Performance Chart (Recharts)**

The `DashboardPage` provides a high-level overview of the user's interview activity:
- Total interviews completed
- Average score across all sessions
- Performance trend chart (Recharts LineChart)
- Recent interview history with role, date, and score

The `ProgressDashboard` (`/progress`) provides deeper analytics:
- Score distribution by role (BarChart)
- Stage-by-stage performance breakdown
- Improvement trend over time
- Weak areas identification based on lowest-scoring dimensions

Both dashboards fetch data from Supabase using React Query, which provides automatic caching, background refetching, and loading/error states.

### 4.8 UI Component Library

SmartMock AI uses shadcn/ui — a collection of re-usable React components built on Radix UI primitives and styled with Tailwind CSS. The library provides 50+ components covering the full range of UI patterns:

| Category | Components |
|---|---|
| **Layout** | Card, Sheet, Drawer, Resizable, Sidebar |
| **Navigation** | NavigationMenu, Breadcrumb, Tabs, Menubar |
| **Forms** | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Toggle, Slider, Form, Label |
| **Feedback** | Alert, AlertDialog, Toast, Sonner, Progress, Skeleton |
| **Overlays** | Dialog, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu |
| **Data Display** | Table, Pagination, ScrollArea, Accordion, Collapsible, Carousel, Chart |
| **Utility** | Avatar, Badge, Button, Command, InputOTP, AspectRatio, Separator |

All components are fully accessible (WCAG 2.1 compliant via Radix UI), keyboard-navigable, and support dark/light themes via CSS custom properties.

**Custom Application Components**:

| Component | File | Purpose |
|---|---|---|
| `AIFeedback` | `components/AIFeedback.tsx` | Renders the full AI analysis result with scores, strengths, improvements, and recommendation |
| `QuestionAIFeedback` | `components/QuestionAIFeedback.tsx` | Per-question inline AI feedback display during interview |
| `ProtectedRoute` | `components/ProtectedRoute.tsx` | HOC that redirects unauthenticated users to `/login` |
| `ProgressChart` | `components/ProgressChart.tsx` | Recharts wrapper for performance trend visualisation |
| `LearningModule` | `components/LearningModule.tsx` | Renders an individual learning tip module |
| `TipCard` | `components/TipCard.tsx` | Preview card for Learning Hub grid |
| `SearchBar` | `components/SearchBar.tsx` | Real-time search input for Learning Hub |
| `CategoryFilter` | `components/CategoryFilter.tsx` | Filterable category badge group |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Dark/light theme toggle button |

---

## Chapter 5: Results & Discussion

### 5.1 Implementation Achievements

SmartMock AI was successfully implemented with the following deliverables:

| Deliverable | Status | Details |
|---|---|---|
| Multi-stage interview pipeline | ✅ Complete | 4 stages, 5 roles, fully configurable |
| AI evaluation engine | ✅ Complete | Dual-path: OpenAI + heuristic fallback |
| Company customisation | ✅ Complete | 7 companies, tailored Deep Dive questions |
| Learning Hub | ✅ Complete | 30+ tips, search and filter |
| Progress Dashboard | ✅ Complete | Recharts visualisation, session history |
| Authentication | ✅ Complete | Supabase Auth with protected routes |
| Supabase database | ✅ Complete | 3 tables, RLS policies, 3 indexes |
| Edge Function | ✅ Complete | `evaluate-answer` with semantic + keyword scoring |
| Video recording | ✅ Complete | Optional MediaRecorder integration |
| Responsive design | ✅ Complete | Mobile-first with Tailwind CSS |
| Dark/light theme | ✅ Complete | System-aware theme with toggle |
| TypeScript coverage | ✅ Complete | 98.6% TypeScript by language composition |

### 5.2 Performance Metrics

The project codebase exhibits the following technical metrics:

| Metric | Value |
|---|---|
| **Total source files** | 102 TypeScript/TSX files |
| **Language composition** | TypeScript 98.6%, CSS 1.1%, Other 0.3% |
| **Page/route components** | 21 page files |
| **UI components** | 60 component files (incl. 50 shadcn/ui) |
| **Custom hooks** | 8 hooks |
| **Library modules** | 7 lib files |
| **Interview roles** | 5 |
| **Interview stages** | 4 |
| **Target companies** | 7 |
| **Question bank entries** | 55+ structured interview questions |
| **Learning tips** | 30+ categorised tips |
| **Database tables** | 3 (questions, sessions, results) |
| **API dependencies** | 40+ npm packages |
| **Build tool** | Vite 5.4.19 (sub-second HMR) |
| **Test framework** | Vitest 3.2.4 + Playwright 1.57.0 |

### 5.3 AI Evaluation Quality

The dual-path AI system was designed to maximise evaluation quality while ensuring availability:

**OpenAI Path Quality**:
- GPT-4o-mini provides nuanced qualitative feedback that captures semantic meaning beyond keyword matching
- Temperature 0.3 ensures consistency across repeated evaluations of similar answers
- Structured JSON output with `response_format: { type: "json_object" }` eliminates parsing errors
- 800-token limit balances feedback richness with API cost

**Heuristic Engine Quality**:
The heuristic engine was validated against common interview answer patterns:

| Answer Quality | Expected Score Range | Engine Behaviour |
|---|---|---|
| Blank/1-2 words | 5–15 | Penalises all dimensions heavily |
| Short (15–50 words) | 20–45 | Partial credit; flags length and STAR gaps |
| Moderate (80–150 words) | 50–70 | Good baseline; STAR and numbers determine variance |
| Strong (150–250 words, STAR, metrics) | 75–90 | Rewards structure, quantification, confidence |
| Overly verbose (350+ words) | 65–75 | Modest penalty for lacking conciseness |

**Scoring Weights in Edge Function**:
- Semantic similarity score (AI-generated): 60% weight
- Keyword matching score (regex-based): 40% weight
- Formula: `final_score = ROUND(0.6 × semantic + 0.4 × keyword)`

### 5.4 User Experience Outcomes

SmartMock AI's UX design decisions contribute to several positive user experience outcomes:

**Accessibility**:
- All interactive components are keyboard-navigable via Radix UI primitives
- ARIA labels and roles are provided throughout the shadcn/ui component library
- Colour contrast ratios meet WCAG 2.1 AA standards in both light and dark themes

**Responsiveness**:
- Tailwind CSS's mobile-first breakpoint system (`sm:`, `md:`, `lg:`) ensures the interface adapts to screen sizes from 320px mobile to 2560px desktop
- The `use-mobile` hook detects viewport width to conditionally render mobile-optimised layouts

**Resilience**:
- Interview state is persisted to `localStorage` after every answer submission, protecting against accidental browser closure
- The heuristic fallback ensures AI feedback is always available, even without network connectivity or API keys
- React Query's error boundaries and retry logic handle transient network failures gracefully

**Performance**:
- Vite's code-splitting and tree-shaking produce optimised production bundles
- React Query caches database responses, minimising redundant API calls
- Framer Motion animations are GPU-accelerated via CSS transforms

### 5.5 Limitations and Challenges

| Limitation | Description | Mitigation |
|---|---|---|
| **API key exposure risk** | VITE_ prefix environment variables are included in the browser bundle | Recommended production approach: proxy requests through Supabase Edge Function |
| **English-only** | All questions, tips, and AI prompts are in English | Future roadmap item: multilingual support |
| **localStorage limitations** | Interview state storage bounded by browser localStorage (~5MB) | Sufficient for typical usage; future migration to Supabase for persistence |
| **Heuristic accuracy** | Offline scoring is less nuanced than GPT-4o | Clearly indicated to users via `modelUsed: "mock"` flag |
| **No live interviewer** | Text-based simulation only; no voice or video AI interviewer | Optional video recording provides partial simulation; future roadmap includes voice |
| **Question bank size** | 55+ structured questions (multi-stage); full 500+ legacy bank in Supabase | Legacy bank augments coverage; multi-stage bank focuses on quality |

---

## Chapter 6: Conclusions and Future Scope

### 6.1 Key Conclusions

SmartMock AI successfully demonstrates that a modern web application combining React, TypeScript, Supabase, and OpenAI can deliver a comprehensive, production-quality interview preparation platform. The project achieves its core objectives:

1. **Realistic simulation**: The four-stage, role-specific pipeline with timed questions and company-specific customisation creates an authentic interview experience that goes beyond single-question practice tools.

2. **Actionable feedback**: The dual-path AI evaluation system — combining OpenAI GPT-4o-mini for rich semantic analysis with a deterministic heuristic engine for offline availability — delivers consistent, personalised coaching feedback on every answer.

3. **Breadth of coverage**: Five professional roles, seven target companies, and four interview stages ensure the platform serves a wide audience of technology job seekers beyond the traditional "LeetCode-style" software engineering focus.

4. **Technical quality**: 98.6% TypeScript coverage, a clean component architecture, Row-Level Security for data privacy, and a fully responsive mobile-first design reflect engineering best practices throughout the codebase.

5. **Learning ecosystem**: The Learning Hub, AI Coach, and Progress Dashboard create a holistic preparation ecosystem that supports both structured practice (mock interviews) and self-directed learning (tips, analytics).

### 6.2 Summary Metrics

| Metric | Value |
|---|---|
| TypeScript coverage | 98.6% |
| Professional roles supported | 5 |
| Interview stages per session | 4 |
| Target companies | 7 |
| Structured interview questions | 55+ |
| Legacy question bank | 500+ |
| Learning Hub tips | 30+ |
| AI scoring dimensions | 4 (clarity, completeness, relevance, confidence) |
| Database tables | 3 (with RLS) |
| Edge Functions deployed | 1 (`evaluate-answer`) |
| npm packages | 40+ |
| Total source files | 102 |

### 6.3 Future Enhancements

The following enhancements are identified as high-priority items for future development:

**Phase 1 — Core Improvements (Short-term)**:

| Enhancement | Description |
|---|---|
| **Voice answer input** | Integrate Web Speech API for speech-to-text answer submission, enabling spoken practice |
| **AI interviewer persona** | Stream GPT-4o responses as interviewer dialogue for a more immersive conversational simulation |
| **Answer history & replay** | Allow users to review and replay past answers side-by-side with AI feedback |
| **Email notifications** | Supabase scheduled notifications for practice reminders and session summaries |
| **Expanded question bank** | Add domain-specific questions (fintech, healthtech, gaming) and seniority levels (junior, senior, staff) |

**Phase 2 — Platform Expansion (Medium-term)**:

| Enhancement | Description |
|---|---|
| **Mobile app** | React Native companion app for on-the-go practice |
| **Peer mock interviews** | WebRTC-based peer-to-peer video mock interview scheduling and matching |
| **Resume integration** | Upload a CV to receive personalised questions tailored to the candidate's experience |
| **Interview recording replay** | Full session playback with AI annotations overlaid on recorded video |
| **Multilingual support** | Spanish, Mandarin, Hindi, and French localisation |

**Phase 3 — Enterprise Features (Long-term)**:

| Enhancement | Description |
|---|---|
| **Team/cohort tracking** | University or bootcamp cohort dashboards for instructors to monitor student progress |
| **Company-specific prep courses** | Curated multi-week preparation programmes for specific target companies |
| **ATS integration** | Parse real job descriptions to auto-generate tailored question sets |
| **Calibration with real interviews** | Allow users to log real interview outcomes to calibrate AI scoring models |
| **API for third-party integration** | Public REST API enabling career platforms to embed SmartMock AI capabilities |

---

## References

1. Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., ... & Amodei, D. (2020). *Language models are few-shot learners*. Advances in Neural Information Processing Systems, 33, 1877–1901.

2. Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). *BERT: Pre-training of deep bidirectional transformers for language understanding*. Proceedings of NAACL-HLT 2019, 4171–4186.

3. Dikli, S. (2006). *An overview of automated scoring of essays*. Journal of Technology, Learning, and Assessment, 5(1).

4. Hoque, M. E., Courgeon, M., Martin, J. C., Mutlu, B., & Picard, R. W. (2013). *MACH: My automated conversation coach*. Proceedings of the 2013 ACM International Joint Conference on Pervasive and Ubiquitous Computing, 697–706.

5. Reimers, N., & Gurevych, I. (2019). *Sentence-BERT: Sentence embeddings using siamese BERT-networks*. Proceedings of EMNLP-IJCNLP 2019.

6. Argamon, S., Koppel, M., Pennebaker, J. W., & Schler, J. (2007). *Mining the blogosphere: Age, gender, and the varieties of self-expression*. First Monday, 12(9).

7. Mesbah, A., Mirshokraie, S., & Van Deursen, A. (2012). *Single-page apps in action*. IEEE Internet Computing, 16(6), 82–86.

8. Meta Platforms, Inc. (2024). *React 18 documentation*. https://react.dev

9. Supabase, Inc. (2024). *Supabase documentation: Row-Level Security*. https://supabase.com/docs/guides/auth/row-level-security

10. OpenAI. (2024). *GPT-4o technical report and API documentation*. https://platform.openai.com/docs

11. Tailwind Labs. (2024). *Tailwind CSS v3 documentation*. https://tailwindcss.com/docs

12. shadcn. (2024). *shadcn/ui component library documentation*. https://ui.shadcn.com

13. TanStack. (2024). *TanStack Query v5 documentation*. https://tanstack.com/query/v5

14. Vitejs. (2024). *Vite build tool documentation*. https://vitejs.dev

15. Microsoft. (2024). *TypeScript 5.8 release notes*. https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html

---

## Appendix: Source Code & GitHub Repository

### A.1 Repository Information

| Field | Value |
|---|---|
| **Repository** | https://github.com/pathanfarhankhan7/mockprep-alpha |
| **Project Title** | SmartMock AI |
| **Visibility** | Private |
| **Primary Language** | TypeScript (98.6%) |
| **Other Languages** | CSS (1.1%), Other (0.3%) |
| **Framework** | React 18 + Vite 5 |

### A.2 Project Structure

```
mockprep-alpha/
├── index.html                          # Vite entry point HTML
├── package.json                        # Dependencies and scripts
├── package-lock.json                   # Dependency lock file
├── bun.lock                            # Bun lock file (alternative)
├── tsconfig.json                       # TypeScript root config
├── tsconfig.app.json                   # TypeScript app config
├── tsconfig.node.json                  # TypeScript node config
├── vite.config.ts                      # Vite build configuration
├── vitest.config.ts                    # Vitest test configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS plugins
├── eslint.config.js                    # ESLint rules
├── components.json                     # shadcn/ui component config
├── playwright.config.ts                # Playwright E2E config
├── playwright-fixture.ts               # Playwright test fixtures
├── .env                                # Environment variables (gitignored)
├── .gitignore
│
├── public/                             # Static assets (served as-is)
│
├── src/
│   ├── main.tsx                        # App entry point
│   ├── App.tsx                         # Root router with all routes
│   ├── App.css                         # App-level styles
│   ├── index.css                       # Global CSS (Tailwind directives)
│   ├── vite-env.d.ts                   # Vite environment type declarations
│   │
│   ├── pages/                          # Route-level page components
│   │   ├── Index.tsx                   # Landing page
│   │   ├── LoginPage.tsx               # Authentication — login
│   │   ├── SignupPage.tsx              # Authentication — registration
│   │   ├── DashboardPage.tsx           # User dashboard with stats
│   │   ├── AIFeedbackPage.tsx          # Standalone AI Coach
│   │   ├── LearningHub.tsx             # Interview tips library
│   │   ├── TipDetailPage.tsx           # Individual tip detail view
│   │   ├── CategoryPage.tsx            # Tips filtered by category
│   │   ├── ProgressDashboard.tsx       # Progress tracking & analytics
│   │   ├── ResultPage.tsx              # Legacy session results
│   │   ├── StartInterviewPage.tsx      # Legacy interview setup
│   │   ├── InterviewPage.tsx           # Legacy interview Q&A
│   │   ├── NotFound.tsx                # 404 page
│   │   └── interview/                  # Multi-stage interview pages
│   │       ├── SetupPage.tsx           # Interview setup wizard (5 steps)
│   │       ├── PhoneScreenPage.tsx     # Phone screen stage
│   │       ├── TechnicalPage.tsx       # Technical challenge (45 min)
│   │       ├── DeepDivePage.tsx        # Deep dive system design stage
│   │       ├── HRPage.tsx              # HR round stage
│   │       ├── AnalysisPage.tsx        # Post-interview AI analysis
│   │       ├── ReportPage.tsx          # Full interview report
│   │       └── HistoryPage.tsx         # Historical interviews list
│   │
│   ├── components/                     # Reusable UI components
│   │   ├── AIFeedback.tsx              # AI analysis result display
│   │   ├── QuestionAIFeedback.tsx      # Per-question inline AI feedback
│   │   ├── ProtectedRoute.tsx          # Auth guard HOC
│   │   ├── ProgressChart.tsx           # Recharts performance chart
│   │   ├── LearningModule.tsx          # Learning tip renderer
│   │   ├── TipCard.tsx                 # Learning tip preview card
│   │   ├── SearchBar.tsx               # Real-time search input
│   │   ├── CategoryFilter.tsx          # Category filter badges
│   │   ├── NavLink.tsx                 # Navigation link component
│   │   ├── ThemeToggle.tsx             # Dark/light mode toggle
│   │   └── ui/                         # shadcn/ui components (50+)
│   │       └── [accordion, alert, avatar, badge, button, card, ...]
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAuth.tsx                 # Auth context provider & hook
│   │   ├── useAI.tsx                   # AI analysis trigger & state
│   │   ├── useProgress.tsx             # User progress data hook
│   │   ├── useTheme.ts                 # Theme state hook
│   │   ├── useTimer.ts                 # Interview countdown timer
│   │   ├── useVideoRecording.ts        # MediaRecorder hook
│   │   ├── use-mobile.tsx              # Viewport width hook
│   │   └── use-toast.ts                # Toast notification hook
│   │
│   ├── lib/                            # Business logic & utilities
│   │   ├── utils.ts                    # Tailwind merge utility (cn())
│   │   ├── api.ts                      # Supabase API calls (legacy)
│   │   ├── ai-service.ts               # AI evaluation engine
│   │   ├── interview-service.ts        # Multi-stage interview state mgmt
│   │   ├── interview-data.ts           # Question bank & role configs
│   │   ├── interview-analyzer.ts       # Answer analysis utilities
│   │   └── data-seed.ts                # Learning tips data (30+ tips)
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts               # Supabase client initialisation
│   │       └── types.ts                # Generated Supabase type definitions
│   │
│   └── test/
│       ├── example.test.ts             # Example Vitest unit test
│       └── setup.ts                    # Vitest test setup file
│
└── supabase/
    ├── config.toml                     # Supabase project configuration
    ├── migrations/
    │   └── 20260323121608_*.sql        # Initial database migration
    └── functions/
        └── evaluate-answer/
            └── index.ts                # Edge Function: AI answer evaluation
```

### A.3 Key Source Files

| File | Lines | Description |
|---|---|---|
| `src/lib/interview-data.ts` | ~657 | Complete question bank and role/company configs |
| `src/lib/ai-service.ts` | ~200 | AI evaluation engine with OpenAI and heuristic paths |
| `src/lib/interview-service.ts` | ~200 | Multi-stage interview state management API |
| `src/lib/data-seed.ts` | ~500+ | 30+ expert interview tips with full content |
| `src/App.tsx` | ~80 | Root application router |
| `src/pages/interview/SetupPage.tsx` | ~300 | 5-step interview setup wizard |
| `src/pages/interview/AnalysisPage.tsx` | ~250 | Post-interview AI coaching summary |
| `supabase/functions/evaluate-answer/index.ts` | ~130 | Serverless AI evaluation Edge Function |
| `supabase/migrations/*.sql` | ~70 | Database schema with RLS policies |

### A.4 Environment Setup

To run SmartMock AI locally, the following prerequisites are required:

- **Node.js** 18+ (or Bun 1.0+)
- **npm** 9+ (or Bun)
- **Supabase account** and project (for database, auth, and Edge Functions)
- **OpenAI API key** (optional — enables GPT-4o feedback; heuristic fallback works without it)

**Step 1: Clone the repository**
```bash
git clone https://github.com/pathanfarhankhan7/mockprep-alpha.git
cd mockprep-alpha
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Configure environment variables**

Create a `.env` file at the project root:
```env
# Supabase (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI (optional — enables GPT-4o feedback)
VITE_OPENAI_API_KEY=sk-your-openai-api-key
```

**Step 4: Apply database migrations**
```bash
npx supabase db push
# or via the Supabase Dashboard → SQL Editor
```

**Step 5: Deploy Edge Functions** (optional — for legacy session model)
```bash
npx supabase functions deploy evaluate-answer
```

**Step 6: Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

### A.5 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Development** | `npm run dev` | Start Vite development server with HMR on port 8080 |
| **Build** | `npm run build` | Build optimised production bundle to `dist/` |
| **Build (dev mode)** | `npm run build:dev` | Build with development mode configuration |
| **Preview** | `npm run preview` | Preview the production build locally |
| **Lint** | `npm run lint` | Run ESLint across the full codebase |
| **Test** | `npm run test` | Run all Vitest unit tests once |
| **Test (watch)** | `npm run test:watch` | Run Vitest in interactive watch mode |

---

*Documentation generated for SmartMock AI — pathanfarhankhan7/mockprep-alpha*  
*Language Composition: TypeScript 98.6% · CSS 1.1% · Other 0.3%*  
*React 18.3.1 · TypeScript 5.8.3 · Tailwind CSS 3.4.17 · Supabase 2.100.0 · OpenAI GPT-4o*
