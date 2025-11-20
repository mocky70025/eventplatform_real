'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (!token || type !== 'signup') {
        setStatus('error')
        setErrorMessage('無効な確認リンクです')
        return
      }

      try {
        // メール確認を実行
        // Supabaseのメール確認リンクは、URLパラメータからtokenとtypeを取得
        const { data, error } = await supabase.auth.verifyOtp({
          token: token,
          type: 'signup'
        })

        if (error) {
          console.error('Email verification error:', error)
          setStatus('error')
          setErrorMessage(error.message || 'メールアドレスの確認に失敗しました')
          return
        }

        // セッションを取得
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session && session.user) {
          // セッションストレージに保存
          sessionStorage.setItem('auth_type', 'email')
          sessionStorage.setItem('user_id', session.user.id)
          sessionStorage.setItem('user_email', session.user.email || '')
          
          setStatus('success')
          
          // 3秒後にホームページにリダイレクト
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setStatus('error')
          setErrorMessage('セッションの取得に失敗しました')
        }
      } catch (err: any) {
        console.error('Verification error:', err)
        setStatus('error')
        setErrorMessage(err.message || 'メールアドレスの確認中にエラーが発生しました')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        background: '#FFFFFF', 
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', 
        borderRadius: '12px', 
        padding: '48px 24px',
        maxWidth: '394px',
        width: '100%',
        textAlign: 'center'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid #E5E5E5',
              borderTopColor: '#06C755',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px'
            }}></div>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000',
              marginBottom: '16px'
            }}>
              メールアドレスを確認中...
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666'
            }}>
              少々お待ちください
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#06C755',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{
                fontSize: '32px',
                color: '#FFFFFF'
              }}>✓</span>
            </div>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000',
              marginBottom: '16px'
            }}>
              メールアドレスの確認が完了しました
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666',
              marginBottom: '24px'
            }}>
              ホームページにリダイレクトします...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#FF3B30',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{
                fontSize: '32px',
                color: '#FFFFFF'
              }}>×</span>
            </div>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000',
              marginBottom: '16px'
            }}>
              確認に失敗しました
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666',
              marginBottom: '24px'
            }}>
              {errorMessage}
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 24px',
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ホームに戻る
            </button>
          </>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

