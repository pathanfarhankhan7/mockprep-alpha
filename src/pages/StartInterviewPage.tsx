import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { startInterview } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, Code, Cpu, Users, BarChart3, ArrowLeft, Shield, Palette, Bug, Server } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const ROLES = [
  { id: "Software Engineer", icon: Code, description: "DSA, OOP, System Design" },
  { id: "Data Analyst", icon: BarChart3, description: "SQL, Statistics, Visualization" },
  { id: "Data Scientist", icon: Cpu, description: "ML, Statistics, Python" },
  { id: "Product Manager", icon: Users, description: "Strategy, Metrics, Execution" },
  { id: "DevOps Engineer", icon: Server, description: "CI/CD, Docker, Monitoring" },
  { id: "UI/UX Designer", icon: Palette, description: "Design Process, Accessibility" },
  { id: "QA Engineer", icon: Bug, description: "Testing, TDD, Bug Triage" },
];

const CATEGORIES = ["DSA", "OOP", "System Design", "Machine Learning", "HR", "Database Design"];

const QUESTION_LIMITS = [5, 10, 15, 20];

export default function StartInterviewPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleStart = async () => {
    if (!selectedRole) return toast.error("Please select a role");
    if (selectedCategories.length === 0) return toast.error("Please select at least one category");

    setLoading(true);
    try {
      const session = await startInterview(selectedRole);
      navigate(`/interview/${session.id}`, {
        state: { role: selectedRole, categories: selectedCategories, questionLimit },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="font-bold font-display">Start Interview</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Role Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold font-display mb-2">Select Your Role</h2>
          <p className="text-muted-foreground mb-6">Choose the position you're preparing for</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map(role => (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                className={`p-5 cursor-pointer transition-all rounded-lg border bg-card text-card-foreground shadow-card hover:shadow-elevated ${
                  selectedRole === role.id ? "ring-2 ring-primary border-primary" : "border-border"
                }`}
                onClick={() => setSelectedRole(role.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedRole(role.id); }}
              >
                <role.icon className={`h-6 w-6 mb-2 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold font-display">{role.id}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold font-display mb-2">Select Categories</h2>
          <p className="text-muted-foreground mb-6">Pick topics to be tested on</p>

          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={selectedCategories.includes(cat) ? "default" : "outline"}
                onClick={() => toggleCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Question Limit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold font-display mb-2">Number of Questions</h2>
          <p className="text-muted-foreground mb-6">How many questions do you want in this session?</p>

          <div className="flex gap-3">
            {QUESTION_LIMITS.map(limit => (
              <Button
                key={limit}
                variant={questionLimit === limit ? "default" : "outline"}
                onClick={() => setQuestionLimit(limit)}
                className="rounded-full min-w-[3.5rem]"
              >
                {limit}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Selected: <span className="font-semibold text-foreground">{questionLimit} questions</span>
          </p>
        </motion.div>

        <Button variant="hero" size="lg" className="w-full" onClick={handleStart} disabled={loading}>
          {loading ? "Starting..." : `Begin Interview (${questionLimit} Questions)`}
        </Button>
      </main>
    </div>
  );
}
