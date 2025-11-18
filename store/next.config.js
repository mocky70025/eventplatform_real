/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
    NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI: process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ORGANIZER_URL: process.env.NEXT_PUBLIC_ORGANIZER_URL,
  }
}

module.exports = nextConfig
