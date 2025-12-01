-- Adicionar colunas address e link na tabela events
-- Separar local físico (address) de link online (link)

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS link TEXT;

-- Adicionar comentários
COMMENT ON COLUMN events.address IS 'Endereço físico do evento (presencial)';
COMMENT ON COLUMN events.link IS 'Link online do evento (Google Meet, Zoom, etc)';

-- Migrar dados existentes de location para address (se houver)
UPDATE events 
SET address = location 
WHERE location IS NOT NULL 
  AND location != '' 
  AND address IS NULL;
