ALTER TABLE IF EXISTS contact_messages
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

UPDATE contact_messages SET is_archived = false WHERE is_archived IS NULL;
