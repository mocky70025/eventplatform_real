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
      try {
        // Supabaseのメール確認リンクをクリックすると、自動的にセッションが作成される
        // セッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setStatus('error')
          setErrorMessage(sessionError.message || 'セッションの取得に失敗しました')
          return
        }

        if (session && session.user) {
          // メール確認済みかチェック
          const isEmailConfirmed = !!session.user.email_confirmed_at
          
          if (!isEmailConfirmed) {
            // メール確認がまだ完了していない場合
            setStatus('error')
            setErrorMessage('メールアドレスの確認が完了していません。確認メールを再送信してください。')
            return
          }

          // セッションストレージに保存
          sessionStorage.setItem('auth_type', 'email')
          sessionStorage.setItem('user_id', session.user.id)
          sessionStorage.setItem('user_email', session.user.email || '')
          
          // 登録済みかチェック
          const { data: organizer } = await supabase
            .from('organizers')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          setStatus('success')
          
          // 登録済みの場合はホームページに、未登録の場合は登録フォーム表示のためホームページにリダイレクト
          // ホームページで自動的に登録フォームが表示される
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          // セッションが存在しない場合、URLパラメータから確認を試みる
          const token = searchParams.get('token')
          const tokenHash = searchParams.get('token_hash')
          const type = searchParams.get('type')

          if (tokenHash && type === 'signup') {
            // token_hashを使用して確認を試みる
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'signup'
            })

            if (error) {
              console.error('Email verification error:', error)
              setStatus('error')
              setErrorMessage(error.message || 'メールアドレスの確認に失敗しました')
              return
            }

            // 再度セッションを取得
            const { data: { session: newSession } } = await supabase.auth.getSession()
            
            if (newSession && newSession.user) {
              sessionStorage.setItem('auth_type', 'email')
              sessionStorage.setItem('user_id', newSession.user.id)
              sessionStorage.setItem('user_email', newSession.user.email || '')
              
              // 登録済みかチェック
              const { data: organizer } = await supabase
                .from('organizers')
                .select('id')
                .eq('user_id', newSession.user.id)
                .maybeSingle()
              
              setStatus('success')
              // 登録済みの場合はホームページに、未登録の場合は登録フォーム表示のためホームページにリダイレクト
              setTimeout(() => {
                router.push('/')
              }, 2000)
            } else {
              setStatus('error')
              setErrorMessage('セッションの取得に失敗しました')
            }
          } else {
            setStatus('error')
            setErrorMessage('無効な確認リンクです。確認メールを再送信してください。')
          }
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
              borderTopColor: '#FF8A5C',
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
              background: '#FF8A5C',
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
              登録フォームにリダイレクトします...
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
                background: '#FF8A5C',
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

