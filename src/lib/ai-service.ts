// AI Service — handles AI API calls with graceful fallbacks

export interface AIAnalysisRequest {
  question: string;
  answer: string;
  category?: string;
  role?: string;
}

export interface AIFeedbackScores {
  clarity: number;       // 0-100
  completeness: number;  // 0-100
  relevance: number;     // 0-100
  confidence: number;    // 0-100
  overall: number;       // 0-100
}

export interface AIAnalysisResult {
  scores: AIFeedbackScores;
  strengths: string[];
  improvements: string[];
  recommendation: string;
  suggestedTipIds: string[];
  detailedFeedback: string;
  modelUsed: "openai" | "mock";
}

// Simple keyword-based heuristic analysis (offline fallback)
function analyzeWithHeuristics(request: AIAnalysisRequest): AIAnalysisResult {
  const { question, answer, category } = request;
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const lower = answer.toLowerCase();

  // ── STAR method detection ─────────────────────────────────────────────────
  const starHits = {
    situation: /\b(situation|context|background|when i|at my|we were|i was working|working at|in my (previous|last|current))\b/i.test(answer),
    task: /\b(task|goal|objective|my role|i needed to|i had to|i was asked|responsibility|the challenge was)\b/i.test(answer),
    action: /\bi (built|designed|implemented|worked|created|led|decided|wrote|proposed|took|delivered|launched|initiated|collaborated|resolved|developed|managed|coordinated)\b/i.test(answer),
    result: /\b(result|outcome|impact|increased|decreased|improved|reduced|saved|delivered|shipped|launched|achieved|percent|%|success)\b/i.test(answer),
  };
  const starCount = Object.values(starHits).filter(Boolean).length;
  const missingStar = Object.entries(starHits).filter(([, v]) => !v).map(([k]) => k);

  const hasNumbers = /\d+(\.\d+)?(%|x|\s*percent|\s*times|\s*users|\s*million|\s*thousand)?/i.test(answer);
  const hasStructureWords = /\b(first|second|third|finally|additionally|however|therefore|because|for example|as a result)\b/i.test(answer);

  // ── Clarity (0–100): tiered by word count ─────────────────────────────────
  let clarity: number;
  if (wordCount >= 200) clarity = 85;
  else if (wordCount >= 120) clarity = 75;
  else if (wordCount >= 80) clarity = 65;
  else if (wordCount >= 50) clarity = 52;
  else if (wordCount >= 30) clarity = 38;
  else if (wordCount >= 15) clarity = 24;
  else if (wordCount >= 5) clarity = 13;
  else clarity = 5;

  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  if (avgWordsPerSentence > 35) clarity = Math.max(5, clarity - 15);
  if (sentenceCount >= 4) clarity = Math.min(95, clarity + 8);

  // ── Completeness (0–100): word count + structure bonuses ─────────────────
  let completeness: number;
  if (wordCount >= 200) completeness = 80;
  else if (wordCount >= 120) completeness = 68;
  else if (wordCount >= 80) completeness = 55;
  else if (wordCount >= 50) completeness = 42;
  else if (wordCount >= 30) completeness = 28;
  else if (wordCount >= 15) completeness = 17;
  else if (wordCount >= 5) completeness = 10;
  else completeness = 4;

  completeness = Math.min(95, completeness + starCount * 6 + (hasStructureWords ? 5 : 0));

  // ── Relevance (0–100): question overlap + STAR + specificity ─────────────
  const questionWords = new Set(
    question.toLowerCase().split(/\W+/).filter(w => w.length > 4)
  );
  const answerWords = lower.split(/\W+/);
  const directOverlap = answerWords.filter(w => questionWords.has(w)).length;

  const relevance = Math.max(5, Math.min(95,
    15 +
    Math.min(25, directOverlap * 7) +
    starCount * 10 +
    (hasNumbers ? 10 : 0) +
    (wordCount >= 50 ? 5 : 0) +
    (wordCount >= 100 ? 5 : 0)
  ));

  // ── Confidence (0–100): ownership language, action words, specificity ─────
  const firstPersonCount = (answer.match(/\bI\b|\bmy\b|\bme\b|\bwe\b/gi) || []).length;
  const positiveActionCount = (lower.match(/\b(achieved|improved|built|led|designed|delivered|shipped|increased|reduced|solved|created|implemented|optimized|launched|owned|drove|collaborated|succeeded|completed)\b/g) || []).length;
  const hedgeCount = (answer.match(/\bmaybe\b|\bperhaps\b|\bpossibly\b|\bi think\b|\bnot sure\b/gi) || []).length;

  const confidence = Math.max(5, Math.min(95,
    10 +
    Math.min(20, firstPersonCount * 3) +
    Math.min(30, positiveActionCount * 6) +
    (hasNumbers ? 12 : 0) -
    hedgeCount * 8
  ));

  const overall = Math.round((clarity + completeness + relevance + confidence) / 4);

  // ── Specific, STAR-aware strengths & improvements ─────────────────────────
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= 100) strengths.push("Good response length — you gave the interviewer enough detail to evaluate you.");
  else if (wordCount < 30) improvements.push(`Your answer is too brief (${wordCount} words). Aim for at least 80–150 words.`);
  else improvements.push("Expand your answer with more specific examples and context — aim for 100+ words.");

  if (starCount >= 3) strengths.push("Strong use of the STAR method — you covered the situation, actions, and results clearly.");
  else if (starCount >= 2) strengths.push("Partial STAR structure detected. Good start — keep building on it.");
  else {
    const missing = missingStar.slice(0, 2);
    const hint = missing.length === 1
      ? `${missing[0]} component`
      : `${missing.join(" and ")} components`;
    improvements.push(`Use the STAR method. Your answer is missing the ${hint || "action and result components"}.`);
  }

  if (hasNumbers) strengths.push("You used specific numbers or metrics — this makes your impact concrete and credible.");
  else improvements.push("Add quantifiable results (e.g., '40% faster', '3 team members', '$20K saved') to strengthen your answer.");

  if (confidence >= 60) strengths.push("Your language conveys ownership and confidence.");
  else if (hedgeCount > 1) improvements.push(`Reduce hedging words ('maybe', 'perhaps', 'I think') — they undermine your confidence.`);
  else improvements.push("Use assertive, action-oriented language — lead with 'I built', 'I led', 'I achieved'.");

  if (hasStructureWords || starCount >= 2) strengths.push("Clear logical flow with structured transitions.");
  else improvements.push("Add structure cues like 'First...', 'Then...', 'As a result...' to guide the interviewer through your answer.");

  // Suggest tips based on category and weaknesses
  const suggestedTipIds: string[] = [];
  if (starCount < 3) suggestedTipIds.push("b1");
  if (confidence < 50) suggestedTipIds.push("b2");
  if (category === "Technical") suggestedTipIds.push("t1", "t4");
  if (category === "Behavioral") suggestedTipIds.push("b1", "b5");
  if (category === "HR") suggestedTipIds.push("hr1", "hr4");
  if (category === "Problem-Solving") suggestedTipIds.push("ps1", "ps4");

  const recommendation = overall >= 75
    ? "Strong answer! You demonstrated clear communication and provided concrete evidence. Continue using specific examples and measurable outcomes."
    : overall >= 55
    ? "Solid foundation — your answer has the right instincts. Focus on adding the missing STAR components and quantifying your impact to push your score higher."
    : overall >= 35
    ? "Your answer needs more development. Practice the STAR method: describe the Situation, your Task, the Action you took, and the Result you achieved. Always close with a specific outcome."
    : "Start by speaking for longer and structuring your answer. Even a 2-minute spoken answer following STAR (Situation → Task → Action → Result) will dramatically improve your score.";

  const starSummary = starCount === 4
    ? "You covered all four STAR components (Situation, Task, Action, Result)."
    : starCount >= 2
    ? `You covered ${starCount}/4 STAR components. Missing: ${missingStar.join(", ")}.`
    : `Your answer is missing key STAR components: ${missingStar.join(", ")}.`;

  const lengthNote = wordCount < 30
    ? `At only ${wordCount} words, your answer was too short for a meaningful interview response.`
    : wordCount > 350
    ? `Your answer was ${wordCount} words — a bit long. Try to distill your key points more concisely.`
    : `Your answer was ${wordCount} words, which is ${wordCount >= 80 ? "a good length" : "slightly short — aim for 80–150 words"}.`;

  const detailedFeedback = `${lengthNote} ${starSummary} ${
    hasNumbers
      ? "You included specific numbers which adds credibility."
      : "Adding specific numbers or metrics would make your impact more convincing."
  } ${
    hedgeCount > 1
      ? `You used hedging language ${hedgeCount} times — this weakens your delivery.`
      : "Your language was mostly assertive and direct."
  }`;

  return {
    scores: { clarity, completeness, relevance, confidence, overall },
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    recommendation,
    suggestedTipIds: [...new Set(suggestedTipIds)].slice(0, 3),
    detailedFeedback,
    modelUsed: "mock",
  };
}

