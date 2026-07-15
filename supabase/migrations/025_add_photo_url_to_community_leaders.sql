-- Add photo_url to community_leaders table
ALTER TABLE community_leaders ADD COLUMN IF NOT EXISTS photo_url TEXT;
