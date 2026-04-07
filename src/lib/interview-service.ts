// Multi-stage interview service — localStorage-backed

import {
  type Role,
  type Company,
  type InterviewType,
  type StageType,
  type Verdict,
  type StageQuestion,
  ROLE_CONFIGS,
  COMPANY_DEEP_DIVE,
  getStagesForType,
  getStageRoute,
} from "./interview-data";

import type { EmotionSnapshot, EmotionSummary } from "./emotion-service";
export type { EmotionSnapshot, EmotionSummary };

export { getStageRoute };

export type { Role, Company, InterviewType, StageType, Verdict };

export interface AnswerScores {
  clarity: number;       // 0–100
  completeness: number;  // 0–100
  structure: number;     // 0–100
  confidence: number;    // 0–100
  overall: number;       // 0–100
}

export interface StageAnswer {
  questionId: string;
  text: string;
  timeUsed: number; // seconds
  scores?: AnswerScores;
  feedback?: string;
  emotionData?: EmotionSnapshot;
}

export interface StageData {
  questions: StageQuestion[];
  answers: StageAnswer[];
  startedAt: string;
  completedAt?: string;
  verdict?: Verdict;
  score?: number;
}

export interface MultiStageInterview {
  id: string;
  role: Role;
  company: Company;
  type: InterviewType;
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
  overallVerdict?: Verdict;
  overallScore?: number;
}

const STORAGE_KEY = "mockprep_interviews";

// ─── Persistence helpers ──────────────────────────────────────────────────────

