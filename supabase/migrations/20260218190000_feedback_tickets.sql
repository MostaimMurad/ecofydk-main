-- Migration: Create feedback_tickets table for Admin Issue Tracker
CREATE TABLE IF NOT EXISTS feedback_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_from_url TEXT,
  screenshot_url TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback_tickets ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins) can access
CREATE POLICY "Authenticated users can view all tickets"
  ON feedback_tickets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tickets"
  ON feedback_tickets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tickets"
  ON feedback_tickets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete tickets"
  ON feedback_tickets FOR DELETE TO authenticated USING (true);

-- Grant permissions
GRANT ALL ON feedback_tickets TO authenticated;

-- Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-screenshots', 'feedback-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload screenshots"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'feedback-screenshots');

CREATE POLICY "Anyone can view screenshots"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'feedback-screenshots');
