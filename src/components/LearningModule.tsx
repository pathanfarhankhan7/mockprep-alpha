import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { type InterviewTip, CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/data-seed";
import { cn } from "@/lib/utils";

interface LearningModuleProps {
  tip: InterviewTip;
}

export default function LearningModule({ tip }: LearningModuleProps) {
  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("text-xs font-medium", CATEGORY_COLORS[tip.category])}>
          {tip.category}
        </Badge>
        <Badge className={cn("text-xs font-medium", DIFFICULTY_COLORS[tip.difficulty])}>
          {tip.difficulty}
        </Badge>
      </div>

      {/* Main content (markdown) */}
      <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
        {tip.content.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <h4 key={i} className="font-semibold text-base mt-4 mb-1">
                {line.replace(/\*\*/g, "")}
              </h4>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-4 text-muted-foreground">
                {line.slice(2)}
              </li>
            );
          }
          if (line.trim() === "") return <br key={i} />;
          return (
            <p key={i} className="text-muted-foreground">
              {line}
            </p>
          );
        })}
      </div>

      {/* Key Points */}
      <Card className="p-5 bg-primary/5 border-primary/20 shadow-none">
        <h4 className="font-semibold font-display mb-3 flex items-center gap-2 text-primary">
          <CheckCircle className="h-4 w-4" /> Key Takeaways
        </h4>
        <ul className="space-y-2">
          {tip.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Example */}
      {tip.example && (
        <Card className="p-5 bg-muted/50 shadow-none">
          <h4 className="font-semibold font-display mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Example
          </h4>
          <div className="text-sm text-foreground space-y-1">
            {tip.example.split("\n").map((line, i) => (
              line.trim() === "" ? <br key={i} /> : (
                <p key={i} className={line.startsWith("**") ? "font-semibold" : "text-muted-foreground"}>
                  {line.replace(/\*\*/g, "")}
                </p>
              )
            ))}
          </div>
        </Card>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tip.tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
