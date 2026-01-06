-- Add slug column to articles table
alter table public.articles 
add column slug text;

-- Create an index on slug for faster lookups (optional but recommended)
create index articles_slug_idx on public.articles (slug);
