import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, AlertTriangle, Code, Send } from "lucide-react";
import { toast } from "sonner";
import {
  getInterview,
  saveAnswer,
  completeStage,
  completeInterview,
  getStageRoute,
} from "@/lib/interview-service";
import { getStageName, getStagesForType, ROLE_CONFIGS } from "@/lib/interview-data";
import { useTimer, formatTime } from "@/hooks/useTimer";
import type { MultiStageInterview, StageType } from "@/lib/interview-service";

const STAGE: StageType = "technical";

function TimeBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = (timeLeft / total) * 100;
  const isWarning = timeLeft <= 600; // 10 min
  const isCritical = timeLeft <= 300; // 5 min

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className={`font-mono font-bold text-lg ${isCritical ? "text-destructive" : isWarning ? "text-amber-600" : "text-foreground"}`}>
          {formatTime(timeLeft)} remaining
        </span>
        {isWarning && (
          <span className={`flex items-center gap-1 text-xs ${isCritical ? "text-destructive" : "text-amber-600"}`}>
            <AlertTriangle className="h-3 w-3" />
            {isCritical ? "Final 5 minutes!" : "10 minutes left"}
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${
            isCritical ? "bg-destructive" : isWarning ? "bg-amber-500" : "bg-primary"
          }`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

export default function TechnicalPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interviewId = searchParams.get("id") ?? "";

  const [interview, setInterview] = useState<MultiStageInterview | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [warned10, setWarned10] = useState(false);
  const [warned5, setWarned5] = useState(false);
  const answerRef = useRef(answer);
  answerRef.current = answer;

  const stageData = interview?.stages[STAGE];
  const question = stageData?.questions[0];
  const timeLimit = question?.timeLimit ?? 2700;
  const isCodingRole = interview ? ["SWE", "DevOps"].includes(interview.role) : false;

  const handleTimeExpire = useCallback(() => {
    toast.error("Time is up! Submitting your solution...");
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { timeLeft, start, reset } = useTimer(timeLimit, handleTimeExpire);

  useEffect(() => {
    if (!interviewId) { navigate("/interview/setup"); return; }
    const iv = getInterview(interviewId);
    if (!iv || !iv.stages[STAGE]) { navigate("/interview/setup"); return; }
    setInterview(iv);
  }, [interviewId, navigate]);

  useEffect(() => {
    if (question) {
      reset(question.timeLimit);
      setTimeout(() => start(), 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  useEffect(() => {
    if (timeLeft <= 600 && timeLeft > 599 && !warned10) {
      toast.warning("10 minutes remaining!", { icon: <AlertTriangle className="h-4 w-4" /> });
      setWarned10(true);
    }
    if (timeLeft <= 300 && timeLeft > 299 && !warned5) {
      toast.error("5 minutes remaining — wrap up!", { icon: <AlertTriangle className="h-4 w-4" /> });
      setWarned5(true);
    }
  }, [timeLeft, warned10, warned5]);

  const handleSubmit = useCallback(() => {
    if (!interview || !question || submitting) return;
    setSubmitting(true);

    const timeUsed = timeLimit - timeLeft;
    const finalAnswer = answerRef.current.trim() || "(No solution provided)";

    saveAnswer(interviewId, STAGE, 0, finalAnswer, timeUsed);
    const withStage = completeStage(interviewId, STAGE);
    if (!withStage) { setSubmitting(false); return; }

    const stages = getStagesForType(withStage.role, withStage.type);
    const currentIdx = stages.indexOf(STAGE);
    const nextStage = stages[currentIdx + 1] as StageType | undefined;

    if (nextStage) {
      navigate(`${getStageRoute(nextStage)}?id=${interviewId}`);
    } else {
      completeInterview(interviewId);
      navigate(`/interview/analysis/${interviewId}`);
    }
    setSubmitting(false);
  }, [interview, interviewId, question, submitting, timeLeft, timeLimit, navigate]);

  if (!interview || !question) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const config = ROLE_CONFIGS[interview.role];
  const allStages = getStagesForType(interview.role, interview.type);
  const stagePosition = allStages.indexOf(STAGE) + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold font-display text-sm">{getStageName(STAGE)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  Stage {stagePosition}/{allStages.length}
                </span>
              </div>
            </div>
            <span className="text-sm font-medium">{interview.role} — {interview.company}</span>
          </div>
          <TimeBar timeLeft={timeLeft} total={timeLimit} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl flex-1 flex flex-col gap-6">
        {/* Problem statement */}
        <Card className="p-6 shadow-elevated">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-bold font-display text-lg">
              {isCodingRole ? "Coding Challenge" : "Case Study"}
            </h2>
          </div>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
            {question.text}
          </pre>

          {config.technicalChallenge.examples && (
            <div className="mt-4 p-4 rounded-lg bg-muted/60 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Examples / Context
              </p>
              <pre className="whitespace-pre-wrap text-xs font-mono text-foreground">
                {config.technicalChallenge.examples}
              </pre>
            </div>
          )}

          {question.hint && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Hint:</span> {question.hint}
              </p>
            </div>
          )}
        </Card>

        {/* Answer area */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              {isCodingRole ? "Your Solution" : "Your Response"}
            </h3>
            {isCodingRole && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                Monospace editor
              </span>
            )}
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              isCodingRole
                ? "// Write your solution here...\n// Include time and space complexity analysis"
                : "Write your detailed response here. Structure your answer clearly with headings and bullet points as needed."
            }
            className={`flex-1 min-h-[320px] resize-none text-sm leading-relaxed ${
              isCodingRole ? "font-mono" : "font-body"
            }`}
          />

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || !answer.trim()}
          >
            <Send className="h-5 w-5" />
            {submitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </div>
      </main>
    </div>
  );
}
