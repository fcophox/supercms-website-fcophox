-- Modify existing table or create new
ALTER TABLE IF EXISTS contact_messages
ADD COLUMN IF NOT EXISTS message_type text,
ADD COLUMN IF NOT EXISTS budget integer,
ADD COLUMN IF NOT EXISTS estimated_time text,
ADD COLUMN IF NOT EXISTS target_url text,
ADD COLUMN IF NOT EXISTS meeting_time text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pendiente';
