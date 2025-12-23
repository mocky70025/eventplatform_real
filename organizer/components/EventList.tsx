'use client'

import { useState } from 'react'
import { supabase, type Event } from '@/lib/supabase'

interface EventListProps {
  events: Event[]
  onEventUpdated: () => void
  onEdit?: (event: Event) => void
  onViewApplications?: (event: Event) => void
  onViewDetail?: (event: Event) => void
}

export default function EventList({ events, onEventUpdated, onEdit, onViewApplications, onViewDetail }: EventListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    if (!confirm('このイベントを削除しますか？')) return

    setDeleting(eventId)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      onEventUpdated()
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('イベントの削除に失敗しました。')
    } finally {
      setDeleting(null)
    }
  }

  if (events.length === 0) {
    return (
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <p style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#6C757D'
        }}>掲載中のイベントはありません</p>
      </div>
    )
  }

  // 日付をフォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  // 期間をフォーマット
  const formatPeriod = (event: Event) => {
    if (event.event_display_period) {
      return event.event_display_period
    }
    const startDate = formatDate(event.event_start_date)
    const endDate = formatDate(event.event_end_date)
    if (startDate && endDate && startDate !== endDate) {
      return `${startDate} - ${endDate}`
    }
    return startDate || endDate || ''
  }

  // 場所をフォーマット
  const formatLocation = (event: Event) => {
    const parts = []
    if (event.venue_city) parts.push(event.venue_city)
    if (event.venue_town) parts.push(event.venue_town)
    return parts.join(' ') || ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {events.map((event) => {
        return (
          <div
            key={event.id}
            onClick={() => {
              if (onViewDetail) {
                onViewDetail(event)
              }
            }}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* 左側: 画像 */}
            <div style={{
              width: '120px',
              height: '80px',
              background: '#E9ECEF',
              borderRadius: '8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {event.main_image_url ? (
                <img
                  src={event.main_image_url}
                  alt={event.event_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#E9ECEF',
                  borderRadius: '8px'
                }} />
              )}
            </div>
            
            {/* 右側: タイトルと情報 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <h3 style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#2C3E50',
                margin: 0
              }}>
                {event.event_name}
              </h3>
              
              <p style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '12px',
                lineHeight: '150%',
                color: '#6C757D',
                margin: 0
              }}>
                {formatPeriod(event)}
              </p>

              {formatLocation(event) && (
                <p style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#6C757D',
                  margin: 0
                }}>
                  {formatLocation(event)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
