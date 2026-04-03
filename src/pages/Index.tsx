import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Mic, BarChart3, Sparkles, CheckCircle, Users, Star, Zap, Upload, FileText, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const STATS = [
  { value: "500+", label: "Practice Questions" },
  { value: "5", label: "Top Companies" },
  { value: "4", label: "Interview Stages" },
  { value: "AI", label: "Powered Feedback" },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Evaluation",
    desc: "Scores clarity, completeness, confidence, and relevance — just like a real interviewer.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Mic,
    title: "Voice Input",
    desc: "Speak your answers naturally. Real-time speech-to-text works across all stages.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Track improvement across sessions with radar charts, score breakdowns, and trend lines.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Sparkles,
    title: "Instant Coaching",
    desc: "After every answer, your AI coach highlights strengths and gives actionable tips.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Zap,
    title: "Multi-Stage Flow",
    desc: "Simulate a full interview loop — Phone Screen, Technical, Deep Dive, HR round.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Role-Specific",
    desc: "SWE, PM, Data Scientist, UX Designer, DevOps — tailored questions for every role.",
    color: "bg-pink-100 text-pink-600",
  },
];

const COMPANIES = ["Google", "Amazon", "Meta", "Apple", "Microsoft"];

const HOW_IT_WORKS = [
  { step: "01", title: "Pick Your Role & Company", desc: "Choose from 5 roles and 5 top tech companies. We tailor the entire loop to match." },
  { step: "02", title: "Go Through Real Stages", desc: "Phone screen, coding/case study, deep-dive behaviorals, and an HR round — in sequence." },
  { step: "03", title: "Get AI Coach Feedback", desc: "After every answer, see your score breakdown and coaching tips. Instantly." },
  { step: "04", title: "Review & Improve", desc: "Full analysis report, strengths/weaknesses, and a personalized learning path." },
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  "Software Engineer": [
    "javascript", "typescript", "python", "java", "c++", "c#", "react", "node", "angular", "vue",
    "backend", "frontend", "full stack", "fullstack", "rest api", "graphql", "software engineer",
    "developer", "coding", "algorithm", "data structure", "git", "microservices", "sql", "mongodb",
    "aws", "docker", "spring", "django", "flask", "ruby", "golang", "kotlin", "swift",
  ],
  "Product Manager": [
    "product manager", "product management", "roadmap", "stakeholder", "agile", "scrum", "sprint",
    "user story", "go-to-market", "gtm", "product strategy", "kpi", "okr", "market research",
    "prioritization", "product owner", "backlog", "mvp", "a/b testing", "product lifecycle",
  ],
  "Data Scientist": [
    "machine learning", "deep learning", "data science", "tensorflow", "pytorch", "scikit",
    "statistics", "regression", "classification", "nlp", "neural network", "dataset", "pandas",
    "numpy", "matplotlib", "r programming", "data analysis", "model training", "feature engineering",
    "big data", "spark", "hadoop", "data mining", "sql", "jupyter",
  ],
  "UX Designer": [
    "ux", "ui", "user experience", "user interface", "figma", "sketch", "adobe xd", "wireframe",
    "prototype", "user research", "usability", "interaction design", "design thinking", "persona",
    "journey map", "heuristic", "accessibility", "responsive design", "visual design", "design system",
  ],
  "DevOps": [
    "devops", "docker", "kubernetes", "k8s", "ci/cd", "jenkins", "github actions", "terraform",
    "ansible", "puppet", "chef", "aws", "azure", "gcp", "cloud", "infrastructure", "monitoring",
    "prometheus", "grafana", "linux", "bash", "shell", "nginx", "pipeline", "devsecops",
  ],
};

const ROLE_TO_PATH: Record<string, string> = {
  "Software Engineer": "SWE",
  "Product Manager": "PM",
  "Data Scientist": "Data Scientist",
  "UX Designer": "UX Designer",
  "DevOps": "DevOps",
};

