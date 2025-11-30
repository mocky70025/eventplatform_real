'use client'

import { useState } from 'react'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      console.log('[WelcomeScreen] Google Login button clicked')
      setLoading(true)
      setError('')

      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`

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
      
      console.log('[WelcomeScreen] Email registration - redirectUrl:', redirectUrl)
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
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
      position: 'relative',
      width: '100%',
      maxWidth: '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#FFFFFF'
    }}>
      {/* タイトル */}
      <div style={{
        position: 'absolute',
        width: '368px',
        height: '96px',
        left: '13px',
        top: '32px',
        fontFamily: '"Noto Sans JP", sans-serif',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '48px',
        textAlign: 'center',
        color: '#000000'
      }}>
        イベントに呼びたい<br />キッチンカー・屋台を探すなら
      </div>

      {/* ロゴプレースホルダー */}
      <div style={{
        position: 'absolute',
        width: '256px',
        height: '256px',
        left: '69px',
        top: '144px',
        background: '#D9D9D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '48px',
          textAlign: 'center',
          color: '#000000'
        }}>
          将来的にロゴ
        </div>
      </div>

      {/* 初期画面：ログイン or 新規登録を選択 */}
      {authMode === 'initial' && (
        <>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '456px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <GoogleIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>Google</span>
          </button>

          {/* メールアドレスログインボタン */}
          <button
            onClick={() => setLoginMethod('email')}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '520.5px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <MailIcon color="#000000" />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '591.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '584px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '580px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 新規登録ボタン */}
          <button
            onClick={() => setAuthMode('register')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '620.5px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
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
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000'
            }}>
              ログイン
            </h2>
            <button
              onClick={() => {
                setAuthMode('initial')
                setLoginMethod(null)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                color: '#06C755',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
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
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              <GoogleIcon />
              <span>{loading ? '読み込み中...' : 'Googleでログイン'}</span>
            </button>
            
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
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              <MailIcon color="#000000" />
              <span>メールアドレスでログイン</span>
            </button>
          </div>
        </div>
      )}

      {/* メールアドレスでログイン */}
      {authMode === 'login' && loginMethod === 'email' && (
        <div style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: '"Noto Sans JP", sans-serif',
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
                fontFamily: '"Noto Sans JP", sans-serif',
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
                fontFamily: '"Noto Sans JP", sans-serif',
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
                fontFamily: '"Noto Sans JP", sans-serif',
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
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="your@example.com"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontFamily: '"Noto Sans JP", sans-serif',
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
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="パスワードを入力"
              />
            </div>
            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <a
                href="/auth/reset-password"
                style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  color: '#06C755',
                  textDecoration: 'none'
                }}
              >
                パスワードを忘れた場合
              </a>
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
                fontFamily: '"Noto Sans JP", sans-serif',
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
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000'
            }}>
              新規登録
            </h2>
            <button
              onClick={() => {
                setAuthMode('initial')
                setRegisterMethod(null)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                color: '#06C755',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
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
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              <GoogleIcon />
              <span>{loading ? '読み込み中...' : 'Googleで新規登録'}</span>
            </button>
            
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
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#000000',
                cursor: 'pointer'
              }}
            >
              <MailIcon color="#000000" />
              <span>メールアドレスで新規登録</span>
            </button>
          </div>
        </div>
      )}

      {/* メールアドレスで新規登録 */}
      {authMode === 'register' && registerMethod === 'email' && (
        <>
          {/* タイトル */}
          <div style={{
            position: 'absolute',
            width: '333px',
            height: '96px',
            left: '30px',
            top: '32px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            イベントに呼びたい<br />キッチンカー・屋台を探すなら
          </div>

          {/* ロゴプレースホルダー */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '256px',
            left: '69px',
            top: '144px',
            background: '#D9D9D9'
          }} />
          <div style={{
            position: 'absolute',
            width: '192px',
            height: '48px',
            left: '101px',
            top: '248px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            将来的にロゴ
          </div>

          {/* 新規登録セパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            新規登録
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              position: 'absolute',
              width: '288px',
              left: '53px',
              top: '440px',
              padding: '8px',
              background: '#FFEBEE',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              color: '#C62828',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <form onSubmit={handleEmailRegister}>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '456px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerEmail ? '#000000' : '#999999'
              }}
              placeholder="入力してください"
            />

            {/* パスワード入力フィールド */}
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              minLength={6}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '520px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerPassword ? '#000000' : '#999999'
              }}
              placeholder="入力してください"
            />

            {/* 新規登録ボタン */}
            <button
              type="submit"
              disabled={loading}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '584px',
                background: loading ? '#CCCCCC' : '#06C755',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '登録中...' : '新規登録'}
            </button>
          </form>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 別の方法で新規登録ボタン */}
          <button
            onClick={() => {
              setRegisterMethod(null)
              setError('')
              setRegisterEmail('')
              setRegisterPassword('')
              setRegisterPasswordConfirm('')
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            別の方法で新規登録
          </button>
        </>
      )}
    </div>
  )
}
