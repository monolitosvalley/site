-- Add missing columns to tables

-- Blog posts: add excerpt column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Events: add created_by column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Opportunities: add category column
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Partners: add category column
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Update RLS policies for created_by columns
-- Allow users to create events
DROP POLICY IF EXISTS "Users can create events" ON events;
CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Allow users to update their own events
DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Allow users to delete their own events
DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
