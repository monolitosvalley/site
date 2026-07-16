-- Security hardening for RLS policies

-- 1. Fix storage buckets: restrict uploads to prevent abuse
-- Opportunities bucket: only owner of the startup or admin can upload
CREATE POLICY "Allow only startup owners to upload opportunities images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'opportunities' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

-- Events bucket: only admins can upload (events are managed by admins)
CREATE POLICY "Allow only admins to upload events images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'events' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Blog bucket: only authors or admins can upload
CREATE POLICY "Allow only authors to upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'blog' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM blog_posts
        WHERE blog_posts.id::text = storage.objects.name
        AND blog_posts.author_id = auth.uid()
    )
);

-- Partners bucket: only admins can upload logos
CREATE POLICY "Allow only admins to upload partners images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'partners' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Team members bucket: only startup owners can upload member photos
CREATE POLICY "Allow only startup owners to upload team member photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'team-members' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

-- 2. Restrict UPDATE/DELETE on storage objects
-- Opportunities: only uploader or admin can update/delete
CREATE POLICY "Allow uploaders to update opportunities images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'opportunities' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
)
WITH CHECK (
    bucket_id = 'opportunities' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

CREATE POLICY "Allow uploaders to delete opportunities images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'opportunities' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

-- Events: only admins can update/delete
CREATE POLICY "Allow only admins to update events images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'events' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    bucket_id = 'events' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow only admins to delete events images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'events' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Blog: only authors or admins can update/delete
CREATE POLICY "Allow authors to update blog images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'blog' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM blog_posts
        WHERE blog_posts.id::text = storage.objects.name
        AND blog_posts.author_id = auth.uid()
    )
)
WITH CHECK (
    bucket_id = 'blog' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM blog_posts
        WHERE blog_posts.id::text = storage.objects.name
        AND blog_posts.author_id = auth.uid()
    )
);

CREATE POLICY "Allow authors to delete blog images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'blog' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM blog_posts
        WHERE blog_posts.id::text = storage.objects.name
        AND blog_posts.author_id = auth.uid()
    )
);

-- Partners: only admins can update/delete
CREATE POLICY "Allow only admins to update partners images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'partners' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    bucket_id = 'partners' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow only admins to delete partners images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'partners' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Team members: only startup owners can update/delete
CREATE POLICY "Allow startup owners to update team member photos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'team-members' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
)
WITH CHECK (
    bucket_id = 'team-members' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

CREATE POLICY "Allow startup owners to delete team member photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'team-members' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM startups
        WHERE startups.id::text = storage.objects.name
        AND startups.owner_id = auth.uid()
    )
);

-- 3. Add missing policies for community_leaders INSERT
CREATE POLICY "Users can create their own community leader profile"
ON community_leaders
FOR INSERT
WITH CHECK (
    auth.uid() = profile_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Users can update their own community leader profile"
ON community_leaders
FOR UPDATE
USING (
    auth.uid() = profile_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() = profile_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Users can delete their own community leader profile"
ON community_leaders
FOR DELETE
USING (
    auth.uid() = profile_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 4. Add missing policies for store_products (if needed for admins)
CREATE POLICY "Admins can insert store products"
ON store_products
FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can update store products"
ON store_products
FOR UPDATE
USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can delete store products"
ON store_products
FOR DELETE
USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
