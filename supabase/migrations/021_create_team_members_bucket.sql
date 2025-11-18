-- Create team-members bucket for storing member photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-members', 'team-members', true)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for team-members bucket
CREATE POLICY "Public read access for team member photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-members');

CREATE POLICY "Authenticated users can upload team member photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'team-members'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own team member photos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'team-members'
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'team-members'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own team member photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'team-members'
    AND auth.role() = 'authenticated'
);
