export interface LineProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
  authType?: 'line' | 'email'
  email?: string
  emailConfirmed?: boolean
}

/**
 * LIFF環境かどうかを検出
 */
export const isLiffEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false
  // LIFF環境では、window.liff が存在するか、URLにliff.line.meが含まれる
  return !!(window as any).liff || window.location.href.includes('liff.line.me')
}

export type AuthMode = 'line_login' | 'unknown'

/**
 * 認証モードを判定
 * 注意: LIFF環境でもWeb環境でも、常にLINE Login（OAuth）を使用することで、確実に同じユーザーIDを取得できます
 */
export const detectAuthMode = (): AuthMode => {
  if (typeof window === 'undefined') return 'unknown'
  
  // LIFF環境でもWeb環境でも、常にLINE Login（OAuth）を使用
  // これにより、確実に同じユーザーIDが取得できます
  return 'line_login'
}

/**
 * LINE Login（OAuth）の認証URLを生成
 */
export const getLineLoginUrl = (): string => {
  const channelId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
  if (!channelId) {
    console.error('[LINE Login] NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID is not set')
    throw new Error('NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID is not set')
  }
  
  // store側のコールバックURLを使用
  const redirectUri = process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI || 
    (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '')
  
  // stateパラメータ（セキュリティ用）
  const randomState = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const state = randomState
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('line_login_state', state)
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state: state,
    scope: 'profile openid email',
    bot_prompt: 'normal'
  })
  
  const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`
  console.log('[LINE Login] Generated login URL:', loginUrl.replace(/state=[^&]+/, 'state=***'))
  
  return loginUrl
}

/**
 * LINE Loginのコールバックから認証コードを取得
 */
export const getLineLoginCode = (): { code: string; state: string } | null => {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (!code || !state) {
    return null
  }
  
  // stateの検証
  const savedState = sessionStorage.getItem('line_login_state')
  if (savedState !== state) {
    console.error('State mismatch in LINE Login callback')
    return null
  }
  
  sessionStorage.removeItem('line_login_state')
  
  return { code, state }
}

/**
 * LINE Loginの認証コードからユーザー情報を取得
 * 注意: この実装はサーバーサイドで行うべきですが、動作確認用にクライアントサイドでも実装可能です
 * 本番環境では、API Routeを使用してサーバーサイドで処理してください
 */
export const exchangeLineLoginCode = async (code: string): Promise<LineProfile | null> => {
  try {
    console.log('[Auth] Exchanging code for profile, code:', code ? 'present' : 'missing')
    // サーバーサイドのAPI Routeを使用することを推奨
    // ここでは動作確認用の実装例を示します
    const response = await fetch('/api/auth/line-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
    
    console.log('[Auth] API response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('[Auth] API response error:', errorData)
      throw new Error(`Failed to exchange code: ${errorData.error || response.statusText}`)
    }
    
    const data = await response.json()
    console.log('[Auth] API response data:', data)
    
    if (!data.profile) {
      console.error('[Auth] No profile in response:', data)
      return null
    }
    
    return data.profile
  } catch (error) {
    console.error('[Auth] Failed to exchange LINE Login code:', error)
    return null
  }
}

