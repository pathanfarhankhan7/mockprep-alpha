import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/hooks/useTheme";
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
// Multi-stage interview pages
import SetupPage from "./pages/interview/SetupPage";
import PhoneScreenPage from "./pages/interview/PhoneScreenPage";
import TechnicalPage from "./pages/interview/TechnicalPage";
import DeepDivePage from "./pages/interview/DeepDivePage";
import HRPage from "./pages/interview/HRPage";
import AnalysisPage from "./pages/interview/AnalysisPage";
import ReportPage from "./pages/interview/ReportPage";
import HistoryPage from "./pages/interview/HistoryPage";

const queryClient = new QueryClient();

function ThemeInitializer() {
  useTheme(); // Reads localStorage and applies dark class on mount
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInitializer />
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
            {/* Legacy interview flow — keep untouched */}
            <Route path="/interview/start" element={<ProtectedRoute><StartInterviewPage /></ProtectedRoute>} />
            <Route path="/interview/result/:sessionId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            {/* Multi-stage interview flow */}
            <Route path="/interview/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
            <Route path="/interview/phone-screen" element={<ProtectedRoute><PhoneScreenPage /></ProtectedRoute>} />
            <Route path="/interview/technical" element={<ProtectedRoute><TechnicalPage /></ProtectedRoute>} />
            <Route path="/interview/deep-dive" element={<ProtectedRoute><DeepDivePage /></ProtectedRoute>} />
            <Route path="/interview/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
            <Route path="/interview/analysis/:interviewId" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
            <Route path="/interview/report/:interviewId" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
            <Route path="/interview/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            {/* Dynamic legacy route — must come after all static /interview/* routes */}
            <Route path="/interview/:sessionId" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
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
