'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface EmailConfirmationPendingProps {
  email: string
  onEmailConfirmed: () => void
}

export default function EmailConfirmationPending({ email, onEmailConfirmed }: EmailConfirmationPendingProps) {
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    setResending(true)
    setResendSuccess(false)
    
    try {
      // リダイレクトURLを設定（メール確認用）
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
      const redirectUrl = `${appUrl}/auth/verify-email`
      
      console.log('[EmailConfirmationPending] Resending confirmation email:', {
        email: email,
        redirectUrl: redirectUrl,
        appUrl: appUrl
      })
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('[EmailConfirmationPending] Resend response:', {
        hasData: !!data,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      })

      if (error) {
        console.error('[EmailConfirmationPending] Failed to resend confirmation email:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
        alert(`確認メールの再送信に失敗しました。\nエラー: ${error.message}\n\nSupabase Dashboardで設定を確認してください。`)
      } else {
        console.log('[EmailConfirmationPending] Confirmation email resent successfully')
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 3000)
      }
    } catch (err: any) {
      console.error('[EmailConfirmationPending] Resend error:', err)
      alert(`確認メールの再送信に失敗しました。\nエラー: ${err.message || '不明なエラー'}`)
    } finally {
      setResending(false)
    }
  }

  // セッションを定期的にチェックして、メール確認が完了したら自動的に遷移
  useEffect(() => {
    let mounted = true
    
    const checkSession = async () => {
      if (!mounted) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session && session.user && session.user.email_confirmed_at) {
        // メール確認が完了した
        sessionStorage.setItem('email_confirmed', 'true')
        if (mounted) {
          onEmailConfirmed()
        }
      }
    }

    // 初回チェック
    checkSession()
    
    // 5秒ごとにセッションをチェック
    const interval = setInterval(checkSession, 5000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      background: '#F7F7F7',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#FFFFFF',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '48px 24px',
        maxWidth: '394px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#FFF4E6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <span style={{
            fontSize: '32px'
          }}>📧</span>
        </div>
        
        <h1 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '120%',
          color: '#000000',
          marginBottom: '16px'
        }}>
          メールアドレスの確認が必要です
        </h1>
        
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#666666',
          marginBottom: '24px'
        }}>
          {email} に確認メールを送信しました。
          <br />
          メール内のリンクをクリックして、メールアドレスを確認してください。
        </p>

        <div style={{
          background: '#F7F7F7',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#666666',
            margin: 0
          }}>
            <strong>確認メールが届かない場合：</strong>
            <br />
            • スパムフォルダを確認してください
            <br />
            • メールアドレスが正しいか確認してください
            <br />
            • 下のボタンから再送信できます
          </p>
        </div>

        <button
          onClick={handleResend}
          disabled={resending}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: resending ? '#CCCCCC' : '#06C755',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            cursor: resending ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            transition: 'background 0.2s'
          }}
        >
          {resending ? '送信中...' : '確認メールを再送信'}
        </button>

        {resendSuccess && (
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#06C755',
            margin: 0
          }}>
            確認メールを再送信しました
          </p>
        )}

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          lineHeight: '150%',
          color: '#999999',
          marginTop: '24px',
          marginBottom: 0
        }}>
          メール確認が完了すると、自動的に登録フォームに進みます。
        </p>
      </div>
    </div>
  )
}

