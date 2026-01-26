import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=no-code`);
    }

    const client_id = process.env.LINE_CHANNEL_ID;
    const client_secret = process.env.LINE_CHANNEL_SECRET;
    const redirect_uri = `${origin}/api/auth/line/callback`;

    if (!client_id || !client_secret) {
        return NextResponse.json({ error: 'LINE credentials missing' }, { status: 500 });
    }

    try {
        console.log('1. Starting token exchange with code:', code);
        // 1. Exchange code for access token (and ID Token)
        const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                client_id: client_id,
                client_secret: client_secret,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('LINE Token Error response:', tokenData);
            return NextResponse.redirect(`${origin}/login?error=line-token-error&detail=${encodeURIComponent(JSON.stringify(tokenData))}`);
        }

        const { id_token } = tokenData;
        if (!id_token) {
            console.error('No ID token in response');
            return NextResponse.redirect(`${origin}/login?error=no-id-token`);
        }

        console.log('2. Verifying ID Token');
        // 2. Decode ID Token to get user email
        const verifyResponse = await fetch('https://api.line.me/oauth2/v2.1/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                id_token: id_token,
                client_id: client_id,
            }),
        });

        const claims = await verifyResponse.json();

        if (!verifyResponse.ok) {
            console.error('ID Token Verification Error:', claims);
            return NextResponse.redirect(`${origin}/login?error=token-verification-failed`);
        }

        if (!claims.email) {
            console.error('Email not found in LINE claims. Make sure you have requested email permission.');
            return NextResponse.redirect(`${origin}/login?error=email-not-found-in-line`);
        }

        const email = claims.email;
        console.log('3. Claims received for email:', email);
        const supabaseAdmin = createAdminClient();

        console.log('4. Attempting to create user in Supabase');
        // 3. Find or Create User in Supabase (Service Role)
        const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: { full_name: claims.name, picture: claims.picture }
        });

        if (createError && !createError.message.includes('already been registered')) {
            console.error('Supabase Create User Error:', createError);
            return NextResponse.redirect(`${origin}/login?error=create-user-failed&msg=${encodeURIComponent(createError.message)}`);
        }

        console.log('5. Generating magic link for login');
        // 4. Generate Magic Link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (linkError || !linkData.properties?.action_link) {
            console.error('Supabase Magic Link Error:', linkError);
            return NextResponse.redirect(`${origin}/login?error=magic-link-failed&msg=${encodeURIComponent(linkError?.message || 'no-link')}`);
        }

        console.log('6. Auth successful, redirecting to action link');
        // 5. Redirect user to the Action Link
        return NextResponse.redirect(linkData.properties.action_link);

    } catch (err: any) {
        console.error('Unexpected Auth Error in catch block:', err);
        return NextResponse.redirect(`${origin}/login?error=server-error&msg=${encodeURIComponent(err.message)}`);
    }
}
