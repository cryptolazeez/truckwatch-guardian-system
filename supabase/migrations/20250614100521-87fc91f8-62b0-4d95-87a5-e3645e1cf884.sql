
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo TEXT, -- e.g., 'QN', 'WI', or a URL to an image
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT,
  notification_time TIMESTAMPTZ NOT NULL, -- The actual time of the event
  is_new BOOLEAN DEFAULT TRUE,
  link_to TEXT, -- Optional URL for the notification to link to
  created_at TIMESTAMPTZ DEFAULT now() -- Timestamp of when the record was created
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all notifications
CREATE POLICY "Authenticated users can read notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow service_role to perform all operations (e.g., for system-generated notifications)
CREATE POLICY "Allow full access for service_role"
  ON public.notifications
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable real-time updates for the notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add the table to the supabase_realtime publication if it's not already there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications' AND schemaname = 'public'
  ) THEN
    -- Check if the publication exists, create if not (though Supabase usually handles this)
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- Insert some sample data
-- Current date is 2025-06-14
-- '1 day ago' -> 2025-06-13
-- '2 days ago' -> 2025-06-12
INSERT INTO public.notifications (logo, title, message, source, notification_time, is_new, link_to) VALUES
('QN', 'New comment', 'Could you explain better?', 'QuotidianoNazionale - SoluzioneFAD', '2025-06-13T10:00:00Z', TRUE, '#'),
('WI', 'Wired IT', 'New publisher - Senior', 'Five solutions for greater impact - SoluzioneFAD', '2025-06-12T14:30:00Z', TRUE, '#'),
('Sys', 'System Update', 'A new feature has been rolled out!', 'Platform Team', NOW() - INTERVAL '5 hours', TRUE, '/features/new');

