import { useState, useCallback } from "react";
import { analyzeAnswer, type AnalysisWithTips } from "@/lib/interview-analyzer";
import type { AIAnalysisRequest } from "@/lib/ai-service";

interface UseAIState {
  result: AnalysisWithTips | null;
  loading: boolean;
  error: string | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    result: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(async (request: AIAnalysisRequest) => {
    setState({ result: null, loading: true, error: null });
    try {
      const result = await analyzeAnswer(request);
      setState({ result, loading: false, error: null });
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setState({ result: null, loading: false, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, analyze, reset };
}
