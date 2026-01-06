-- Add category column to articles
ALTER TABLE IF EXISTS public.articles
ADD COLUMN IF NOT EXISTS category text;

-- Add category column to case_studies
ALTER TABLE IF EXISTS public.case_studies
ADD COLUMN IF NOT EXISTS category text;

-- Add category column to services
ALTER TABLE IF EXISTS public.services
ADD COLUMN IF NOT EXISTS category text;
