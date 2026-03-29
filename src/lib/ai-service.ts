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

  // Clarity: sentence length variety and punctuation usage
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  const clarityBase = Math.min(100, 40 + wordCount * 0.4);
  const clarityPenalty = avgWordsPerSentence > 35 ? 15 : avgWordsPerSentence < 5 ? 10 : 0;
  const clarity = Math.round(Math.max(20, Math.min(95, clarityBase - clarityPenalty)));

  // Completeness: length-based heuristic with structure bonuses
  const hasStructure = /first|second|third|finally|additionally|however|therefore|because|example|situation|result/i.test(answer);
  const completenessBase = Math.min(100, 30 + wordCount * 0.6 + (hasStructure ? 15 : 0));
  const completeness = Math.round(Math.max(15, Math.min(95, completenessBase)));

  // Relevance: keyword overlap with question
  const questionWords = new Set(
    question.toLowerCase().split(/\W+/).filter(w => w.length > 4)
  );
  const answerWords = answer.toLowerCase().split(/\W+/);
  const overlap = answerWords.filter(w => questionWords.has(w)).length;
  const relevanceBase = Math.min(100, 40 + overlap * 8);
  const relevance = Math.round(Math.max(20, Math.min(95, relevanceBase)));

  // Confidence: first-person usage and assertive language
  const firstPersonCount = (answer.match(/\bI\b|\bmy\b|\bme\b|\bwe\b/gi) || []).length;
  const hedgeWords = (answer.match(/\bmaybe\b|\bperhaps\b|\bpossibly\b|\bi think\b|\bnot sure\b/gi) || []).length;
  const confidenceBase = Math.min(100, 45 + firstPersonCount * 3 - hedgeWords * 8);
  const confidence = Math.round(Math.max(20, Math.min(95, confidenceBase)));

  const overall = Math.round((clarity + completeness + relevance + confidence) / 4);

  // Strengths and improvements based on scores
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (clarity >= 70) strengths.push("Your answer is clearly structured and easy to follow.");
  else improvements.push("Work on clarity — use shorter sentences and clearer transitions.");

  if (completeness >= 70) strengths.push("You provided a thorough and complete response.");
  else improvements.push("Add more detail and concrete examples to make your answer more complete.");

  if (relevance >= 70) strengths.push("Your answer stays on topic and addresses the question directly.");
  else improvements.push("Make sure to address all parts of the question directly.");

  if (confidence >= 70) strengths.push("Your answer conveys confidence and ownership.");
  else improvements.push("Use more assertive language and avoid hedging phrases like 'maybe' or 'I think'.");

  if (hasStructure) strengths.push("Good use of structure with clear transitions.");
  else improvements.push("Try using the STAR method or explicit transitions (first, then, finally) to structure your answer.");

  if (wordCount < 50) improvements.push("Your answer is too brief — aim for at least 100-150 words for a complete response.");
  if (wordCount > 400) improvements.push("Consider being more concise — strong interview answers are typically 150-300 words.");

  // Suggest tips based on category and weaknesses
  const suggestedTipIds: string[] = [];
  if (clarity < 60 || completeness < 60) suggestedTipIds.push("b1"); // STAR method
  if (confidence < 60) suggestedTipIds.push("b2"); // Tell me about yourself
  if (category === "Technical") suggestedTipIds.push("t1", "t4");
  if (category === "Behavioral") suggestedTipIds.push("b1", "b5");
  if (category === "HR") suggestedTipIds.push("hr1", "hr4");
  if (category === "Problem-Solving") suggestedTipIds.push("ps1", "ps4");

  const recommendation = overall >= 80
    ? "Excellent response! You demonstrated strong communication and clear thinking. Keep practicing to maintain this level."
    : overall >= 60
    ? "Good effort! A few targeted improvements will elevate your answer significantly. Focus on the areas highlighted below."
    : "This answer needs development. Review the STAR method and practice structuring your responses with specific examples and outcomes.";

  const detailedFeedback = `Your response scored ${overall}/100 overall. ${
    wordCount < 50
      ? "The answer was very brief — interviewers expect substantive responses."
      : wordCount > 400
      ? "The answer was lengthy — consider distilling your key points more concisely."
      : "The length was appropriate for an interview answer."
  } ${
    hasStructure
      ? "You demonstrated good use of structure with logical flow."
      : "Adding explicit structure (e.g., STAR method) would improve your answer significantly."
  } Focus on the improvement areas below to reach a higher score.`;

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
