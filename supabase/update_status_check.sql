-- Add 'pending' and 'rejected' to the checks for event status
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'pending', 'published', 'rejected', 'ended'));

-- Ensure is_approved is false by default for new organizers (already default false, but good to verify)
-- UPDATE organizers SET is_approved = false WHERE is_approved IS NULL;

-- Update RLS policy for events to check for organizer approval
DROP POLICY IF EXISTS "Organizers can create events" ON events;
CREATE POLICY "Organizers can create events" 
  ON events FOR INSERT WITH CHECK (
    organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid() AND is_approved = true)
  );
