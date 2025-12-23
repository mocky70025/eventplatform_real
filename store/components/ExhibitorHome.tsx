'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ExhibitorHomeProps {
  userProfile: any
  onNavigate: (view: 'events' | 'profile' | 'applications' | 'notifications') => void
}

interface Event {
  id: string
  event_name: string
  event_start_date: string
  event_end_date: string
  venue_city?: string
  venue_town?: string
  main_image_url?: string
}

export default function ExhibitorHome({ userProfile, onNavigate }: ExhibitorHomeProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('events')
        .select('id, event_name, event_start_date, event_end_date, venue_city, venue_town, main_image_url')
      
      // approval_statusカラムが存在する場合のみフィルタリング
      try {
        query = query.eq('approval_status', 'approved')
      } catch (error) {
        // カラムが存在しない場合はスキップ
        console.log('[ExhibitorHome] approval_status column may not exist')
      }

      const today = new Date().toISOString().split('T')[0]
      query = query.gte('event_end_date', today)
      query = query.order('event_start_date', { ascending: true })
      query = query.limit(10) // 最新10件を取得

      const { data, error } = await query

      if (error) {
        console.error('[ExhibitorHome] Failed to fetch events:', error)
        setEvents([])
        return
      }

      let filteredEvents = (data || []) as Event[]

      // approval_statusカラムが存在する場合、クライアント側でもフィルタリング
      if (filteredEvents.length > 0 && 'approval_status' in filteredEvents[0]) {
        filteredEvents = filteredEvents.filter(event => 
          (event as any).approval_status === 'approved' || (event as any).approval_status === null
        )
      }

      setEvents(filteredEvents)
    } catch (error) {
      console.error('[ExhibitorHome] Error fetching events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startYear = start.getFullYear()
    const startMonth = start.getMonth() + 1
    const startDay = start.getDate()
    const endMonth = end.getMonth() + 1
    const endDay = end.getDate()
    return `${startYear}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`
  }

  const formatLocation = (city?: string, town?: string) => {
    if (city && town) {
      return `東京都 ${city}${town}`
    } else if (city) {
      return `東京都 ${city}`
    }
    return '東京都'
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: '#5DABA8', fontSize: '16px' }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFF5F0',
      paddingBottom: '100px'
    }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        height: '64px',
        background: '#5DABA8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '18px',
          fontWeight: 700,
          color: '#FFFFFF'
        }}>
          マイイベント
        </div>
      </div>

      {/* イベントリスト */}
      <div style={{
        width: '100%',
        maxWidth: '393px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6C757D',
            fontSize: '14px'
          }}>
            イベントがありません
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => onNavigate('events')}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '16px'
                }}
              >
                {/* 画像プレースホルダー */}
                <div style={{
                  width: '120px',
                  height: '80px',
                  background: '#D9D9D9',
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
                    <div style={{ color: '#6C757D', fontSize: '12px' }}>画像なし</div>
                  )}
                </div>

                {/* イベント情報 */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* イベント名 */}
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#2C3E50',
                    lineHeight: '1.4'
                  }}>
                    {event.event_name}
                  </div>

                  {/* 日付 */}
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#6C757D'
                  }}>
                    {formatDateRange(event.event_start_date, event.event_end_date)}
                  </div>

                  {/* 場所 */}
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#6C757D'
                  }}>
                    {formatLocation(event.venue_city, event.venue_town)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

