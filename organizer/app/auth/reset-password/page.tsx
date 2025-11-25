'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/update-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) throw error

      setMessage('パスワードリセット用のメールを送信しました。メール内のリンクから新しいパスワードを設定してください。')
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError(err.message || 'パスワードリセットに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ paddingTop: '24px', marginBottom: '24px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: '#06C755',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            ← 戻る
          </button>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '24px'
          }}>
            パスワードをリセット
          </h1>
        </div>

        <div style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          {message ? (
            <div style={{
              padding: '16px',
              background: '#E6F7ED',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#06C755'
              }}>
                {message}
              </p>
            </div>
          ) : (
            <>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#666666',
                marginBottom: '24px'
              }}>
                登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
              </p>

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

              <form onSubmit={handleResetPassword}>
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
                  {loading ? '送信中...' : 'リセット用メールを送信'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

