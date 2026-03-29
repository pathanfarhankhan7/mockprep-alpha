import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import StartInterviewPage from "./pages/StartInterviewPage";
import InterviewPage from "./pages/InterviewPage";
import ResultPage from "./pages/ResultPage";
import LearningHub from "./pages/LearningHub";
import TipDetailPage from "./pages/TipDetailPage";
import CategoryPage from "./pages/CategoryPage";
import ProgressDashboard from "./pages/ProgressDashboard";
import AIFeedbackPage from "./pages/AIFeedbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/interview/start" element={<ProtectedRoute><StartInterviewPage /></ProtectedRoute>} />
            <Route path="/interview/:sessionId" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
            <Route path="/interview/result/:sessionId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/learning/:tipId" element={<TipDetailPage />} />
            <Route path="/learning/category/:category" element={<CategoryPage />} />
            <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
            <Route path="/ai-coach" element={<AIFeedbackPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
