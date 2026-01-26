import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '2008802751'
    const channelSecret = process.env.LINE_CHANNEL_SECRET || '2e8d01f1ffe014d8d06c935250049494'
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://eventplatform-organizer.vercel.app'}/api/auth/line/callback`

    // LINEからアクセストークンを取得
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
      console.error('LINE token error:', errorText)
      throw new Error('Failed to get LINE access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const idToken = tokenData.id_token

    // LINEからユーザープロフィールを取得
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to get LINE profile')
    }

    const profile = await profileResponse.json()

    // ID Tokenからメールアドレスを取得
    let email = null
    if (idToken) {
      try {
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())
        email = payload.email
      } catch (e) {
        console.error('Failed to parse ID token:', e)
      }
    }

    // Supabase Admin Clientを使用してユーザーを作成
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const userEmail = email || `line_${profile.userId}@line.local`
    const userName = profile.displayName

    // 既存ユーザーをチェック
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users.find(u => u.email === userEmail)

    let userId: string

    if (!existingUser) {
      // 新規ユーザー作成
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          name: userName,
          line_id: profile.userId,
          avatar_url: profile.pictureUrl,
          provider: 'line',
        },
      })

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError)
        throw new Error('Failed to create user')
      }

      userId = newUser.user.id

      // organizersテーブルにレコード作成
      await supabaseAdmin.from('organizers').insert({
        id: userId,
        email: userEmail,
        name: userName,
      })
    } else {
      userId = existingUser.id
    }

    // ワンタイムトークンを生成してリダイレクト
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    })

    if (sessionError || !sessionData) {
      console.error('Failed to generate session:', sessionError)
      throw new Error('Failed to generate session')
    }

    // ユーザーをログインページにリダイレクト
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('line_auth', 'success')
    redirectUrl.searchParams.set('email', userEmail)
    redirectUrl.searchParams.set('line_name', userName)
    redirectUrl.searchParams.set('line_id', profile.userId)
    if (profile.pictureUrl) {
      redirectUrl.searchParams.set('line_picture', profile.pictureUrl)
    }
    
    return NextResponse.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error('LINE OAuth error:', error)
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, request.url))
  }
}
