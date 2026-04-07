// Emotion analysis service — video frame capture + OpenAI Vision / heuristic fallback

export type EmotionLabel = "confident" | "nervous" | "engaged" | "uncertain" | "calm";

export interface EmotionSnapshot {
  emotion: EmotionLabel;
  /** 0–100: how strongly the dominant emotion was detected */
  confidence: number;
  /** Per-emotion distribution (sums to ~100) */
  scores: Record<EmotionLabel, number>;
  /** "vision" if frame was sent to OpenAI, "heuristic" if text-only */
  method: "vision" | "heuristic";
}

export interface EmotionSummary {
  dominant: EmotionLabel;
  breakdown: Record<EmotionLabel, number>;
  insights: string[];
  /** Overall presentation confidence score 0–100 */
  overallConfidenceScore: number;
}

// ─── Video Frame Capture ──────────────────────────────────────────────────────

/** Draws the current frame of a <video> element onto an off-screen canvas and
 *  returns a compressed JPEG data-URL, or null if the video has no dimensions. */
export function captureVideoFrame(videoEl: HTMLVideoElement): string | null {
  const w = videoEl.videoWidth;
  const h = videoEl.videoHeight;
  if (!w || !h) return null;

  const canvas = document.createElement("canvas");
  // Downscale to reduce payload size while keeping faces readable
  const scale = Math.min(1, 480 / Math.max(w, h));
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.6);
}

// ─── Heuristic Emotion Analysis (text-only fallback) ─────────────────────────

const FILLER_PATTERNS = [
  /\bum\b/gi, /\buh\b/gi, /\blike\b/gi, /\byou know\b/gi,
  /\bbasically\b/gi, /\bright\b/gi, /\bkind of\b/gi, /\bsort of\b/gi,
  /\bi mean\b/gi, /\bactually\b/gi,
];
const HEDGE_PATTERNS = [
  /\bmaybe\b/gi, /\bperhaps\b/gi, /\bmight\b/gi, /\bpossibly\b/gi,
  /\bnot sure\b/gi, /\bi think\b/gi, /\bi guess\b/gi, /\bcould be\b/gi,
];
const ACTION_VERBS = [
  "built", "led", "designed", "implemented", "achieved", "improved",
  "delivered", "launched", "created", "solved", "owned", "drove",
  "collaborated", "shipped", "optimized",
];

// Scoring weights for heuristic emotion calculation
const ENGAGED_SUBSTANTIAL_BONUS = 35;
const ENGAGED_MINOR_BONUS = 10;
const ENGAGED_STRUCTURE_BONUS = 20;
const ENGAGED_LENGTH_DIVISOR = 8;
const ENGAGED_LENGTH_MAX = 20;
const CONFIDENT_ACTION_WEIGHT = 10;
const CONFIDENT_NUMBERS_BONUS = 15;
const CONFIDENT_HEDGE_PENALTY = 8;
const NERVOUS_FILLER_WEIGHT = 12;
const NERVOUS_SHORT_PENALTY = 20;
const UNCERTAIN_HEDGE_WEIGHT = 12;
const UNCERTAIN_SHORT_PENALTY = 25;
const CALM_BASE = 30;
const CALM_FILLER_PENALTY = 5;
const SUBSTANTIAL_WORD_COUNT = 80;
const SHORT_WORD_COUNT = 30;
const VERY_SHORT_WORD_COUNT = 25;

// Weights for overall confidence score
const CONFIDENT_PRESENTATION_WEIGHT = 0.6;
const ENGAGED_PRESENTATION_WEIGHT = 0.4;

function countPatterns(text: string, patterns: RegExp[]): number {
  return patterns.reduce((n, p) => n + (text.match(p)?.length ?? 0), 0);
}

function normalizeScores(raw: Record<EmotionLabel, number>): Record<EmotionLabel, number> {
  const total = Object.values(raw).reduce((s, v) => s + v, 0) || 1;
  const result = {} as Record<EmotionLabel, number>;
  for (const key of Object.keys(raw) as EmotionLabel[]) {
    result[key] = Math.round((raw[key] / total) * 100);
  }
  return result;
}

