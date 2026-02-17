-- Add likes column to case_studies and services
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

-- Create a more flexible RPC for incrementing likes that supports UUIDs
CREATE OR REPLACE FUNCTION increment_likes_uuid(table_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET likes = COALESCE(likes, 0) + 1 WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update or create one for BigInt if needed, but let's make it generic for text ID if possible
-- Actually, the current increment_likes works for articles (bigint).
