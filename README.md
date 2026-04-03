# MockPrep Alpha — AI-Powered Mock Interview Platform

MockPrep Alpha (branded **SmartMock**) is a full-stack web application that helps job seekers practise for technical and behavioural interviews through realistic multi-stage simulations, AI-driven answer analysis, and a curated learning hub.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Multi-Stage Interview Flow](#multi-stage-interview-flow)
- [AI Scoring & Feedback](#ai-scoring--feedback)
- [Database Schema](#database-schema)
- [Testing](#testing)

---

## Features

| Feature | Description |
|---|---|
| **Multi-stage interviews** | Simulates a real hiring pipeline: Phone Screen → Technical → Deep Dive → HR |
| **Role selection** | Tailored question banks for SWE, PM, Data Scientist, UX Designer, and DevOps |
| **Company selection** | Company-specific deep-dive questions for Google, Amazon, Meta, Apple, Microsoft, Startup, and Custom |
| **AI answer analysis** | Real-time scoring using OpenAI GPT-4o-mini; graceful heuristic fallback when no API key is set |
| **STAR method coaching** | Automatically detects STAR components and gives targeted improvement tips |
| **Learning Hub** | Searchable, filterable library of interview tips organised by category and difficulty |
| **Progress Dashboard** | Bar chart and radar chart of performance across categories; identifies weak areas |
| **Interview history** | Per-session score history stored in Supabase; multi-stage history stored in localStorage |
| **AI Coach page** | Open-ended practice space for custom questions with instant AI feedback |
| **Dark / light theme** | Theme preference persisted in localStorage |
| **Video recording** | Optional camera recording during interview stages |
| **Authentication** | Email/password sign-up and sign-in via Supabase Auth |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite 5](https://vitejs.dev) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Routing | [React Router v6](https://reactrouter.com) |
| Server state | [TanStack Query v5](https://tanstack.com/query) |
| Animation | [Framer Motion](https://www.framer.com/motion) |
| Charts | [Recharts](https://recharts.org) |
| Backend / DB | [Supabase](https://supabase.com) (PostgreSQL + Auth + Edge Functions) |
| AI | OpenAI GPT-4o-mini (optional) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) + [Playwright](https://playwright.dev) |

---

## Project Structure

```
mockprep-alpha/
├── public/                  # Static assets
├── src/
│   ├── components/          # Shared UI components
│   │   ├── ui/              # shadcn/ui generated components
│   │   ├── AIFeedback.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── LearningModule.tsx
│   │   ├── NavLink.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── QuestionAIFeedback.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TipCard.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAI.tsx        # AI analysis hook
│   │   ├── useAuth.tsx      # Supabase auth context
│   │   ├── useMobile.tsx
│   │   ├── useProgress.tsx
│   │   ├── useTheme.ts      # Dark/light theme
│   │   ├── useTimer.ts      # Countdown timer
│   │   └── useVideoRecording.ts
│   ├── lib/                 # Core business logic
│   │   ├── ai-service.ts    # OpenAI + heuristic answer analysis
│   │   ├── api.ts           # Supabase CRUD helpers
│   │   ├── data-seed.ts     # Learning Hub tip data
│   │   ├── interview-analyzer.ts
│   │   ├── interview-data.ts  # Question banks & role configs
│   │   ├── interview-service.ts  # localStorage-backed multi-stage service
│   │   └── utils.ts
│   ├── pages/
│   │   ├── interview/       # Multi-stage interview pages
│   │   │   ├── SetupPage.tsx
│   │   │   ├── PhoneScreenPage.tsx
│   │   │   ├── TechnicalPage.tsx
│   │   │   ├── DeepDivePage.tsx
│   │   │   ├── HRPage.tsx
│   │   │   ├── AnalysisPage.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── AIFeedbackPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── Index.tsx        # Landing page
│   │   ├── InterviewPage.tsx  # Legacy single-session flow
│   │   ├── LearningHub.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFound.tsx
│   │   ├── ProgressDashboard.tsx
│   │   ├── ResultPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── StartInterviewPage.tsx
│   │   └── TipDetailPage.tsx
│   ├── test/
│   │   ├── setup.ts
│   │   └── example.test.ts
│   ├── App.tsx              # Root component + router
│   └── main.tsx             # Entry point
├── supabase/
│   ├── config.toml
│   └── migrations/          # SQL migration files
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 or **Bun** ≥ 1.0
- A [Supabase](https://supabase.com) project (free tier works)
- (Optional) An [OpenAI](https://platform.openai.com) API key for live AI feedback

### Installation

```bash
# Clone the repository
git clone https://github.com/pathanfarhankhan7/mockprep-alpha.git
cd mockprep-alpha

# Install dependencies
npm install
# or
bun install
```

### Running locally

```bash
npm run dev
```

The app starts at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root (see `.env` for the existing variables):

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public key |
| `VITE_OPENAI_API_KEY` | ⬜ | OpenAI API key — if omitted, the app falls back to offline heuristic scoring |

> **Note**: Never commit real credentials. The existing `.env` file is listed in `.gitignore`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Vite HMR) |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |

---

## Application Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/signup` | Public | Create account |
| `/dashboard` | 🔒 Auth | Main dashboard — stats, charts, interview history |
| `/interview/setup` | 🔒 Auth | Configure a new multi-stage interview |
| `/interview/phone-screen` | 🔒 Auth | Phone screen stage |
| `/interview/technical` | 🔒 Auth | Technical challenge stage |
| `/interview/deep-dive` | 🔒 Auth | Company deep-dive stage |
| `/interview/hr` | 🔒 Auth | HR / culture-fit stage |
| `/interview/analysis/:id` | 🔒 Auth | Per-stage score breakdown |
| `/interview/report/:id` | 🔒 Auth | Full interview report |
| `/interview/history` | 🔒 Auth | All past multi-stage interviews |
| `/interview/start` | 🔒 Auth | Legacy single-session interview start |
| `/interview/:sessionId` | 🔒 Auth | Legacy interview session |
| `/interview/result/:sessionId` | 🔒 Auth | Legacy result page |
| `/learning` | Public | Learning Hub |
| `/learning/:tipId` | Public | Tip detail |
| `/learning/category/:category` | Public | Tips filtered by category |
| `/progress` | 🔒 Auth | Progress dashboard with performance charts |
| `/ai-coach` | Public | Open-ended AI coaching practice |

---

## Multi-Stage Interview Flow

```
Setup → Phone Screen → Technical → Deep Dive → HR → Analysis → Report
```

1. **Setup** (`/interview/setup`) — Choose role, company, interview type, and whether to enable video recording.
2. **Phone Screen** — 3 behavioural questions (2 min each).
3. **Technical** — 1 role-specific challenge (45 min for coding; shorter for design/PM case studies).
4. **Deep Dive** — 3–4 company-specific or role-specific scenario questions.
5. **HR** — Culture, values, and motivation questions.
6. **Analysis** — Per-stage verdict (Pass / Marginal / Fail) with score breakdown.
7. **Report** — Full interview report with overall score and verdict.

### Supported Roles

| Role | Technical challenge style |
|---|---|
| **SWE** | LeetCode-style algorithm problem |
| **PM** | Product strategy / metrics scenario |
| **Data Scientist** | ML model design / SQL analysis |
| **UX Designer** | Design case study |
| **DevOps** | Infrastructure / incident scenario |

### Interview Types

| Type | Stages included |
|---|---|
| **Full** | Phone Screen → Technical → Deep Dive → HR |
| **Phone Screen Only** | Phone Screen |
| **Technical Only** | Technical |

### Interview data storage

Multi-stage interviews are persisted in **localStorage** under the key `mockprep_interviews`. Legacy single-session interviews are stored in Supabase.

---

## AI Scoring & Feedback

Every answer is scored across four dimensions (0–100):

| Dimension | What it measures |
|---|---|
| **Clarity** | Word count, sentence length, absence of filler words |
| **Completeness** | Coverage of question keywords and role-specific terminology |
| **Structure** | STAR method detection (Situation, Task, Action, Result) |
| **Confidence** | Positive action language, first-person ownership, absence of hedging words |

**Overall** score = weighted average (Clarity 25%, Completeness 30%, Structure 25%, Confidence 20%).

### Scoring modes

- **OpenAI mode** — When `VITE_OPENAI_API_KEY` is set, answers are sent to `gpt-4o-mini` which returns structured JSON feedback.
- **Heuristic mode** (offline fallback) — A keyword-based analyser runs locally in the browser. No API call is made. Results are slightly less nuanced but still actionable.

---

## Database Schema

Managed via Supabase migrations (`supabase/migrations/`). Row Level Security (RLS) is enabled on all tables.

### `questions`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `role` | TEXT | Target role (e.g. `SWE`) |
| `category` | TEXT | Question category (e.g. `Behavioral`) |
| `question` | TEXT | Question text |
| `keywords` | TEXT[] | Keywords used for keyword scoring |
| `ideal_answer` | TEXT | Reference answer for evaluation |
| `created_at` | TIMESTAMPTZ | |

### `interview_sessions`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → `auth.users` |
| `role` | TEXT | Selected role |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | `NULL` if in progress |
| `total_score` | INTEGER | Average score across all answers |

### `interview_results`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `session_id` | UUID | FK → `interview_sessions` |
| `question_id` | UUID | FK → `questions` |
| `user_answer` | TEXT | Candidate's answer |
| `semantic_score` | INTEGER | Semantic similarity score (0–100) |
| `keyword_score` | INTEGER | Keyword match score (0–100) |
| `final_score` | INTEGER | Blended final score (0–100) |
| `feedback` | TEXT | AI or heuristic feedback text |
| `created_at` | TIMESTAMPTZ | |

---

## Testing

```bash
# Unit tests (Vitest + Testing Library)
npm run test

# End-to-end tests (Playwright)
npx playwright test
```

Unit test files live in `src/test/`. Playwright configuration is in `playwright.config.ts` and fixtures in `playwright-fixture.ts`.
