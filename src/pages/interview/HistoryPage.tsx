import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  ArrowLeft,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Calendar,
  Search,
  Trash2,
} from "lucide-react";
import { clearCompletedInterviews, deleteInterview, getAllInterviews, type MultiStageInterview, type Verdict } from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";
import { toast } from "sonner";

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === "Pass") {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Pass
      </span>
    );
  }
  if (verdict === "Marginal") {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <MinusCircle className="h-3 w-3" /> Marginal
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <XCircle className="h-3 w-3" /> Needs Work
    </span>
  );
}

function InterviewCard({
  interview,
  onDelete,
}: {
  interview: MultiStageInterview;
  onDelete: (interview: MultiStageInterview) => void;
}) {
  const navigate = useNavigate();
  const stages = getStagesForType(interview.role, interview.type);
  const date = new Date(interview.startedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const completedStages = stages.filter((s) => interview.stages[s]?.completedAt).length;

  return (
    <Card className="p-5 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold font-display">{interview.role}</h3>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {interview.company}
            </span>
            {interview.overallVerdict && (
              <VerdictBadge verdict={interview.overallVerdict} />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{interview.type}</p>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {completedStages}/{stages.length} stages
            </span>
          </div>

          {/* Stage progress pills */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {stages.map((stage) => {
              const stageData = interview.stages[stage];
              const done = !!stageData?.completedAt;
              return (
                <span
                  key={stage}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getStageName(stage)}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {interview.overallScore !== undefined && (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                interview.overallScore >= 70
                  ? "bg-emerald-100 text-emerald-700"
                  : interview.overallScore >= 45
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {interview.overallScore}
            </div>
          )}
          {interview.status === "completed" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/interview/analysis/${interview.id}`)}
            >
              <FileText className="h-3.5 w-3.5" /> View
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const stages = getStagesForType(interview.role, interview.type);
                // resume at current stage
                const currentStage = interview.currentStage;
                const routes: Record<string, string> = {
                  "phone-screen": "/interview/phone-screen",
                  technical: "/interview/technical",
                  "deep-dive": "/interview/deep-dive",
                  hr: "/interview/hr",
                };
                navigate(`${routes[currentStage] ?? "/interview/setup"}?id=${interview.id}`);
              }}
            >
              <Play className="h-3.5 w-3.5" /> Resume
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(interview);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<MultiStageInterview[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score">("newest");

  const loadInterviews = () => {
    setInterviews(getAllInterviews());
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const visibleInterviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = interviews.filter((interview) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        interview.role.toLowerCase().includes(normalizedQuery) ||
        interview.company.toLowerCase().includes(normalizedQuery) ||
        interview.type.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || interview.status === statusFilter;

      return matchesQuery && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
      }
      if (sortBy === "score") {
        return (b.overallScore ?? -1) - (a.overallScore ?? -1);
      }
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });
  }, [interviews, query, statusFilter, sortBy]);

  const completed = visibleInterviews.filter((i) => i.status === "completed");
  const inProgress = visibleInterviews.filter((i) => i.status === "in-progress");
  const completedTotal = interviews.filter((i) => i.status === "completed").length;
  const scoredInterviews = interviews.filter((i) => typeof i.overallScore === "number");
  const averageScore = scoredInterviews.length > 0
    ? Math.round(scoredInterviews.reduce((sum, i) => sum + (i.overallScore ?? 0), 0) / scoredInterviews.length)
    : null;

  const handleDeleteInterview = (interview: MultiStageInterview) => {
    const ok = window.confirm(`Delete interview for ${interview.role} at ${interview.company}?`);
    if (!ok) return;

    const removed = deleteInterview(interview.id);
    if (!removed) {
      toast.error("Could not delete interview.");
      return;
    }

    toast.success("Interview deleted.");
    loadInterviews();
  };

  const handleClearCompleted = () => {
    const ok = window.confirm("Delete all completed interviews?");
    if (!ok) return;

    const removedCount = clearCompletedInterviews();
    if (removedCount === 0) {
      toast.message("No completed interviews to clear.");
      return;
    }

    toast.success(`Deleted ${removedCount} completed interview${removedCount > 1 ? "s" : ""}.`);
    loadInterviews();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold font-display">Interview History</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {interviews.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold font-display">{interviews.length}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold font-display">{interviews.filter((i) => i.status === "in-progress").length}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold font-display">{completedTotal}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-xl font-bold font-display">{averageScore !== null ? `${averageScore}%` : "—"}</p>
              </Card>
            </div>

            <Card className="p-4 space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by role, company, or interview type..."
                  className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-md border border-input p-1">
                  {(["all", "in-progress", "completed"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs rounded-sm capitalize transition-colors ${statusFilter === status ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {status.replace("-", " ")}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "newest" | "oldest" | "score")}
                  className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="score">Top score first</option>
                </select>
                {completedTotal > 0 && (
                  <Button variant="outline" size="sm" className="ml-auto text-destructive hover:text-destructive" onClick={handleClearCompleted}>
                    <Trash2 className="h-3.5 w-3.5" /> Clear Completed
                  </Button>
                )}
              </div>
            </Card>
          </>
        )}

        {interviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold font-display mb-2">No interviews yet</h2>
            <p className="text-muted-foreground mb-6">
              Start your first multi-stage mock interview to see your history here.
            </p>
            <Button variant="hero" onClick={() => navigate("/interview/setup")}>
              <Play className="h-4 w-4" /> Start Interview
            </Button>
          </motion.div>
        )}

        {visibleInterviews.length === 0 && interviews.length > 0 && (
          <Card className="p-8 text-center">
            <p className="font-semibold font-display">No interviews match your filters</p>
            <p className="text-sm text-muted-foreground mt-1">Try changing your search text, status, or sort order.</p>
          </Card>
        )}

        {inProgress.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-amber-600">In Progress</h2>
            {inProgress.map((iv, i) => (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <InterviewCard interview={iv} onDelete={handleDeleteInterview} />
              </motion.div>
            ))}
          </section>
        )}

        {completed.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display">Completed ({completed.length})</h2>
            {completed.map((iv, i) => (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <InterviewCard interview={iv} onDelete={handleDeleteInterview} />
              </motion.div>
            ))}
          </section>
        )}

        <div className="pt-4">
          <Button variant="hero" onClick={() => navigate("/interview/setup")}>
            <Play className="h-4 w-4" /> New Interview
          </Button>
        </div>
      </main>
    </div>
  );
}
