import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, BookOpen } from "lucide-react";
import { type InterviewTip, CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/data-seed";
import { cn } from "@/lib/utils";

interface TipCardProps {
  tip: InterviewTip;
  className?: string;
}

export default function TipCard({ tip, className }: TipCardProps) {
  return (
    <Link to={`/learning/${tip.id}`}>
      <Card
        className={cn(
          "p-5 shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col",
          className
        )}
      >
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className={cn("text-xs font-medium", CATEGORY_COLORS[tip.category])}>
            {tip.category}
          </Badge>
          <Badge className={cn("text-xs font-medium", DIFFICULTY_COLORS[tip.difficulty])}>
            {tip.difficulty}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold font-display text-base leading-snug mb-2 line-clamp-2">
          {tip.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
          {tip.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {tip.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {tip.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {tip.keyPoints.length} tips
          </span>
        </div>
      </Card>
    </Link>
  );
}
