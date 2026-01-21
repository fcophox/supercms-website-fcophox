-- Add published_at and tags columns to articles
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add published_at and tags columns to case_studies
ALTER TABLE case_studies 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add published_at and tags columns to services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tags TEXT[];
