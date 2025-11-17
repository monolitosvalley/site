-- Create storage buckets for images

-- Opportunities bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('opportunities', 'opportunities', true)
ON CONFLICT (id) DO NOTHING;

-- Partners bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('partners', 'partners', true)
ON CONFLICT (id) DO NOTHING;

-- Events bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Blog bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for public read access
CREATE POLICY "Public read access for opportunities" ON storage.objects
  FOR SELECT USING (bucket_id = 'opportunities');

CREATE POLICY "Public read access for partners" ON storage.objects
  FOR SELECT USING (bucket_id = 'partners');

CREATE POLICY "Public read access for events" ON storage.objects
  FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Public read access for blog" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to opportunities" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'opportunities' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload to partners" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'partners' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload to events" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'events' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload to blog" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog' AND
    auth.role() = 'authenticated'
  );
