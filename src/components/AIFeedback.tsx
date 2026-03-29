import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp, Sparkles, Bot } from "lucide-react";
import { type AnalysisWithTips } from "@/lib/interview-analyzer";
import { getScoreLabel, getScoreColor, getScoreBgColor } from "@/lib/interview-analyzer";
import TipCard from "./TipCard";
import { cn } from "@/lib/utils";

interface AIFeedbackProps {
  result: AnalysisWithTips;
  question?: string;
}

const SCORE_METRICS = [
  { key: "clarity" as const, label: "Clarity", description: "How clear and structured your answer is" },
  { key: "completeness" as const, label: "Completeness", description: "How thoroughly you answered the question" },
  { key: "relevance" as const, label: "Relevance", description: "How directly you addressed what was asked" },
  { key: "confidence" as const, label: "Confidence", description: "How assertive and confident your delivery sounds" },
];

export default function AIFeedback({ result, question }: AIFeedbackProps) {
  const { scores, strengths, improvements, recommendation, detailedFeedback, suggestedTips, modelUsed } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold font-display">AI Feedback</h3>
          {modelUsed === "mock" && (
            <Badge variant="outline" className="text-xs text-muted-foreground ml-auto">
              <Bot className="h-3 w-3 mr-1" /> Smart Analysis
            </Badge>
          )}
        </div>
        {question && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">Question: </span>{question}
          </p>
        )}
      </motion.div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className={cn("p-6 text-center border", getScoreBgColor(scores.overall))}>
          <p className="text-sm font-medium text-muted-foreground mb-1">Overall Score</p>
          <div className={cn("text-5xl font-bold font-display mb-2", getScoreColor(scores.overall))}>
            {scores.overall}
            <span className="text-2xl">/100</span>
          </div>
          <Badge className={cn("text-sm font-semibold", getScoreBgColor(scores.overall))}>
            {getScoreLabel(scores.overall)}
          </Badge>
        </Card>
      </motion.div>

      {/* Metric Scores */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5 shadow-card">
          <h4 className="font-semibold font-display mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Score Breakdown
          </h4>
          <div className="space-y-4">
            {SCORE_METRICS.map(metric => (
              <div key={metric.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium">{metric.label}</span>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <span className={cn("text-sm font-bold font-display ml-2", getScoreColor(scores[metric.key]))}>
                    {scores[metric.key]}
                  </span>
                </div>
                <Progress value={scores[metric.key]} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Detailed Feedback */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5 shadow-card">
          <h4 className="font-semibold font-display mb-3 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" /> Analysis
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{detailedFeedback}</p>
        </Card>
      </motion.div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5 shadow-card border-emerald-200 bg-emerald-50/50">
            <h4 className="font-semibold font-display mb-3 flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-4 w-4" /> Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5 shadow-card border-amber-200 bg-amber-50/50">
            <h4 className="font-semibold font-display mb-3 flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4" /> Areas to Improve
            </h4>
            <ul className="space-y-2">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                  {imp}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Recommendation */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="p-5 shadow-card bg-primary/5 border-primary/20">
          <h4 className="font-semibold font-display mb-2 flex items-center gap-2 text-primary">
            <Lightbulb className="h-4 w-4" /> Coach Recommendation
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{recommendation}</p>
        </Card>
      </motion.div>

      {/* Suggested Tips */}
      {suggestedTips.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h4 className="font-semibold font-display mb-3">Recommended Learning</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedTips.map(tip => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
