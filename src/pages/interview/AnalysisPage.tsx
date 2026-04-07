import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Trophy,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileText,
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { getInterview, type MultiStageInterview, type StageData, type StageAnswer, type Verdict } from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";
import { analyzeInterviewAnswer } from "@/lib/ai-service";
import { generateEmotionSummary, type EmotionSnapshot } from "@/lib/emotion-service";
import EmotionInsights from "@/components/EmotionInsights";

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-destructive";
  const textColor =
    value >= 70 ? "text-emerald-600" : value >= 40 ? "text-amber-600" : "text-destructive";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${textColor}`}>{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === "Pass") {
    return (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Pass
      </span>
    );
  }
  if (verdict === "Marginal") {
    return (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
        <MinusCircle className="h-4 w-4" /> Marginal
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
      <XCircle className="h-4 w-4" /> Needs Work
    </span>
  );
}

function QuestionCard({ answer, questionText, index }: { answer: StageAnswer; questionText: string; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const scores = answer.scores;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <span className="text-sm font-medium truncate">{questionText}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {scores && (
            <span
              className={`text-sm font-bold ${
                scores.overall >= 70 ? "text-emerald-600" : scores.overall >= 40 ? "text-amber-600" : "text-destructive"
              }`}
            >
              {scores.overall}/100
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/10">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Your Answer</p>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-card p-3 rounded-lg border border-border">
              {answer.text}
            </p>
          </div>

          {scores && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Score Breakdown</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ScoreBar label="Clarity" value={scores.clarity} />
                <ScoreBar label="Completeness" value={scores.completeness} />
                <ScoreBar label="Structure" value={scores.structure} />
                <ScoreBar label="Confidence" value={scores.confidence} />
              </div>
              <div className="pt-2 border-t border-border">
                <ScoreBar label="Overall Score" value={scores.overall} />
              </div>
            </div>
          )}

          {answer.feedback && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">AI Feedback</p>
              <p className="text-sm text-foreground">{answer.feedback}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Time used: {Math.round(answer.timeUsed / 60)}m {answer.timeUsed % 60}s
          </p>
        </div>
      )}
    </div>
  );
}

function StageSection({ stageName, stageData, questions }: {
  stageName: string;
  stageData: StageData;
  questions: Array<{ id: string; text: string }>;
}) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <button
        className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold font-display">{stageName}</span>
          {stageData.verdict && <VerdictBadge verdict={stageData.verdict} />}
          {stageData.score !== undefined && (
            <span className="text-sm text-muted-foreground">Score: {stageData.score}/100</span>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div className="space-y-2 pl-2">
          {stageData.answers.map((answer, i) => {
            const q = questions[i] ?? { id: answer.questionId, text: `Question ${i + 1}` };
            return (
              <QuestionCard
                key={answer.questionId}
                answer={answer}
                questionText={q.text}
                index={i}
              />
            );
          })}
          {stageData.answers.length === 0 && (
            <p className="text-sm text-muted-foreground pl-4">No answers recorded for this stage.</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function computeStrengthsAndImprovements(interview: MultiStageInterview) {
  const allAnswers: Array<{ dimension: string; score: number }> = [];

  for (const stageData of Object.values(interview.stages)) {
    if (!stageData) continue;
    for (const answer of stageData.answers) {
      if (!answer.scores) continue;
      allAnswers.push({ dimension: "clarity", score: answer.scores.clarity });
      allAnswers.push({ dimension: "completeness", score: answer.scores.completeness });
      allAnswers.push({ dimension: "structure", score: answer.scores.structure });
      allAnswers.push({ dimension: "confidence", score: answer.scores.confidence });
    }
  }

  const dims = ["clarity", "completeness", "structure", "confidence"];
  const avgByDim = dims.map((dim) => {
    const relevant = allAnswers.filter((a) => a.dimension === dim);
    const avg =
      relevant.length > 0
        ? Math.round(relevant.reduce((s, a) => s + a.score, 0) / relevant.length)
        : 50;
    return { dim, avg };
  });

  const sorted = [...avgByDim].sort((a, b) => b.avg - a.avg);

  const strengthLabels: Record<string, string> = {
    clarity: "Clear, concise communication",
    completeness: "Thorough and complete answers",
    structure: "Well-structured responses (STAR method)",
    confidence: "Confident, action-oriented language",
  };

  const improvementLabels: Record<string, string> = {
    clarity: "Work on reducing filler words and improving conciseness",
    completeness: "Provide more detail and relevant examples",
    structure: "Use the STAR method to structure your answers",
    confidence: "Use more specific examples with measurable outcomes",
  };

  return {
    strengths: sorted.slice(0, 2).filter((d) => d.avg >= 50).map((d) => strengthLabels[d.dim]),
    improvements: sorted
      .slice(-2)
      .reverse()
      .filter((d) => d.avg < 75)
      .map((d) => improvementLabels[d.dim]),
  };
}

export default function AnalysisPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<MultiStageInterview | null>(null);
  const [aiSummary, setAiSummary] = useState<{ recommendation: string; strengths: string[]; improvements: string[] } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [emotionSummary, setEmotionSummary] = useState<ReturnType<typeof generateEmotionSummary> | null>(null);

  useEffect(() => {
    if (!interviewId) { navigate("/dashboard"); return; }
    const iv = getInterview(interviewId);
    if (!iv) { navigate("/dashboard"); return; }
    setInterview(iv);

    // Collect all emotion snapshots across every stage answer
    const emotionSnapshots: EmotionSnapshot[] = [];
    for (const stageData of Object.values(iv.stages)) {
      if (!stageData?.answers) continue;
      for (const answer of stageData.answers) {
        if (answer.emotionData) emotionSnapshots.push(answer.emotionData);
      }
    }
    setEmotionSummary(generateEmotionSummary(emotionSnapshots));

    // Generate AI coaching summary from the first answered question of each stage
    const allAnswers: Array<{ question: string; answer: string; category: string }> = [];
    for (const stageData of Object.values(iv.stages)) {
      if (!stageData?.answers?.length) continue;
      const a = stageData.answers[0];
      const q = stageData.questions.find(q => q.id === a.questionId);
      if (q && a.text && a.text !== "(No answer provided)") {
        allAnswers.push({ question: q.text, answer: a.text, category: q.type });
      }
    }

    if (allAnswers.length > 0) {
      const sample = allAnswers[0];
      setLoadingAI(true);
      analyzeInterviewAnswer({
        question: sample.question,
        answer: sample.answer,
        category: sample.category,
        role: iv.role,
      }).then((result) => {
        setAiSummary({
          recommendation: result.recommendation,
          strengths: result.strengths,
          improvements: result.improvements,
        });
      }).catch(() => {
        // silently fail — heuristic summary will still show
      }).finally(() => setLoadingAI(false));
    }
  }, [interviewId, navigate]);

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const stages = getStagesForType(interview.role, interview.type);
  const { strengths, improvements } = computeStrengthsAndImprovements(interview);
  const score = interview.overallScore ?? 0;
  const verdict = interview.overallVerdict ?? "Marginal";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold font-display">Interview Analysis</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/interview/report/${interviewId}`)}>
              <FileText className="h-4 w-4" /> Full Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Overall score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 shadow-elevated text-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                  score >= 70
                    ? "bg-emerald-100 text-emerald-700"
                    : score >= 45
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {score}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display">
                  {interview.role} Interview — {interview.company}
                </h2>
                <p className="text-muted-foreground mt-1">{interview.type}</p>
              </div>
              <VerdictBadge verdict={verdict} />
            </div>
          </Card>
        </motion.div>

        {/* Strengths + improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 h-full border-emerald-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold">Top Strengths</h3>
              </div>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Complete more answers to see strengths.</p>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Card className="p-5 h-full border-amber-200/50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold">Areas to Improve</h3>
              </div>
              {improvements.length > 0 ? (
                <ul className="space-y-2">
                  {improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {imp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Strong performance across all dimensions!</p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* AI Coaching Summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 shadow-card bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold font-display">AI Coach Summary</h3>
            </div>
            {loadingAI ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Generating personalized coaching insights…
              </div>
            ) : aiSummary ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  {aiSummary.recommendation}
                </p>
                {aiSummary.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 mb-1">Standout strengths</p>
                    <ul className="space-y-1">
                      {aiSummary.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiSummary.improvements.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-700 mb-1">Focus areas for next time</p>
                    <ul className="space-y-1">
                      {aiSummary.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                          <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" />{imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete interview answers to receive personalized AI coaching insights.
              </p>
            )}
          </Card>
        </motion.div>

        {/* Emotion & Presentation Analysis */}
        {emotionSummary && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <EmotionInsights summary={emotionSummary} />
          </motion.div>
        )}

        {/* Stage breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display">Stage Breakdown</h3>
          {stages.map((stage) => {
            const stageData = interview.stages[stage];
            if (!stageData) return null;

            const questions = stageData.questions.map((q) => ({ id: q.id, text: q.text }));

            return (
              <StageSection
                key={stage}
                stageName={getStageName(stage)}
                stageData={stageData}
                questions={questions}
              />
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button variant="hero" onClick={() => navigate(`/interview/report/${interviewId}`)}>
            <FileText className="h-4 w-4" /> View Full Report
          </Button>
          <Button variant="outline" onClick={() => navigate("/interview/setup")}>
            <RotateCcw className="h-4 w-4" /> Practice Again
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/learning">
              <BookOpen className="h-4 w-4" /> Learning Hub
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
