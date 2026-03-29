import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Mic, MicOff, Heart, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  getInterview,
  saveAnswer,
  completeStage,
  completeInterview,
} from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";
import { useTimer, formatTime } from "@/hooks/useTimer";
import type { MultiStageInterview, StageType } from "@/lib/interview-service";

const STAGE: StageType = "hr";

function SoftTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = (timeLeft / total) * 100;
  const isLow = timeLeft <= 30;

  return (
    <div className="flex items-center gap-3">
      <span className={`font-mono text-sm ${isLow ? "text-amber-600 font-bold" : "text-muted-foreground"}`}>
        {formatTime(timeLeft)}
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

export default function HRPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interviewId = searchParams.get("id") ?? "";

  const [interview, setInterview] = useState<MultiStageInterview | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const answerRef = useRef(answer);
  answerRef.current = answer;

  const stageData = interview?.stages[STAGE];
  const questions = stageData?.questions ?? [];
  const currentQuestion = questions[questionIndex];
  const timeLimit = currentQuestion?.timeLimit ?? 120;

  const handleTimeExpire = useCallback(() => {
    handleSubmitAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  const { timeLeft, start, reset } = useTimer(timeLimit, handleTimeExpire);

  useEffect(() => {
    if (!interviewId) { navigate("/interview/setup"); return; }
    const iv = getInterview(interviewId);
    if (!iv || !iv.stages[STAGE]) { navigate("/interview/setup"); return; }
    setInterview(iv);
  }, [interviewId, navigate]);

  useEffect(() => {
    if (currentQuestion) {
      reset(currentQuestion.timeLimit);
      setTimeout(() => start(), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, currentQuestion?.id]);

  const handleSubmitAnswer = useCallback(() => {
    if (!interview || !currentQuestion || submitting) return;
    setSubmitting(true);

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const timeUsed = (currentQuestion.timeLimit ?? 120) - timeLeft;
    const finalAnswer = answerRef.current.trim() || "(No answer provided)";
    const updated = saveAnswer(interviewId, STAGE, questionIndex, finalAnswer, timeUsed);

    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setAnswer("");
      setSubmitting(false);
      if (updated) setInterview(updated);
    } else {
      const withStage = completeStage(interviewId, STAGE);
      if (!withStage) { setSubmitting(false); return; }

      completeInterview(interviewId);
      navigate(`/interview/analysis/${interviewId}`);
      setSubmitting(false);
    }
  }, [interview, currentQuestion, interviewId, questionIndex, questions.length, submitting, timeLeft, isRecording, navigate]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Speech recognition not supported"); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setAnswer(t);
    };
    recognition.onerror = () => { setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  if (!interview || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const allStages = getStagesForType(interview.role, interview.type);
  const stagePosition = allStages.indexOf(STAGE) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold font-display text-sm">{getStageName(STAGE)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  Stage {stagePosition}/{allStages.length} · Final Round
                </span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {questionIndex + 1} / {questions.length}
            </span>
          </div>
          <SoftTimer timeLeft={timeLeft} total={timeLimit} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Relaxed header message */}
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">
                This is the final stage. Relax — just be yourself. ✨
              </p>
            </div>

            <Card className="p-6 shadow-elevated border-emerald-200/50">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 mb-3">
                HR Question
              </span>
              <h2 className="text-xl font-semibold font-display leading-relaxed">
                {currentQuestion.text}
              </h2>
              {currentQuestion.hint && (
                <p className="text-sm text-muted-foreground mt-3 border-l-2 border-emerald-300 pl-3">
                  💡 {currentQuestion.hint}
                </p>
              )}
            </Card>

            <AnimatePresence>
              {isRecording && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="p-3 border-emerald-200 bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <motion.div className="h-3 w-3 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                      <span className="text-sm font-medium text-emerald-700">Listening...</span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Share your thoughts openly and honestly..."
                  className="min-h-[180px] resize-none text-base pr-12"
                />
                <Button
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  className="absolute bottom-3 right-3"
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
                onClick={handleSubmitAnswer}
                disabled={submitting}
              >
                {submitting ? "Saving..." : questionIndex < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="h-5 w-5" /></>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Complete Interview & View Analysis
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
