import { useState, useEffect } from "react";
import { getInterviewHistory, getPerformanceByCategory, type InterviewSession, type PerformanceData } from "@/lib/api";

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  bestScore: number;
  totalQuestions: number;
  mostImprovedCategory: string | null;
  recentSessions: InterviewSession[];
  categoryPerformance: PerformanceData[];
  scoreHistory: { date: string; score: number }[];
}

export function useProgress() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);
    setError(null);
    try {
      const [history, performance] = await Promise.all([
        getInterviewHistory(),
        getPerformanceByCategory(),
      ]);

      const completed = history.filter(s => s.completed_at && s.total_score !== null);
      const scores = completed.map(s => s.total_score as number);
      const averageScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const totalQuestions = performance.reduce((sum, p) => sum + p.total_questions, 0);

      // Build score history from completed sessions (sorted by date)
      const scoreHistory = completed
        .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
        .map(s => ({
          date: new Date(s.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: s.total_score as number,
        }));

      // Most improved: category with highest score
      const mostImproved = [...performance].sort((a, b) => b.avg_score - a.avg_score)[0];

      setStats({
        totalSessions: history.length,
        completedSessions: completed.length,
        averageScore,
        bestScore,
        totalQuestions,
        mostImprovedCategory: mostImproved?.category ?? null,
        recentSessions: history.slice(0, 5),
        categoryPerformance: performance,
        scoreHistory,
      });
    } catch {
      setError("Failed to load progress data.");
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading, error, refresh: loadProgress };
}
