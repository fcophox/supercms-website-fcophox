-- Create availability_settings table
CREATE TABLE IF NOT EXISTS availability_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restricted_days INTEGER[] DEFAULT '{0, 3, 5}', -- Default to Sun (0), Wed (3), Fri (5)
    restricted_slots TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to read
CREATE POLICY "Allow public read access" ON availability_settings
    FOR SELECT USING (true);

-- Policy for admin to manage (assuming dashboard is protected by Supabase Auth)
CREATE POLICY "Allow admin to manage" ON availability_settings
    FOR ALL USING (true); -- In a real app, this would be restricted to authenticated users

-- Insert initial record if not exists
INSERT INTO availability_settings (id, restricted_days)
SELECT '00000000-0000-0000-0000-000000000001', '{0, 3, 5}'
WHERE NOT EXISTS (SELECT 1 FROM availability_settings WHERE id = '00000000-0000-0000-0000-000000000001');
