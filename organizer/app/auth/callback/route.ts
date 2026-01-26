import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';
    const type = searchParams.get('type') ?? '';

    if (error) {
        console.error('Auth error:', error, error_description);
        return NextResponse.redirect(`${origin}/login?error=${error}&error_description=${error_description}`);
    }

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.user) {
            // If this is a password recovery, redirect directly to the next page (likely /reset-password)
            if (type === 'recovery') {
                return NextResponse.redirect(`${origin}${next}`);
            }

            // Verify session is established
            const { data: { session } } = await supabase.auth.getSession();
            console.log('=== Auth Callback Debug ===');
            console.log('User ID:', data.user.id);
            console.log('User Email:', data.user.email);
            console.log('Session exists:', !!session);
            console.log('Session user ID:', session?.user?.id);

            // Check if profile exists
            // Use .maybeSingle() instead of .single() to avoid error when no rows found
            const { data: profile, error: profileError } = await supabase
                .from('organizers')
                .select('id, user_id, company_name')
                .eq('user_id', data.user.id)
                .maybeSingle();

            console.log('Profile data:', profile);
            console.log('Profile error code:', profileError?.code);
            console.log('Profile error message:', profileError?.message);
            console.log('Profile error details:', profileError ? JSON.stringify(profileError, null, 2) : 'No error');

            // If there's an error (other than "no rows found"), log it
            if (profileError) {
                console.error('Error fetching profile:', {
                    code: profileError.code,
                    message: profileError.message,
                    details: profileError.details,
                    hint: profileError.hint
                });

                // 42501 = insufficient privilege (RLS policy issue)
                if (profileError.code === '42501') {
                    console.error('RLS policy error - user does not have permission to read organizers table');
                    return NextResponse.redirect(`${origin}/onboarding`);
                } else {
                    // Other errors - log and redirect to onboarding
                    console.error('Unexpected error fetching profile:', profileError);
                    return NextResponse.redirect(`${origin}/onboarding`);
                }
            }

            // If no profile found (no error, but profile is null), redirect to onboarding
            if (!profile) {
                console.log('No profile found for user, redirecting to onboarding');
                return NextResponse.redirect(`${origin}/onboarding`);
            }

            console.log('Profile found successfully, redirecting to:', next);
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
