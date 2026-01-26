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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
              cursor: 'pointer'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#FF8A5C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '24px' }}>🎪</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: '0 0 4px',
                  fontSize: '16px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50'
                }}>
                  {event.event_name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '2px'
                }}>
                  <img 
                    src="/mdi_calendar-outline.svg" 
                    alt="カレンダー" 
                    style={{ width: '16px', height: '16px' }}
                  />
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    color: '#6C757D'
                  }}>
                    {formatPeriod(event)}
                  </p>
                </div>
                {formatLocation(event) && (
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    color: '#6C757D'
                  }}>
                    {formatLocation(event)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
