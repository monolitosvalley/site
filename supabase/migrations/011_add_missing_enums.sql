-- Add maturity_stage column to startups if it doesn't exist
ALTER TABLE startups 
ADD COLUMN IF NOT EXISTS maturity_stage estagio_maturidade;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_startups_maturity_stage ON startups(maturity_stage);
