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

  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        background: colors.background.primary,
      }}>
        <Card 
          padding={12}
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
            fontSize: typography.fontSize['3xl'],
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
      padding: spacing[6],
      background: colors.background.primary,
    }}>
      <Card
        padding={12}
        style={{
          maxWidth: '440px',
          width: '100%',
        }}
      >
        {/* ロゴ・タイトル */}
        <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: colors.primary[500],
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing[5]}`,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
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
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2],
          }}>
            デミセル
          </h1>

          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
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
          marginBottom: spacing[8],
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: `${spacing[3]} ${spacing[4]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
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
              padding: `${spacing[3]} ${spacing[4]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
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
                padding: spacing[4],
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
          gap: spacing[4],
          margin: `${spacing[8]} 0`,
        }}>
          <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
          <span style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
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
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
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
            Googleでログイン
          </div>
        </Button>
      </Card>
    </div>
  )
}
