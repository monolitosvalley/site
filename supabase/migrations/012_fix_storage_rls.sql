-- Fix Storage RLS policies for image uploads

-- Allow authenticated users to upload to opportunities bucket
CREATE POLICY "Allow authenticated users to upload opportunities images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'opportunities' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to upload to events bucket
CREATE POLICY "Allow authenticated users to upload events images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to upload to blog bucket
CREATE POLICY "Allow authenticated users to upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to upload to partners bucket
CREATE POLICY "Allow authenticated users to upload partners images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'partners' AND
  auth.role() = 'authenticated'
);

-- Allow public to read all images
CREATE POLICY "Allow public to read opportunities images"
ON storage.objects FOR SELECT
USING (bucket_id = 'opportunities');

CREATE POLICY "Allow public to read events images"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Allow public to read blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Allow public to read partners images"
ON storage.objects FOR SELECT
USING (bucket_id = 'partners');
