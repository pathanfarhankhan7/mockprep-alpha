-- Questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  ideal_answer TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are readable by authenticated users"
  ON public.questions FOR SELECT TO authenticated USING (true);

-- Interview sessions table
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_score INTEGER
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.interview_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.interview_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.interview_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Interview results table
CREATE TABLE public.interview_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  user_answer TEXT NOT NULL,
  semantic_score INTEGER NOT NULL DEFAULT 0,
  keyword_score INTEGER NOT NULL DEFAULT 0,
  final_score INTEGER NOT NULL DEFAULT 0,
  feedback TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
  ON public.interview_results FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT id FROM public.interview_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert results for their sessions"
  ON public.interview_results FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.interview_sessions WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_questions_role_category ON public.questions(role, category);
CREATE INDEX idx_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX idx_results_session_id ON public.interview_results(session_id);