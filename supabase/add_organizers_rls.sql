-- Add RLS policies for organizers table
-- Allow organizers to read and update their own data
-- Allow public read for organizers (so exhibitors can view organizer info)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Organizers can read their own data" ON organizers;
DROP POLICY IF EXISTS "Organizers can update their own data" ON organizers;
DROP POLICY IF EXISTS "Organizers can insert their own data" ON organizers;
DROP POLICY IF EXISTS "Public can read organizers" ON organizers;

-- Allow organizers to read their own data
CREATE POLICY "Organizers can read their own data" ON organizers
    FOR SELECT
    USING (user_id = auth.uid());

-- Allow organizers to update their own data
CREATE POLICY "Organizers can update their own data" ON organizers
    FOR UPDATE
    USING (user_id = auth.uid());

-- Allow organizers to insert their own data
CREATE POLICY "Organizers can insert their own data" ON organizers
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Allow public read for organizers (so exhibitors can view organizer info when viewing events)
CREATE POLICY "Public can read organizers" ON organizers
    FOR SELECT
    USING (true);
