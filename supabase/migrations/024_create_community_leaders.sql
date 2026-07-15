-- Create community_leaders table
CREATE TABLE IF NOT EXISTS community_leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role_title TEXT NOT NULL,
    startup_name TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    checklist JSONB DEFAULT '[]'::jsonb,
    monthly_engagement JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE community_leaders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to community leaders (for showcasing in the future)
CREATE POLICY "Allow public read access to community_leaders"
ON community_leaders FOR SELECT
USING (true);

-- Allow all operations for admin profiles
CREATE POLICY "Allow all operations for admins on community_leaders"
ON community_leaders FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
