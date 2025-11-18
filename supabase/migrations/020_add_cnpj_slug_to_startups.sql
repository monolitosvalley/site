-- Add CNPJ and slug columns to startups table
ALTER TABLE startups
ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18),
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create index for slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_startups_slug ON startups(slug);

-- Create a function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+',
            '-',
            'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically generate slug when name changes
CREATE OR REPLACE FUNCTION update_startup_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND (OLD.name IS NULL OR OLD.name != NEW.name) THEN
        NEW.slug := generate_slug(NEW.name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS startup_slug_trigger ON startups;
CREATE TRIGGER startup_slug_trigger
BEFORE INSERT OR UPDATE ON startups
FOR EACH ROW
EXECUTE FUNCTION update_startup_slug();

-- Update existing startups with slugs
UPDATE startups
SET slug = generate_slug(name)
WHERE slug IS NULL;
