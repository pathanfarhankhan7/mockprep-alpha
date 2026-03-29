import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import TipCard from "@/components/TipCard";
import { getTipsByCategory, CATEGORY_COLORS, type TipCategory, CATEGORIES } from "@/lib/data-seed";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const validCategory = CATEGORIES.includes(category as TipCategory)
    ? (category as TipCategory)
    : null;

  const tips = validCategory ? getTipsByCategory(validCategory) : [];

  if (!validCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold font-display mb-2">Category not found</h2>
          <Button variant="hero" onClick={() => navigate("/learning")}>Browse All Tips</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/learning")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/learning" className="hover:text-foreground transition-colors">
              Learning Hub
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{validCategory}</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3", CATEGORY_COLORS[validCategory])}>
              {validCategory}
            </span>
            <h1 className="text-3xl font-bold font-display mb-2">
              {validCategory} Interview Tips
            </h1>
            <p className="text-muted-foreground">
              {tips.length} expert tips to help you excel in {validCategory.toLowerCase()} interviews.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tips Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <TipCard tip={tip} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
