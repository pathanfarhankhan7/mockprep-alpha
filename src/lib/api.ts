import { supabase } from "@/integrations/supabase/client";

// Types
export interface Question {
  id: string;
  role: string;
  category: string;
  question: string;
  keywords: string[];
  ideal_answer: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  role: string;
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
}

export interface InterviewResult {
  id: string;
  session_id: string;
  question_id: string;
  user_answer: string;
  semantic_score: number;
  keyword_score: number;
  final_score: number;
  feedback: string;
  question?: Question;
}

export interface PerformanceData {
  category: string;
  avg_score: number;
  total_questions: number;
}

// Auth
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Interview
export async function startInterview(role: string): Promise<InterviewSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("interview_sessions")
    .insert({ user_id: user.id, role })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRandomQuestion(role: string, category: string, excludeIds: string[] = []): Promise<Question | null> {
  let query = supabase
    .from("questions")
    .select("*")
    .eq("role", role)
    .eq("category", category);

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  return data[Math.floor(Math.random() * data.length)];
}

export async function getQuestionsByRole(role: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("role", role);
  if (error) throw error;
  return data || [];
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  userAnswer: string
): Promise<InterviewResult> {
  const { data, error } = await supabase.functions.invoke("evaluate-answer", {
    body: { session_id: sessionId, question_id: questionId, user_answer: userAnswer },
  });
  if (error) throw error;
  return data;
}

export async function completeInterview(sessionId: string) {
  // Calculate average score
  const { data: results } = await supabase
    .from("interview_results")
    .select("final_score")
    .eq("session_id", sessionId);

  const totalScore = results && results.length > 0
    ? results.reduce((sum, r) => sum + r.final_score, 0) / results.length
    : 0;

  const { error } = await supabase
    .from("interview_sessions")
    .update({ completed_at: new Date().toISOString(), total_score: Math.round(totalScore) })
    .eq("id", sessionId);
  if (error) throw error;
}

export async function getSessionResults(sessionId: string): Promise<InterviewResult[]> {
  const { data, error } = await supabase
    .from("interview_results")
    .select("*, question:questions(*)")
    .eq("session_id", sessionId);
  if (error) throw error;
  return data || [];
}

// Dashboard
export async function getInterviewHistory(): Promise<InterviewSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPerformanceByCategory(): Promise<PerformanceData[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: sessions } = await supabase
    .from("interview_sessions")
    .select("id")
    .eq("user_id", user.id);

  if (!sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map(s => s.id);
  const { data: results, error } = await supabase
    .from("interview_results")
    .select("final_score, question:questions(category)")
    .in("session_id", sessionIds);

  if (error) throw error;
  if (!results) return [];

  const categoryMap: Record<string, { total: number; count: number }> = {};
  results.forEach((r: any) => {
    const cat = r.question?.category || "Unknown";
    if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
    categoryMap[cat].total += r.final_score;
    categoryMap[cat].count += 1;
  });

  return Object.entries(categoryMap).map(([category, { total, count }]) => ({
    category,
    avg_score: Math.round(total / count),
    total_questions: count,
  }));
}
