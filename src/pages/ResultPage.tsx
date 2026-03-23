import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSessionResults, type InterviewResult } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, Home, CheckCircle, AlertCircle, XCircle, Award } from "lucide-react";

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function getScoreIcon(score: number) {
  if (score >= 80) return CheckCircle;
  if (score >= 60) return Award;
  if (score >= 40) return AlertCircle;
  return XCircle;
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-success/10";
  if (score >= 60) return "bg-primary/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-destructive/10";
}

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    getSessionResults(sessionId)
      .then(setResults)
      .catch(() => toast.error("Failed to load results"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.final_score, 0) / results.length)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const ScoreIcon = getScoreIcon(avgScore);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-display">Results</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Overall score */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className={`p-8 text-center shadow-elevated ${getScoreBg(avgScore)}`}>
            <ScoreIcon className={`h-12 w-12 mx-auto mb-3 ${getScoreColor(avgScore)}`} />
            <h2 className={`text-5xl font-bold font-display ${getScoreColor(avgScore)}`}>{avgScore}%</h2>
            <p className="text-lg text-muted-foreground mt-2">
              {avgScore >= 80 ? "Excellent Performance!" : avgScore >= 60 ? "Good Job!" : avgScore >= 40 ? "Room for Improvement" : "Keep Practicing!"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{results.length} questions answered</p>
          </Card>
        </motion.div>

        {/* Individual results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-display">Detailed Results</h3>
          {results.map((result, i) => (
            <motion.div key={result.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                      {result.question?.category}
                    </span>
                    <h4 className="font-medium font-display">{result.question?.question}</h4>
                  </div>
                  <span className={`text-2xl font-bold font-display ml-4 ${getScoreColor(result.final_score)}`}>
                    {result.final_score}%
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Your Answer</p>
                    <p>{result.user_answer}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5">
                    <p className="text-xs text-primary mb-1 font-medium">Feedback</p>
                    <p>{result.feedback}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Semantic: {result.semantic_score}%</span>
                    <span>Keyword: {result.keyword_score}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="hero" size="lg" className="flex-1" onClick={() => navigate("/interview/start")}>
            Start New Interview
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
            <Home className="h-5 w-5" /> Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
