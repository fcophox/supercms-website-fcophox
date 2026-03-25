-- Update availability_settings table to support per-day slot restrictions
ALTER TABLE availability_settings ADD COLUMN IF NOT EXISTS daily_slot_restrictions JSONB DEFAULT '{}'::jsonb;

-- Comment on usage: daily_slot_restrictions will be like { "1": ["18:30..."], "2": [...] } where key is day number (0-6)
