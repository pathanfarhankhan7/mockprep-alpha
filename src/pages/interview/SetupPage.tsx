import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Code,
  BarChart3,
  Cpu,
  Palette,
  Server,
  Building2,
  Play,
  Video,
  VideoOff,
  CheckCircle2,
} from "lucide-react";
import {
  type Role,
  type Company,
  type InterviewType,
  type StageType,
  ROLE_CONFIGS,
  getStageName,
  getStagesForType,
} from "@/lib/interview-data";
import {
  createInterview,
  getStageRoute,
} from "@/lib/interview-service";
import { toast } from "sonner";

const ROLES: { id: Role; icon: React.ElementType; description: string }[] = [
  { id: "SWE", icon: Code, description: "Algorithms, system design, coding" },
  { id: "PM", icon: BarChart3, description: "Strategy, metrics, product sense" },
  { id: "Data Scientist", icon: Cpu, description: "ML, SQL, analytics thinking" },
  { id: "UX Designer", icon: Palette, description: "Design process, user research" },
  { id: "DevOps", icon: Server, description: "CI/CD, infrastructure, reliability" },
];

const COMPANIES: { id: Company; description: string; emoji: string }[] = [
  { id: "Google", description: "Moonshots, 10x thinking", emoji: "🟢" },
  { id: "Amazon", description: "Leadership Principles", emoji: "🟠" },
  { id: "Meta", description: "Move fast, social impact", emoji: "🔵" },
  { id: "Apple", description: "Quality, privacy, design", emoji: "⚫" },
  { id: "Microsoft", description: "Growth mindset, ecosystem", emoji: "🔷" },
  { id: "Startup", description: "Hustle, adaptability, ownership", emoji: "🚀" },
  { id: "Custom", description: "General industry questions", emoji: "🏢" },
];

const INTERVIEW_TYPES: { id: InterviewType; description: string; stages: string }[] = [
  {
    id: "Full",
    description: "Complete multi-stage interview experience",
    stages: "Phone Screen → Technical → Deep Dive → HR",
  },
  {
    id: "Phone Screen Only",
    description: "Quick 3-question behavioral screen",
    stages: "Phone Screen only",
  },
  {
    id: "Technical Only",
    description: "Focused technical challenge",
    stages: "Technical Round only",
  },
];

const TOTAL_STEPS = 5;

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [starting, setStarting] = useState(false);

  const canAdvance = () => {
    if (step === 0) return role !== null;
    if (step === 1) return company !== null;
    if (step === 2) return interviewType !== null;
    if (step === 3) return true; // preferences are optional
    return true;
  };

  const handleStart = () => {
    if (!role || !company || !interviewType) {
      toast.error("Please complete all setup steps");
      return;
    }
    setStarting(true);
    try {
      const interview = createInterview({ role, company, type: interviewType, videoEnabled });
      const firstStage = getStagesForType(role, interviewType)[0];
      const route = getStageRoute(firstStage);
      navigate(`${route}?id=${interview.id}`);
    } catch (err) {
      toast.error("Failed to create interview session");
      setStarting(false);
    }
  };

  const stepsLabels = ["Role", "Company", "Type", "Preferences", "Preview"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-display">Interview Setup</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8">
          {stepsLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < TOTAL_STEPS - 1 && (
                <div className={`flex-1 h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Role */}
          {step === 0 && (
            <motion.div
              key="step-role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display">Select Your Role</h2>
                <p className="text-muted-foreground mt-1">Choose the position you're interviewing for</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES.map(({ id, icon: Icon, description }) => (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={role === id}
                    className={`p-5 cursor-pointer rounded-lg border bg-card shadow-card hover:shadow-elevated transition-all ${
                      role === id ? "ring-2 ring-primary border-primary" : "border-border"
                    }`}
                    onClick={() => setRole(id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setRole(id); } }}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${role === id ? "text-primary" : "text-muted-foreground"}`} />
                    <h3 className="font-semibold font-display">{id}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Company */}
          {step === 1 && (
            <motion.div
              key="step-company"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display">Select Target Company</h2>
                <p className="text-muted-foreground mt-1">We'll tailor the deep-dive questions to their culture</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMPANIES.map(({ id, description, emoji }) => (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={company === id}
                    className={`p-5 cursor-pointer rounded-lg border bg-card shadow-card hover:shadow-elevated transition-all ${
                      company === id ? "ring-2 ring-primary border-primary" : "border-border"
                    }`}
                    onClick={() => setCompany(id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCompany(id); } }}
                  >
                    <span className="text-2xl mb-2 block">{emoji}</span>
                    <h3 className="font-semibold font-display">{id}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Interview type */}
          {step === 2 && (
            <motion.div
              key="step-type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display">Interview Format</h2>
                <p className="text-muted-foreground mt-1">Choose how deep you want to go</p>
              </div>
              <div className="space-y-4">
                {INTERVIEW_TYPES.map(({ id, description, stages }) => (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={interviewType === id}
                    className={`p-5 cursor-pointer rounded-lg border bg-card shadow-card hover:shadow-elevated transition-all ${
                      interviewType === id ? "ring-2 ring-primary border-primary" : "border-border"
                    }`}
                    onClick={() => setInterviewType(id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setInterviewType(id); } }}
                  >
                    <h3 className="font-semibold font-display mb-1">{id}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{description}</p>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{stages}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div
              key="step-prefs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display">Preferences</h2>
                <p className="text-muted-foreground mt-1">Customize your interview environment</p>
              </div>
              <Card className="p-6 space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    videoEnabled ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setVideoEnabled((v) => !v)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setVideoEnabled((v) => !v); } }}
                >
                  <div className="flex items-center gap-3">
                    {videoEnabled ? (
                      <Video className="h-5 w-5 text-primary" />
                    ) : (
                      <VideoOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">Video Recording</p>
                      <p className="text-sm text-muted-foreground">
                        Record your interview session for self-review
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                      videoEnabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        videoEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Note: Video is stored locally in your browser only. Microphone input for
                  speech-to-text is always available regardless of this setting.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && role && company && interviewType && (
            <motion.div
              key="step-preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold font-display">Interview Preview</h2>
                <p className="text-muted-foreground mt-1">Here's what to expect</p>
              </div>

              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-semibold">{role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-semibold">{company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="font-semibold">{interviewType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Video</p>
                    <p className="font-semibold">{videoEnabled ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                <h3 className="font-semibold font-display">Stage Flow</h3>
                {getStagesForType(role, interviewType).map((stage: StageType, i: number) => {
                  const config = ROLE_CONFIGS[role];
                  const questionCount =
                    stage === "phone-screen"
                      ? config.phoneScreenQuestions.length
                      : stage === "technical"
                      ? 1
                      : stage === "deep-dive"
                      ? 2
                      : config.hrQuestions.length;
                  const duration =
                    stage === "technical"
                      ? `${Math.round(config.technicalChallenge.duration / 60)} min`
                      : `${questionCount} × 2 min`;

                  return (
                    <div
                      key={stage}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{getStageName(stage)}</p>
                        <p className="text-sm text-muted-foreground">{duration}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleStart}
                disabled={starting}
              >
                <Play className="h-5 w-5" />
                {starting ? "Starting..." : "Start Interview"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <Button
              variant="hero"
              className="ml-auto"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
