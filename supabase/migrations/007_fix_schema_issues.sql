-- Fix schema issues for events, partners, and opportunities

-- 1. Events: add date and time columns (keep event_date for backward compatibility)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS time TIME;

-- 2. Partners: add description and created_by columns
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 3. Opportunities: add created_by column for RLS
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON opportunities(created_by);
CREATE INDEX IF NOT EXISTS idx_partners_created_by ON partners(created_by);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(time);

-- Update RLS policies for opportunities to allow users to create
DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON opportunities;
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can create opportunities" ON opportunities;
CREATE POLICY "Users can create opportunities" ON opportunities
  FOR INSERT WITH CHECK (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can update their own opportunities" ON opportunities;
CREATE POLICY "Users can update their own opportunities" ON opportunities
  FOR UPDATE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own opportunities" ON opportunities;
CREATE POLICY "Users can delete their own opportunities" ON opportunities
  FOR DELETE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Update RLS policies for partners to allow users to create
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON partners;
CREATE POLICY "Partners are viewable by everyone" ON partners
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can create partners" ON partners;
CREATE POLICY "Users can create partners" ON partners
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update partners" ON partners;
CREATE POLICY "Admins can update partners" ON partners
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Update RLS policies for events to allow users to create
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can create events" ON events;
CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
