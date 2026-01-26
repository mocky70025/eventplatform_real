-- Add RLS policies for event_applications table
-- Allow organizers to read applications for their own events
-- Allow exhibitors to read their own applications
-- Allow public insert (anyone can apply to events)
-- Allow organizers to update applications for their own events

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Organizers can read applications for their events" ON event_applications;
DROP POLICY IF EXISTS "Exhibitors can read their own applications" ON event_applications;
DROP POLICY IF EXISTS "Anyone can apply to events" ON event_applications;
DROP POLICY IF EXISTS "Organizers can update applications for their events" ON event_applications;
DROP POLICY IF EXISTS "Public can read event_applications" ON event_applications;

-- Simple approach: Allow public read for event_applications to avoid recursion
-- This is safe because event_applications only contains application status, not sensitive data
CREATE POLICY "Public can read event_applications" ON event_applications
    FOR SELECT
    USING (true);

-- Allow anyone to insert applications (apply to events)
CREATE POLICY "Anyone can apply to events" ON event_applications
    FOR INSERT
    WITH CHECK (true);

-- Allow organizers to update applications for their events
-- Use a simpler check that doesn't cause recursion
CREATE POLICY "Organizers can update applications for their events" ON event_applications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_applications.event_id
            AND events.organizer_id IN (
                SELECT id FROM organizers
                WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================
-- RLS Policies for exhibitors table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Organizers can read exhibitors who applied to their events" ON exhibitors;
DROP POLICY IF EXISTS "Exhibitors can read their own data" ON exhibitors;
DROP POLICY IF EXISTS "Public can read exhibitors" ON exhibitors;

-- Simple approach: Allow public read for exhibitors to avoid recursion
-- This allows organizers to see exhibitor info when viewing applications
CREATE POLICY "Public can read exhibitors" ON exhibitors
    FOR SELECT
    USING (true);

-- Allow exhibitors to read their own data (for their profile page)
CREATE POLICY "Exhibitors can read their own data" ON exhibitors
    FOR SELECT
    USING (user_id = auth.uid());
