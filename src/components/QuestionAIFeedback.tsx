import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Bot,
  Lightbulb,
  Copy,
  Check,
} from "lucide-react";
import type { AIAnalysisResult } from "@/lib/ai-service";

interface QuestionAIFeedbackProps {
  result: AIAnalysisResult;
  questionText: string;
  onContinue: () => void;
  continueLabel?: string;
}

const METRICS: { key: keyof AIAnalysisResult["scores"]; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "completeness", label: "Completeness" },
  { key: "confidence", label: "Confidence" },
  { key: "relevance", label: "Relevance" },
];

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-destructive";
}

function scoreBg(score: number) {
  if (score >= 75) return "bg-emerald-50 border-emerald-200";
  if (score >= 50) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export default function QuestionAIFeedback({
  result,
  questionText,
  onContinue,
  continueLabel = "Continue",
}: QuestionAIFeedbackProps) {
  const { scores, strengths, improvements, recommendation } = result;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      `Question: ${questionText}`,
      `Overall Score: ${scores.overall}/100`,
      `Clarity: ${scores.clarity} | Completeness: ${scores.completeness} | Confidence: ${scores.confidence} | Relevance: ${scores.relevance}`,
      strengths.length > 0 ? `\nStrengths:\n${strengths.map(s => `• ${s}`).join("\n")}` : "",
      improvements.length > 0 ? `\nImprovements:\n${improvements.map(i => `• ${i}`).join("\n")}` : "",
      `\nCoach Tip: ${recommendation}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-bold font-display text-base">AI Coach Feedback</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{questionText}</p>
        </div>
        {result.modelUsed === "openai" && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
            <Bot className="h-3 w-3" /> GPT-4o
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-1"
          onClick={handleCopy}
          title="Copy feedback"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Overall score */}
      <Card className={`p-4 border ${scoreBg(scores.overall)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Overall Score</p>
            <p className={`text-4xl font-bold font-display ${scoreColor(scores.overall)}`}>
              {scores.overall}
              <span className="text-xl">/100</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {METRICS.map((m) => (
              <div key={m.key} className="min-w-[100px]">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className={`font-semibold ${scoreColor(scores[m.key])}`}>
                    {scores[m.key]}
                  </span>
                </div>
                <Progress value={scores[m.key]} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Strengths + improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {strengths.length > 0 && (
          <Card className="p-4 border-emerald-200 bg-emerald-50/60">
            <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> What You Did Well
            </p>
            <ul className="space-y-1.5">
              {strengths.slice(0, 2).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        )}
        {improvements.length > 0 && (
          <Card className="p-4 border-amber-200 bg-amber-50/60">
            <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Areas to Improve
            </p>
            <ul className="space-y-1.5">
              {improvements.slice(0, 2).map((imp, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                  {imp}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Coach tip */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
          <Lightbulb className="h-3.5 w-3.5" /> Coach Tip
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{recommendation}</p>
      </Card>

      {/* Continue */}
      <Button variant="hero" size="lg" className="w-full" onClick={onContinue}>
        {continueLabel} <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
