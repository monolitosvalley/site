-- Make profile_id mandatory and unique in community_leaders
ALTER TABLE community_leaders ALTER COLUMN profile_id SET NOT NULL;
ALTER TABLE community_leaders ADD CONSTRAINT community_leaders_profile_id_key UNIQUE (profile_id);

-- Drop full_name and email columns since they are queried from profiles table
ALTER TABLE community_leaders DROP COLUMN IF EXISTS full_name;
ALTER TABLE community_leaders DROP COLUMN IF EXISTS email;
ALTER TABLE community_leaders DROP COLUMN IF EXISTS photo_url;
