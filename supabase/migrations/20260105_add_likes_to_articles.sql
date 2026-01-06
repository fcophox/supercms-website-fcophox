-- Add likes column to articles table
ALTER TABLE public.articles ADD COLUMN likes integer DEFAULT 0;
