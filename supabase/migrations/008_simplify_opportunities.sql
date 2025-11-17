-- Simplify opportunities table: remove category column and add active status

-- Remove redundant category column if it exists
ALTER TABLE opportunities 
DROP COLUMN IF EXISTS category;

-- Add active column (default true for new opportunities)
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Create index for active opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(active);
CREATE INDEX IF NOT EXISTS idx_opportunities_active_approved ON opportunities(active, approved);