export function analyzeEmotionFromText(answerText: string): EmotionSnapshot {
  const lower = answerText.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerCount = countPatterns(answerText, FILLER_PATTERNS);
  const hedgeCount = countPatterns(answerText, HEDGE_PATTERNS);
  const actionCount = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  const hasNumbers = /\d+/.test(answerText);
  const hasStructure = /\b(first|second|then|finally|as a result|because|therefore)\b/i.test(answerText);
  const isSubstantial = wordCount >= SUBSTANTIAL_WORD_COUNT;

  const raw: Record<EmotionLabel, number> = {
    confident: Math.max(0, 20 + actionCount * CONFIDENT_ACTION_WEIGHT + (hasNumbers ? CONFIDENT_NUMBERS_BONUS : 0) - hedgeCount * CONFIDENT_HEDGE_PENALTY),
    nervous: Math.max(0, fillerCount * NERVOUS_FILLER_WEIGHT + (wordCount < VERY_SHORT_WORD_COUNT ? NERVOUS_SHORT_PENALTY : 0)),
    engaged: Math.max(0,
      (isSubstantial ? ENGAGED_SUBSTANTIAL_BONUS : ENGAGED_MINOR_BONUS) +
      (hasStructure ? ENGAGED_STRUCTURE_BONUS : 0) +
      Math.min(ENGAGED_LENGTH_MAX, wordCount / ENGAGED_LENGTH_DIVISOR),
    ),
    uncertain: Math.max(0, hedgeCount * UNCERTAIN_HEDGE_WEIGHT + (wordCount < SHORT_WORD_COUNT ? UNCERTAIN_SHORT_PENALTY : 0)),
    calm: Math.max(0, CALM_BASE - fillerCount * CALM_FILLER_PENALTY),
  };

  const scores = normalizeScores(raw);
  const dominant = (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as EmotionLabel;

  return { emotion: dominant, confidence: scores[dominant], scores, method: "heuristic" };
}

// Vision API request constants
const MAX_ANSWER_CONTEXT_LENGTH = 300;
const MAX_VISION_RESPONSE_TOKENS = 200;

// ─── OpenAI Vision-Based Emotion Analysis ────────────────────────────────────

async function analyzeEmotionWithVision(
  imageDataUrl: string,
  answerText: string,
  apiKey: string,
): Promise<EmotionSnapshot> {
  const base64 = imageDataUrl.split(",")[1];
  if (!base64) throw new Error("Invalid image data");

  const prompt = `You are an interview coaching AI. Analyze this candidate's facial expression and body language captured during a mock interview.

Candidate's answer (for context): "${answerText.slice(0, MAX_ANSWER_CONTEXT_LENGTH)}"

Return JSON only:
{
  "dominant": "confident" | "nervous" | "engaged" | "uncertain" | "calm",
  "confidence": <0-100>,
  "scores": { "confident": <0-100>, "nervous": <0-100>, "engaged": <0-100>, "uncertain": <0-100>, "calm": <0-100> }
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64}`, detail: "low" },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: MAX_VISION_RESPONSE_TOKENS,
      temperature: 0.2,
    }),
  });

  if (!response.ok) throw new Error(`Vision API error: ${response.status}`);

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    emotion: parsed.dominant as EmotionLabel,
    confidence: parsed.confidence ?? 60,
    scores: parsed.scores as Record<EmotionLabel, number>,
    method: "vision",
  };
}

// ─── Main Public API ──────────────────────────────────────────────────────────

/** Capture a video frame (if provided) and analyze emotion.
 *  Falls back to text-only heuristics when the frame is unavailable or vision fails. */
export async function analyzeEmotion(
  frameDataUrl: string | null,
  answerText: string,
): Promise<EmotionSnapshot> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

  if (frameDataUrl && apiKey) {
    try {
      return await analyzeEmotionWithVision(frameDataUrl, answerText, apiKey);
    } catch (err) {
      console.error("[emotion-service] Vision API failed, falling back to heuristics:", err);
    }
  }

  // Small async delay to avoid blocking perception (mirrors ai-service pattern)
  await new Promise((resolve) => setTimeout(resolve, 400));
  return analyzeEmotionFromText(answerText);
}

// ─── Summary Generation ───────────────────────────────────────────────────────

const EMOTION_LABELS: Record<EmotionLabel, string> = {
  confident: "Confident",
  nervous: "Nervous",
  engaged: "Engaged",
  uncertain: "Uncertain",
  calm: "Calm",
};

export { EMOTION_LABELS };

const FALLBACK_BREAKDOWN: Record<EmotionLabel, number> = {
  confident: 20,
  nervous: 20,
  engaged: 20,
  uncertain: 20,
  calm: 20,
};

export function generateEmotionSummary(snapshots: EmotionSnapshot[]): EmotionSummary {
  if (snapshots.length === 0) {
    return {
      dominant: "calm",
      breakdown: FALLBACK_BREAKDOWN,
      insights: ["No emotion data collected — enable video recording during your next session for emotion insights."],
      overallConfidenceScore: 50,
    };
  }

  // Average per-emotion scores across all snapshots
  const totals: Record<EmotionLabel, number> = {
    confident: 0, nervous: 0, engaged: 0, uncertain: 0, calm: 0,
  };

  for (const snap of snapshots) {
    for (const key of Object.keys(snap.scores) as EmotionLabel[]) {
      totals[key] += snap.scores[key];
    }
  }

  const breakdown = {} as Record<EmotionLabel, number>;
  for (const key of Object.keys(totals) as EmotionLabel[]) {
    breakdown[key] = Math.round(totals[key] / snapshots.length);
  }

  const dominant = (
    Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0][0]
  ) as EmotionLabel;

  const overallConfidenceScore = Math.min(
    100,
    Math.round(breakdown.confident * CONFIDENT_PRESENTATION_WEIGHT + breakdown.engaged * ENGAGED_PRESENTATION_WEIGHT),
  );

  const insights: string[] = [];

  if (breakdown.confident >= 35) {
    insights.push("You projected strong confidence — your use of action verbs and concrete examples showed ownership.");
  } else if (breakdown.confident < 20) {
    insights.push("Work on projecting more confidence: start sentences with 'I built…', 'I led…', 'I achieved…'");
  }

  if (breakdown.engaged >= 35) {
    insights.push("You demonstrated clear engagement with detailed, well-structured responses.");
  }

  if (breakdown.nervous >= 30) {
    insights.push("Signs of nervousness detected — practice pacing your speech and reducing filler words.");
  }

  if (breakdown.uncertain >= 25) {
    insights.push("Reduce hedging language ('maybe', 'I think', 'perhaps') to sound more decisive and authoritative.");
  }

  if (breakdown.calm >= 30) {
    insights.push("You maintained a calm, composed demeanor — a positive signal to interviewers.");
  }

  if (insights.length === 0) {
    insights.push("Mixed emotional signals across answers. Aim for consistently confident and engaged delivery.");
  }

  return { dominant, breakdown, insights, overallConfidenceScore };
}
