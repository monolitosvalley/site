-- Simplify team_members table to not require profile_id
-- Drop the old table and recreate
DROP TABLE IF EXISTS team_members CASCADE;

-- Create simplified team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    role VARCHAR(255) NOT NULL,
    linkedin VARCHAR(500),
    github VARCHAR(500),
    behance VARCHAR(500),
    portfolio VARCHAR(500),
    lattes VARCHAR(500),
    instagram VARCHAR(500),
    outros VARCHAR(500),
    position_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_team_members_startup_id ON team_members(startup_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_members_updated_at_trigger
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_team_members_updated_at();

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view team members
CREATE POLICY "team_members_select_policy" ON team_members
    FOR SELECT
    USING (true);

-- Only startup owner can insert team members
CREATE POLICY "team_members_insert_policy" ON team_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = team_members.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- Only startup owner can update team members
CREATE POLICY "team_members_update_policy" ON team_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = team_members.startup_id
            AND startups.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = team_members.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- Only startup owner can delete team members
CREATE POLICY "team_members_delete_policy" ON team_members
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM startups
            WHERE startups.id = team_members.startup_id
            AND startups.owner_id = auth.uid()
        )
    );
