import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, Sparkles, Send, RotateCcw, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAI } from "@/hooks/useAI";
import AIFeedback from "@/components/AIFeedback";
import { CATEGORIES } from "@/lib/data-seed";
import { toast } from "sonner";

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  Behavioral: [
    "Tell me about a time you had to work under pressure to meet a deadline.",
    "Describe a situation where you had to resolve a conflict with a coworker.",
    "Give an example of a time you showed leadership.",
    "Tell me about a time you failed and what you learned from it.",
  ],
  Technical: [
    "Explain the difference between a stack and a queue.",
    "Walk me through how you would optimize a slow database query.",
    "Describe the SOLID principles in software engineering.",
    "How would you design a URL shortener like bit.ly?",
  ],
  HR: [
    "Why do you want to work here?",
    "Where do you see yourself in 5 years?",
    "What is your greatest weakness?",
    "Why are you leaving your current role?",
  ],
  "Problem-Solving": [
    "How would you prioritize 10 features with limited engineering resources?",
    "Describe your approach to debugging a production incident.",
    "How would you improve user retention for a mobile app?",
    "Walk me through how you'd estimate the number of coffee shops in a city.",
  ],
};

export default function AIFeedbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, loading, error, analyze, reset } = useAI();

  const [category, setCategory] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const categoryQuestions = category ? SAMPLE_QUESTIONS[category] ?? [] : [];

  const handleAnalyze = async () => {
    if (!question.trim()) return toast.error("Please enter a question.");
    if (!answer.trim()) return toast.error("Please enter your answer.");
    if (answer.trim().split(/\s+/).length < 10) {
      return toast.error("Please provide a more detailed answer (at least 10 words).");
    }
    await analyze({ question, answer, category: category || undefined });
  };

  const handleReset = () => {
    reset();
    setAnswer("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(user ? "/dashboard" : "/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold font-display">AI Coach</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Get instant feedback on your answers</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/learning")}>
            <BookOpen className="h-4 w-4 mr-1" /> Learning Hub
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold font-display">AI Interview Coach</h1>
            </div>
            <p className="text-muted-foreground">
              Practice answering interview questions and get instant AI-powered feedback on your clarity, completeness, and confidence.
            </p>
          </div>

          {/* Input Form */}
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Category */}
                <div className="space-y-2">
                  <Label>Interview Category (optional)</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sample question picker */}
                {categoryQuestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Sample Questions</Label>
                    <div className="flex flex-wrap gap-2">
                      {categoryQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setQuestion(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors text-left line-clamp-1 max-w-[280px]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question */}
                <div className="space-y-2">
                  <Label htmlFor="question">Interview Question *</Label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Enter the interview question..."
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* Answer */}
                <div className="space-y-2">
                  <Label htmlFor="answer">Your Answer *</Label>
                  <Textarea
                    id="answer"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type your answer here as you would in a real interview..."
                    className="min-h-[160px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {answer.trim().split(/\s+/).filter(Boolean).length} words — aim for 100-250 words
                  </p>
                </div>

                {error && (
                  <Card className="p-4 border-destructive/30 bg-destructive/5">
                    <p className="text-sm text-destructive">{error}</p>
                  </Card>
                )}

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Analyzing your answer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Get AI Feedback
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Your answer summary */}
                <Card className="p-4 shadow-card">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Your Answer</p>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-4">{answer}</p>
                </Card>

                <AIFeedback result={result} question={question} />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="hero" size="lg" className="flex-1" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" /> Try Another Question
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/learning")}>
                    <BookOpen className="h-4 w-4" /> Learning Hub
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
