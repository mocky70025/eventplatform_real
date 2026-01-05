'use client'

import { useState, useEffect } from 'react'
import { supabase, type Organizer, type Event } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin'

// 管理者用カラーパレット
const colors = {
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryLight: '#EEF2FF',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
}

const spacing = {
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
}

const borderRadius = {
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
}

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<'organizers' | 'events'>('organizers')
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated') === 'true'
    setIsAuthenticated(authenticated)
    if (authenticated) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchData = async () => {
    try {
      const { data: organizersData } = await supabase
        .from('organizers')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      setOrganizers(organizersData || [])
      setEvents(eventsData || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizerApproval = async (organizerId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('organizers')
        .update({ is_approved: approved })
        .eq('id', organizerId)

      if (error) throw error
      await fetchData()
      alert(approved ? '主催者を承認しました' : '主催者の承認を取り消しました')
    } catch (error) {
      console.error('Failed to update organizer:', error)
      alert('更新に失敗しました')
    }
  }

  const handleEventApproval = async (eventId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ approval_status: status })
        .eq('id', eventId)

      if (error) throw error
      await fetchData()
      alert(status === 'approved' ? 'イベントを承認しました' : 'イベントを却下しました')
    } catch (error) {
      console.error('Failed to update event:', error)
      alert('更新に失敗しました')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {
      setIsAuthenticated(true)
      fetchData()
    }} />
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.neutral.gray100,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.neutral.gray200}`,
            borderTopColor: colors.primary,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{
            fontSize: '1rem',
            color: colors.neutral.gray500,
          }}>
            データを読み込み中...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.neutral[50],
    }}>
      {/* ヘッダー */}
      <div style={{
        background: colors.neutral.white,
        boxShadow: shadows.sm,
        borderBottom: `1px solid ${colors.neutral.gray200}`,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: spacing.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              borderRadius: borderRadius.medium,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              🔐
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: colors.neutral.gray900,
              margin: 0,
            }}>
              運営管理
            </h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_authenticated')
              sessionStorage.removeItem('admin_email')
              setIsAuthenticated(false)
            }}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: 'transparent',
              border: `1px solid ${colors.neutral.gray300}`,
              borderRadius: borderRadius.medium,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.neutral.gray700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.neutral.gray100
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* ナビゲーション */}
      <div style={{
        background: colors.neutral.white,
        boxShadow: shadows.sm,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${spacing.lg}`,
          display: 'flex',
          gap: spacing['4xl'],
        }}>
          <button
            onClick={() => setCurrentView('organizers')}
            style={{
              padding: `${spacing.lg} 0`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentView === 'organizers' ? colors.primary : 'transparent'}`,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentView === 'organizers' ? colors.primary.main : colors.neutral.gray500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            主催者承認 ({organizers.filter(o => !o.is_approved).length})
          </button>
          <button
            onClick={() => setCurrentView('events')}
            style={{
              padding: `${spacing.lg} 0`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentView === 'events' ? colors.primary : 'transparent'}`,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentView === 'events' ? colors.primary.main : colors.neutral.gray500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            イベント管理 ({events.length})
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: spacing['4xl'],
      }}>
        {currentView === 'organizers' ? (
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: colors.neutral.gray900,
              marginBottom: spacing['3xl'],
            }}>
              主催者承認
            </h2>
            {organizers.length === 0 ? (
              <p style={{ color: colors.neutral.gray500 }}>主催者登録がありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing['3xl'],
              }}>
                {organizers.map((organizer) => (
                  <div
                    key={organizer.id}
                    style={{
                      background: colors.neutral.white,
                      borderRadius: borderRadius.large,
                      boxShadow: shadows.md,
                      padding: spacing['3xl'],
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing.lg,
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: colors.neutral.gray900,
                          marginBottom: spacing.xs,
                        }}>
                          {organizer.company_name}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: colors.neutral.gray500,
                          margin: 0,
                        }}>
                          {organizer.name}
                        </p>
                      </div>
                      <span style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: borderRadius.medium,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: organizer.is_approved ? colors.successLight : colors.warningLight,
                        color: organizer.is_approved ? colors.success : colors.warning,
                      }}>
                        {organizer.is_approved ? '承認済み' : '未承認'}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: colors.neutral.gray500,
                      marginBottom: spacing.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing.sm,
                    }}>
                      <div>電話: {organizer.phone_number}</div>
                      <div>メール: {organizer.email}</div>
                      <div>登録日: {formatDate(organizer.created_at)}</div>
                    </div>
                    {!organizer.is_approved && (
                      <div style={{ display: 'flex', gap: spacing.sm }}>
                        <button
                          onClick={() => handleOrganizerApproval(organizer.id, true)}
                          style={{
                            flex: 1,
                            padding: `${spacing.sm} ${spacing.lg}`,
                            background: colors.success,
                            color: colors.neutral.white,
                            border: 'none',
                            borderRadius: borderRadius.medium,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          承認
                        </button>
                        <button
                          onClick={() => handleOrganizerApproval(organizer.id, false)}
                          style={{
                            flex: 1,
                            padding: `${spacing.sm} ${spacing.lg}`,
                            background: colors.error,
                            color: colors.neutral.white,
                            border: 'none',
                            borderRadius: borderRadius.medium,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          却下
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: colors.neutral.gray900,
              marginBottom: spacing['3xl'],
            }}>
              イベント管理
            </h2>
            {events.length === 0 ? (
              <p style={{ color: colors.neutral.gray500 }}>イベントがありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing['3xl'],
              }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: colors.neutral.white,
                      borderRadius: borderRadius.large,
                      boxShadow: shadows.md,
                      padding: spacing['3xl'],
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: colors.neutral.gray900,
                      marginBottom: spacing.sm,
                    }}>
                      {event.event_name}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: colors.neutral.gray500,
                      marginBottom: spacing.sm,
                    }}>
                      {event.genre}
                    </p>
                    <div style={{
                      fontSize: '0.875rem',
                      color: colors.neutral[500],
                      marginBottom: spacing.lg,
                    }}>
                      <div>{formatDate(event.event_start_date)} 〜 {formatDate(event.event_end_date)}</div>
                      <div>{event.venue_name}</div>
                    </div>
                    <div style={{ marginBottom: spacing[4] }}>
                      <span style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: borderRadius.medium,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: event.approval_status === 'approved' ? colors.successLight :
                          event.approval_status === 'rejected' ? colors.errorLight : colors.warningLight,
                        color: event.approval_status === 'approved' ? colors.success :
                          event.approval_status === 'rejected' ? colors.error : colors.warning,
                      }}>
                        {event.approval_status === 'approved' ? '承認済み' :
                          event.approval_status === 'rejected' ? '却下' : '審査中'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[2] }}>
                      <button
                        onClick={() => handleEventApproval(event.id, 'approved')}
                        style={{
                          flex: 1,
                          padding: `${spacing.sm} ${spacing.lg}`,
                          background: colors.success,
                          color: colors.neutral.white,
                          border: 'none',
                          borderRadius: borderRadius.medium,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        承認
                      </button>
                      <button
                        onClick={() => handleEventApproval(event.id, 'rejected')}
                        style={{
                          flex: 1,
                          padding: `${spacing.sm} ${spacing.lg}`,
                          background: colors.error,
                          color: colors.neutral.white,
                          border: 'none',
                          borderRadius: borderRadius.medium,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        却下
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
