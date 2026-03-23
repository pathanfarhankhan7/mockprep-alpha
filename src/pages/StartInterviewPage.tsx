import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startInterview } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, Code, Database, Cpu, Users, BarChart3, Layers, ArrowLeft } from "lucide-react";

const ROLES = [
  { id: "Software Engineer", icon: Code, description: "DSA, OOP, System Design" },
  { id: "Data Analyst", icon: BarChart3, description: "SQL, Statistics, Visualization" },
  { id: "Data Scientist", icon: Cpu, description: "ML, Statistics, Python" },
  { id: "Product Manager", icon: Users, description: "Strategy, Metrics, Execution" },
];

const CATEGORIES = ["DSA", "OOP", "System Design", "Machine Learning", "HR", "Database Design"];

export default function StartInterviewPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
        state: { role: selectedRole, categories: selectedCategories },
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

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold font-display mb-2">Select Your Role</h2>
          <p className="text-muted-foreground mb-6">Choose the position you're preparing for</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLES.map(role => (
              <Card
                key={role.id}
                className={`p-5 cursor-pointer transition-all shadow-card hover:shadow-elevated ${
                  selectedRole === role.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <role.icon className={`h-6 w-6 mb-2 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold font-display">{role.id}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

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

        <Button variant="hero" size="lg" className="w-full" onClick={handleStart} disabled={loading}>
          {loading ? "Starting..." : "Begin Interview"}
        </Button>
      </main>
    </div>
  );
}
