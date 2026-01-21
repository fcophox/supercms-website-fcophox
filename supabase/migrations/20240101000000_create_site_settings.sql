-- Create a table for site-wide settings
create table if not exists site_settings (
  key text primary key,
  value boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default values safely (do nothing if they exist)
insert into site_settings (key, value)
values 
  ('articles_visible', true),
  ('case_studies_visible', true),
  ('services_visible', true)
on conflict (key) do nothing;

-- Enable Row Level Security (RLS)
alter table site_settings enable row level security;

-- Create policies (modify as needed for your auth setup)
-- Allow public read access
create policy "Public settings are viewable by everyone."
  on site_settings for select
  using ( true );

-- Allow authenticated users (admins) to update
create policy "Admins can update settings."
  on site_settings for update
  using ( auth.role() = 'authenticated' );

-- Allow authenticated users to insert (if needed)
create policy "Admins can insert settings."
  on site_settings for insert
  with check ( auth.role() = 'authenticated' );
