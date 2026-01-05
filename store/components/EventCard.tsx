'use client'

import { useState } from 'react'
import { supabase, type Event } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/design-system'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'

interface EventCardProps {
  event: Event
  userProfile: any
  onClick?: () => void
}

export default function EventCard({ event, userProfile, onClick }: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [applying, setApplying] = useState(false)

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm(`「${event.event_name}」に申し込みますか？\n\n申し込み後、主催者による承認が必要です。`)) {
      return
    }

    setApplying(true)
    try {
      const authType = userProfile.authType || 'line'
      let exhibitor

      if (authType === 'email') {
        const { data } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('user_id', userProfile.userId)
          .single()
        exhibitor = data
      } else {
        const { data } = await supabase
        .from('exhibitors')
        .select('id')
        .eq('line_user_id', userProfile.userId)
        .single()
        exhibitor = data
      }

      if (!exhibitor) {
        throw new Error('出店者情報が見つかりません')
      }

      const { data: applicationData, error } = await supabase
        .from('event_applications')
        .insert({
          exhibitor_id: exhibitor.id,
          event_id: event.id,
          application_status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      const { data: eventData } = await supabase
        .from('events')
        .select('event_name, organizer_id')
        .eq('id', event.id)
        .single()

      if (eventData && eventData.organizer_id) {
        const { data: organizerData } = await supabase
          .from('organizers')
          .select('email, user_id, line_user_id')
          .eq('id', eventData.organizer_id)
          .single()

        if (organizerData) {
          const organizerUserId = organizerData.user_id || organizerData.line_user_id

          if (organizerUserId) {
            try {
              await fetch('/api/notifications/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: organizerUserId,
                  userType: 'organizer',
                  notificationType: 'application_received',
                  title: '新しい出店申し込み',
                  message: `${eventData.event_name}に新しい出店申し込みがありました。`,
                  relatedEventId: event.id,
                  relatedApplicationId: applicationData.id
                })
              })

              if (organizerData.email) {
                await fetch('/api/notifications/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to: organizerData.email,
                    subject: `【${eventData.event_name}】新しい出店申し込みがありました`,
                    html: `
                      <div style="font-family: ${typography.fontFamily.japanese}; line-height: 1.6; color: ${colors.neutral[900]};">
                        <h2 style="color: ${colors.primary[500]}; margin-bottom: ${spacing[4]};">新しい出店申し込み</h2>
                        <p>${eventData.event_name}に新しい出店申し込みがありました。</p>
                        <p style="margin-top: ${spacing[6]};">アプリ内で申し込み内容を確認し、承認または却下を行ってください。</p>
                        <hr style="border: none; border-top: 1px solid ${colors.neutral[200]}; margin: ${spacing[6]} 0;">
                        <p style="font-size: ${typography.fontSize.xs}; color: ${colors.neutral[500]};">このメールは自動送信されています。</p>
                      </div>
                    `
                  })
                })
              }
            } catch (notificationError) {
              console.error('通知の送信に失敗しました:', notificationError)
            }
          }
        }
      }

      alert('申し込みが完了しました！')
    } catch (error) {
      console.error('申し込みに失敗しました:', error)
      alert('申し込みに失敗しました。もう一度お試しください。')
    } finally {
      setApplying(false)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
  }

  return (
    <Card 
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: `all ${transitions.normal}`,
        border: `1px solid ${colors.neutral[200]}`,
      }}
    >
      {event.main_image_url && (
        <div style={{
          width: '100%',
          height: '180px',
          borderRadius: borderRadius.medium,
          overflow: 'hidden',
          marginBottom: spacing.lg,
          background: colors.neutral[100]
        }}>
          <img
            src={event.main_image_url}
            alt={event.event_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* ジャンルバッジ */}
        <Badge variant="info">
          {event.genre || 'イベント'}
        </Badge>

        {/* イベント名 */}
        <h3 style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.heading3,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          lineHeight: typography.lineHeight.heading3,
          margin: 0
        }}>
          {event.event_name}
        </h3>
        
        {/* 開催情報 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.bodySmall,
          color: colors.neutral[700]
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <span style={{ color: colors.neutral[500] }}>📅</span>
            <span>{formatDateRange(event.event_start_date, event.event_end_date)}</span>
          </div>
          {event.event_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <span style={{ color: colors.neutral[500] }}>🕒</span>
              <span>{event.event_time}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <span style={{ color: colors.neutral[500] }}>📍</span>
            <span>{event.venue_name}</span>
          </div>
        </div>

        {/* リード文 */}
        <p style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.bodySmall,
          lineHeight: typography.lineHeight.bodySmall,
          color: colors.neutral[700],
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.lead_text}
        </p>

        {/* ボタン */}
        <div style={{ 
          display: 'flex', 
          gap: spacing.sm,
          marginTop: spacing.sm
        }}>
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            style={{ flex: 1 }}
          >
            {showDetails ? '詳細を閉じる' : '詳細を見る'}
          </Button>
          
          <Button
            variant="primary"
            size="small"
            onClick={handleApply}
            disabled={applying}
            loading={applying}
            style={{ flex: 1 }}
          >
            申し込む
          </Button>
        </div>

        {/* 詳細表示 */}
        {showDetails && (
          <div style={{
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTop: `1px solid ${colors.neutral[200]}`
          }}>
            <h4 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.body,
              fontWeight: typography.fontWeight.semiBold,
              color: colors.neutral[900],
              marginBottom: spacing.sm
            }}>
              イベント詳細
            </h4>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.bodySmall,
              lineHeight: typography.lineHeight.bodySmall,
              color: colors.neutral[700],
              margin: 0,
              whiteSpace: 'pre-line'
            }}>
              {event.event_description}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
