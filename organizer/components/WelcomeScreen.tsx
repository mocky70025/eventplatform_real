'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email' | 'google'
type RegisterMethod = 'line' | 'email' | 'google'

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）- 黒背景用
const MailIcon = ({ color = '#000000' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const handleNavigateToRegister = () => {
    // 状態をクリア
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    // 即座に状態を変更
    setAuthMode('register')
  }

  const handleNavigateToLogin = () => {
    // 状態をクリア
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    // 即座に状態を変更
    setAuthMode('initial')
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('[WelcomeScreen] Google Login button clicked')
      setLoading(true)
      setError('')

      // 現在のURLからリダイレクトURIを生成（主催者アプリのURLを使用）
      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`
      
      console.log('[WelcomeScreen] Google Login - appUrl:', appUrl)
      console.log('[WelcomeScreen] Google Login - redirectUrl:', redirectUrl)
      console.log('[WelcomeScreen] Google Login - current origin:', window.location.origin)

      // セッションストレージにアプリタイプを保存（リダイレクト後に判定するため）
      sessionStorage.setItem('app_type', 'organizer')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('[WelcomeScreen] Google Login error:', error)
        setError('Googleログインに失敗しました。もう一度お試しください。')
        setLoading(false)
      } else if (data.url) {
        // リダイレクトURLに遷移
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleGoogleLogin:', error)
      setError('GoogleログインのURL生成に失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      console.log('[WelcomeScreen] Google Register button clicked')
      setLoading(true)
      setError('')

      // 現在のURLからリダイレクトURIを生成（主催者アプリのURLを使用）
      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`
      
      console.log('[WelcomeScreen] Google Register - appUrl:', appUrl)
      console.log('[WelcomeScreen] Google Register - redirectUrl:', redirectUrl)

      // セッションストレージにアプリタイプを保存（リダイレクト後に判定するため）
      sessionStorage.setItem('app_type', 'organizer')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('[WelcomeScreen] Google Register error:', error)
        setError('Google新規登録に失敗しました。もう一度お試しください。')
        setLoading(false)
      } else if (data.url) {
        // リダイレクトURLに遷移
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleGoogleRegister:', error)
      setError('Google新規登録のURL生成に失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Email login error:', err)
      setError(err.message || 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (registerPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/verify-email`
      
      console.log('[WelcomeScreen] Attempting email registration:', {
        email: registerEmail,
        redirectUrl: redirectUrl,
        appUrl: appUrl,
        windowOrigin: window.location.origin,
        timestamp: new Date().toISOString()
      })
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('[WelcomeScreen] SignUp response:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at,
        hasSession: !!data.session,
        timestamp: new Date().toISOString(),
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      })

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('already exists') || error.status === 422) {
          setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
          setLoading(false)
          return
        }
        throw error
      }

      if (data.user) {
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        sessionStorage.setItem('email_confirmed', data.session ? 'true' : 'false')
        
        if (!data.session) {
          window.location.reload()
          return
        }
        
        window.location.reload()
      } else {
        setError('ユーザー登録に失敗しました。もう一度お試しください。')
      }
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('already exists') || err.status === 422) {
        setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
      } else {
        setError(err.message || '登録に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isDesktop ? '48px 24px' : '24px 16px',
      background: '#E8F5F5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '480px' : '352px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        padding: isDesktop ? '48px' : '40px 24px',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 12px',
            background: '#FF8A5C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#2C3E50',
            margin: '0 0 4px',
            fontFamily: 'Inter, sans-serif'
          }}>
            デミセル
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6C757D',
            margin: 0,
            lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif'
          }}>
            主催者向けプラットフォーム
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div style={{
            marginBottom: '24px',
            padding: '14px 18px',
            background: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>!</span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#991b1b',
              fontWeight: 500,
              lineHeight: 1.5
            }}>{error}</p>
          </div>
        )}

        {/* 初期画面：ログイン or 新規登録を選択 */}
        {authMode === 'initial' && !loginMethod && !registerMethod && (
          <div>
            {/* タブ切り替え */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: activeTab === 'login' ? '#FF8A5C' : '#000000',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                ログイン
                {activeTab === 'login' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#FF8A5C'
                  }} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: activeTab === 'register' ? '#FF8A5C' : '#000000',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                新規登録
                {activeTab === 'register' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#FF8A5C'
                  }} />
                )}
              </button>
            </div>

            {/* ログインセクション */}
            {activeTab === 'login' && (
            <div>
              {/* Googleログインボタン */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #E9ECEF',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <GoogleIcon />
                <span>Google</span>
              </button>

              {/* セパレーター */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
                color: '#6C757D',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                または
              </div>

              {/* メールアドレスログインボタン */}
              <button
                onClick={() => {
                  console.log('[WelcomeScreen] Email LOGIN button clicked (initial screen)')
                  console.log('[WelcomeScreen] Current state - authMode:', authMode, 'loginMethod:', loginMethod)
                  setAuthMode('login')
                  setLoginMethod('email')
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#FF8A5C',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <MailIcon color="#ffffff" />
                <span>メールアドレス</span>
              </button>
            </div>
            )}

            {/* 新規登録セクション */}
            {activeTab === 'register' && (
            <div>
              {/* Google新規登録ボタン */}
              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #E9ECEF',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <GoogleIcon />
                <span>Google</span>
              </button>

              {/* セパレーター */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
                color: '#6C757D',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                または
              </div>

              {/* メールアドレス新規登録ボタン */}
              <button
                onClick={() => {
                  setAuthMode('register')
                  setRegisterMethod('email')
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#FF8A5C',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <MailIcon color="#ffffff" />
                <span>メールアドレス</span>
              </button>
            </div>
            )}
          </div>
        )}


      {/* メールアドレスでログイン */}
      {authMode === 'login' && loginMethod === 'email' && (
        <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ログイン
          </h2>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '14px 18px',
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>!</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#991b1b',
                fontWeight: 500,
                lineHeight: 1.5
              }}>{error}</p>
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              color: email ? '#000000' : '#999999',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
            placeholder="メールアドレス"
          />

          {/* パスワード入力フィールド */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              color: password ? '#000000' : '#999999',
              marginBottom: '24px',
              boxSizing: 'border-box'
            }}
            placeholder="パスワード"
          />

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: loading ? '#CCCCCC' : '#FF8A5C',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px'
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          {/* 別の方法でログインボタン */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('initial')
              setActiveTab('login')
              setLoginMethod(null)
              setError('')
              setEmail('')
              setPassword('')
            }}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: '#FFFFFF',
              border: '2px solid #E5E5E5',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#111827',
              cursor: 'pointer'
            }}
          >
            別の方法でログイン
          </button>
        </form>
      )}


      {/* メールアドレスで新規登録 */}
      {authMode === 'register' && registerMethod === 'email' && (
        <form onSubmit={handleEmailRegister} style={{ width: '100%' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            新規登録
          </h2>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '14px 18px',
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>!</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#991b1b',
                fontWeight: 500,
                lineHeight: 1.5
              }}>{error}</p>
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              color: registerEmail ? '#000000' : '#999999',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
            placeholder="メールアドレス"
          />

          {/* パスワード入力フィールド */}
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              color: registerPassword ? '#000000' : '#999999',
              marginBottom: '24px',
              boxSizing: 'border-box'
            }}
            placeholder="パスワード（6文字以上）"
          />

          {/* 新規登録ボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: loading ? '#CCCCCC' : '#FF8A5C',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px'
            }}
          >
            {loading ? '登録中...' : '新規登録'}
          </button>

          {/* 別の方法で新規登録ボタン */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('initial')
              setActiveTab('register')
              setRegisterMethod(null)
              setError('')
              setRegisterEmail('')
              setRegisterPassword('')
              setRegisterPasswordConfirm('')
            }}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: '#FFFFFF',
              border: '2px solid #E5E5E5',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#111827',
              cursor: 'pointer'
            }}
          >
            別の方法で新規登録
          </button>
        </form>
      )}
      </div>
    </div>
  )
}
