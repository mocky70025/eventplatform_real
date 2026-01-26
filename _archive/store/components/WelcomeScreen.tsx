'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import { colors, spacing, typography, borderRadius } from '../styles/design-system'

export default function WelcomeScreen() {
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
      // カスタムLINE OAuthエンドポイントにリダイレクト
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
        padding: spacing[4],
        background: colors.background.primary,
      }}>
        <Card 
          padding={8}
          style={{
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            background: colors.primary[100],
            borderRadius: borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing[6]}`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                fill={colors.primary[500]}
              />
            </svg>
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
            marginBottom: spacing[8],
          }}>
            <strong>{email}</strong> にログインリンクを送信しました。
            <br />
            メール内のリンクをクリックしてログインしてください。
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setEmailSent(false)
              setEmail('')
              setPassword('')
              setConfirmPassword('')
            }}
          >
            戻る
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[4],
      background: colors.background.primary,
    }}>
      <Card
        padding={8}
        style={{
          maxWidth: '440px',
          width: '100%',
        }}
      >
        {/* ロゴ・タイトル */}
        <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: colors.primary[500],
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing[4]}`,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
              />
              <path
                d="M2 17L12 22L22 17M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[1.5],
          }}>
            デミセル
          </h1>

          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
            fontWeight: typography.fontWeight.medium,
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* タブ切り替え */}
        <div style={{
          display: 'flex',
          gap: spacing[2],
          background: colors.neutral[100],
          padding: spacing[1],
          borderRadius: borderRadius.lg,
          marginBottom: spacing[6],
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: `${spacing[2.5]} ${spacing[3]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: isLogin ? colors.neutral[900] : colors.neutral[500],
              background: isLogin ? colors.neutral[0] : 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ログイン
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: `${spacing[2.5]} ${spacing[3]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: !isLogin ? colors.neutral[900] : colors.neutral[500],
              background: !isLogin ? colors.neutral[0] : 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            新規登録
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              label="メールアドレス"
              required
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
                />

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  label="パスワード（確認）"
                  required
                />
              </>
            )}

            {error && (
              <div style={{
                padding: spacing[3],
                background: colors.status.error.light,
                border: `1px solid ${colors.status.error.main}`,
                borderRadius: borderRadius.lg,
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                color: colors.status.error.dark,
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {isLogin ? 'ログインリンクを送信' : '新規登録'}
            </Button>
          </div>
        </form>

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
            fontSize: typography.fontSize.xs,
            color: colors.neutral[500],
          }}>
            または
          </span>
          <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
        </div>

        {/* Googleログイン */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ marginBottom: spacing[3] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span style={{ fontSize: typography.fontSize.sm }}>
              {isLogin ? 'Googleでログイン' : 'Googleで新規登録'}
            </span>
          </div>
        </Button>

        {/* LINEログイン */}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                fill="currentColor"
              />
            </svg>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold }}>
                  {isLogin ? 'LINEでログイン' : 'LINEで新規登録'}
                </span>
          </div>
        </Button>
      </Card>
    </div>
  )
}
