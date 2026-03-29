import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { getInterview, type MultiStageInterview, type Verdict } from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";

function VerdictIcon({ verdict }: { verdict: Verdict }) {
  if (verdict === "Pass") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (verdict === "Marginal") return <MinusCircle className="h-5 w-5 text-amber-600" />;
  return <XCircle className="h-5 w-5 text-destructive" />;
}

function verdictText(verdict: Verdict): string {
  if (verdict === "Pass") return "Strong Pass";
  if (verdict === "Marginal") return "Marginal";
  return "Needs Improvement";
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

function ScoreMeter({ value }: { value: number }) {
  const color =
    value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${value >= 70 ? "text-emerald-600" : value >= 40 ? "text-amber-600" : "text-red-600"}`}>
        {value}
      </span>
    </div>
  );
}

function computeInsights(interview: MultiStageInterview) {
  const dim: Record<string, number[]> = { clarity: [], completeness: [], structure: [], confidence: [] };

  for (const stageData of Object.values(interview.stages)) {
    if (!stageData) continue;
    for (const answer of stageData.answers) {
      if (!answer.scores) continue;
      dim.clarity.push(answer.scores.clarity);
      dim.completeness.push(answer.scores.completeness);
      dim.structure.push(answer.scores.structure);
      dim.confidence.push(answer.scores.confidence);
    }
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const dimAvgs = {
    clarity: avg(dim.clarity),
    completeness: avg(dim.completeness),
    structure: avg(dim.structure),
    confidence: avg(dim.confidence),
  };

  const sorted = (Object.entries(dimAvgs) as [string, number][]).sort((a, b) => b[1] - a[1]);

  const recommendations: string[] = [];
  if (dimAvgs.structure < 60) {
    recommendations.push("Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.");
  }
  if (dimAvgs.clarity < 60) {
    recommendations.push("Work on reducing filler words and delivering clear, concise answers.");
  }
  if (dimAvgs.completeness < 60) {
    recommendations.push("Ensure you fully address each part of the question with relevant examples.");
  }
  if (dimAvgs.confidence < 60) {
    recommendations.push("Use specific numbers and outcomes to back up your statements and sound more confident.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Continue practicing to maintain and sharpen your strong interview skills.");
  }

  return {
    dimAvgs,
    topStrength: sorted[0]?.[0] ?? "clarity",
    topImprovement: sorted[sorted.length - 1]?.[0] ?? "structure",
    recommendations,
  };
}

export default function ReportPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<MultiStageInterview | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interviewId) { navigate("/dashboard"); return; }
    const iv = getInterview(interviewId);
    if (!iv) { navigate("/dashboard"); return; }
    setInterview(iv);
  }, [interviewId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const stages = getStagesForType(interview.role, interview.type);
  const { dimAvgs, recommendations } = computeInsights(interview);
  const score = interview.overallScore ?? 0;
  const verdict = interview.overallVerdict ?? "Marginal";

  const interviewDate = new Date(interview.startedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Print-hidden navigation */}
      <header className="border-b border-border bg-card print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/interview/analysis/${interviewId}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold font-display">Interview Report</span>
          </div>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Download / Print
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div ref={reportRef} className="space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 shadow-elevated">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="font-bold font-display text-lg text-primary">MockPrep AI</span>
                  </div>
                  <h1 className="text-3xl font-bold font-display">{interview.role} Interview Report</h1>
                  <p className="text-muted-foreground mt-1">
                    {interview.company} · {interview.type} · {interviewDate}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-2xl font-bold ${
                      score >= 70
                        ? "bg-emerald-100 text-emerald-700"
                        : score >= 45
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {score}
                    <span className="text-xs font-normal mt-0.5">/ 100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{scoreLabel(score)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg border border-border flex items-center gap-3">
                <VerdictIcon verdict={verdict} />
                <div>
                  <p className="font-semibold">Overall Verdict: {verdictText(verdict)}</p>
                  <p className="text-sm text-muted-foreground">
                    {verdict === "Pass"
                      ? "You demonstrated strong interview skills. Well done!"
                      : verdict === "Marginal"
                      ? "You showed potential but need more practice in key areas."
                      : "Focus on the improvement areas below to build interview confidence."}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Dimension scores */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <h2 className="font-bold font-display text-lg mb-4">Performance Dimensions</h2>
              <div className="space-y-3">
                {(Object.entries(dimAvgs) as [string, number][]).map(([dim, val]) => (
                  <div key={dim} className="flex items-center gap-4">
                    <span className="text-sm capitalize w-28 flex-shrink-0">{dim}</span>
                    <div className="flex-1">
                      <ScoreMeter value={val} />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      {scoreLabel(val)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Stage results table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="p-6">
              <h2 className="font-bold font-display text-lg mb-4">Stage Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Stage</th>
                      <th className="text-center py-2 px-4 text-muted-foreground font-medium">Score</th>
                      <th className="text-center py-2 px-4 text-muted-foreground font-medium">Verdict</th>
                      <th className="text-center py-2 pl-4 text-muted-foreground font-medium">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage) => {
                      const stageData = interview.stages[stage];
                      return (
                        <tr key={stage} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4 font-medium">{getStageName(stage)}</td>
                          <td className="py-3 px-4 text-center">
                            {stageData?.score !== undefined ? (
                              <span
                                className={`font-bold ${
                                  (stageData.score ?? 0) >= 70
                                    ? "text-emerald-600"
                                    : (stageData.score ?? 0) >= 40
                                    ? "text-amber-600"
                                    : "text-destructive"
                                }`}
                              >
                                {stageData.score}/100
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {stageData?.verdict ? (
                              <span className="flex items-center justify-center gap-1">
                                <VerdictIcon verdict={stageData.verdict} />
                                <span>{stageData.verdict}</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 pl-4 text-center text-muted-foreground">
                            {stageData?.answers.length ?? 0} answered
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h2 className="font-bold font-display text-lg mb-4">Recommendations</h2>
              <ul className="space-y-3">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Learning Hub</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Visit the{" "}
                  <Link to="/learning" className="text-primary underline hover:no-underline">
                    Learning Hub
                  </Link>{" "}
                  for tips, frameworks, and practice resources tailored to your improvement areas.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Answer log */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-6">
              <h2 className="font-bold font-display text-lg mb-4">Answer Log</h2>
              {stages.map((stage) => {
                const stageData = interview.stages[stage];
                if (!stageData || stageData.answers.length === 0) return null;

                return (
                  <div key={stage} className="mb-6 last:mb-0">
                    <h3 className="font-semibold mb-3 text-primary">{getStageName(stage)}</h3>
                    <div className="space-y-4">
                      {stageData.answers.map((answer, i) => {
                        const q = stageData.questions[i];
                        return (
                          <div key={answer.questionId} className="border border-border rounded-lg p-4">
                            <p className="text-sm font-semibold mb-2 text-foreground">
                              Q{i + 1}: {q?.text ?? "Question"}
                            </p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {answer.text}
                            </p>
                            {answer.scores && (
                              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                                <span>Clarity: <strong>{answer.scores.clarity}</strong></span>
                                <span>Completeness: <strong>{answer.scores.completeness}</strong></span>
                                <span>Structure: <strong>{answer.scores.structure}</strong></span>
                                <span>Confidence: <strong>{answer.scores.confidence}</strong></span>
                                <span className="font-bold">Overall: <strong>{answer.scores.overall}</strong></span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </Card>
          </motion.div>
        </div>

        {/* Action buttons (print-hidden) */}
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button variant="hero" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print / Save PDF
          </Button>
          <Button variant="outline" onClick={() => navigate("/interview/setup")}>
            <RotateCcw className="h-4 w-4" /> Practice Again
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </main>

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
