'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, spacing, borderRadius, typography, shadows } from '@/styles/design-system'
import Button from './ui/Button'

interface EmailConfirmationBannerProps {
  email: string
}

export default function EmailConfirmationBanner({ email }: EmailConfirmationBannerProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error
      
      setMessage('確認メールを再送信しました。メールをご確認ください。')
    } catch (error: any) {
      setMessage('メールの再送信に失敗しました。しばらくしてからもう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: colors.status.warning.light,
      border: `1px solid ${colors.status.warning.main}`,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      boxShadow: shadows.card,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[4],
      }}>
        <div style={{
          flexShrink: 0,
          width: '48px',
          height: '48px',
          background: colors.status.warning.main,
          borderRadius: borderRadius.full,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          📧
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2],
          }}>
            メールアドレスの確認が必要です
          </h3>
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[700],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing[4],
          }}>
            <strong>{email}</strong> 宛に確認メールを送信しました。
            メール内のリンクをクリックして、メールアドレスを確認してください。
          </p>
          {message && (
            <div style={{
              padding: spacing[3],
              background: message.includes('失敗') ? colors.status.error.light : colors.status.success.light,
              border: `1px solid ${message.includes('失敗') ? colors.status.error.main : colors.status.success.main}`,
              borderRadius: borderRadius.base,
              marginBottom: spacing[4],
            }}>
              <p style={{
                margin: 0,
                fontSize: typography.fontSize.sm,
                color: message.includes('失敗') ? colors.status.error.dark : colors.status.success.dark,
              }}>
                {message}
              </p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendEmail}
            loading={loading}
          >
            確認メールを再送信
          </Button>
        </div>
      </div>
    </div>
  )
}