function loadAll(): Record<string, MultiStageInterview> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, MultiStageInterview>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
  return `ms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface CreateInterviewConfig {
  role: Role;
  company: Company;
  type: InterviewType;
  videoEnabled: boolean;
}

export function createInterview(config: CreateInterviewConfig): MultiStageInterview {
  const id = generateId();
  const stages = getStagesForType(config.role, config.type);
  const firstStage = stages[0];
  const roleConfig = ROLE_CONFIGS[config.role];

  const stagesData: MultiStageInterview["stages"] = {};

  for (const stage of stages) {
    let questions: StageQuestion[] = [];

    if (stage === "phone-screen") {
      questions = roleConfig.phoneScreenQuestions.slice(0, 3);
    } else if (stage === "technical") {
      // Technical is a single challenge — represented as one question
      questions = [
        {
          id: `tech-${config.role}-${id}`,
          text: roleConfig.technicalChallenge.text,
          type: config.role === "UX Designer" ? "case-study" : "technical",
          hint: roleConfig.technicalChallenge.hint,
          timeLimit: roleConfig.technicalChallenge.duration,
        },
      ];
    } else if (stage === "deep-dive") {
      const companyQs = COMPANY_DEEP_DIVE[config.company];
      questions = companyQs.length > 0 ? companyQs : roleConfig.deepDiveQuestions;
    } else if (stage === "hr") {
      questions = roleConfig.hrQuestions;
    }

    stagesData[stage] = {
      questions,
      answers: [],
      startedAt: new Date().toISOString(),
    };
  }

  const interview: MultiStageInterview = {
    id,
    role: config.role,
    company: config.company,
    type: config.type,
    videoEnabled: config.videoEnabled,
    status: "in-progress",
    currentStage: firstStage,
    currentQuestionIndex: 0,
    startedAt: new Date().toISOString(),
    stages: stagesData,
  };

  const all = loadAll();
  all[id] = interview;
  saveAll(all);

  return interview;
}

export function getInterview(id: string): MultiStageInterview | null {
  const all = loadAll();
  return all[id] ?? null;
}

export function getAllInterviews(): MultiStageInterview[] {
  const all = loadAll();
  return Object.values(all).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function saveAnswer(
  id: string,
  stage: StageType,
  questionIndex: number,
  answerText: string,
  timeUsed: number
): MultiStageInterview | null {
  const all = loadAll();
  const interview = all[id];
  if (!interview) return null;

  const stageData = interview.stages[stage];
  if (!stageData) return null;

  const question = stageData.questions[questionIndex];
  if (!question) return null;

  const scores = analyzeAnswer(question.text, answerText, interview.role);
  const feedback = generateFeedback(scores, question.text, answerText);

  const answer: StageAnswer = {
    questionId: question.id,
    text: answerText,
    timeUsed,
    scores,
    feedback,
  };

  // Replace or append
  if (stageData.answers[questionIndex]) {
    stageData.answers[questionIndex] = answer;
  } else {
    stageData.answers.push(answer);
  }

  interview.currentQuestionIndex = questionIndex + 1;
  all[id] = interview;
  saveAll(all);

  return interview;
}

export function completeStage(id: string, stage: StageType): MultiStageInterview | null {
  const all = loadAll();
  const interview = all[id];
  if (!interview) return null;

  const stageData = interview.stages[stage];
  if (!stageData) return null;

  stageData.completedAt = new Date().toISOString();

  // Compute stage verdict
  const answered = stageData.answers.filter((a) => a.text.trim().length > 0);
  if (answered.length > 0) {
    const avg =
      answered.reduce((sum, a) => sum + (a.scores?.overall ?? 50), 0) /
      answered.length;
    stageData.score = Math.round(avg);
    stageData.verdict = avg >= 70 ? "Pass" : avg >= 45 ? "Marginal" : "Fail";
  } else {
    stageData.score = 0;
    stageData.verdict = "Fail";
  }

  // Advance to next stage
  const orderedStages = getStagesForType(interview.role, interview.type);
  const currentIdx = orderedStages.indexOf(stage);
  if (currentIdx < orderedStages.length - 1) {
    interview.currentStage = orderedStages[currentIdx + 1];
    interview.currentQuestionIndex = 0;

    // Mark next stage started
    const nextStage = interview.stages[interview.currentStage];
    if (nextStage) {
      nextStage.startedAt = new Date().toISOString();
    }
  }

  all[id] = interview;
  saveAll(all);

  return interview;
}

export function completeInterview(id: string): MultiStageInterview | null {
  const all = loadAll();
  const interview = all[id];
  if (!interview) return null;

  interview.status = "completed";
  interview.completedAt = new Date().toISOString();

  // Compute overall score
  const stageScores: number[] = [];
  for (const stage of getStagesForType(interview.role, interview.type)) {
    const stageData = interview.stages[stage];
    if (stageData?.score !== undefined) {
      stageScores.push(stageData.score);
    }
  }

  if (stageScores.length > 0) {
    interview.overallScore = Math.round(
      stageScores.reduce((s, v) => s + v, 0) / stageScores.length
    );
    interview.overallVerdict =
      interview.overallScore >= 70
        ? "Pass"
        : interview.overallScore >= 45
        ? "Marginal"
        : "Fail";
  }

  all[id] = interview;
  saveAll(all);

  return interview;
}

// ─── Emotion data attachment ──────────────────────────────────────────────────

/** Attach an emotion snapshot to a previously saved answer. Safe to call async
 *  after the answer has already been stored. */
export function attachEmotionToAnswer(
  id: string,
  stage: StageType,
  questionIndex: number,
  emotionData: EmotionSnapshot,
): void {
  const all = loadAll();
  const interview = all[id];
  if (!interview) return;
  const stageData = interview.stages[stage];
  if (!stageData?.answers[questionIndex]) return;
  stageData.answers[questionIndex].emotionData = emotionData;
  all[id] = interview;
  saveAll(all);
}

// ─── Heuristics-based answer analysis ─────────────────────────────────────────

const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "literally", "right",
  "kind of", "sort of", "i mean", "actually", "so", "well",
];

// Pre-compile filler word regexes to avoid repeated compilation on each call
// Multi-word phrases use a plain string search; single words use word boundaries
const FILLER_REGEXES: Array<{ pattern: RegExp; isPhrase: boolean }> = FILLER_WORDS.map(
  (filler) => ({
    pattern: filler.includes(" ")
      ? new RegExp(filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
      : new RegExp(`\\b${filler}\\b`, "gi"),
    isPhrase: filler.includes(" "),
  })
);

const STAR_KEYWORDS = {
  situation: ["situation", "context", "background", "when", "working at", "at my", "we were", "i was"],
  task: ["task", "goal", "objective", "responsibility", "needed to", "had to", "my role", "i was asked"],
  action: ["i did", "i built", "i designed", "i implemented", "i worked", "i created", "i led", "i decided", "i wrote", "i proposed", "i worked with", "we decided", "i took"],
  result: ["result", "outcome", "impact", "we achieved", "increased", "decreased", "improved", "reduced", "saved", "delivered", "shipped", "launched", "percent", "%"],
};

const POSITIVE_WORDS = [
  "achieved", "improved", "built", "led", "designed", "delivered", "shipped",
  "increased", "reduced", "solved", "created", "implemented", "optimized",
  "launched", "owned", "drove", "collaborated", "succeeded", "completed",
];

const TECHNICAL_KEYWORDS: Record<Role, string[]> = {
  SWE: ["algorithm", "complexity", "function", "class", "api", "database", "cache", "service", "test", "deploy", "code", "system", "architecture", "pattern", "performance", "scalable"],
  PM: ["metric", "kpi", "user", "customer", "roadmap", "prioritize", "stakeholder", "revenue", "retention", "churn", "hypothesis", "ab test", "feature", "launch", "strategy"],
  "Data Scientist": ["model", "accuracy", "precision", "recall", "training", "feature", "dataset", "sql", "python", "regression", "classification", "neural", "distribution", "correlation", "variance"],
  "UX Designer": ["user research", "usability", "prototype", "wireframe", "persona", "journey", "accessibility", "iteration", "testing", "feedback", "interaction", "visual", "layout", "flow"],
  DevOps: ["kubernetes", "docker", "ci/cd", "pipeline", "terraform", "monitoring", "deployment", "container", "cloud", "incident", "alert", "infrastructure", "scale", "reliability", "automation"],
};

export function analyzeAnswer(
  question: string,
  answer: string,
  role: Role
): AnswerScores {
  const lower = answer.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // ── Clarity (word count, filler words, sentence length variance) ──────────
  let clarityScore = 50;

  if (wordCount < 20) clarityScore -= 30;
  else if (wordCount < 50) clarityScore -= 10;
  else if (wordCount >= 80 && wordCount <= 250) clarityScore += 20;
  else if (wordCount > 350) clarityScore -= 10; // too long/rambling

  const fillerCount = FILLER_REGEXES.reduce(
    (count, { pattern }) => count + (answer.match(pattern)?.length ?? 0),
    0
  );

  const fillerRatio = fillerCount / Math.max(wordCount, 1);
  if (fillerRatio > 0.05) clarityScore -= 20;
  else if (fillerRatio > 0.02) clarityScore -= 10;
  else if (fillerRatio === 0) clarityScore += 10;

  clarityScore = Math.max(0, Math.min(100, clarityScore));

  // ── Completeness (question keyword coverage, answer length) ───────────────
  let completenessScore = 40;

  if (wordCount >= 60) completenessScore += 20;
  if (wordCount >= 120) completenessScore += 10;

  const roleKeywords = TECHNICAL_KEYWORDS[role] ?? [];
  const keywordHits = roleKeywords.filter((kw) => lower.includes(kw)).length;
  completenessScore += Math.min(20, keywordHits * 4);

  // Question word coverage
  const questionWords = question
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .filter((w) => !["what", "when", "where", "which", "would", "could", "should", "there", "their", "about"].includes(w));

  const qWordCoverage =
    questionWords.length > 0
      ? questionWords.filter((w) => lower.includes(w)).length / questionWords.length
      : 0;

  completenessScore += Math.round(qWordCoverage * 20);

  completenessScore = Math.max(0, Math.min(100, completenessScore));

  // ── Structure (STAR method detection) ────────────────────────────────────
  let structureScore = 30;

  const starHits = Object.values(STAR_KEYWORDS).filter((keywords) =>
    keywords.some((kw) => lower.includes(kw))
  ).length;

  structureScore += starHits * 15; // up to 60 bonus for all 4 STAR parts

  // Paragraph / sentence structure (multiple sentences = good structure)
  const sentenceCount = (answer.match(/[.!?]+/g) ?? []).length;
  if (sentenceCount >= 3) structureScore += 10;
  if (sentenceCount >= 6) structureScore += 10;

  structureScore = Math.max(0, Math.min(100, structureScore));

  // ── Confidence (positive action words, first-person, specific examples) ───
  let confidenceScore = 40;

  const positiveHits = POSITIVE_WORDS.filter((w) => lower.includes(w)).length;
  confidenceScore += Math.min(30, positiveHits * 6);

  const firstPersonCount = (lower.match(/\bi(?:\s|')/g) ?? []).length;
  if (firstPersonCount >= 3) confidenceScore += 10;
  if (firstPersonCount >= 6) confidenceScore += 5;

  // Specific numbers or percentages suggest concrete examples
  const hasNumbers = /\d+/.test(answer);
  if (hasNumbers) confidenceScore += 10;

  // Hedging language reduces confidence
  const hedgeCount = (lower.match(/\b(maybe|perhaps|might|possibly|not sure|i think|i guess|sort of|kind of)\b/g) ?? []).length;
  if (hedgeCount > 3) confidenceScore -= 15;
  else if (hedgeCount > 1) confidenceScore -= 5;

  confidenceScore = Math.max(0, Math.min(100, confidenceScore));

  // ── Overall (weighted average) ─────────────────────────────────────────────
  const overall = Math.round(
    clarityScore * 0.25 +
    completenessScore * 0.30 +
    structureScore * 0.25 +
    confidenceScore * 0.20
  );

  return {
    clarity: Math.round(clarityScore),
    completeness: Math.round(completenessScore),
    structure: Math.round(structureScore),
    confidence: Math.round(confidenceScore),
    overall,
  };
}

function generateFeedback(
  scores: AnswerScores,
  _question: string,
  answer: string
): string {
  const lines: string[] = [];
  const lower = answer.toLowerCase();

  // Clarity feedback
  const wordCount = answer.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount < 50) {
    lines.push("Your answer was quite brief. Try to elaborate with more details and examples.");
  } else if (wordCount > 300) {
    lines.push("Your answer was thorough but could be more concise. Focus on the most relevant points.");
  }

  const fillerCount = FILLER_REGEXES.reduce(
    (count, { pattern }) => count + (answer.match(pattern)?.length ?? 0),
    0
  );
  if (fillerCount > 3) {
    lines.push(`Reduce filler words (e.g., "um", "like", "you know") to sound more confident and polished.`);
  }

  // Structure feedback
  const starHits = Object.entries(STAR_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([part]) => part);

  const missingStarParts = ["situation", "task", "action", "result"].filter(
    (p) => !starHits.includes(p)
  );

  if (missingStarParts.length > 0) {
    lines.push(
      `Try the STAR method. Your answer could be stronger with these components: ${missingStarParts.join(", ")}.`
    );
  }

  // Completeness / specificity
  const hasNumbers = /\d+/.test(answer);
  if (!hasNumbers) {
    lines.push("Add specific numbers or metrics to make your impact more concrete and credible.");
  }

  // Positive feedback
  if (scores.overall >= 70) {
    lines.push("Overall, this is a strong answer. Keep up the specificity and structure.");
  } else if (scores.overall >= 50) {
    lines.push("Decent foundation — adding more concrete examples and structure will elevate this significantly.");
  } else {
    lines.push("Focus on giving a structured answer with a specific real-world example from your experience.");
  }

  return lines.join(" ");
}
