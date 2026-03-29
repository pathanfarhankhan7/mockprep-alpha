import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Brain, ArrowLeft, Trophy, Target, TrendingUp, Clock,
  Play, BookOpen, ArrowRight, BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import ProgressChart from "@/components/ProgressChart";
import { toast } from "sonner";
import { signOut } from "@/lib/api";

export default function ProgressDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, loading, error } = useProgress();

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
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold font-display">Progress Analytics</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Track your interview journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-display">Your Progress</h1>
          <p className="text-muted-foreground">Comprehensive view of your interview performance over time.</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">{error}</p>
          </Card>
        ) : !stats || stats.totalSessions === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold font-display mb-2">No data yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Complete your first interview to start tracking your progress and seeing personalized analytics.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" onClick={() => navigate("/interview/start")}>
                <Play className="h-4 w-4" /> Start First Interview
              </Button>
              <Button variant="outline" onClick={() => navigate("/learning")}>
                <BookOpen className="h-4 w-4" /> Browse Tips First
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Trophy,
                  label: "Average Score",
                  value: `${stats.averageScore}%`,
                  color: "text-primary",
                  sub: `Best: ${stats.bestScore}%`,
                },
                {
                  icon: Clock,
                  label: "Sessions",
                  value: stats.completedSessions,
                  color: "text-info",
                  sub: `${stats.totalSessions} total`,
                },
                {
                  icon: Target,
                  label: "Questions",
                  value: stats.totalQuestions,
                  color: "text-warning",
                  sub: "answered",
                },
                {
                  icon: TrendingUp,
                  label: "Top Category",
                  value: stats.mostImprovedCategory ?? "—",
                  color: "text-success",
                  sub: "highest score",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-5 shadow-card">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold font-display leading-none">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <ProgressChart stats={stats} />
            </motion.div>

            {/* Weak areas */}
            {stats.categoryPerformance.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-display">Category Breakdown</h3>
                    <Button variant="outline" size="sm" onClick={() => navigate("/learning")}>
                      Browse Tips <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[...stats.categoryPerformance]
                      .sort((a, b) => a.avg_score - b.avg_score)
                      .map(area => (
                        <div key={area.category} className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{area.category}</span>
                              <span className="text-sm font-bold font-display text-muted-foreground">
                                {area.avg_score}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full gradient-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${area.avg_score}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {area.total_questions} questions answered
                            </p>
                          </div>
                          <Link to={`/learning/category/${area.category}`}>
                            <Button variant="ghost" size="sm" className="text-xs shrink-0">
                              Study <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="hero" size="lg" className="flex-1" onClick={() => navigate("/interview/start")}>
                <Play className="h-5 w-5" /> Start New Interview
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/learning")}>
                <BookOpen className="h-5 w-5" /> Learning Hub
              </Button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
