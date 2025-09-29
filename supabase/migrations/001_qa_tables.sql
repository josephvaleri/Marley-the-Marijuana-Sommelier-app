-- Q&A Tables
CREATE TABLE IF NOT EXISTS qa_questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_answers (
  answer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES qa_questions(question_id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('database', 'reference', 'openai')),
  answer_md text NOT NULL,
  confidence numeric(3,2),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_feedback (
  question_id uuid REFERENCES qa_questions(question_id) ON DELETE CASCADE,
  answer_id uuid REFERENCES qa_answers(answer_id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback smallint CHECK (feedback IN (1, -1)),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (question_id, answer_id, user_id)
);

CREATE TABLE IF NOT EXISTS ml_training_queue (
  item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES qa_questions(question_id) ON DELETE CASCADE,
  answer_id uuid REFERENCES qa_answers(answer_id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied', 'exported')),
  moderator_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  updated_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Add trial and billing columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
ADD COLUMN IF NOT EXISTS subscription_status text,
ADD COLUMN IF NOT EXISTS price_id text,
ADD COLUMN IF NOT EXISTS renewal_at timestamptz,
ADD COLUMN IF NOT EXISTS app_role text DEFAULT 'user';

-- RLS Policies
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_training_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Q&A Questions policies
CREATE POLICY "Users can read their own questions" ON qa_questions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questions" ON qa_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all questions" ON qa_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.app_role IN ('admin', 'moderator')
    )
  );

-- Q&A Answers policies
CREATE POLICY "Public can read answers" ON qa_answers
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert answers" ON qa_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.app_role IN ('admin', 'moderator')
    )
  );

-- Q&A Feedback policies
CREATE POLICY "Users can manage their own feedback" ON qa_feedback
  FOR ALL USING (auth.uid() = user_id);

-- ML Training Queue policies
CREATE POLICY "Admins can manage training queue" ON ml_training_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.app_role IN ('admin', 'moderator')
    )
  );

-- Settings policies
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.app_role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
  ('welcome_message', '{"md": "Welcome to Marley the Marijuana Sommelier! I''m here to help you discover the perfect strains for your needs."}'),
  ('pricing', '{"monthly": 1.99, "yearly": 28.99}'),
  ('trial_days', 7)
ON CONFLICT (key) DO NOTHING;

