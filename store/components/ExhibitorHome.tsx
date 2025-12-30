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
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        maxWidth: '393px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        flexShrink: 0,
        height: '64px',
        background: 'linear-gradient(180deg, #5DABA8 0%, #4A9A97 100%)', // Secondary Main（出店者用）
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white'
        }}>
          マイイベント
        </h1>
      </div>

      <div style={{
        width: '100%',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
      {/* コンテンツエリア */}
      <div style={{
        width: '100%',
        maxWidth: '353px'
      }}>
      {/* イベントリスト */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
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
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => onNavigate('events')}
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
                  width: '120px',
                  height: '80px',
                  borderRadius: '8px',
                  background: '#D9D9D9',
                  flexShrink: 0,
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
                  ) : null}
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
                      {formatDateRange(event.event_start_date, event.event_end_date)}
                    </p>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    color: '#6C757D'
                  }}>
                    {formatLocation(event.venue_city, event.venue_town)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

