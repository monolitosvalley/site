-- Migration to update startups table schema to match new requirements

-- First, drop the old enum and create new one
DROP TYPE IF EXISTS estagio_maturidade CASCADE;
CREATE TYPE estagio_maturidade AS ENUM ('ideia', 'mvp', 'tracao', 'escala');

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT;

-- Drop old columns from startups table
ALTER TABLE startups
DROP COLUMN IF EXISTS modelo_monetizacao,
DROP COLUMN IF EXISTS problema_abordado,
DROP COLUMN IF EXISTS solucao_oferecida,
DROP COLUMN IF EXISTS programas_previos,
DROP COLUMN IF EXISTS tecnologias_utilizadas,
DROP COLUMN IF EXISTS links_premios_noticias,
DROP COLUMN IF EXISTS publico_atende,
DROP COLUMN IF EXISTS is_esg;

-- Add new columns to startups table
ALTER TABLE startups
ADD COLUMN IF NOT EXISTS ano_fundacao INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS tecnologias TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tem_esg BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS detalhes_esg TEXT;

-- Re-add estagio_maturidade column with new enum
ALTER TABLE startups
ADD COLUMN estagio_maturidade_new estagio_maturidade;

-- Drop old column if exists
ALTER TABLE startups
DROP COLUMN IF EXISTS estagio_maturidade CASCADE;

-- Rename new column
ALTER TABLE startups
RENAME COLUMN estagio_maturidade_new TO estagio_maturidade;

-- Make description NOT NULL with default
ALTER TABLE startups
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN description SET NOT NULL;

-- Make segmento NOT NULL with default
ALTER TABLE startups
ALTER COLUMN segmento SET DEFAULT '',
ALTER COLUMN segmento SET NOT NULL;

-- Update indexes
DROP INDEX IF EXISTS idx_startups_estagio;
CREATE INDEX idx_startups_estagio ON startups(estagio_maturidade);
CREATE INDEX IF NOT EXISTS idx_startups_cidade ON startups(cidade);
CREATE INDEX IF NOT EXISTS idx_startups_estado ON startups(estado);
CREATE INDEX IF NOT EXISTS idx_startups_tem_esg ON startups(tem_esg) WHERE tem_esg = TRUE;

-- Update existing records to have default values
UPDATE startups 
SET 
  description = COALESCE(description, ''),
  segmento = COALESCE(segmento, ''),
  cidade = COALESCE(cidade, ''),
  estado = COALESCE(estado, ''),
  ano_fundacao = COALESCE(ano_fundacao, EXTRACT(YEAR FROM created_at)::INTEGER)
WHERE description IS NULL OR segmento IS NULL OR cidade IS NULL OR estado IS NULL OR ano_fundacao IS NULL;
