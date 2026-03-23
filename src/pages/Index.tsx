import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Mic, BarChart3, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading]);

  const features = [
    { icon: Brain, title: "AI Evaluation", desc: "Semantic similarity scoring powered by AI" },
    { icon: Mic, title: "Voice Input", desc: "Answer questions by speaking naturally" },
    { icon: BarChart3, title: "Analytics", desc: "Track your progress across categories" },
    { icon: Sparkles, title: "Smart Feedback", desc: "Detailed feedback on every answer" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="container mx-auto flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display">MockPrep AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="hero" onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-6xl font-bold font-display leading-tight max-w-3xl mx-auto">
            Ace Your Next Interview with{" "}
            <span className="text-gradient">AI-Powered</span> Practice
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Practice with role-specific questions, get instant AI evaluation, and track your improvement across technical and behavioral categories.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
              Start Practicing <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-xl bg-card shadow-card text-center"
            >
              <div className="h-12 w-12 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold font-display mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MockPrep AI. Built with Lovable.</p>
      </footer>
    </div>
  );
}