// Main AI analysis function — tries OpenAI, falls back to heuristics
export async function analyzeInterviewAnswer(
  request: AIAnalysisRequest
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (apiKey) {
    try {
      return await analyzeWithOpenAI(request, apiKey);
    } catch {
      // Fall through to mock
    }
  }

  // Simulate a small async delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1200));
  return analyzeWithHeuristics(request);
}

async function analyzeWithOpenAI(
  request: AIAnalysisRequest,
  apiKey: string
): Promise<AIAnalysisResult> {
  const { question, answer, category, role } = request;

  const prompt = `You are an expert interview coach analyzing a candidate's response. Provide detailed, constructive feedback.

Interview Context:
- Role: ${role || "General"}
- Category: ${category || "General"}
- Question: ${question}
- Candidate's Answer: ${answer}

Analyze this response and respond with a JSON object containing:
{
  "scores": {
    "clarity": <0-100, how clear and well-structured the answer is>,
    "completeness": <0-100, how thoroughly the question is answered>,
    "relevance": <0-100, how directly the answer addresses the question>,
    "confidence": <0-100, how confident and assertive the delivery seems>,
    "overall": <0-100, weighted average>
  },
  "strengths": [<up to 3 specific strengths>],
  "improvements": [<up to 3 specific, actionable improvement suggestions>],
  "recommendation": "<one paragraph coaching recommendation>",
  "detailedFeedback": "<detailed analysis paragraph>",
  "suggestedTipIds": [<array of relevant tip IDs from: b1,b2,b3,b4,b5,b6,b7,t1,t2,t3,t4,t5,hr1,hr2,hr3,hr4,ps1,ps2,ps3,ps4>]
}

Be specific, constructive, and encouraging. Focus on actionable feedback.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    ...parsed,
    modelUsed: "openai" as const,
  };
}
