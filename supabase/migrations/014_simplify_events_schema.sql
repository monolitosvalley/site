-- Simplify events table: use timestamp instead of separate date/time columns

-- Add event_datetime column (timestamp with timezone)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_datetime TIMESTAMP WITH TIME ZONE;

-- Add duration_minutes column (optional, for event length)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 120;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(event_datetime);
