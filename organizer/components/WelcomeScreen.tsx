'use client'

import { useState } from 'react'
import { getLineLoginUrl } from '@/lib/auth'
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

  const handleLineLogin = () => {
    try {
      console.log('[WelcomeScreen] Login button clicked')
      const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] Login URL generated, redirecting...')
      window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLogin:', error)
      alert('ログインエラーが発生しました。コンソールを確認してください。')
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
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      })

      if (error) throw error

      if (data.user) {
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Email register error:', err)
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
            イベント主催プラットフォーム
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666',
            marginBottom: '32px'
          }}>
            イベント主催者向けプラットフォーム
          </p>
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
          </div>
        )}

        {/* メールアドレスで新規登録 */}
        {authMode === 'register' && registerMethod === 'email' && (
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
              }}>基本情報を登録</p>
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
              }}>イベントを掲載・管理</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
