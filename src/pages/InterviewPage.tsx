import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getQuestionsByRole, submitAnswer, completeInterview, type Question } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Mic, MicOff, Send, SkipForward, CheckCircle, Sparkles, User } from "lucide-react";
import { analyzeInterviewAnswer, type AIAnalysisResult } from "@/lib/ai-service";
import QuestionAIFeedback from "@/components/QuestionAIFeedback";

/** Animated voice waveform bars shown while recording */
function VoiceWaveform() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center justify-center gap-1 py-4"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-primary"
          animate={{
            height: [8, 24 + Math.random() * 20, 8],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.07,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, categories, questionLimit = 10 } = (location.state as { role: string; categories: string[]; questionLimit?: number }) || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!role || !categories) {
      navigate("/interview/start");
      return;
    }
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      const allQuestions = await getQuestionsByRole(role);
      const filtered = allQuestions.filter(q => categories.includes(q.category));
      const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, questionLimit);
      setQuestions(shuffled);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  // Speech-to-Text
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
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

  const handleSubmit = async () => {
    if (!answer.trim()) return toast.error("Please provide an answer");
    if (!sessionId || !currentQuestion) return;

    setSubmitting(true);
    try {
      await submitAnswer(sessionId, currentQuestion.id, answer.trim());

      const isLast = currentIndex >= questions.length - 1;

      // Run AI analysis
      setAnalyzingAI(true);
      try {
        const result = await analyzeInterviewAnswer({
          question: currentQuestion.question,
          answer: answer.trim(),
          category: currentQuestion.category,
          role,
        });
        setAiResult(result);
        // Navigation will happen when user clicks Continue in the feedback panel
        if (isLast) {
          await completeInterview(sessionId);
        }
      } catch {
        // If AI fails, just advance normally
        if (isLast) {
          await completeInterview(sessionId);
          toast.success("Interview complete!");
          navigate(`/interview/result/${sessionId}`);
        } else {
          setCurrentIndex(prev => prev + 1);
          setAnswer("");
          toast.success("Answer submitted!");
        }
      } finally {
        setAnalyzingAI(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueAfterFeedback = () => {
    setAiResult(null);
    if (currentIndex >= questions.length - 1) {
      toast.success("Interview complete!");
      navigate(`/interview/result/${sessionId}`);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswer("");
    }
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md shadow-elevated">
          <p className="text-lg font-display font-semibold mb-4">No questions available for this selection</p>
          <Button variant="hero" onClick={() => navigate("/interview/start")}>Try Different Options</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold font-display">{role}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {/* AI Feedback panel */}
          {(analyzingAI || aiResult) ? (
            <motion.div
              key="ai-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {analyzingAI ? (
                <Card className="p-8 shadow-elevated flex flex-col items-center gap-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-lg">AI Coach is reviewing your answer…</h3>
                    <p className="text-sm text-muted-foreground mt-1">Analyzing clarity, completeness, and confidence</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </Card>
              ) : aiResult && (
                <QuestionAIFeedback
                  result={aiResult}
                  questionText={currentQuestion?.question ?? ""}
                  onContinue={handleContinueAfterFeedback}
                  continueLabel={
                    currentIndex < questions.length - 1
                      ? `Next Question (${currentIndex + 2}/${questions.length})`
                      : "View Results →"
                  }
                />
              )}
            </motion.div>
          ) : (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Interviewer persona */}
            <Card className="p-4 shadow-card flex items-center gap-3 bg-muted/30">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Interviewer · Practice Session</p>
                <p className="text-sm font-medium">{role} Interview</p>
              </div>
            </Card>

            {/* Question */}
            <Card className="p-6 shadow-elevated">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {currentQuestion?.category}
              </span>
              <h2 className="text-xl font-semibold font-display leading-relaxed">
                {currentQuestion?.question}
              </h2>
            </Card>

            {/* Voice waveform animation */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-4 shadow-card border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        className="h-3 w-3 rounded-full bg-destructive"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-primary">Listening... Speak your answer</span>
                    </div>
                    <VoiceWaveform />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer input */}
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use the microphone..."
                  className="min-h-[200px] resize-none text-base pr-12"
                />
                <Button
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  className={`absolute bottom-3 right-3 ${isRecording ? "animate-pulse-glow" : ""}`}
                  onClick={toggleRecording}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="hero" size="lg" className="flex-1" onClick={handleSubmit} disabled={submitting || analyzingAI}>
                  {submitting || analyzingAI ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Processing...</>
                  ) : currentIndex === questions.length - 1 ? (
                    <><CheckCircle className="h-5 w-5" /> Submit & Finish</>
                  ) : (
                    <><Send className="h-5 w-5" /> Submit Answer</>
                  )}
                </Button>
                {currentIndex < questions.length - 1 && (
                  <Button variant="outline" size="lg" onClick={handleSkip}>
                    <SkipForward className="h-5 w-5" /> Skip
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
