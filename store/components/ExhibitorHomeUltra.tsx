'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/design-system'
import Button from './ui/Button'

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
  genre?: string
}

interface Application {
  id: string
  event_id: string
  status: string
  event: {
    event_name: string
  }
}

export default function ExhibitorHomeUltra({ userProfile, onNavigate }: ExhibitorHomeProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // イベント取得
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('approval_status', 'approved')
        .order('event_start_date', { ascending: true })
        .limit(6)

      // 申し込み取得
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: appsData } = await supabase
          .from('event_applications')
          .select('*, event:events(event_name)')
          .eq('exhibitor_id', user.id)

        if (appsData) {
          setApplications(appsData)
          setStats({
            total: appsData.length,
            pending: appsData.filter(a => a.status === 'pending').length,
            approved: appsData.filter(a => a.status === 'approved').length,
          })
        }
      }

      setEvents(eventsData || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
  }

  const StatIcons = {
    total: (color: string) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" stroke={color} strokeWidth="1.8" />
        <path d="M8 8H16M8 12H16M8 16H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    pending: (color: string) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
        <path d="M12 7v6l3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    approved: (color: string) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.primary[50],
    }}>
      {/* ヘッダー */}
      <div style={{
        background: colors.neutral[0],
        borderBottom: `1px solid ${colors.neutral[200]}`,
        boxShadow: shadows.sm,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `${spacing[6]} ${spacing[8]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[1],
            }}>
              ダッシュボード
            </h1>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
            }}>
              こんにちは、{userProfile?.name || 'ゲスト'}さん
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing[3] }}>
            <Button variant="outline" onClick={() => onNavigate('profile')}>
              プロフィール
            </Button>
            <Button variant="primary" onClick={() => onNavigate('events')}>
              イベントを探す
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
        {/* 統計カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing[6],
          marginBottom: spacing[8],
        }}>
          {[
            { label: '総申込数', value: stats.total, icon: StatIcons.total, color: colors.status.info.main },
            { label: '審査中', value: stats.pending, icon: StatIcons.pending, color: colors.status.warning.main },
            { label: '承認済み', value: stats.approved, icon: StatIcons.approved, color: colors.status.success.main },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: colors.neutral[0],
                borderRadius: borderRadius.xl,
                padding: spacing[6],
                boxShadow: shadows.card,
                border: `1px solid ${colors.neutral[100]}`,
                transition: `all ${transitions.normal}`,
                cursor: 'default',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[3],
              }}>
                <span aria-hidden="true">
                  {stat.icon(stat.color)}
                </span>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: borderRadius.lg,
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: stat.color,
                }}>
                  {stat.value}
                </div>
              </div>
              <div style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                fontWeight: typography.fontWeight.medium,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 最新のイベント */}
        <div style={{ marginBottom: spacing[8] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing[6],
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            }}>
              おすすめのイベント
            </h2>
            <Button variant="ghost" onClick={() => onNavigate('events')}>
              すべて見る →
            </Button>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[6],
            }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: colors.neutral[100],
                    borderRadius: borderRadius.xl,
                    height: '300px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[6],
            }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: colors.neutral[0],
                    borderRadius: borderRadius.xl,
                    overflow: 'hidden',
                    boxShadow: shadows.card,
                    border: `1px solid ${colors.neutral[100]}`,
                    cursor: 'pointer',
                    transition: `all ${transitions.normal}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = shadows.xl
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = shadows.card
                  }}
                  onClick={() => onNavigate('events')}
                >
                  {/* イベント画像 */}
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: event.main_image_url
                      ? `url(${event.main_image_url}) center/cover`
                      : `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
                    position: 'relative',
                  }}>
                    {event.genre && (
                      <div style={{
                        position: 'absolute',
                        top: spacing[3],
                        left: spacing[3],
                        padding: `${spacing[1.5]} ${spacing[3]}`,
                        background: colors.neutral[0],
                        borderRadius: borderRadius.full,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                        boxShadow: shadows.sm,
                      }}>
                        {event.genre}
                      </div>
                    )}
                  </div>

                  {/* イベント情報 */}
                  <div style={{ padding: spacing[5] }}>
                    <h3 style={{
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[900],
                      marginBottom: spacing[2],
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {event.event_name}
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing[2],
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <span>📅</span>
                        <span>{formatDate(event.event_start_date)}</span>
                      </div>
                      {event.venue_city && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                          <span>📍</span>
                          <span>{event.venue_city} {event.venue_town}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      style={{ marginTop: spacing[4] }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate('events')
                      }}
                    >
                      詳細を見る
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 最近の申し込み */}
        {applications.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing[6],
            }}>
              <h2 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
              }}>
                最近の申し込み
              </h2>
              <Button variant="ghost" onClick={() => onNavigate('applications')}>
                すべて見る →
              </Button>
            </div>

            <div style={{
              background: colors.neutral[0],
              borderRadius: borderRadius.xl,
              boxShadow: shadows.card,
              border: `1px solid ${colors.neutral[100]}`,
              overflow: 'hidden',
            }}>
              {applications.slice(0, 5).map((app, index) => (
                <div
                  key={app.id}
                  style={{
                    padding: spacing[5],
                    borderBottom: index < 4 ? `1px solid ${colors.neutral[100]}` : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: `all ${transitions.fast}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.neutral[50]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                  onClick={() => onNavigate('applications')}
                >
                  <div>
                    <div style={{
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      marginBottom: spacing[1],
                    }}>
                      {app.event?.event_name || '不明なイベント'}
                    </div>
                    <div style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                    }}>
                      申込ID: {app.id.substring(0, 8)}
                    </div>
                  </div>

                  <div style={{
                    padding: `${spacing[2]} ${spacing[4]}`,
                    borderRadius: borderRadius.full,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    background: app.status === 'approved'
                      ? colors.status.success.light
                      : app.status === 'rejected'
                      ? colors.status.error.light
                      : colors.status.warning.light,
                    color: app.status === 'approved'
                      ? colors.status.success.dark
                      : app.status === 'rejected'
                      ? colors.status.error.dark
                      : colors.status.warning.dark,
                  }}>
                    {app.status === 'approved' ? '承認済み' : app.status === 'rejected' ? '却下' : '審査中'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
