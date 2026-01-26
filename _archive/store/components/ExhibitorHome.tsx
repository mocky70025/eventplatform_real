'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows } from '../styles/design-system'

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
        console.log('[ExhibitorHome] approval_status column may not exist')
      }

      const today = new Date().toISOString().split('T')[0]
      query = query.gte('event_end_date', today)
      query = query.order('event_start_date', { ascending: true })
      query = query.limit(isDesktop ? 20 : 10)

      const { data, error } = await query

      if (error) {
        console.error('[ExhibitorHome] Failed to fetch events:', error)
        setEvents([])
        return
      }

      let filteredEvents = (data || []) as Event[]

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
        background: colors.background.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `3px solid ${colors.neutral[200]}`,
          borderTopColor: colors.primary[500],
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: colors.background.primary,
      paddingBottom: isDesktop ? spacing[12] : spacing[20]
    }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        height: isDesktop ? '80px' : '64px',
        background: colors.primary[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: shadows.md,
        padding: `0 ${isDesktop ? spacing[12] : spacing[4]}`
      }}>
        <h1 style={{
          margin: 0,
          fontSize: isDesktop ? typography.fontSize['3xl'] : typography.fontSize['2xl'],
          fontFamily: typography.fontFamily.japanese,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[0]
        }}>
          マイイベント
        </h1>
      </div>

      {/* コンテンツエリア */}
      <div style={{
        maxWidth: isDesktop ? '1400px' : '100%',
        margin: '0 auto',
        padding: isDesktop ? `${spacing[10]} ${spacing[12]}` : `${spacing[6]} ${spacing[4]}`
      }}>
        {/* イベントリスト */}
        {events.length === 0 ? (
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: isDesktop ? `${spacing[16]} ${spacing[10]}` : `${spacing[10]} ${spacing[6]}`,
            textAlign: 'center',
            boxShadow: shadows.card
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: `0 auto ${spacing[4]}` }}>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.neutral[300]} strokeWidth="1.5"/>
              <path d="M3 10H21" stroke={colors.neutral[300]} strokeWidth="1.5"/>
              <path d="M8 4V8M16 4V8" stroke={colors.neutral[300]} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.lg,
              lineHeight: typography.lineHeight.relaxed,
              color: colors.neutral[500],
              fontWeight: typography.fontWeight.medium
            }}>
              イベントがありません
            </p>
            <button
              onClick={() => onNavigate('events')}
              style={{
                marginTop: spacing[6],
                padding: `${spacing[3]} ${spacing[6]}`,
                background: colors.primary[500],
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.lg,
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: shadows.button
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.primary[600]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.primary[500]}
            >
              イベントを探す
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(400px, 1fr))' : '1fr',
            gap: isDesktop ? spacing[6] : spacing[4]
          }}>
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => onNavigate('events')}
                style={{
                  background: colors.neutral[0],
                  borderRadius: borderRadius.xl,
                  overflow: 'hidden',
                  boxShadow: shadows.card,
                  cursor: 'pointer',
                  border: `1px solid ${colors.neutral[200]}`,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = shadows.lg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = shadows.card
                }}
              >
                {/* イベント画像 */}
                <div style={{
                  width: '100%',
                  height: isDesktop ? '220px' : '180px',
                  background: event.main_image_url ? 'transparent' : `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
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
                    <span style={{ fontSize: '64px' }}>🎪</span>
                  )}
                </div>

                {/* イベント情報 */}
                <div style={{ padding: isDesktop ? spacing[5] : spacing[4] }}>
                  <h3 style={{
                    margin: `0 0 ${spacing[3]} 0`,
                    fontSize: isDesktop ? typography.fontSize.xl : typography.fontSize.lg,
                    fontFamily: typography.fontFamily.japanese,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    lineHeight: typography.lineHeight.tight
                  }}>
                    {event.event_name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2]
                  }}>
                    {/* 日付 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2]
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                        <path d="M3 10H21" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                        <path d="M8 4V8M16 4V8" stroke={colors.neutral[500]} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p style={{
                        margin: 0,
                        fontSize: typography.fontSize.sm,
                        fontFamily: typography.fontFamily.japanese,
                        color: colors.neutral[600],
                        lineHeight: typography.lineHeight.normal
                      }}>
                        {formatDateRange(event.event_start_date, event.event_end_date)}
                      </p>
                    </div>

                    {/* 場所 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2]
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                        <circle cx="12" cy="9" r="2.5" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                      </svg>
                      <p style={{
                        margin: 0,
                        fontSize: typography.fontSize.sm,
                        fontFamily: typography.fontFamily.japanese,
                        color: colors.neutral[600],
                        lineHeight: typography.lineHeight.normal
                      }}>
                        {formatLocation(event.venue_city, event.venue_town)}
                      </p>
                    </div>
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
