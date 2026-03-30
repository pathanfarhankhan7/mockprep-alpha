import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getInterviewHistory, getPerformanceByCategory, signOut, type InterviewSession, type PerformanceData } from "@/lib/api";
import { getAllInterviews } from "@/lib/interview-service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, Play, BarChart3, LogOut, Clock, Trophy, TrendingUp, Target, BookOpen, Sparkles, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-stage interviews from localStorage
  const localInterviews = getAllInterviews().filter(iv => iv.completedAt).slice(0, 5);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [h, p] = await Promise.all([getInterviewHistory(), getPerformanceByCategory()]);
      setHistory(h);
      setPerformance(p);
    } catch {
      // New user, no data yet
    } finally {
      setLoading(false);
    }
  }

  const avgScore = history.filter(h => h.total_score !== null).length > 0
    ? Math.round(history.filter(h => h.total_score !== null).reduce((s, h) => s + (h.total_score || 0), 0) / history.filter(h => h.total_score !== null).length)
    : 0;

  const weakAreas = [...performance].sort((a, b) => a.avg_score - b.avg_score).slice(0, 3);
  const completedSessions = history.filter(h => h.completed_at).length;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display">MockPrep AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/learning")}>
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome + CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">{greeting}, {firstName} 👋</h1>
            <p className="text-muted-foreground">Ready to ace your next interview?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" size="lg" onClick={() => navigate("/interview/setup")}>
              <Play className="h-5 w-5" /> Start Interview
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/learning")}>
              <BookOpen className="h-5 w-5" /> Learning Hub
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/progress")}>
              <BarChart3 className="h-5 w-5" /> Progress
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/ai-coach")}>
              <Sparkles className="h-5 w-5" /> AI Coach
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Trophy, label: "Avg Score", value: `${avgScore}%`, color: "text-primary" },
            { icon: Clock, label: "Sessions", value: completedSessions, color: "text-info" },
            { icon: TrendingUp, label: "Categories", value: performance.length, color: "text-accent" },
            { icon: Target, label: "Questions", value: performance.reduce((s, p) => s + p.total_questions, 0), color: "text-warning" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        {performance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Performance by Category
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
                  <Bar dataKey="avg_score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold font-display mb-4">Skill Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={performance}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="avg_score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold font-display mb-4">Areas to Improve</h3>
            <div className="space-y-3">
              {weakAreas.map(area => (
                <div key={area.category} className="flex items-center justify-between">
                  <span className="font-medium">{area.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${area.avg_score}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right">{area.avg_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Multi-stage interview history from localStorage */}
        {localInterviews.length > 0 && (
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-display flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" /> Recent AI Interviews
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/interview/history")}>
                <History className="h-4 w-4 mr-1" /> View All
              </Button>
            </div>
            <div className="space-y-3">
              {localInterviews.map((iv) => (
                <div
                  key={iv.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/interview/analysis/${iv.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{iv.role} — {iv.company}</p>
                      <p className="text-xs text-muted-foreground">{iv.type} · {new Date(iv.startedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {iv.overallScore !== undefined && (
                      <span className={`text-lg font-bold font-display ${iv.overallScore >= 70 ? "text-emerald-600" : iv.overallScore >= 45 ? "text-amber-600" : "text-destructive"}`}>
                        {iv.overallScore}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">View →</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* History */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold font-display mb-4">Interview History</h3>
          {history.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold font-display">No interviews yet</p>
                <p className="text-muted-foreground text-sm mt-1">Start your first mock interview to track your progress</p>
              </div>
              <Button variant="hero" onClick={() => navigate("/interview/setup")}>
                <Play className="h-4 w-4" /> Start First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map(session => (
                <Link
                  key={session.id}
                  to={session.completed_at ? `/interview/result/${session.id}` : "#"}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{session.role}</p>
                    <p className="text-sm text-muted-foreground">{new Date(session.started_at).toLocaleDateString()}</p>
                  </div>
                  {session.total_score !== null ? (
                    <span className={`text-lg font-bold font-display ${session.total_score >= 80 ? "text-success" : session.total_score >= 60 ? "text-primary" : session.total_score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {session.total_score}%
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">In progress</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
