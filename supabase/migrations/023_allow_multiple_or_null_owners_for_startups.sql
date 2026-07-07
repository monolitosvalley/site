-- Drop the unique constraint on owner_id to allow a single user to own multiple startups
ALTER TABLE startups DROP CONSTRAINT IF EXISTS startups_owner_id_key;

-- Make owner_id nullable so a startup can be registered/saved without an owner
ALTER TABLE startups ALTER COLUMN owner_id DROP NOT NULL;
