'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface EmailConfirmationBannerProps {
  email: string
}

export default function EmailConfirmationBanner({ email }: EmailConfirmationBannerProps) {
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResendEmail = async () => {
    setResending(true)
    setResendSuccess(false)

    try {
      const redirectUrl = `${window.location.origin}/auth/verify-email`
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) throw error

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (err: any) {
      console.error('Resend email error:', err)
      alert('確認メールの再送信に失敗しました: ' + (err.message || '不明なエラー'))
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      background: '#FFF3CD',
      border: '1px solid #FFC107',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          fontSize: '20px',
          lineHeight: '1'
        }}>⚠️</div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '150%',
            color: '#856404',
            marginBottom: '8px'
          }}>
            メールアドレスの確認が必要です
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#856404',
            marginBottom: '12px'
          }}>
            {email} に確認メールを送信しました。メール内のリンクをクリックしてメールアドレスを確認してください。
          </p>
          <button
            onClick={handleResendEmail}
            disabled={resending || resendSuccess}
            style={{
              padding: '8px 16px',
              background: resending || resendSuccess ? '#CCCCCC' : '#FFC107',
              color: '#000000',
              borderRadius: '6px',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              cursor: resending || resendSuccess ? 'not-allowed' : 'pointer'
            }}
          >
            {resending ? '送信中...' : resendSuccess ? '送信しました' : '確認メールを再送信'}
          </button>
        </div>
      </div>
    </div>
  )
}

