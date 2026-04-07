import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Smile, AlertCircle, Zap, HelpCircle, Wind, TrendingUp } from "lucide-react";
import type { EmotionSummary, EmotionLabel } from "@/lib/emotion-service";
import { EMOTION_LABELS } from "@/lib/emotion-service";

const EMOTION_COLORS: Record<EmotionLabel, { bar: string; text: string; bg: string }> = {
  confident: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-100" },
  nervous:   { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-100" },
  engaged:   { bar: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-100" },
  uncertain: { bar: "bg-orange-400",  text: "text-orange-700",  bg: "bg-orange-100" },
  calm:      { bar: "bg-violet-400",  text: "text-violet-700",  bg: "bg-violet-100" },
};

const EMOTION_ICONS: Record<EmotionLabel, React.ElementType> = {
  confident: Zap,
  nervous:   AlertCircle,
  engaged:   Smile,
  uncertain: HelpCircle,
  calm:      Wind,
};

function EmotionBar({ label, value, delay }: { label: EmotionLabel; value: number; delay: number }) {
  const colors = EMOTION_COLORS[label];
  const Icon = EMOTION_ICONS[label];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
          {EMOTION_LABELS[label]}
        </span>
        <span className={`font-semibold text-sm ${colors.text}`}>{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

interface EmotionInsightsProps {
  summary: EmotionSummary;
}

export default function EmotionInsights({ summary }: EmotionInsightsProps) {
  const { dominant, breakdown, insights, overallConfidenceScore } = summary;
  const dominantColors = EMOTION_COLORS[dominant];
  const DominantIcon = EMOTION_ICONS[dominant];

  const scoreColor =
    overallConfidenceScore >= 65
      ? "text-emerald-700 bg-emerald-100"
      : overallConfidenceScore >= 40
      ? "text-amber-700 bg-amber-100"
      : "text-red-700 bg-red-100";

  const sortedEmotions = (Object.keys(breakdown) as EmotionLabel[]).sort(
    (a, b) => breakdown[b] - breakdown[a],
  );

  return (
    <Card className="p-5 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold font-display">Emotion &amp; Presentation Analysis</h3>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${scoreColor}`}>
          {overallConfidenceScore}/100
        </span>
      </div>

      {/* Dominant emotion badge */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${dominantColors.bg}`}>
        <DominantIcon className={`h-5 w-5 ${dominantColors.text} flex-shrink-0`} />
        <div>
          <p className={`text-sm font-semibold ${dominantColors.text}`}>
            Dominant presence: {EMOTION_LABELS[dominant]}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on your answer language{" "}
            {breakdown[dominant]}% of signals matched this emotion
          </p>
        </div>
      </div>

      {/* Emotion breakdown bars */}
      <div className="space-y-2.5">
        {sortedEmotions.map((emotion, i) => (
          <EmotionBar
            key={emotion}
            label={emotion}
            value={breakdown[emotion]}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Coaching Insights
          </p>
          <ul className="space-y-1.5">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
