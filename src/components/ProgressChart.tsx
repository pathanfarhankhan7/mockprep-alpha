import { Card } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { type ProgressStats } from "@/hooks/useProgress";
import { BarChart3, TrendingUp } from "lucide-react";

interface ProgressChartProps {
  stats: ProgressStats;
}

export default function ProgressChart({ stats }: ProgressChartProps) {
  const { scoreHistory, categoryPerformance } = stats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Trend */}
      {scoreHistory.length > 1 && (
        <Card className="p-6 shadow-card">
          <h3 className="text-base font-semibold font-display mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category Performance Bar */}
      {categoryPerformance.length > 0 && (
        <Card className="p-6 shadow-card">
          <h3 className="text-base font-semibold font-display mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Performance by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="avg_score" name="Avg Score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Radar Chart */}
      {categoryPerformance.length > 2 && (
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="text-base font-semibold font-display mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={categoryPerformance}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar
                dataKey="avg_score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
