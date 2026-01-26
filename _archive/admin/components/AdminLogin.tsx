'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logAdminAction } from '@/lib/adminLogger'

interface AdminLoginProps {
  onLoginSuccess: () => void
}

// 管理者用カラーパレット
const colors = {
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryLight: '#EEF2FF',
  neutral: {
    0: '#FFFFFF',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    500: '#737373',
    700: '#404040',
    900: '#171717',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
}

const spacing = {
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
}

const borderRadius = {
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
}

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 複数の管理者メールアドレスに対応（カンマ区切り）
  const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  const adminEmails = adminEmailsString
    ? adminEmailsString.split(',').map(e => e.trim().toLowerCase())
    : []
  console.log('[AdminLogin] adminEmails', adminEmailsString, adminEmails)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 管理者メールアドレスが設定されている場合、チェック
      if (adminEmails.length > 0 && !adminEmails.includes(email.trim().toLowerCase())) {
        setError('管理者権限がありません')
        setLoading(false)
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        sessionStorage.setItem('admin_authenticated', 'true')
        sessionStorage.setItem('admin_email', email)
        
        // ログイン操作を記録
        await logAdminAction({
          adminEmail: email,
          actionType: 'login',
          details: {
            loginTime: new Date().toISOString(),
            userId: data.user.id
          }
        })
        
        onLoginSuccess()
      }
    } catch (err: any) {
      console.error('Admin login error:', err)
      setError(err.message || 'ログインに失敗しました')
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
      background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.neutral[100]} 100%)`,
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
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            borderRadius: borderRadius.xl,
            boxShadow: `0 4px 12px rgba(99, 102, 241, 0.3)`,
            margin: '0 auto',
            marginBottom: spacing[4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
          }}>
            🔐
          </div>
          <h1 style={{
            fontFamily: '"Poppins", "Inter", sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.neutral[900],
            marginBottom: spacing[2],
            letterSpacing: '-0.025em',
          }}>
            デミセル
          </h1>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '1rem',
            color: colors.neutral[500],
            fontWeight: 500,
          }}>
            運営管理システム
          </p>
        </div>

        {/* ログインカード */}
        <div style={{
          background: colors.neutral[0],
          borderRadius: borderRadius.xl,
          boxShadow: shadows.xl,
          padding: spacing[8],
        }}>
          <h2 style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: colors.neutral[900],
            marginBottom: spacing[6],
            textAlign: 'center',
          }}>
            管理者ログイン
          </h2>

          {error && (
            <div style={{
              padding: spacing[4],
              background: colors.error.light,
              border: `1px solid ${colors.error.main}`,
              borderRadius: borderRadius.md,
              marginBottom: spacing[6],
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: colors.error.dark,
                fontWeight: 500,
              }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: spacing[2],
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.neutral[700],
              }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: `0 ${spacing[4]}`,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '1rem',
                  color: colors.neutral[900],
                  background: colors.neutral[0],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  outline: 'none',
                  transition: 'all 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.neutral[300]
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: spacing[2],
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.neutral[700],
              }}>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: `0 ${spacing[4]}`,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '1rem',
                  color: colors.neutral[900],
                  background: colors.neutral[0],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  outline: 'none',
                  transition: 'all 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.neutral[300]
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                background: colors.primary,
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.md,
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = colors.primaryHover
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = colors.primary
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: `2px solid ${colors.neutral[0]}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  <span>ログイン中...</span>
                </>
              ) : (
                <span>ログイン</span>
              )}
            </button>
          </form>

          {adminEmailsString && (
            <p style={{
              marginTop: spacing[6],
              fontSize: '0.75rem',
              color: colors.neutral[500],
              textAlign: 'center',
            }}>
              設定済の管理者メールアドレス: {adminEmailsString}
            </p>
          )}
        </div>

        {/* フッター */}
        <div style={{
          marginTop: spacing[6],
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: colors.neutral[500],
            margin: 0,
          }}>
            © 2024 デミセル. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
