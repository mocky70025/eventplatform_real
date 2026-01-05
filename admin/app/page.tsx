'use client'

import { useState, useEffect } from 'react'
import { supabase, type Organizer, type Event } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin'
import { colors, spacing, borderRadius, shadows } from '@/styles/design-system'
import { logAdminAction, getAdminLogs } from '@/lib/adminLogger'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<'organizers' | 'events' | 'logs'>('organizers')
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated') === 'true'
    const email = sessionStorage.getItem('admin_email') || ''
    setIsAuthenticated(authenticated)
    setAdminEmail(email)
    if (authenticated) {
      fetchData()
      fetchLogs()
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

  const fetchLogs = async () => {
    try {
      const logsData = await getAdminLogs(100)
      setLogs(logsData)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }

  const handleLogout = async () => {
    try {
      // ログアウト操作を記録
      await logAdminAction({
        adminEmail,
        actionType: 'logout',
        details: {
          logoutTime: new Date().toISOString()
        }
      })

      sessionStorage.removeItem('admin_authenticated')
      sessionStorage.removeItem('admin_email')
      setIsAuthenticated(false)
      
      // Supabaseからもサインアウト
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const handleOrganizerApproval = async (organizerId: string, approved: boolean) => {
    try {
      const organizer = organizers.find(o => o.id === organizerId)
      
      const { error } = await supabase
        .from('organizers')
        .update({ is_approved: approved })
        .eq('id', organizerId)

      if (error) throw error

      // 操作をログに記録
      await logAdminAction({
        adminEmail,
        actionType: approved ? 'approve_organizer' : 'reject_organizer',
        targetType: 'organizer',
        targetId: organizerId,
        targetName: organizer?.name || '不明',
        details: {
          previousStatus: organizer?.is_approved,
          newStatus: approved
        }
      })

      await fetchData()
      await fetchLogs()
      alert(approved ? '主催者を承認しました' : '主催者の承認を取り消しました')
    } catch (error) {
      console.error('Failed to update organizer:', error)
      alert('更新に失敗しました')
    }
  }

  const handleEventApproval = async (eventId: string, status: 'approved' | 'rejected') => {
    try {
      const event = events.find(e => e.id === eventId)
      
      const { error } = await supabase
        .from('events')
        .update({ approval_status: status })
        .eq('id', eventId)

      if (error) throw error

      // 操作をログに記録
      await logAdminAction({
        adminEmail,
        actionType: status === 'approved' ? 'approve_event' : 'reject_event',
        targetType: 'event',
        targetId: eventId,
        targetName: event?.event_name || '不明',
        details: {
          previousStatus: event?.approval_status,
          newStatus: status
        }
      })

      await fetchData()
      await fetchLogs()
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <span style={{ fontSize: '0.875rem', color: colors.neutral[600] }}>
              {adminEmail}
            </span>
            <button
              onClick={handleLogout}
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
          <button
            onClick={() => setCurrentView('logs')}
            style={{
              padding: `${spacing[4]} 0`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentView === 'logs' ? colors.primary : 'transparent'}`,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentView === 'logs' ? colors.primary[500] : colors.neutral[500],
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            操作ログ ({logs.length})
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
        ) : currentView === 'logs' ? (
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: colors.neutral[900],
              marginBottom: spacing[12],
            }}>
              操作ログ
            </h2>
            {logs.length === 0 ? (
              <p style={{ color: colors.neutral[500] }}>ログがありません</p>
            ) : (
              <div style={{
                background: colors.neutral[0],
                borderRadius: borderRadius.lg,
                boxShadow: shadows.md,
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: colors.neutral[100] }}>
                    <tr>
                      <th style={{ padding: spacing[3], textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: colors.neutral[700] }}>日時</th>
                      <th style={{ padding: spacing[3], textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: colors.neutral[700] }}>管理者</th>
                      <th style={{ padding: spacing[3], textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: colors.neutral[700] }}>操作</th>
                      <th style={{ padding: spacing[3], textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: colors.neutral[700] }}>対象</th>
                      <th style={{ padding: spacing[3], textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: colors.neutral[700] }}>詳細</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={log.id} style={{ borderTop: index === 0 ? 'none' : `1px solid ${colors.neutral[200]}` }}>
                        <td style={{ padding: spacing[3], fontSize: '0.875rem', color: colors.neutral[600] }}>
                          {formatDate(log.created_at)}
                        </td>
                        <td style={{ padding: spacing[3], fontSize: '0.875rem', color: colors.neutral[900] }}>
                          {log.admin_email}
                        </td>
                        <td style={{ padding: spacing[3] }}>
                          <span style={{
                            padding: `${spacing[1]} ${spacing[2]}`,
                            borderRadius: borderRadius.md,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 
                              log.action_type === 'login' ? colors.status.info.light :
                              log.action_type === 'logout' ? colors.neutral[200] :
                              log.action_type === 'approve_organizer' || log.action_type === 'approve_event' ? colors.status.success.light :
                              colors.status.error.light,
                            color:
                              log.action_type === 'login' ? colors.status.info.main :
                              log.action_type === 'logout' ? colors.neutral[600] :
                              log.action_type === 'approve_organizer' || log.action_type === 'approve_event' ? colors.status.success.main :
                              colors.status.error.main,
                          }}>
                            {log.action_type === 'login' ? 'ログイン' :
                              log.action_type === 'logout' ? 'ログアウト' :
                              log.action_type === 'approve_organizer' ? '主催者承認' :
                              log.action_type === 'reject_organizer' ? '主催者却下' :
                              log.action_type === 'approve_event' ? 'イベント承認' :
                              log.action_type === 'reject_event' ? 'イベント却下' :
                              log.action_type}
                          </span>
                        </td>
                        <td style={{ padding: spacing[3], fontSize: '0.875rem', color: colors.neutral[600] }}>
                          {log.target_name || '-'}
                        </td>
                        <td style={{ padding: spacing[3], fontSize: '0.75rem', color: colors.neutral[500] }}>
                          {log.user_agent ? log.user_agent.substring(0, 50) + '...' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
