-- Update pitch-decks bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'pitch-decks';

-- Drop the old private policy
DROP POLICY IF EXISTS "Authenticated users can view own pitch decks" ON storage.objects;

-- Create new public policy for pitch-decks
CREATE POLICY "Pitch decks are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pitch-decks');
