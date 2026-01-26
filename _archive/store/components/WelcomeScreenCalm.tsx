'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Mail, Store } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Button from './ui/Button'
import Input from './ui/Input'
import { colors, spacing, typography, borderRadius, shadows, transitions } from '../styles/design-system'

export default function WelcomeScreenCalm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const returnTo = encodeURIComponent(currentUrl)
  const termsHref = `/terms?returnTo=${returnTo}`
  const privacyHref = `/privacy?returnTo=${returnTo}`
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        if (!loginPassword) {
          setError('パスワードを入力してください')
          setLoading(false)
          return
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: loginPassword,
        })
        if (error) throw error
        setEmailSent(false)
        router.replace('/')
        return
      } else {
        if (password.length < 6) {
          setError('パスワードは6文字以上で入力してください')
          setLoading(false)
          return
        }
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

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    return () => window.removeEventListener('resize', updateIsDesktop)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: colors.neutral[50],
    }}>
      {/* 左側: シンプルなブランドセクション */}
      <div style={{
        flex: '1',
        display: isDesktop ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[12],
        background: colors.primary[50],
        borderRight: isDesktop ? `1px solid ${colors.primary[100]}` : 'none',
      }}>
        <div style={{
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: `0 auto ${spacing[6]}`,
            background: colors.primary[100],
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary[700],
          }}>
            <Store size={36} />
          </div>
          
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4],
          }}>
            出店者プラットフォーム
          </h1>
          
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            イベントへの出店申込を簡単に管理できるプラットフォームです
          </p>
        </div>
      </div>
      {/* 右側: ログインフォーム */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[8],
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
        }}>
          <div style={{
            marginBottom: spacing[8],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[1],
            height: '96px', // 見出しエリアの高さを固定して切替時の位置ずれを防ぐ
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[2],
            }}>
              {isLogin ? 'ログイン' : '新規登録'}
            </h2>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600],
            }}>
              {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成します'}
            </p>
          </div>

          {/* ソーシャルログイン */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
            marginBottom: spacing[6],
          }}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: spacing[3],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[3],
                background: colors.neutral[0],
                border: `2px solid ${colors.neutral[300]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.japanese,
                color: colors.neutral[700],
                cursor: 'pointer',
                transition: `all ${transitions.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.neutral[400]
                e.currentTarget.style.background = colors.neutral[50]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.neutral[300]
                e.currentTarget.style.background = colors.neutral[0]
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'Googleでログイン' : 'Googleで新規登録'}
            </button>

            <button
              onClick={handleLineLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: spacing[3],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[3],
                background: '#06C755',
                border: 'none',
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily.japanese,
                color: colors.neutral[0],
                cursor: 'pointer',
                transition: `all ${transitions.fast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#05B04C'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#06C755'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              {isLogin ? 'LINEでログイン' : 'LINEで新規登録'}
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
            }}>
              または
            </span>
            <div style={{ flex: 1, height: '1px', background: colors.neutral[300] }} />
          </div>

          {/* メールログインフォーム */}
          <form onSubmit={handleEmailAuth}>
            <div style={{ marginBottom: spacing[4] }}>
              <Input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {isLogin && (
              <div style={{ marginBottom: spacing[4] }}>
                <Input
                  type="password"
                  placeholder="パスワード"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <>
                <div style={{ marginBottom: spacing[4] }}>
                  <Input
                    type="password"
                    placeholder="パスワード（6文字以上）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: spacing[4] }}>
                  <Input
                    type="password"
                    placeholder="パスワード（確認）"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div style={{
                padding: spacing[3],
                background: colors.status.error.light,
                color: colors.status.error.dark,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.sm,
                marginBottom: spacing[4],
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? '送信中...' : isLogin ? 'メールでログイン' : 'メールで登録'}
            </Button>
          </form>

          {/* 切り替えリンク */}
          <div style={{
            marginTop: spacing[6],
            textAlign: 'center',
          }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setEmailSent(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary[600],
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.japanese,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
            </button>
          </div>

          {emailSent && !isLogin && (
            <div style={{
              marginTop: spacing[4],
              padding: spacing[3],
              borderRadius: borderRadius.lg,
              background: colors.status.success.light,
              color: colors.status.success.dark,
              fontSize: typography.fontSize.sm,
              textAlign: 'center',
            }}>
              メールを送信しました。メール内のリンクをクリックしてログインを完了してください。
            </div>
          )}

          <div style={{
            marginTop: spacing[5],
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
            lineHeight: typography.lineHeight.relaxed,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            gap: spacing[1],
          }}>
            {!isLogin && (
              <>
                <span>新規登録は、</span>
                <Link href={termsHref} style={{ color: '#2563EB', fontWeight: typography.fontWeight.semibold, textDecoration: 'underline' }}>
                  利用規約
                </Link>
                <span>と</span>
                <Link href={privacyHref} style={{ color: '#2563EB', fontWeight: typography.fontWeight.semibold, textDecoration: 'underline' }}>
                  プライバシーポリシー
                </Link>
                <span>に同意したものとみなされます。</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
