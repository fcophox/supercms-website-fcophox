-- Migration to create case_studies and services tables
-- Run this in your Supabase SQL Editor

-- 1. Create case_studies table
create table if not exists public.case_studies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null,
  content text,
  image_url text,
  status text default 'draft'::text,
  
  -- English fields
  title_en text,
  slug_en text,
  content_en text
);

-- 2. Create services table
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null,
  content text,
  image_url text,
  
  -- English fields
  title_en text,
  slug_en text,
  content_en text
);

-- Enable RLS (Row Level Security) - Optional but recommended
alter table public.case_studies enable row level security;
alter table public.services enable row level security;

-- Create basic policies (Allow read to everyone, write to authenticated)
-- Adjust these based on your actual security requirements
create policy "Public case studies are viewable by everyone"
  on public.case_studies for select
  using ( true );

create policy "Authenticated users can insert case studies"
  on public.case_studies for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update case studies"
  on public.case_studies for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can delete case studies"
  on public.case_studies for delete
  using ( auth.role() = 'authenticated' );

-- Policies for services
create policy "Public services are viewable by everyone"
  on public.services for select
  using ( true );

create policy "Authenticated users can insert services"
  on public.services for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update services"
  on public.services for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can delete services"
  on public.services for delete
  using ( auth.role() = 'authenticated' );
