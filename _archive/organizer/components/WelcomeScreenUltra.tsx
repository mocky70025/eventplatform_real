'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from './ui/Button'
import Input from './ui/Input'
import { colors, spacing, typography, borderRadius, shadows, transitions } from '@/styles/design-system'
import { CheckIcon } from './icons'

export default function WelcomeScreenUltra() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error
        setEmailSent(true)
      } else {
        if (password !== confirmPassword) {
          setError('パスワードが一致しません')
          setLoading(false)
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error
        setEmailSent(true)
      }
    } catch (error: any) {
      setError(error.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'Googleログインに失敗しました')
      setLoading(false)
    }
  }

  const handleLineLogin = async () => {
    setError('')
    setLoading(true)

    try {
      window.location.href = '/api/auth/line'
    } catch (error: any) {
      setError(error.message || 'LINEログインに失敗しました')
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 50%, ${colors.primary[900]} 100%)`,
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: colors.neutral[0],
          borderRadius: borderRadius['2xl'],
          padding: spacing[10],
          boxShadow: shadows['2xl'],
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: colors.primary[100],
            borderRadius: borderRadius.full,
            margin: '0 auto',
            marginBottom: spacing[6],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize['3xl'],
          }}>
            📧
          </div>
          <h2 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[3],
          }}>
            メールを確認してください
          </h2>
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            {email} にログインリンクを送信しました。<br />
            メール内のリンクをクリックしてログインしてください。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden',
    }}>
      {/* 左側 - ヒーロー */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 50%, ${colors.primary[900]} 100%)`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: spacing[12],
        color: colors.neutral[0],
      }}>
        {/* 装飾的な背景要素 */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60%',
          height: '60%',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: borderRadius['2xl'],
            marginBottom: spacing[8],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize['5xl'],
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            🎪
          </div>

          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            marginBottom: spacing[4],
            lineHeight: typography.lineHeight.tight,
          }}>
            デミセル<br />主催者プラットフォーム
          </h1>

          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.xl,
            opacity: 0.95,
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing[8],
          }}>
            イベント主催をもっと簡単に、<br />
            もっとスマートに。
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
          }}>
            {['カンタンイベント作成', 'リアルタイム管理', '安心のサポート'].map((text, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
                fontSize: typography.fontSize.lg,
                opacity: 0.9,
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: borderRadius.full,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: typography.fontWeight.bold,
                }}>
                  <CheckIcon width={20} height={20} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側 - ログインフォーム */}
      <div style={{
        background: colors.neutral[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[8],
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: colors.neutral[0],
          borderRadius: borderRadius['2xl'],
          padding: spacing[10],
          boxShadow: shadows['2xl'],
        }}>
          <div style={{
            marginBottom: spacing[8],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[1],
            height: '104px', // 見出しエリアの高さを固定して切替時の位置ずれを防ぐ
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[2],
            }}>
              {isLogin ? 'ログイン' : '新規登録'}
            </h2>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
            }}>
              {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成'}
            </p>
          </div>

          {error && (
            <div style={{
              background: colors.status.error.light,
              color: colors.status.error.dark,
              padding: spacing[4],
              borderRadius: borderRadius.lg,
              marginBottom: spacing[6],
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}>
              {error}
            </div>
          )}

          {/* ソーシャルログイン */}
          <div style={{ marginBottom: spacing[8] }}>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ marginBottom: spacing[3] }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                  Googleで{isLogin ? 'ログイン' : '登録'}
                </span>
              </div>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleLineLogin}
              disabled={loading}
              style={{
                background: '#06C755',
                color: colors.neutral[0],
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="currentColor"/>
                </svg>
                <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold }}>
                  LINEで{isLogin ? 'ログイン' : '登録'}
                </span>
              </div>
            </Button>
          </div>

          {/* 区切り線 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            margin: `${spacing[6]} 0`,
          }}>
            <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
            <span style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              color: colors.neutral[500],
              fontWeight: typography.fontWeight.medium,
            }}>
              または
            </span>
            <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
          </div>

          {/* メールログイン */}
          <form onSubmit={handleEmailAuth}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                label="メールアドレス"
                required
                fullWidth
              />

              {!isLogin && (
                <>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    label="パスワード"
                    required
                    fullWidth
                  />

                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    label="パスワード（確認）"
                    required
                    fullWidth
                  />
                </>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                style={{ marginTop: spacing[2] }}
              >
                {isLogin ? 'ログインリンクを送信' : 'アカウントを作成'}
              </Button>
            </div>
          </form>

          {/* 切り替え */}
          <div style={{
            marginTop: spacing[8],
            textAlign: 'center',
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
          }}>
            {isLogin ? 'アカウントをお持ちでない場合' : 'すでにアカウントをお持ちの場合'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                marginLeft: spacing[2],
                background: 'none',
                border: 'none',
                color: colors.primary[600],
                fontWeight: typography.fontWeight.semibold,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: typography.fontSize.sm,
              }}
            >
              {isLogin ? '新規登録' : 'ログイン'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
