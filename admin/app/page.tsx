'use client'

import { useState, useEffect } from 'react'
import { supabase, type Organizer, type Event } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin'
import { colors, spacing, borderRadius, shadows } from '@/styles/design-system'

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
        background: colors.neutral[100],
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.neutral[200]}`,
            borderTopColor: colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{
            fontSize: '1rem',
            color: colors.neutral[500],
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
        background: colors.neutral[0],
        boxShadow: shadows.sm,
        borderBottom: `1px solid ${colors.neutral[200]}`,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: spacing[4],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary[600]} 100%)`,
              borderRadius: borderRadius.md,
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
              color: colors.neutral[900],
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
              padding: `${spacing[2]} ${spacing[4]}`,
              background: 'transparent',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: borderRadius.md,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: colors.neutral[700],
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.neutral[100]
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
        background: colors.neutral[0],
        boxShadow: shadows.sm,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: `0 ${spacing[4]}`,
          display: 'flex',
          gap: spacing[16],
        }}>
          <button
            onClick={() => setCurrentView('organizers')}
            style={{
              padding: `${spacing[4]} 0`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentView === 'organizers' ? colors.primary : 'transparent'}`,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentView === 'organizers' ? colors.primary[500] : colors.neutral[500],
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            主催者承認 ({organizers.filter(o => !o.is_approved).length})
          </button>
          <button
            onClick={() => setCurrentView('events')}
            style={{
              padding: `${spacing[4]} 0`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentView === 'events' ? colors.primary : 'transparent'}`,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentView === 'events' ? colors.primary[500] : colors.neutral[500],
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
        padding: spacing[16],
      }}>
        {currentView === 'organizers' ? (
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: colors.neutral[900],
              marginBottom: spacing[12],
            }}>
              主催者承認
            </h2>
            {organizers.length === 0 ? (
              <p style={{ color: colors.neutral[500] }}>主催者登録がありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing[12],
              }}>
                {organizers.map((organizer) => (
                  <div
                    key={organizer.id}
                    style={{
                      background: colors.neutral[0],
                      borderRadius: borderRadius.lg,
                      boxShadow: shadows.md,
                      padding: spacing[12],
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing[4],
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: colors.neutral[900],
                          marginBottom: spacing[1],
                        }}>
                          {organizer.company_name}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: colors.neutral[500],
                          margin: 0,
                        }}>
                          {organizer.name}
                        </p>
                      </div>
                      <span style={{
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: borderRadius.md,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: organizer.is_approved ? colors.status.success.light : colors.status.warning.light,
                        color: organizer.is_approved ? colors.status.success.main : colors.status.warning.main,
                      }}>
                        {organizer.is_approved ? '承認済み' : '未承認'}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: colors.neutral[500],
                      marginBottom: spacing[4],
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing[2],
                    }}>
                      <div>電話: {organizer.phone_number}</div>
                      <div>メール: {organizer.email}</div>
                      <div>登録日: {formatDate(organizer.created_at)}</div>
                    </div>
                    {!organizer.is_approved && (
                      <div style={{ display: 'flex', gap: spacing[2] }}>
                        <button
                          onClick={() => handleOrganizerApproval(organizer.id, true)}
                          style={{
                            flex: 1,
                            padding: `${spacing[2]} ${spacing[4]}`,
                            background: colors.status.success.main,
                            color: colors.neutral[0],
                            border: 'none',
                            borderRadius: borderRadius.md,
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
                            padding: `${spacing[2]} ${spacing[4]}`,
                            background: colors.status.error.main,
                            color: colors.neutral[0],
                            border: 'none',
                            borderRadius: borderRadius.md,
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
              color: colors.neutral[900],
              marginBottom: spacing[12],
            }}>
              イベント管理
            </h2>
            {events.length === 0 ? (
              <p style={{ color: colors.neutral[500] }}>イベントがありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing[12],
              }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: colors.neutral[0],
                      borderRadius: borderRadius.lg,
                      boxShadow: shadows.md,
                      padding: spacing[12],
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: colors.neutral[900],
                      marginBottom: spacing[2],
                    }}>
                      {event.event_name}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: colors.neutral[500],
                      marginBottom: spacing[2],
                    }}>
                      {event.genre}
                    </p>
                    <div style={{
                      fontSize: '0.875rem',
                      color: colors.neutral[500],
                      marginBottom: spacing[4],
                    }}>
                      <div>{formatDate(event.event_start_date)} 〜 {formatDate(event.event_end_date)}</div>
                      <div>{event.venue_name}</div>
                    </div>
                    <div style={{ marginBottom: spacing[4] }}>
                      <span style={{
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: borderRadius.md,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: event.approval_status === 'approved' ? colors.status.success.light :
                          event.approval_status === 'rejected' ? colors.status.error.light : colors.status.warning.light,
                        color: event.approval_status === 'approved' ? colors.status.success.main :
                          event.approval_status === 'rejected' ? colors.status.error.main : colors.status.warning.main,
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
                          padding: `${spacing[2]} ${spacing[4]}`,
                          background: colors.status.success.main,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
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
                          padding: `${spacing[2]} ${spacing[4]}`,
                          background: colors.status.error.main,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
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
