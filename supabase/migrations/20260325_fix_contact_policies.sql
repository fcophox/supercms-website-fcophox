-- Ensure RLS is enabled and policies allow management
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read (we need this to fetch the list in the dashboard for now)
-- PROD: In a real app, this should be restricted to authenticated users.
CREATE POLICY IF NOT EXISTS "Allow all for demo" ON contact_messages
    FOR ALL USING (true) WITH CHECK (true);
