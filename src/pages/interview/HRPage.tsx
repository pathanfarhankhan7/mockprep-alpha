import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Mic, MicOff, Heart, ChevronRight, Sparkles, User, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import {
  getInterview,
  saveAnswer,
  completeStage,
  completeInterview,
  attachEmotionToAnswer,
} from "@/lib/interview-service";
import { getStageName, getStagesForType } from "@/lib/interview-data";
import { useTimer, formatTime } from "@/hooks/useTimer";
import type { MultiStageInterview, StageType } from "@/lib/interview-service";
import { analyzeInterviewAnswer, type AIAnalysisResult } from "@/lib/ai-service";
import QuestionAIFeedback from "@/components/QuestionAIFeedback";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { captureVideoFrame, analyzeEmotion } from "@/lib/emotion-service";

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
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [pendingContinue, setPendingContinue] = useState<(() => void) | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const answerRef = useRef(answer);
  answerRef.current = answer;
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoStartedRef = useRef(false);

  const videoRecording = useVideoRecording(interview?.videoEnabled ?? false);

  useEffect(() => {
    if (videoPreviewRef.current && videoRecording.stream) {
      videoPreviewRef.current.srcObject = videoRecording.stream;
    }
  }, [videoRecording.stream]);

  useEffect(() => {
    if (interview?.videoEnabled && !videoStartedRef.current) {
      videoStartedRef.current = true;
      videoRecording.startRecording().catch(() => {
        toast.error("Could not access camera. Check browser permissions.");
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview?.videoEnabled]);

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

  const handleSubmitAnswer = useCallback(async () => {
    if (!interview || !currentQuestion || submitting) return;
    setSubmitting(true);

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const timeUsed = (currentQuestion.timeLimit ?? 120) - timeLeft;
    const finalAnswer = answerRef.current.trim() || "(No answer provided)";

    // Capture video frame for emotion analysis
    const frameData = videoPreviewRef.current
      ? captureVideoFrame(videoPreviewRef.current)
      : null;

    const updated = saveAnswer(interviewId, STAGE, questionIndex, finalAnswer, timeUsed);
    if (updated) setInterview(updated);

    // Run emotion analysis in background — non-blocking
    analyzeEmotion(frameData, finalAnswer).then((emotionSnapshot) => {
      attachEmotionToAnswer(interviewId, STAGE, questionIndex, emotionSnapshot);
    }).catch(() => { /* silently ignore */ });

    const nextIndex = questionIndex + 1;
    const continueAction = () => {
      setAiResult(null);
      setPendingContinue(null);
      if (nextIndex < questions.length) {
        setQuestionIndex(nextIndex);
        setAnswer("");
        setSubmitting(false);
      } else {
        const withStage = completeStage(interviewId, STAGE);
        if (!withStage) { setSubmitting(false); return; }
        completeInterview(interviewId);
        navigate(`/interview/analysis/${interviewId}`);
        setSubmitting(false);
      }
    };

    setAnalyzingAI(true);
    try {
      const result = await analyzeInterviewAnswer({
        question: currentQuestion.text,
        answer: finalAnswer,
        category: "HR",
        role: interview.role,
      });
      setAiResult(result);
      setPendingContinue(() => continueAction);
    } catch {
      continueAction();
    } finally {
      setAnalyzingAI(false);
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
          {(analyzingAI || aiResult) && (
            <motion.div
              key="ai-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {analyzingAI ? (
                <Card className="p-8 shadow-elevated flex flex-col items-center gap-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-lg">AI Coach is reviewing your answer…</h3>
                    <p className="text-sm text-muted-foreground mt-1">Evaluating communication and cultural fit</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </Card>
              ) : aiResult && (
                <QuestionAIFeedback
                  result={aiResult}
                  questionText={currentQuestion?.text ?? ""}
                  onContinue={() => pendingContinue?.()}
                  continueLabel={
                    questionIndex < questions.length - 1
                      ? `Next Question (${questionIndex + 2}/${questions.length})`
                      : "View Full Analysis →"
                  }
                />
              )}
            </motion.div>
          )}

          {!analyzingAI && !aiResult && (
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Interviewer persona */}
            <Card className="p-4 shadow-card flex items-center gap-3 bg-emerald-50/50 border-emerald-200/50">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">HR Round · Final Stage</p>
                <p className="text-sm font-medium text-emerald-800">HR Partner — Be yourself ✨</p>
              </div>
            </Card>

            {/* Relaxed header message */}
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">
                Question {questionIndex + 1} of {questions.length} · Relax and be authentic
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
                disabled={submitting || analyzingAI}
              >
                {submitting ? "Saving…" : questionIndex < questions.length - 1 ? (
                  <>Submit Answer <ChevronRight className="h-5 w-5" /></>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Submit & View Analysis
                  </>
                )}
              </Button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating camera preview */}
      {interview?.videoEnabled && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1">
          {videoRecording.isRecording && (
            <div className="flex items-center gap-1.5 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
              <motion.div
                className="h-2 w-2 rounded-full bg-destructive"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              REC
            </div>
          )}
          {videoRecording.error && (
            <div className="flex items-center gap-1.5 bg-black/70 text-white text-xs px-2 py-1 rounded-lg max-w-[128px]">
              <VideoOff className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Camera denied</span>
            </div>
          )}
          {videoRecording.stream ? (
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-32 h-24 rounded-lg border border-border object-cover bg-black shadow-lg"
            />
          ) : (
            <div className="w-32 h-24 rounded-lg border border-border bg-black/80 flex items-center justify-center shadow-lg">
              <Video className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
