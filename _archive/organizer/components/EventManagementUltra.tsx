'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'
import NotificationBox from './NotificationBox'
import { TentIcon, CheckIcon, ClockIcon, ClipboardIcon } from './icons'

interface EventManagementProps {
  userProfile: any
  onNavigate: (view: 'create-event' | 'profile' | 'notifications') => void
  onRequestCreateEvent: () => void
  isApproved: boolean
}

interface Event {
  id: string
  event_name: string
  event_start_date: string
  event_end_date: string
  venue_city?: string
  approval_status: string
  applications_count: number
}

export default function EventManagementUltra({
  userProfile,
  onNavigate,
  onRequestCreateEvent,
  isApproved,
}: EventManagementProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, applications: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // イベント取得
        const { data: eventsData } = await supabase
          .from('events')
          .select(`
            *,
            event_applications(count)
          `)
          .eq('organizer_id', user.id)
          .order('created_at', { ascending: false })

        if (eventsData) {
          const eventsWithCount = eventsData.map(event => ({
            ...event,
            applications_count: event.event_applications?.[0]?.count || 0
          }))

          setEvents(eventsWithCount)

          // 統計計算
          const totalApps = eventsWithCount.reduce((sum, e) => sum + (e.applications_count || 0), 0)
          setStats({
            total: eventsWithCount.length,
            approved: eventsWithCount.filter(e => e.approval_status === 'approved').length,
            pending: eventsWithCount.filter(e => e.approval_status === 'pending').length,
            applications: totalApps,
          })
        }
      }
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
              イベント管理
            </h1>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
            }}>
              こんにちは、{userProfile?.name || 'ゲスト'}さん
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing[3], alignItems: 'center' }}>
            <Button variant="outline" onClick={() => onNavigate('profile')}>
              プロフィール
            </Button>
            <Button variant="primary" onClick={onRequestCreateEvent}>
              + 新しいイベント
            </Button>
            {!isApproved && (
              <span style={{
                fontSize: typography.fontSize.sm,
                color: colors.status.warning.dark,
                marginLeft: spacing[2],
              }}>
                承認待ち
              </span>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
        {(!isApproved) && (
          <div style={{ marginBottom: spacing[6] }}>
            <NotificationBox
              type="warning"
              title="イベント作成には承認が必要です"
              message="管理者からの承認が完了するまでは新しいイベントを作成できません。承認が完了したら再度お試しください。"
            />
          </div>
        )}

        {/* 統計カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing[6],
          marginBottom: spacing[8],
        }}>
          {[
            { label: '総イベント数', value: stats.total, icon: <TentIcon width={24} height={24} />, color: colors.primary[500] },
            { label: '公開中', value: stats.approved, icon: <CheckIcon width={24} height={24} />, color: colors.status.success.main },
            { label: '審査中', value: stats.pending, icon: <ClockIcon width={24} height={24} />, color: colors.status.warning.main },
            { label: '総申込数', value: stats.applications, icon: <ClipboardIcon width={24} height={24} />, color: colors.status.info.main },
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
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[3],
              }}>
                <span style={{
                  fontSize: typography.fontSize['4xl'],
                }}>
                  {stat.icon}
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

        {/* イベント一覧 */}
        <div>
          <h2 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[6],
          }}>
            あなたのイベント
          </h2>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing[6],
            }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    background: colors.neutral[100],
                    borderRadius: borderRadius.xl,
                    height: '200px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div style={{
              background: colors.neutral[0],
              borderRadius: borderRadius.xl,
              padding: spacing[12],
              textAlign: 'center',
              boxShadow: shadows.card,
            }}>
              <div style={{
                fontSize: typography.fontSize['5xl'],
                marginBottom: spacing[4],
              }}>
                🎪
              </div>
              <h3 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                marginBottom: spacing[2],
              }}>
                まだイベントがありません
              </h3>
              <p style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.base,
                color: colors.neutral[600],
                marginBottom: spacing[6],
              }}>
                新しいイベントを作成して、出店者を募集しましょう
              </p>
              <Button variant="primary" size="lg" onClick={() => onNavigate('create-event')}>
                最初のイベントを作成
              </Button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing[6],
            }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: colors.neutral[0],
                    borderRadius: borderRadius.xl,
                    padding: spacing[6],
                    boxShadow: shadows.card,
                    border: `1px solid ${colors.neutral[100]}`,
                    cursor: 'pointer',
                    transition: `all ${transitions.normal}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = shadows.xl
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = shadows.card
                  }}
                >
                  {/* ステータスバッジ */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: spacing[4],
                  }}>
                    <div style={{
                      padding: `${spacing[2]} ${spacing[4]}`,
                      borderRadius: borderRadius.full,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      background: event.approval_status === 'approved'
                        ? colors.status.success.light
                        : event.approval_status === 'rejected'
                        ? colors.status.error.light
                        : colors.status.warning.light,
                      color: event.approval_status === 'approved'
                        ? colors.status.success.dark
                        : event.approval_status === 'rejected'
                        ? colors.status.error.dark
                        : colors.status.warning.dark,
                    }}>
                      {event.approval_status === 'approved' ? '公開中' : event.approval_status === 'rejected' ? '却下' : '審査中'}
                    </div>

                    {event.applications_count > 0 && (
                      <div style={{
                        padding: `${spacing[2]} ${spacing[4]}`,
                        borderRadius: borderRadius.full,
                        background: colors.primary[100],
                        color: colors.primary[700],
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.bold,
                      }}>
                        {event.applications_count} 件の申込
                      </div>
                    )}
                  </div>

                  {/* イベント情報 */}
                  <h3 style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    marginBottom: spacing[3],
                  }}>
                    {event.event_name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                    marginBottom: spacing[5],
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <span>📅</span>
                      <span>{formatDate(event.event_start_date)} 〜 {formatDate(event.event_end_date)}</span>
                    </div>
                    {event.venue_city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <span>📍</span>
                        <span>{event.venue_city}</span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div style={{
                    display: 'flex',
                    gap: spacing[3],
                  }}>
                    <Button variant="outline" size="sm" fullWidth>
                      編集
                    </Button>
                    <Button variant="primary" size="sm" fullWidth>
                      申込を見る
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
