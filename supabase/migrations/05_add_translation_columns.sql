-- Add English translation columns to articles table
alter table public.articles 
add column title_en text,
add column slug_en text,
add column content_en text;
