import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { origin } = new URL(request.url);
    const client_id = process.env.LINE_CHANNEL_ID;
    const redirect_uri = `${origin}/api/auth/line/callback`;
    const state = Math.random().toString(36).substring(7); // Simple state for now

    if (!client_id) {
        return NextResponse.json({ error: 'LINE_CHANNEL_ID is missing' }, { status: 500 });
    }

    // LINE OAuth2 Authorization URL
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        state: state,
        scope: 'profile openid email',
        prompt: 'consent',
    });

    const url = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    return NextResponse.redirect(url);
}
