'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // URLパラメータからtokenとtypeを確認
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (!token || type !== 'recovery') {
      setError('無効なリンクです。')
    }
  }, [searchParams])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setMessage('パスワードを更新しました。ログイン画面に戻ります。')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err: any) {
      console.error('Password update error:', err)
      setError(err.message || 'パスワードの更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ paddingTop: '24px', marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '24px'
          }}>
            新しいパスワードを設定
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
                color: '#FF8A5C'
              }}>
                {message}
              </p>
            </div>
          ) : (
            <>
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

              <form onSubmit={handleUpdatePassword}>
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
                    新しいパスワード（6文字以上）
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="新しいパスワードを入力"
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
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
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
                    background: loading ? '#CCCCCC' : '#FF8A5C',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? '更新中...' : 'パスワードを更新'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

