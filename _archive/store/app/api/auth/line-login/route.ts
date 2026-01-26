import { NextRequest, NextResponse } from 'next/server'

/**
 * LINE Loginの認証コードをトークンに交換し、ユーザー情報を取得
 * 注意: この実装は動作確認用です。本番環境では適切なエラーハンドリングとセキュリティ対策を追加してください
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    console.log('[API] LINE Login request received, code:', code ? 'present' : 'missing')
    
    if (!code) {
      console.error('[API] Code is missing')
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }
    
    const channelId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
    const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback`
    
    console.log('[API] Channel ID:', channelId ? 'present' : 'missing')
    console.log('[API] Channel Secret:', channelSecret ? 'present' : 'missing')
    console.log('[API] Redirect URI:', redirectUri)
    
    if (!channelId || !channelSecret) {
      console.error('[API] LINE Login credentials not configured')
      return NextResponse.json({ error: 'LINE Login credentials not configured' }, { status: 500 })
    }
    
    // 1. 認証コードをトークンに交換
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret,
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[API] Token exchange failed:', errorText)
      console.error('[API] Status:', tokenResponse.status)
      return NextResponse.json({ error: 'Failed to exchange code for token', details: errorText }, { status: 500 })
    }
    
    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const idToken = tokenData.id_token
    
    console.log('[API] Token exchange successful')
    console.log('[API] Has access token:', !!accessToken)
    console.log('[API] Has ID token:', !!idToken)
    
    // 2. IDトークンからユーザー情報を取得（または、アクセストークンでプロフィールを取得）
    let profile: { userId: string; displayName: string; pictureUrl?: string; statusMessage?: string }
    
    if (idToken) {
      // IDトークンからユーザー情報を取得（JWTをデコード）
      // 注意: 本番環境では、IDトークンの署名検証を行う必要があります
      try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
        console.log('[API] ID token payload:', { sub: payload.sub, name: payload.name })
      profile = {
        userId: payload.sub,
        displayName: payload.name || '',
        pictureUrl: payload.picture,
        statusMessage: payload.email
        }
      } catch (error) {
        console.error('[API] Failed to decode ID token:', error)
        throw error
      }
    } else {
      // アクセストークンでプロフィールを取得
      console.log('[API] Fetching profile with access token')
      const profileResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text()
        console.error('[API] Profile fetch failed:', errorText)
        throw new Error(`Failed to get profile: ${errorText}`)
      }
      
      const profileData = await profileResponse.json()
      console.log('[API] Profile data:', { userId: profileData.userId, displayName: profileData.displayName })
      profile = {
        userId: profileData.userId,
        displayName: profileData.displayName,
        pictureUrl: profileData.pictureUrl,
        statusMessage: profileData.statusMessage
      }
    }
    
    console.log('[API] Returning profile:', { userId: profile.userId, displayName: profile.displayName })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('[API] LINE Login API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
}


