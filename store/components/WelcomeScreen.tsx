'use client'

import { useState } from 'react'
import { getLineLoginUrl, isLiffEnvironment } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email'
type RegisterMethod = 'line' | 'email'

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // LIFF環境かどうかを判定
  const isLiff = isLiffEnvironment()

  const handleLineLogin = () => {
    const loginUrl = getLineLoginUrl()
    window.location.href = loginUrl
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
        // セッションストレージに保存（既存のLINE Loginと同じ形式）
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        
        // ページをリロードして認証状態を反映
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

    if (registerPassword !== registerPasswordConfirm) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      // メール確認用のリダイレクトURLを設定
      // LIFF環境では、環境変数から取得したURLを使用するか、固定URLを使用
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const redirectUrl = `${appUrl}/auth/verify-email`
      console.log('[WelcomeScreen] Email registration - redirectUrl:', redirectUrl)
      console.log('[WelcomeScreen] Email registration - window.location.origin:', window.location.origin)
      console.log('[WelcomeScreen] Email registration - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
      console.log('[WelcomeScreen] Email registration - email:', registerEmail)
      
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
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      })
      
      // メール送信の状態を確認
      if (data.user && !data.session) {
        console.log('[WelcomeScreen] ⚠️ Email confirmation required but no session - email should be sent')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Users to verify user creation')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      } else if (data.user && data.session) {
        console.log('[WelcomeScreen] ⚠️ Session exists - email confirmation may be disabled')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      }

      if (error) {
        console.error('[WelcomeScreen] SignUp error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        })
        throw error
      }

      if (data.user) {
        console.log('[WelcomeScreen] User created successfully:', {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          createdAt: data.user.created_at
        })
        
        // メール確認が必要な場合でも、user_idを保存して登録フォームに進める
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        sessionStorage.setItem('email_confirmed', data.session ? 'true' : 'false')
        
        // メール確認が必要な場合
        if (!data.session) {
          console.log('[WelcomeScreen] Email confirmation required - no session')
          // メール確認待ちの状態を表示
          setError('')
          // ページをリロードして、メール確認待ち画面を表示
          window.location.reload()
          return
        }
        
        console.log('[WelcomeScreen] Email confirmation not required - session exists')
        // メール確認が不要な場合（開発環境など）は、ページをリロード
        window.location.reload()
      } else {
        console.error('[WelcomeScreen] SignUp succeeded but no user data returned')
        setError('ユーザー登録に失敗しました。もう一度お試しください。')
      }
    } catch (err: any) {
      console.error('[WelcomeScreen] Email register error:', {
        message: err.message,
        status: err.status,
        name: err.name,
        stack: err.stack
      })
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '24px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '16px'
          }}>
            イベント出店プラットフォーム
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666',
            marginBottom: '32px'
          }}>
            イベント出店者向けプラットフォーム
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '24px'
          }}>
            ご利用の流れ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                1
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>LINEアカウントでログイン</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                2
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>基本情報と必要書類を登録</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                3
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>イベント一覧から出店申し込み</p>
            </div>
          </div>
        </div>

        {/* 初期画面：ログイン or 新規登録を選択 */}
        {authMode === 'initial' && (
          <>
            <button
              onClick={() => setAuthMode('login')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                width: '100%',
                height: '48px',
                background: '#06C755',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '19px',
                color: '#FFFFFF',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              ログイン
            </button>
            <button
              onClick={() => setAuthMode('register')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                width: '100%',
                height: '48px',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E5E5',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '19px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              新規登録
            </button>
          </>
        )}

        {/* ログイン方法選択 */}
        {authMode === 'login' && !loginMethod && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                ログイン方法を選択
              </h2>
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setLoginMethod(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <button
              onClick={handleLineLogin}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                width: '100%',
                height: '48px',
                background: '#06C755',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '19px',
                color: '#FFFFFF',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              LINEでログイン
            </button>
            {!isLiff && (
              <button
                onClick={() => setLoginMethod('email')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E5E5E5',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '19px',
                  color: '#000000',
                  cursor: 'pointer'
                }}
              >
                メールアドレスでログイン
              </button>
            )}
          </div>
        )}

        {/* メールアドレスでログイン */}
        {!isLiff && authMode === 'login' && loginMethod === 'email' && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                メールアドレスでログイン
              </h2>
              <button
                onClick={() => {
                  setLoginMethod(null)
                  setError('')
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FFEBEE',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#C62828'
                }}>
                  {error}
                </p>
              </div>
            )}
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your@example.com"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを入力"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: loading ? '#CCCCCC' : '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          </div>
        )}

        {/* 新規登録方法選択 */}
        {authMode === 'register' && !registerMethod && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                新規登録方法を選択
              </h2>
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setRegisterMethod(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <button
              onClick={handleLineLogin}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                width: '100%',
                height: '48px',
                background: '#06C755',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '19px',
                color: '#FFFFFF',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              LINEで新規登録
            </button>
            {!isLiff && (
              <button
                onClick={() => setRegisterMethod('email')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E5E5E5',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '19px',
                  color: '#000000',
                  cursor: 'pointer'
                }}
              >
                メールアドレスで新規登録
              </button>
            )}
          </div>
        )}

        {/* メールアドレスで新規登録 */}
        {!isLiff && authMode === 'register' && registerMethod === 'email' && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                新規登録
              </h2>
              <button
                onClick={() => {
                  setRegisterMethod(null)
                  setError('')
                  setRegisterEmail('')
                  setRegisterPassword('')
                  setRegisterPasswordConfirm('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FFEBEE',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#C62828'
                }}>
                  {error}
                </p>
              </div>
            )}
            <form onSubmit={handleEmailRegister}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your@example.com"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード（6文字以上）
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを入力"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを再入力"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: loading ? '#CCCCCC' : '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '登録中...' : '登録する'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
