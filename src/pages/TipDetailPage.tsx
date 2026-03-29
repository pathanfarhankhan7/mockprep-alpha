import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, BookOpen, Clock, Star, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LearningModule from "@/components/LearningModule";
import TipCard from "@/components/TipCard";
import {
  getTipById,
  getRelatedTips,
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
} from "@/lib/data-seed";
import { cn } from "@/lib/utils";

export default function TipDetailPage() {
  const { tipId } = useParams<{ tipId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tip = getTipById(tipId ?? "");
  const relatedTips = tip ? getRelatedTips(tip.id) : [];

  if (!tip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md shadow-elevated">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold font-display mb-2">Tip not found</h2>
          <p className="text-muted-foreground mb-4">
            The tip you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="hero" onClick={() => navigate("/learning")}>
            Browse All Tips
          </Button>
        </Card>
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
            <Link
              to={`/learning/category/${tip.category}`}
              className="hover:text-foreground transition-colors"
            >
              {tip.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1 max-w-[180px]">{tip.title}</span>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Title Card */}
            <Card className="p-6 shadow-card">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={cn("text-xs font-medium", CATEGORY_COLORS[tip.category])}>
                  {tip.category}
                </Badge>
                <Badge className={cn("text-xs font-medium", DIFFICULTY_COLORS[tip.difficulty])}>
                  {tip.difficulty}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold font-display leading-snug mb-2">{tip.title}</h1>
              <p className="text-muted-foreground mb-4">{tip.summary}</p>
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {tip.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {tip.rating.toFixed(1)}
                </span>
              </div>
            </Card>

            {/* Main tip content */}
            <Card className="p-6 shadow-card">
              <LearningModule tip={tip} />
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* CTA */}
            {user ? (
              <Card className="p-5 shadow-card bg-primary/5 border-primary/20">
                <h4 className="font-semibold font-display mb-2">Ready to Practice?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Apply what you've learned in a real mock interview session.
                </p>
                <Button variant="hero" size="sm" className="w-full" onClick={() => navigate("/interview/start")}>
                  Start Interview
                </Button>
              </Card>
            ) : (
              <Card className="p-5 shadow-card bg-primary/5 border-primary/20">
                <h4 className="font-semibold font-display mb-2">Practice with AI</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign up to take mock interviews and get AI-powered feedback.
                </p>
                <Button variant="hero" size="sm" className="w-full" onClick={() => navigate("/signup")}>
                  Get Started Free
                </Button>
              </Card>
            )}

            {/* Category browse */}
            <Card className="p-5 shadow-card">
              <h4 className="font-semibold font-display mb-3">Browse Category</h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/learning/category/${tip.category}`)}
              >
                All {tip.category} Tips
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Related Tips */}
        {relatedTips.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold font-display mb-4">Related Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedTips.map(related => (
                <TipCard key={related.id} tip={related} />
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
