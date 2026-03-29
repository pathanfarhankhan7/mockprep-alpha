import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, BookOpen, ArrowLeft, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import TipCard from "@/components/TipCard";
import SearchBar from "@/components/SearchBar";
import {
  INTERVIEW_TIPS,
  CATEGORIES,
  CATEGORY_COLORS,
  searchTips,
  type TipCategory,
  type TipDifficulty,
  DIFFICULTIES,
  DIFFICULTY_COLORS,
} from "@/lib/data-seed";
import { cn } from "@/lib/utils";

export default function LearningHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TipDifficulty | null>(null);

  const filteredTips = useMemo(
    () => searchTips(search, selectedCategory ?? undefined, selectedDifficulty ?? undefined),
    [search, selectedCategory, selectedDifficulty]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    INTERVIEW_TIPS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            {user && (
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold font-display">Learning Hub</span>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {INTERVIEW_TIPS.length} tips across {CATEGORIES.length} categories
              </p>
            </div>
          </div>
          {user ? (
            <Button variant="hero" size="sm" onClick={() => navigate("/interview/start")}>
              Start Interview
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Interview Learning Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3">
              Master Your Interview Skills
            </h1>
            <p className="text-muted-foreground max-w-xl mb-6">
              Browse expert interview tips and strategies organized by category. From behavioral questions to technical challenges — we've got you covered.
            </p>

            {/* Category stat badges */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                    selectedCategory === cat
                      ? cn(CATEGORY_COLORS[cat], "ring-2 ring-offset-1 ring-current border-current")
                      : cn(CATEGORY_COLORS[cat], "border-transparent hover:opacity-80")
                  )}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {cat}
                  <span className="text-xs opacity-70">({categoryCounts[cat] ?? 0})</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search tips by keyword..."
            className="flex-1 max-w-md"
          />
          {/* Difficulty filter */}
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  selectedDifficulty === diff
                    ? cn(DIFFICULTY_COLORS[diff], "ring-2 ring-offset-1 ring-current border-current")
                    : cn(DIFFICULTY_COLORS[diff], "border-transparent hover:opacity-80")
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredTips.length}</span> tips
            {selectedCategory && <> in <span className="font-semibold text-foreground">{selectedCategory}</span></>}
            {search && <> matching <span className="font-semibold text-foreground">"{search}"</span></>}
          </p>
          {(selectedCategory || selectedDifficulty || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
                setSelectedDifficulty(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Tips Grid */}
        {filteredTips.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-lg font-medium mb-2">No tips found</p>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
            <Button variant="outline" onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedDifficulty(null); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
              >
                <TipCard tip={tip} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
