-- Add new opportunity types to enum (lowercase, no accents)
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'investidor';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'edital';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'inovacao_aberta';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'beneficio';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'vaga';

-- Remove old values (execute these manually in Supabase SQL Editor if needed)
-- ALTER TYPE opportunity_type DROP VALUE 'Investidor';
-- ALTER TYPE opportunity_type DROP VALUE 'Edital';
-- ALTER TYPE opportunity_type DROP VALUE 'InovacaoAberta';
-- ALTER TYPE opportunity_type DROP VALUE 'Beneficio';
-- ALTER TYPE opportunity_type DROP VALUE 'Mentoria';
-- ALTER TYPE opportunity_type DROP VALUE 'Parceria';
-- ALTER TYPE opportunity_type DROP VALUE 'Bolsa';
-- ALTER TYPE opportunity_type DROP VALUE 'Capacitação';
-- ALTER TYPE opportunity_type DROP VALUE 'apagar';
-- ALTER TYPE opportunity_type DROP VALUE 'apagar2';
