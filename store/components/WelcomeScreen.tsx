'use client'

import { useState, useEffect } from 'react'
import { getLineLoginUrl } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email' | 'google'
type RegisterMethod = 'line' | 'email' | 'google'

// LINEアイコン（SVG）- Figmaからコピー
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_46_28)">
      <mask id="mask0_46_28" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
        <path d="M32 0H0V32H32V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_46_28)">
        <path d="M25.82 13.1507C26.0372 13.1593 26.2426 13.2517 26.3932 13.4084C26.5437 13.5651 26.6278 13.774 26.6278 13.9913C26.6278 14.2087 26.5437 14.4176 26.3932 14.5743C26.2426 14.731 26.0372 14.8233 25.82 14.832H23.48V16.332H25.82C25.933 16.3275 26.0458 16.3459 26.1516 16.386C26.2573 16.4262 26.3539 16.4873 26.4355 16.5656C26.517 16.644 26.5819 16.7381 26.6263 16.8422C26.6706 16.9462 26.6935 17.0582 26.6935 17.1713C26.6935 17.2845 26.6706 17.3964 26.6263 17.5005C26.5819 17.6046 26.517 17.6986 26.4355 17.777C26.3539 17.8554 26.2573 17.9165 26.1516 17.9566C26.0458 17.9968 25.933 18.0152 25.82 18.0107H22.6387C22.4168 18.0096 22.2044 17.9208 22.0478 17.7637C21.8911 17.6066 21.803 17.3939 21.8027 17.172V10.8107C21.8027 10.3507 22.1787 9.97066 22.6427 9.97066H25.824C26.0468 9.9712 26.2602 10.0602 26.4174 10.2181C26.5745 10.376 26.6625 10.5899 26.662 10.8127C26.6615 11.0354 26.5725 11.2489 26.4146 11.406C26.2567 11.5632 26.0428 11.6512 25.82 11.6507H23.48V13.1507H25.82ZM20.68 17.172C20.6789 17.3943 20.5898 17.6072 20.4321 17.7639C20.2744 17.9206 20.061 18.0084 19.8387 18.008C19.707 18.0106 19.5765 17.9818 19.4583 17.9238C19.34 17.8658 19.2373 17.7804 19.1587 17.6747L15.9013 13.252V17.172C15.8867 17.3842 15.792 17.583 15.6365 17.7282C15.4809 17.8733 15.2761 17.9541 15.0633 17.9541C14.8506 17.9541 14.6458 17.8733 14.4902 17.7282C14.3347 17.583 14.24 17.3842 14.2253 17.172V10.8107C14.225 10.5894 14.3124 10.377 14.4683 10.2201C14.6243 10.0631 14.8361 9.97439 15.0573 9.97333C15.3173 9.97333 15.5573 10.112 15.7173 10.312L19 14.752V10.8107C19 10.3507 19.376 9.97066 19.84 9.97066C20.3 9.97066 20.68 10.3507 20.68 10.8107V17.172ZM13.0253 17.172C13.0252 17.2823 13.0033 17.3915 12.9609 17.4934C12.9185 17.5952 12.8565 17.6877 12.7784 17.7656C12.7002 17.8435 12.6075 17.9052 12.5056 17.9472C12.4036 17.9893 12.2943 18.0108 12.184 18.0107C11.9621 18.0096 11.7497 17.9208 11.5931 17.7637C11.4365 17.6066 11.3483 17.3939 11.348 17.172V10.8107C11.348 10.3507 11.724 9.97066 12.188 9.97066C12.6493 9.97066 13.0253 10.3507 13.0253 10.8107V17.172ZM9.73733 18.0107H6.556C6.33388 18.0093 6.12123 17.9205 5.96404 17.7636C5.80685 17.6066 5.71775 17.3941 5.716 17.172V10.8107C5.716 10.3507 6.096 9.97066 6.556 9.97066C7.02 9.97066 7.396 10.3507 7.396 10.8107V16.332H9.73733C9.95415 16.3406 10.1592 16.4329 10.3096 16.5893C10.4599 16.7458 10.5439 16.9543 10.5439 17.1713C10.5439 17.3883 10.4599 17.5969 10.3096 17.7534C10.1592 17.9098 9.95415 18.002 9.73733 18.0107ZM32 13.752C32 6.59067 24.82 0.762665 16 0.762665C7.18 0.762665 0 6.59067 0 13.752C0 20.1667 5.69333 25.5413 13.38 26.5627C13.9013 26.672 14.6107 26.9067 14.7907 27.3493C14.9507 27.7507 14.896 28.3707 14.8413 28.7893L14.6227 30.1493C14.5627 30.5507 14.3027 31.7307 16.0213 31.0093C17.7427 30.2907 25.2427 25.572 28.6027 21.7093C30.9013 19.1907 32 16.6107 32 13.752Z" fill="white"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_46_28">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）- 白背景用
const MailIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
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
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    setAuthMode('register')
  }

  const handleNavigateToLogin = () => {
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    setAuthMode('initial')
  }

  const handleLineLogin = () => {
    try {
      console.log('[WelcomeScreen] LINE Login button clicked')
    const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] LINE Login URL generated, redirecting to:', loginUrl.replace(/state=[^&]+/, 'state=***'))
    window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLineLogin:', error)
      setError('LINEログインのURL生成に失敗しました。もう一度お試しください。')
    }
  }

  const handleLineRegister = () => {
    try {
      console.log('[WelcomeScreen] LINE Register button clicked')
      const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] LINE Register URL generated, redirecting to:', loginUrl.replace(/state=[^&]+/, 'state=***'))
      window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLineRegister:', error)
      setError('LINE新規登録のURL生成に失敗しました。もう一度お試しください。')
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
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

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`

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
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleGoogleLogin:', error)
      setError('GoogleログインのURL生成に失敗しました。もう一度お試しください。')
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

    if (!registerEmail) {
      setError('メールアドレスを入力してください')
      setLoading(false)
      return
    }

    try {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/verify-email`
      
      // パスワードを自動生成（ランダムな文字列）
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '!@#'
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: randomPassword,
        options: {
          emailRedirectTo: redirectUrl
        }
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
        sessionStorage.setItem('show_email_sent', 'true')
        
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
      width: '100%',
      background: '#FFF5F0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      {/* 白いカード */}
      <div style={{
        width: '100%',
        maxWidth: '393px',
        marginTop: '190px',
        marginBottom: '0',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        padding: '0',
        position: 'relative',
        minHeight: '472px'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '32px',
          padding: '0 20px'
        }}>
          <div style={{
            width: isDesktop ? '120px' : '100px',
            height: isDesktop ? '120px' : '100px',
            margin: '0 auto 24px',
            background: '#5DABA8',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              fontSize: isDesktop ? '48px' : '40px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>🚚</div>
          </div>
          <h1 style={{
            fontSize: isDesktop ? '28px' : '24px',
            fontWeight: 800,
            lineHeight: 1.3,
            color: '#2C3E50',
            margin: '0 0 12px',
            letterSpacing: '-0.02em'
          }}>
            デミセル
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#6C757D',
            margin: 0,
            lineHeight: 1.6
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* タブナビゲーション */}
        {authMode === 'initial' && !loginMethod && !registerMethod && (
          <div style={{
            padding: '0 20px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E9ECEF',
              position: 'relative'
            }}>
              {/* ログインタブ */}
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  flex: 1,
                  padding: '16px 0',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: activeTab === 'login' ? 600 : 400,
                  color: activeTab === 'login' ? '#5DABA8' : '#6C757D',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 200ms ease'
                }}
              >
                ログイン
                {activeTab === 'login' && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#5DABA8',
                    borderRadius: '1px 1px 0 0'
                  }} />
                )}
              </button>

              {/* 新規登録タブ */}
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  flex: 1,
                  padding: '16px 0',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: activeTab === 'register' ? 600 : 400,
                  color: activeTab === 'register' ? '#5DABA8' : '#6C757D',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 200ms ease'
                }}
              >
                新規登録
                {activeTab === 'register' && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#5DABA8',
                    borderRadius: '1px 1px 0 0'
                  }} />
                )}
              </button>
            </div>
          </div>
        )}

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
          <div style={{ padding: '0 20px' }}>
            {/* ログインセクション */}
            {activeTab === 'login' && (
            <div style={{
              marginBottom: '32px'
        }}>

              {/* LINEログインボタン */}
              <button
                onClick={handleLineLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#06C755',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 6px -1px rgba(6, 199, 85, 0.3), 0 2px 4px -1px rgba(6, 199, 85, 0.2)',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(6, 199, 85, 0.4), 0 4px 6px -2px rgba(6, 199, 85, 0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(6, 199, 85, 0.3), 0 2px 4px -1px rgba(6, 199, 85, 0.2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <LineIcon />
                <span>LINEでログイン</span>
              </button>

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
                  borderRadius: '12px',
                  border: '2px solid #E9ECEF',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <GoogleIcon />
                <span>Googleでログイン</span>
              </button>

              {/* メールアドレスログインボタン */}
              <button
                onClick={() => {
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
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '2px solid #E9ECEF',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <MailIcon color="#111827" />
                <span>メールアドレスでログイン</span>
              </button>
            </div>
            )}

            {/* 新規登録セクション */}
            {activeTab === 'register' && (
            <div style={{
              marginBottom: '32px'
            }}>
              {/* LINE新規登録ボタン */}
              <button
                onClick={handleLineRegister}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: '#06C755',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 6px -1px rgba(6, 199, 85, 0.3), 0 2px 4px -1px rgba(6, 199, 85, 0.2)',
                  marginBottom: '12px'
                }}
              >
                <LineIcon />
                <span>LINEで新規登録</span>
              </button>

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
                  borderRadius: '12px',
                  border: '2px solid #E9ECEF',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  marginBottom: '12px'
                }}
              >
                <GoogleIcon />
                <span>Googleで新規登録</span>
              </button>

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
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '2px solid #E9ECEF',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              >
                <MailIcon color="#111827" />
                <span>メールアドレスで新規登録</span>
              </button>
            </div>
            )}
          </div>
        )}

        {/* ログイン方法選択 */}
        {authMode === 'login' && !loginMethod && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '2px'
              }} />
              ログイン
            </h2>

            <button
              type="button"
              onClick={handleLineLogin}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: '#06C755',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -1px rgba(6, 199, 85, 0.3), 0 2px 4px -1px rgba(6, 199, 85, 0.2)',
                marginBottom: '12px'
              }}
            >
              <LineIcon />
              <span>LINE</span>
            </button>

            <button
              type="button"
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
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '12px'
              }}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '24px'
              }}
            >
              <MailIcon color="#111827" />
              <span>メールアドレス</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '16px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: 500
              }}>または</span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
            </div>

            <button
              type="button"
              onClick={handleNavigateToLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            >
              新規登録
            </button>
          </div>
        )}

        {/* メールアドレスでログイン */}
        {authMode === 'login' && loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} style={{ padding: '0 20px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '3px',
                background: '#5DABA8',
                borderRadius: '2px'
              }} />
              ログイン
            </h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="メールアドレス"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: email ? '#111827' : '#9ca3af',
                background: '#ffffff',
                border: '2px solid #E9ECEF',
                borderRadius: '12px',
                marginBottom: '16px',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5DABA8'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(93, 171, 168, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E9ECEF'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワード"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: password ? '#111827' : '#9ca3af',
                background: '#ffffff',
                border: '2px solid #E9ECEF',
                borderRadius: '12px',
                marginBottom: '24px',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5DABA8'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(93, 171, 168, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E9ECEF'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 24px',
                background: loading ? '#9ca3af' : '#5DABA8',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)',
                marginBottom: '24px'
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '16px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: 500
              }}>または</span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                setLoginMethod(null)
                setError('')
                setEmail('')
                setPassword('')
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            >
              別の方法でログイン
            </button>
          </form>
        )}

        {/* 新規登録方法選択 */}
        {authMode === 'register' && !registerMethod && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '2px'
              }} />
              新規登録
            </h2>

            <button
              type="button"
              onClick={handleLineLogin}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: '#06C755',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -1px rgba(6, 199, 85, 0.3), 0 2px 4px -1px rgba(6, 199, 85, 0.2)',
                marginBottom: '12px'
              }}
            >
              <LineIcon />
              <span>LINE</span>
            </button>

            <button
              type="button"
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
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '12px'
              }}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => setRegisterMethod('email')}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '24px'
              }}
            >
              <MailIcon color="#111827" />
              <span>メールアドレス</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '16px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: 500
              }}>または</span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
            </div>

            <button
              type="button"
              onClick={handleNavigateToLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            >
              ログイン
            </button>
          </div>
        )}

        {/* メールアドレスで新規登録 */}
        {authMode === 'register' && registerMethod === 'email' && (
          <form onSubmit={handleEmailRegister} style={{ padding: '0 20px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '12px'
            }}>
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '3px',
                background: '#5DABA8',
                borderRadius: '2px'
              }} />
              新規登録
            </h2>

            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              placeholder="メールアドレス"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: registerEmail ? '#2C3E50' : '#6C757D',
                background: '#ffffff',
                border: '2px solid #E9ECEF',
                borderRadius: '12px',
                marginBottom: '24px',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5DABA8'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(93, 171, 168, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E9ECEF'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />

            <button
              type="submit"
              disabled={loading || !registerEmail}
              onClick={async (e) => {
                e.preventDefault()
                await handleEmailRegister(e as any)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 24px',
                background: loading || !registerEmail ? '#9ca3af' : '#5DABA8',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: loading || !registerEmail ? 'not-allowed' : 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: loading || !registerEmail ? 'none' : '0px 8px 32px rgba(0, 0, 0, 0.08)',
                marginBottom: '24px'
              }}
            >
              {loading ? '送信中...' : '新規登録'}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '16px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: 500
              }}>または</span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
              }} />
        </div>

        <button
              onClick={() => {
                setRegisterMethod(null)
                setError('')
                setRegisterEmail('')
                setRegisterPassword('')
                setRegisterPasswordConfirm('')
              }}
          style={{
                width: '100%',
            display: 'flex',
                alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #E9ECEF',
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
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
