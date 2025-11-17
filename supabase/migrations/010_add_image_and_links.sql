-- Add image_url and application_url to opportunities
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS application_url TEXT;

-- Add image_url to events (if not exists)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url to blog_posts (if not exists)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url to partners (if not exists)
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS image_url TEXT;
