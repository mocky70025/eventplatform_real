'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/design-system'
import Button from './ui/Button'

interface Application {
  id: string
  event_id: string
  application_status: string
  message?: string
  created_at: string
  event: {
    event_name: string
    event_start_date: string
    venue_city?: string
    main_image_url?: string
    genre?: string
  }
}

interface ApplicationManagementProps {
  userProfile: any
  onBack: () => void
}

export default function ApplicationManagementUltra({ userProfile, onBack }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('exhibitors')
          .select('id')
          .or(`id.eq.${user.id},line_user_id.eq.${user.id}`)
          .maybeSingle()

        if (!data?.id) {
          setApplications([])
          return
        }

        const { data: applicationsData, error: applicationsError } = await supabase
          .from('event_applications')
          .select(`
            *,
            event:events(event_name, event_start_date, venue_city, main_image_url, genre)
          `)
          .eq('exhibitor_id', data.id)
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.application_status === filter
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.application_status === 'pending').length,
    approved: applications.filter(a => a.application_status === 'approved').length,
    rejected: applications.filter(a => a.application_status === 'rejected').length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
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
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            marginBottom: spacing[6],
          }}>
            <Button variant="ghost" onClick={onBack}>
              ← 戻る
            </Button>
            <h1 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            }}>
              申込管理
            </h1>
          </div>

          {/* 統計 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: spacing[4],
            marginBottom: spacing[6],
          }}>
            {[
              { label: '総申込数', value: stats.total, color: colors.neutral[600], filter: 'all' },
              { label: '審査中', value: stats.pending, color: colors.status.warning.main, filter: 'pending' },
              { label: '承認済み', value: stats.approved, color: colors.status.success.main, filter: 'approved' },
              { label: '却下', value: stats.rejected, color: colors.status.error.main, filter: 'rejected' },
            ].map((stat) => (
              <button
                key={stat.filter}
                onClick={() => setFilter(stat.filter as any)}
                style={{
                  background: filter === stat.filter ? colors.neutral[0] : 'transparent',
                  border: `2px solid ${filter === stat.filter ? stat.color : 'transparent'}`,
                  borderRadius: borderRadius.lg,
                  padding: spacing[4],
                  cursor: 'pointer',
                  transition: `all ${transitions.fast}`,
                  textAlign: 'left',
                }}
              >
                <div style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: stat.color,
                  marginBottom: spacing[1],
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                }}>
                  {stat.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 申込一覧 */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing[6],
          }}>
            {[1, 2, 3, 4].map((i) => (
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
        ) : filteredApplications.length === 0 ? (
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[12],
            textAlign: 'center',
            boxShadow: shadows.card,
          }}>
            <div style={{ fontSize: typography.fontSize['5xl'], marginBottom: spacing[4] }}>
              📋
            </div>
            <h3 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[2],
            }}>
              {filter === 'all' ? '申込がありません' : `${filter === 'pending' ? '審査中' : filter === 'approved' ? '承認済み' : '却下'}の申込がありません`}
            </h3>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
            }}>
              イベントに申し込むと、ここに表示されます
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing[6],
          }}>
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: colors.neutral[0],
                  borderRadius: borderRadius.xl,
                  overflow: 'hidden',
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.neutral[100]}`,
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
                {/* イベント画像 */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  background: app.event?.main_image_url
                    ? `url(${app.event.main_image_url}) center/cover`
                    : `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
                  position: 'relative',
                }}>
                  {app.event?.genre && (
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
                      {app.event.genre}
                    </div>
                  )}
                  
                  <div style={{
                    position: 'absolute',
                    top: spacing[3],
                    right: spacing[3],
                    padding: `${spacing[2]} ${spacing[4]}`,
                    borderRadius: borderRadius.full,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    background: app.application_status === 'approved'
                      ? colors.status.success.light
                      : app.application_status === 'rejected'
                      ? colors.status.error.light
                      : colors.status.warning.light,
                    color: app.application_status === 'approved'
                      ? colors.status.success.dark
                      : app.application_status === 'rejected'
                      ? colors.status.error.dark
                      : colors.status.warning.dark,
                  }}>
                    {app.application_status === 'approved'
                      ? '承認済み'
                      : app.application_status === 'rejected'
                      ? '却下'
                      : '審査中'}
                  </div>
                </div>

                {/* 申込情報 */}
                <div style={{ padding: spacing[5] }}>
                  <h3 style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    marginBottom: spacing[3],
                  }}>
                    {app.event?.event_name || '不明なイベント'}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                    marginBottom: spacing[4],
                  }}>
                    {app.event?.event_start_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <span>📅</span>
                        <span>{formatDate(app.event.event_start_date)}</span>
                      </div>
                    )}
                    {app.event?.venue_city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <span>📍</span>
                        <span>{app.event.venue_city}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <span>📝</span>
                      <span>申込日: {formatDate(app.created_at)}</span>
                    </div>
                  </div>

                  {app.message && (
                    <div style={{
                      background: colors.neutral[50],
                      borderRadius: borderRadius.lg,
                      padding: spacing[3],
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[700],
                      marginBottom: spacing[4],
                    }}>
                      <div style={{
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: spacing[1],
                      }}>
                        メッセージ:
                      </div>
                      {app.message}
                    </div>
                  )}

                  <div style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                  }}>
                    申込ID: {app.id.substring(0, 8)}
                  </div>
                </div>
              </div>
            ))}
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
