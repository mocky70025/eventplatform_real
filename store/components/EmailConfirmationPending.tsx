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
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(-44.94deg, rgba(255, 245, 240, 1) 0%, rgba(232, 245, 245, 1) 99.95%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* メインカード */}
      <div style={{
        width: '100%',
        maxWidth: '352px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '0',
        position: 'relative'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '32px',
          padding: '0 20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 12px',
            background: '#5DABA8',
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
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.3,
            color: '#2C3E50',
            margin: '0 0 12px'
          }}>
            デミセル
          </h1>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '15px',
            color: '#6C757D',
            margin: 0,
            lineHeight: 1.6
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* 区切り線 */}
        <div style={{
          width: '100%',
          height: '1px',
          background: '#E9ECEF',
          marginBottom: '32px'
        }} />

        {/* メインメッセージ */}
        <div style={{
          padding: '0 20px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: '#2C3E50',
            margin: '0 0 16px',
            lineHeight: 1.3
          }}>
            メールを送信しました
          </h2>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            確認メールを送信しました
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            メール内のリンクをクリックして
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: 0
          }}>
            登録を完了してください
          </p>
        </div>

        {/* メールが届かない場合セクション */}
        <div style={{
          margin: '0 20px 24px',
          padding: '16px',
          background: '#F8F9FA',
          border: '1px solid #E9ECEF',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2C3E50',
            margin: '0 0 8px',
            lineHeight: 1.5
          }}>
            メールが届かない場合
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            迷惑メールフォルダをご確認ください
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: '0 0 8px'
          }}>
            それでもメールを確認できない場合
          </p>
          <p style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#6C757D',
            margin: '0 0 16px'
          }}>
            再送信ボタンを押してください
          </p>

          {/* メール再送信ボタン */}
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              width: '100%',
              maxWidth: '256px',
              height: '52px',
              padding: 0,
              background: resending ? '#9ca3af' : '#5DABA8',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: 'none',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              fontStyle: 'italic',
              cursor: resending ? 'not-allowed' : 'pointer',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: resending ? 'none' : '0px 8px 32px rgba(0, 0, 0, 0.08)',
              margin: '0 auto'
            }}
          >
            {resending ? '送信中...' : 'メール再送信'}
          </button>

          {resendSuccess && (
            <p style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '12px',
              lineHeight: 1.5,
              color: '#5DABA8',
              margin: '12px 0 0',
              fontWeight: 600
            }}>
              確認メールを再送信しました
            </p>
          )}
        </div>

        {/* パディング調整 */}
        <div style={{ height: '32px' }} />
      </div>
    </div>
  )
}

