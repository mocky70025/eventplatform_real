'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'

interface Application {
  id: string
  event_id: string
  exhibitor_id: string
  status: string
  message?: string
  created_at: string
  exhibitor: {
    name: string
    email: string
    phone?: string
  }
}

interface ApplicationManagementProps {
  eventId: string
  eventName: string
  onBack: () => void
}

export default function ApplicationManagementUltra({ eventId, eventName, onBack }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchApplications()
  }, [eventId])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('event_applications')
        .select(`
          *,
          exhibitor:exhibitors(name, email, phone)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      // 更新後、再取得
      fetchApplications()
      alert(`申込を${newStatus === 'approved' ? '承認' : '却下'}しました`)
    } catch (error: any) {
      console.error('Failed to update status:', error)
      alert('ステータスの更新に失敗しました: ' + error.message)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
            marginBottom: spacing[4],
          }}>
            <Button variant="ghost" onClick={onBack}>
              ← 戻る
            </Button>
            <div>
              <h1 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
              }}>
                申込管理
              </h1>
              <p style={{
                fontSize: typography.fontSize.base,
                color: colors.neutral[600],
                marginTop: spacing[1],
              }}>
                {eventName}
              </p>
            </div>
          </div>

          {/* 統計 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: spacing[4],
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
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
          }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: colors.neutral[100],
                  borderRadius: borderRadius.xl,
                  height: '150px',
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
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
          }}>
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: colors.neutral[0],
                  borderRadius: borderRadius.xl,
                  padding: spacing[6],
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.neutral[100]}`,
                  transition: `all ${transitions.fast}`,
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: spacing[6],
                  alignItems: 'start',
                }}>
                  {/* 左側: 申込情報 */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[3],
                      marginBottom: spacing[4],
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: borderRadius.full,
                        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSize.xl,
                        color: colors.neutral[0],
                        fontWeight: typography.fontWeight.bold,
                      }}>
                        {app.exhibitor?.name?.[0] || '?'}
                      </div>
                      
                      <div>
                        <h3 style={{
                          fontFamily: typography.fontFamily.japanese,
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.neutral[900],
                        }}>
                          {app.exhibitor?.name || '不明な出店者'}
                        </h3>
                        <div style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral[600],
                        }}>
                          {formatDate(app.created_at)}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: spacing[3],
                      marginBottom: spacing[4],
                    }}>
                      <div style={{
                        background: colors.neutral[50],
                        borderRadius: borderRadius.lg,
                        padding: spacing[3],
                      }}>
                        <div style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          marginBottom: spacing[1],
                        }}>
                          メールアドレス
                        </div>
                        <div style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral[900],
                        }}>
                          {app.exhibitor?.email || '未登録'}
                        </div>
                      </div>

                      <div style={{
                        background: colors.neutral[50],
                        borderRadius: borderRadius.lg,
                        padding: spacing[3],
                      }}>
                        <div style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          marginBottom: spacing[1],
                        }}>
                          電話番号
                        </div>
                        <div style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral[900],
                        }}>
                          {app.exhibitor?.phone || '未登録'}
                        </div>
                      </div>
                    </div>

                    {app.message && (
                      <div style={{
                        background: colors.primary[50],
                        borderRadius: borderRadius.lg,
                        padding: spacing[4],
                        marginBottom: spacing[4],
                      }}>
                        <div style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          marginBottom: spacing[2],
                          fontWeight: typography.fontWeight.semibold,
                        }}>
                          メッセージ
                        </div>
                        <div style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.neutral[700],
                          lineHeight: typography.lineHeight.relaxed,
                        }}>
                          {app.message}
                        </div>
                      </div>
                    )}

                    <div style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[500],
                    }}>
                      申込ID: {app.id}
                    </div>
                  </div>

                  {/* 右側: ステータスとアクション */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[3],
                    minWidth: '200px',
                  }}>
                    <div style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      borderRadius: borderRadius.lg,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      textAlign: 'center',
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
                      {app.status === 'approved' ? '✓ 承認済み' : app.status === 'rejected' ? '✕ 却下' : '⏳ 審査中'}
                    </div>

                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => handleStatusChange(app.id, 'approved')}
                        >
                          承認する
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                        >
                          却下する
                        </Button>
                      </>
                    )}
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

