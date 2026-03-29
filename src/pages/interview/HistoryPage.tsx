import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";
import { getAllInterviews, type MultiStageInterview, type Verdict } from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";

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

function InterviewCard({ interview }: { interview: MultiStageInterview }) {
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
        </div>
      </div>
    </Card>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<MultiStageInterview[]>([]);

  useEffect(() => {
    setInterviews(getAllInterviews());
  }, []);

  const completed = interviews.filter((i) => i.status === "completed");
  const inProgress = interviews.filter((i) => i.status === "in-progress");

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
                <InterviewCard interview={iv} />
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
                <InterviewCard interview={iv} />
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
