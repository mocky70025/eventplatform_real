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
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '') // 末尾のスラッシュを削除
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
      background: '#E8F5F5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* 白いカード */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '40px 20px',
        maxWidth: '393px',
        width: '100%',
        position: 'relative'
      }}>
        {/* ロゴ・タイトル・サブタイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 12px',
            background: '#FF8A5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
          </div>
          <h1 style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '24px',
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#2C3E50',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            デミセル
          </h1>
          <p style={{
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            margin: 0,
            lineHeight: 1.6
          }}>
            主催者向けプラットフォーム
          </p>
        </div>

        {/* 区切り線 */}
        <div style={{
          width: '100%',
          height: '1px',
          background: '#E9ECEF',
          marginBottom: '24px'
        }} />

        {/* メインタイトル */}
        <h2 style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '120%',
          color: '#2C3E50',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          メールを送信しました
        </h2>
        
        {/* 説明文 */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            確認メールを送信しました
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            メール内のリンクをクリックして
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: 0
          }}>
            登録を完了してください
          </p>
        </div>

        {/* 情報ボックス */}
        <div style={{
          background: '#F8F9FA',
          border: '1px solid #E9ECEF',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: '150%',
            color: '#2C3E50',
            margin: '0 0 8px'
          }}>
            メールが届かない場合
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: '0 0 4px'
          }}>
            迷惑メールフォルダをご確認ください
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: '0 0 4px'
          }}>
            それでもメールを確認できない場合
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: '150%',
            color: '#6C757D',
            margin: 0
          }}>
            再送信ボタンを押してください
          </p>
        </div>

        {/* 再送信ボタン */}
        <button
          onClick={handleResend}
          disabled={resending || resendSuccess}
          style={{
            width: '100%',
            maxWidth: '256px',
            margin: '0 auto',
            display: 'block',
            height: '52px',
            padding: '0',
            background: resending || resendSuccess ? '#CCCCCC' : '#FF8A5C',
            color: '#FFFFFF',
            borderRadius: '12px',
            border: 'none',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '15px',
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: '52px',
            textAlign: 'center',
            cursor: resending || resendSuccess ? 'not-allowed' : 'pointer',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'background 0.2s'
          }}
        >
          {resending ? '送信中...' : resendSuccess ? '送信しました' : 'メール再送信'}
        </button>

        {resendSuccess && (
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: '150%',
            color: '#FF8A5C',
            margin: '16px 0 0',
            textAlign: 'center'
          }}>
            確認メールを再送信しました
          </p>
        )}
      </div>
    </div>
  )
}

