import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Mic, MicOff, AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  getInterview,
  saveAnswer,
  completeStage,
  completeInterview,
  getStageRoute,
} from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";
import { useTimer, formatTime } from "@/hooks/useTimer";
import type { MultiStageInterview, StageType } from "@/lib/interview-service";

const STAGE: StageType = "phone-screen";

function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const dashOffset = circumference * (1 - progress);
  const isWarning = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute -rotate-90" width={96} height={96}>
        <circle cx={48} cy={48} r={radius} className="fill-none stroke-muted" strokeWidth={6} />
        <circle
          cx={48}
          cy={48}
          r={radius}
          className={`fill-none transition-all duration-1000 ${
            isCritical ? "stroke-destructive" : isWarning ? "stroke-amber-500" : "stroke-primary"
          }`}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`text-lg font-mono font-bold z-10 ${
          isCritical ? "text-destructive" : isWarning ? "text-amber-600" : "text-foreground"
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default function PhoneScreenPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interviewId = searchParams.get("id") ?? "";

  const [interview, setInterview] = useState<MultiStageInterview | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [warned, setWarned] = useState(false);
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

  const { timeLeft, isRunning, start, reset } = useTimer(timeLimit, handleTimeExpire);

  useEffect(() => {
    if (!interviewId) {
      navigate("/interview/setup");
      return;
    }
    const iv = getInterview(interviewId);
    if (!iv || !iv.stages[STAGE]) {
      navigate("/interview/setup");
      return;
    }
    setInterview(iv);
  }, [interviewId, navigate]);

  // Start timer on mount / question change
  useEffect(() => {
    if (currentQuestion) {
      reset(currentQuestion.timeLimit);
      setTimeout(() => start(), 300);
      setWarned(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, currentQuestion?.id]);

  // 30-second warning
  useEffect(() => {
    if (timeLeft === 30 && isRunning && !warned) {
      toast.warning("30 seconds remaining!", { icon: <AlertTriangle className="h-4 w-4" /> });
      setWarned(true);
    }
  }, [timeLeft, isRunning, warned]);

  const handleSubmitAnswer = useCallback(() => {
    if (!interview || !currentQuestion || submitting) return;

    const timeUsed = (currentQuestion.timeLimit ?? 120) - timeLeft;
    const finalAnswer = answerRef.current.trim() || "(No answer provided)";

    setSubmitting(true);

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const updated = saveAnswer(interviewId, STAGE, questionIndex, finalAnswer, timeUsed);

    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setAnswer("");
      setSubmitting(false);
      if (updated) setInterview(updated);
    } else {
      // Complete stage and navigate
      const withStage = completeStage(interviewId, STAGE);
      if (!withStage) { setSubmitting(false); return; }

      const stages = getStagesForType(withStage.role, withStage.type);
      const currentStageIdx = stages.indexOf(STAGE);
      const nextStage = stages[currentStageIdx + 1] as StageType | undefined;

      if (nextStage) {
        navigate(`${getStageRoute(nextStage)}?id=${interviewId}`);
      } else {
        completeInterview(interviewId);
        navigate(`/interview/analysis/${interviewId}`);
      }
      setSubmitting(false);
    }
  }, [interview, currentQuestion, interviewId, navigate, questionIndex, questions.length, submitting, timeLeft, isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: typeof globalThis.SpeechRecognition; webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Speech recognition error");
    };

    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  if (!interview || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const allStages = getStagesForType(interview.role, interview.type);
  const stagePosition = allStages.indexOf(STAGE) + 1;
  const overallProgress = ((stagePosition - 1) / allStages.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
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
            <span className="text-sm text-muted-foreground">
              Question {questionIndex + 1}/{questions.length}
            </span>
          </div>
          {/* Stage progress */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              animate={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Overall progress */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Overall progress</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-muted-foreground/40 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Timer + question */}
            <div className="flex gap-4 items-start">
              <CircularTimer timeLeft={timeLeft} total={timeLimit} />
              <Card className="flex-1 p-5 shadow-elevated">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary mb-3">
                  Behavioral
                </span>
                <h2 className="text-lg font-semibold font-display leading-relaxed">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.hint && (
                  <p className="text-sm text-muted-foreground mt-3 border-l-2 border-primary/30 pl-3">
                    💡 {currentQuestion.hint}
                  </p>
                )}
              </Card>
            </div>

            {/* Voice indicator */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-3 border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="h-3 w-3 rounded-full bg-destructive"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-primary">
                        Listening... Speak your answer
                      </span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer input */}
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer or use the microphone..."
                  className="min-h-[180px] resize-none text-base pr-12"
                />
                <Button
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  className="absolute bottom-3 right-3"
                  onClick={toggleRecording}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleSubmitAnswer}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : questionIndex < questions.length - 1
                  ? (
                    <>Submit & Next <ChevronRight className="h-5 w-5" /></>
                  )
                  : "Complete Stage →"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
