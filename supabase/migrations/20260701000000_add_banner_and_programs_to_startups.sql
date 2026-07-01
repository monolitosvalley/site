-- Add columns to startups
ALTER TABLE startups
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS programas_investimentos TEXT;

-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('banners', 'banners', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
CREATE POLICY "Banner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'banners' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
