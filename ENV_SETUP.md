# Environment Variables Setup Guide

## Supabase Configuration

Create a `.env.local` file in each app directory (organizer, store, admin) with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to get these values:

1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Go to "API" section
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Files to create:

- `/organizer/.env.local`
- `/store/.env.local`
- `/admin/.env.local`

**Note**: These files are gitignored and will not be committed to version control.
