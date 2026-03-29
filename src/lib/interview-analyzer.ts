// Interview answer analyzer — coordinates AI analysis with local context

import { analyzeInterviewAnswer, type AIAnalysisResult, type AIAnalysisRequest } from "./ai-service";
import { getTipById, type InterviewTip } from "./data-seed";

export interface AnalysisWithTips extends AIAnalysisResult {
  suggestedTips: InterviewTip[];
}

export async function analyzeAnswer(
  request: AIAnalysisRequest
): Promise<AnalysisWithTips> {
  const result = await analyzeInterviewAnswer(request);

  const suggestedTips = result.suggestedTipIds
    .map(id => getTipById(id))
    .filter(Boolean) as InterviewTip[];

  return { ...result, suggestedTips };
}

// Score label helpers
export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return "bg-emerald-50 border-emerald-200";
  if (score >= 70) return "bg-blue-50 border-blue-200";
  if (score >= 55) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}
