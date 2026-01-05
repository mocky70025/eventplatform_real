'use client'

import { useState } from 'react'
import { getLineLoginUrl } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { colors, spacing, borderRadius, typography, shadows } from '@/styles/design-system'
import Button from './ui/Button'
import Input from './ui/Input'

type AuthMode = 'initial' | 'login' | 'register'

// LINEアイコン
const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 13.752C32 6.59067 24.82 0.762665 16 0.762665C7.18 0.762665 0 6.59067 0 13.752C0 20.1667 5.69333 25.5413 13.38 26.5627C13.9013 26.672 14.6107 26.9067 14.7907 27.3493C14.9507 27.7507 14.896 28.3707 14.8413 28.7893L14.6227 30.1493C14.5627 30.5507 14.3027 31.7307 16.0213 31.0093C17.7427 30.2907 25.2427 25.572 28.6027 21.7093C30.9013 19.1907 32 16.6107 32 13.752Z" fill="currentColor"/>
  </svg>
)

// Googleアイコン
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLineLogin = () => {
    try {
      const loginUrl = getLineLoginUrl()
      window.location.href = loginUrl
    } catch (error) {
      setError('LINEログインに失敗しました')
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError('Googleログインに失敗しました')
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (activeTab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        sessionStorage.setItem('auth_type', 'email')
        window.location.reload()
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify-email`,
          },
        })
        if (error) throw error
        if (data.user) {
          sessionStorage.setItem('auth_type', 'email')
          sessionStorage.setItem('show_email_sent', 'true')
          window.location.reload()
        }
      }
    } catch (err: any) {
      setError(err.message || '認証に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[6],
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        animation: 'fadeIn 0.5s ease-out',
      }}>
        {/* ロゴとタイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing[8],
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: colors.gradients.primary,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.glow,
            margin: '0 auto',
            marginBottom: spacing[4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
          }}>
            🎯
          </div>
          <h1 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2],
            letterSpacing: typography.letterSpacing.tight,
          }}>
            デミセル
          </h1>
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            fontWeight: typography.fontWeight.medium,
          }}>
            主催者向けプラットフォーム
          </p>
        </div>

        {/* メインカード */}
        <div style={{
          background: colors.neutral[0],
          borderRadius: borderRadius.xl,
          boxShadow: shadows.xl,
          padding: spacing[8],
        }}>
          {authMode === 'initial' ? (
            <>
              {/* タブ */}
              <div style={{
                display: 'flex',
                gap: spacing[2],
                marginBottom: spacing[6],
                background: colors.neutral[100],
                borderRadius: borderRadius.md,
                padding: spacing[1],
              }}>
                <button
                  onClick={() => setActiveTab('login')}
                  style={{
                    flex: 1,
                    padding: `${spacing[2.5]} ${spacing[4]}`,
                    background: activeTab === 'login' ? colors.neutral[0] : 'transparent',
                    color: activeTab === 'login' ? colors.neutral[900] : colors.neutral[600],
                    border: 'none',
                    borderRadius: borderRadius.base,
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === 'login' ? shadows.sm : 'none',
                  }}
                >
                  ログイン
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  style={{
                    flex: 1,
                    padding: `${spacing[2.5]} ${spacing[4]}`,
                    background: activeTab === 'register' ? colors.neutral[0] : 'transparent',
                    color: activeTab === 'register' ? colors.neutral[900] : colors.neutral[600],
                    border: 'none',
                    borderRadius: borderRadius.base,
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === 'register' ? shadows.sm : 'none',
                  }}
                >
                  新規登録
                </button>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div style={{
                  padding: spacing[4],
                  background: colors.status.error.light,
                  border: `1px solid ${colors.status.error.main}`,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing[6],
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.status.error.dark,
                    fontWeight: typography.fontWeight.medium,
                  }}>
                    {error}
                  </p>
                </div>
              )}

              {/* ソーシャルログインボタン */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[3],
                marginBottom: spacing[6],
              }}>
                <button
                  onClick={handleLineLogin}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[2],
                    padding: `${spacing[3]} ${spacing[4]}`,
                    background: '#06C755',
                    color: colors.neutral[0],
                    border: 'none',
                    borderRadius: borderRadius.md,
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: shadows.button,
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = '#05B04A'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = shadows.buttonHover
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = '#06C755'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = shadows.button
                    }
                  }}
                >
                  <LineIcon />
                  <span>LINEで{activeTab === 'login' ? 'ログイン' : '新規登録'}</span>
                </button>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[2],
                    padding: `${spacing[3]} ${spacing[4]}`,
                    background: colors.neutral[0],
                    color: colors.neutral[700],
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = colors.neutral[50]
                      e.currentTarget.style.borderColor = colors.neutral[400]
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = colors.neutral[0]
                      e.currentTarget.style.borderColor = colors.neutral[300]
                    }
                  }}
                >
                  <GoogleIcon />
                  <span>Googleで{activeTab === 'login' ? 'ログイン' : '新規登録'}</span>
                </button>
              </div>

              {/* 区切り線 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[4],
                marginBottom: spacing[6],
              }}>
                <div style={{ flex: 1, height: '1px', background: colors.neutral[300] }} />
                <span style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[500],
                  fontWeight: typography.fontWeight.medium,
                }}>
                  または
                </span>
                <div style={{ flex: 1, height: '1px', background: colors.neutral[300] }} />
              </div>

              {/* メールログインボタン */}
              <button
                onClick={() => setAuthMode(activeTab)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[2],
                  padding: `${spacing[3]} ${spacing[4]}`,
                  background: colors.primary[500],
                  color: colors.neutral[0],
                  border: 'none',
                  borderRadius: borderRadius.md,
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: shadows.glow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.primary[600]
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = shadows.buttonHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.primary[500]
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = shadows.glow
                }}
              >
                <MailIcon />
                <span>メールアドレスで{activeTab === 'login' ? 'ログイン' : '新規登録'}</span>
              </button>
            </>
          ) : (
            <>
              {/* メールログインフォーム */}
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setError('')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: spacing[2],
                  background: 'transparent',
                  border: 'none',
                  color: colors.neutral[600],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  marginBottom: spacing[6],
                }}
              >
                <span>←</span>
                <span>戻る</span>
              </button>

              <h2 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                marginBottom: spacing[6],
                textAlign: 'center',
              }}>
                {authMode === 'login' ? 'メールアドレスでログイン' : 'メールアドレスで新規登録'}
              </h2>

              {error && (
                <div style={{
                  padding: spacing[4],
                  background: colors.status.error.light,
                  border: `1px solid ${colors.status.error.main}`,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing[6],
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.status.error.dark,
                    fontWeight: typography.fontWeight.medium,
                  }}>
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="メールアドレス"
                  placeholder="example@email.com"
                  required
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="パスワード"
                  placeholder="6文字以上"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  {authMode === 'login' ? 'ログイン' : '新規登録'}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* フッター */}
        <div style={{
          marginTop: spacing[6],
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
            margin: 0,
          }}>
            © 2024 デミセル. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
