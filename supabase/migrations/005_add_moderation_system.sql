-- Add approved column to tables that need moderation
-- By default, content is not approved (needs admin review)

-- Blog posts need approval
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Events need approval
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Opportunities need approval
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Partners need approval
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Store products need approval
ALTER TABLE store_products 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Startups are auto-approved (users manage their own)
-- But we add the column for future moderation if needed
ALTER TABLE startups 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_approved ON blog_posts(approved);
CREATE INDEX IF NOT EXISTS idx_events_approved ON events(approved);
CREATE INDEX IF NOT EXISTS idx_opportunities_approved ON opportunities(approved);
CREATE INDEX IF NOT EXISTS idx_partners_approved ON partners(approved);
CREATE INDEX IF NOT EXISTS idx_store_products_approved ON store_products(approved);
CREATE INDEX IF NOT EXISTS idx_startups_approved ON startups(approved);

-- Update RLS policies to only show approved content to non-admins
-- Blog posts: only show approved to public
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Events: only show approved to public
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Opportunities: only show approved to public
DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON opportunities;
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Partners: only show approved to public
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON partners;
CREATE POLICY "Partners are viewable by everyone" ON partners
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Store products: only show approved to public
DROP POLICY IF EXISTS "Store products are viewable by everyone" ON store_products;
CREATE POLICY "Store products are viewable by everyone" ON store_products
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Startups: all approved by default (users manage their own)
DROP POLICY IF EXISTS "Startups are viewable by everyone" ON startups;
CREATE POLICY "Startups are viewable by everyone" ON startups
  FOR SELECT USING (
    approved = true OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Allow admins to update approved status
CREATE POLICY "Admins can update blog posts" ON blog_posts
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update events" ON events
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update opportunities" ON opportunities
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update partners" ON partners
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update store products" ON store_products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
