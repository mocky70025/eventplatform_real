-- Check organizer data for a specific user
-- Replace 'YOUR_USER_ID' with the actual user ID from the error log
-- Example: SELECT * FROM organizers WHERE user_id = '27c35d78-df16-455f-bf47-3693b0f2ef8a';

-- Check all organizers
SELECT 
    id,
    user_id,
    company_name,
    name,
    email,
    created_at
FROM organizers
ORDER BY created_at DESC;

-- Check if a specific user has an organizer profile
-- Replace 'YOUR_USER_ID' with the actual user ID
-- SELECT * FROM organizers WHERE user_id = 'YOUR_USER_ID';

-- Check auth.users to see all users
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;