function detectRoleFromText(text: string): { role: string; confidence: number } | null {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
    scores[role] = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] === 0) return null;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return { role: top[0], confidence: Math.round((top[1] / total) * 100) };
}

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? "");
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  // For PDF/DOCX: read as ArrayBuffer and extract runs of printable ASCII characters.
  // This is a simplified approach — it works well for text-based PDFs and DOCX XML
  // fragments, but may miss non-ASCII characters. Runs shorter than MIN_RUN_LENGTH
  // are discarded to avoid noise from binary metadata bytes.
  const MIN_RUN_LENGTH = 4;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(buf);
      let text = "";
      let run = "";
      for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];
        if (c >= 32 && c <= 126) {
          run += String.fromCharCode(c);
        } else {
          if (run.length >= MIN_RUN_LENGTH) text += run + " ";
          run = "";
        }
      }
      if (run.length >= MIN_RUN_LENGTH) text += run;
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<{ role: string; confidence: number } | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    const allowed = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    // Also check file extension as a fallback since MIME types may not be set correctly on all OS/browser combos
    const hasAllowedExt = file.name.endsWith(".txt") || file.name.endsWith(".pdf") || file.name.endsWith(".docx");
    if (!allowed.includes(file.type) && !hasAllowedExt) {
      setResumeError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setResumeFile(file);
    setResumeAnalysis(null);
    setResumeError(null);
    setResumeLoading(true);
    try {
      const text = await extractTextFromFile(file);
      const result = detectRoleFromText(text);
      if (!result) {
        setResumeError("Unable to detect a role from your resume. Please ensure it includes relevant keywords for your target position, or try uploading a plain-text (.txt) version.");
      } else {
        setResumeAnalysis(result);
      }
    } catch {
      setResumeError("Failed to read the file. Please try a plain-text (.txt) version.");
    } finally {
      setResumeLoading(false);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeAnalysis(null);
    setResumeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="container mx-auto flex items-center justify-between py-5 px-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display">SmartMock</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="hero" onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Powered by GPT-4o
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display leading-tight max-w-4xl mx-auto">
            Land Your Dream Job with{" "}
            <span className="text-gradient">AI-Powered</span>{" "}
            Mock Interviews
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practice the full interview loop — phone screen, technical, deep dive, HR — with real-time AI coaching after every answer. Like having a senior engineer in your corner.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
              Start Practicing Free <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required · Free to start</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold font-display text-gradient">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Resume Upload & Analysis */}
      <section className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-sm text-accent font-medium mb-4">
              <FileText className="h-3.5 w-3.5" /> Resume Analyzer
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Upload Your Resume, Get a{" "}
              <span className="text-gradient">Tailored Interview</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              We'll scan your resume and recommend the best interview track for you — in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
            {!resumeFile ? (
              <div
                className="flex flex-col items-center justify-center gap-4 py-10 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0] ?? null); }}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold font-display">Drag & drop your resume here</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse — PDF, DOCX, or TXT</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Uploaded file info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{resumeFile.name}</span>
                  <button onClick={clearResume} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {resumeLoading && (
                  <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Analyzing your resume…</span>
                  </div>
                )}

                {resumeError && (
                  <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                    {resumeError}
                  </div>
                )}

                {resumeAnalysis && !resumeLoading && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Detected Role</p>
                      <p className="text-xl font-bold font-display text-gradient">{resumeAnalysis.role}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Keyword match confidence: <span className="font-semibold text-foreground">{resumeAnalysis.confidence}%</span>
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We recommend starting a <span className="font-semibold text-foreground">{resumeAnalysis.role}</span> interview to match your background.
                    </p>
                    <Button
                      variant="hero"
                      className="w-full"
                      size="lg"
                      onClick={() => navigate(`/signup?role=${encodeURIComponent(ROLE_TO_PATH[resumeAnalysis.role] ?? resumeAnalysis.role)}`)}
                    >
                      Start {resumeAnalysis.role} Interview <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Companies section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-6 font-medium">Interview prep tailored for top companies</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {COMPANIES.map((c) => (
              <span key={c} className="text-xl font-bold font-display text-muted-foreground/60 hover:text-foreground transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold font-display">How It Works</h2>
          <p className="text-muted-foreground mt-2">From setup to full analysis in under an hour</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <span className="text-4xl font-bold font-display text-primary/20">{step.step}</span>
                <h3 className="font-semibold font-display mt-2 mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-muted-foreground/40">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-muted/30 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-display">Everything You Need to Prepare</h2>
            <p className="text-muted-foreground mt-2">Built for serious candidates who want real results</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div className="h-16 w-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold font-display">Start Practicing Today</h2>
          <p className="text-muted-foreground text-lg">
            Free to start. No downloads. AI coaching after every single answer.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {["Free to start", "No credit card", "Instant feedback"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" /> {item}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SmartMock — Built for serious candidates</p>
      </footer>
    </div>
  );
}

