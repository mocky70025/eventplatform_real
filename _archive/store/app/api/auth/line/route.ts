import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '2008802740'
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://store-phi-murex.vercel.app'}/api/auth/line/callback`
  const state = Math.random().toString(36).substring(7)
  
  // stateをセッションに保存（本番環境ではより安全な方法を使用）
  const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
  lineAuthUrl.searchParams.append('response_type', 'code')
  lineAuthUrl.searchParams.append('client_id', channelId)
  lineAuthUrl.searchParams.append('redirect_uri', redirectUri)
  lineAuthUrl.searchParams.append('state', state)
  lineAuthUrl.searchParams.append('scope', 'profile openid email')

  return NextResponse.redirect(lineAuthUrl.toString())
}

