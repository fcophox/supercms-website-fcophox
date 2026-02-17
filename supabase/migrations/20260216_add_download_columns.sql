-- Add download columns to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS download_title TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS download_description TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS download_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS download_type TEXT;

-- Add download columns to case_studies
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS download_title TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS download_description TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS download_url TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS download_type TEXT;

-- Add download columns to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS download_title TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS download_description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS download_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS download_type TEXT;
