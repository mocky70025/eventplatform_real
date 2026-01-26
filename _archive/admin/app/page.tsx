'use client'

import { useState, useEffect } from 'react'
import { supabase, type Organizer, type Event } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
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
      const res = await fetch('/api/admin/pending-data')

      if (!res.ok) {
        throw new Error('Failed to load admin data')
      }

      const payload = await res.json()
      setOrganizers(payload.organizers || [])
      setEvents(payload.events || [])
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
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

      const res = await fetch('/api/admin/update-organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizerId, approved }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to update organizer')
      }

      await res.json()

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

      const res = await fetch('/api/admin/update-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to update event')
      }

      await res.json()

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

  const pendingOrganizers = organizers.filter((organizer) => !organizer.is_approved)
  const approvedOrganizers = organizers.filter((organizer) => organizer.is_approved)
  const pendingEvents = events.filter((event) => event.approval_status !== 'approved')
  const approvedEvents = events.filter((event) => event.approval_status === 'approved')

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

  const SummaryStat = ({
    label,
    value,
    helper,
    accent,
  }: {
    label: string
    value: number
    helper: string
    accent: [string, string]
  }) => (
    <Card
      variant="glass"
      padding={6}
      style={{
        background: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})`,
        border: 'none',
        color: colors.neutral[900],
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: spacing[2],
      }}
    >
      <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '2rem', fontWeight: 700 }}>{value.toLocaleString()}</span>
      <span style={{ fontSize: '0.9rem', color: colors.neutral[800] }}>{helper}</span>
    </Card>
  )

  const summaryStats: {
    label: string
    value: number
    helper: string
    accent: [string, string]
  }[] = [
    {
      label: '未承認主催者',
      value: pendingOrganizers.length,
      helper: '着実に承認してください',
      accent: ['#E0F2F1', '#C8E6C9'],
    },
    {
      label: '審査中イベント',
      value: pendingEvents.length,
      helper: 'イベント掲載待ち',
      accent: ['#FFF3CC', '#FFE0B2'],
    },
    {
      label: '操作ログ',
      value: logs.length,
      helper: '最新履歴',
      accent: ['#EDE7F6', '#D1C4E9'],
    },
  ]

  const navTabs = [
    {
      id: 'organizers' as const,
      label: '主催者承認',
      count: pendingOrganizers.length,
      helper: '未承認のみ表示',
    },
    {
      id: 'events' as const,
      label: 'イベント管理',
      count: pendingEvents.length,
      helper: '審査中・却下',
    },
    {
      id: 'logs' as const,
      label: '操作ログ',
      count: logs.length,
      helper: '直近の履歴',
    },
  ]

  const SectionHeading = ({ title, count }: { title: string; count: number }) => (
    <div style={{
      marginBottom: spacing[4],
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
    }}>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: colors.neutral[900] }}>{title}</h3>
      <span style={{
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: borderRadius.md,
        background: colors.neutral[100],
        fontSize: '0.75rem',
        color: colors.neutral[700],
        fontWeight: 600,
      }}>
        {count} 件
      </span>
    </div>
  )

  const ApprovalCard = ({
    title,
    subtitle,
    statusLabel,
    statusColor,
    meta,
    actions,
  }: {
    title: string
    subtitle: string
    statusLabel: string
    statusColor: { background: string; color: string }
    meta: string[]
    actions?: { label: string; color: string; onClick: () => void }[]
  }) => (
    <Card
      variant="elevated"
      padding={6}
      style={{
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing[3],
      }}>
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: colors.neutral[900],
            margin: 0,
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: colors.neutral[500],
            margin: 0,
          }}>
            {subtitle}
          </p>
        </div>
        <Badge
          variant={statusColor.color === colors.status.success.main ? 'success'
            : statusColor.color === colors.status.error.main ? 'error'
            : statusColor.color === colors.status.warning.main ? 'warning'
            : 'info'}
        >
          {statusLabel}
        </Badge>
      </div>
      <div style={{
        fontSize: '0.9rem',
        color: colors.neutral[600],
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[1.5],
      }}>
        {meta.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: spacing[2], marginTop: 'auto' }}>
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant={action.label === '承認' ? 'gradient' : 'outline'}
              size="sm"
              style={{
                flex: 1,
                background: action.label === '承認' ? undefined : 'transparent',
                color: action.label === '却下' ? colors.status.error.main : undefined,
                borderColor: action.label === '却下' ? colors.status.error.main : undefined,
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  )

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
      <header style={{
        background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
        color: colors.neutral[0],
        padding: `${spacing[6]} ${spacing[4]} ${spacing[8]}`,
        boxShadow: shadows.xl,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[4],
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: colors.neutral[0],
              color: colors.primary[600],
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}>
              🛰️
            </div>
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0,
              }}>
                運営管理ダッシュボード
              </h1>
              <p style={{
                fontSize: '0.95rem',
                margin: 0,
                color: 'rgba(255, 255, 255, 0.85)',
              }}>
                承認待ちの主催者やイベントをスマートに可視化
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>ログイン中</p>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{adminEmail}</strong>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="md"
              style={{
                color: colors.neutral[900],
                borderColor: colors.neutral[100],
                background: colors.neutral[0],
              }}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <section style={{
        maxWidth: '1280px',
        margin: `-${spacing[4]} auto 0`,
        padding: `0 ${spacing[4]} ${spacing[6]}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: spacing[4],
        }}>
          {summaryStats.map((stat) => (
            <SummaryStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              helper={stat.helper}
              accent={stat.accent}
            />
          ))}
        </div>
      </section>

      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `0 ${spacing[4]} ${spacing[4]}`,
      }}>
        <Card variant="bordered" padding={4} style={{ display: 'flex', gap: spacing[3], justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              style={{
                flex: '1 1 180px',
                minWidth: '180px',
                borderRadius: borderRadius.lg,
                border: 'none',
                padding: `${spacing[3]} ${spacing[4]}`,
                background: currentView === tab.id ? colors.primary[500] : colors.neutral[50],
                color: currentView === tab.id ? colors.neutral[0] : colors.neutral[700],
                boxShadow: currentView === tab.id ? shadows.button : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <strong style={{ display: 'block' }}>{tab.label}</strong>
              <span style={{ fontSize: '0.85rem', color: currentView === tab.id ? colors.neutral[100] : colors.neutral[500] }}>
                {tab.count.toLocaleString()} 件 <span style={{ marginLeft: spacing[1], fontWeight: 400 }}>{tab.helper}</span>
              </span>
            </button>
          ))}
        </Card>
      </section>

      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${spacing[4]} ${spacing[4]} ${spacing[12]}`,
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
            <SectionHeading title="未承認主催者" count={pendingOrganizers.length} />
            {pendingOrganizers.length === 0 ? (
              <p style={{ color: colors.neutral[500], marginBottom: spacing[8] }}>未承認の主催者はありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing[12],
                marginBottom: spacing[12],
              }}>
                {pendingOrganizers.map((organizer) => (
                  <ApprovalCard
                    key={organizer.id}
                    title={organizer.company_name}
                    subtitle={organizer.name}
                    statusLabel="未承認"
                    statusColor={{ background: colors.status.warning.light, color: colors.status.warning.main }}
                    meta={[
                      `電話: ${organizer.phone_number}`,
                      `メール: ${organizer.email}`,
                      `登録日: ${formatDate(organizer.created_at)}`,
                    ]}
                    actions={[
                      { label: '承認', color: colors.status.success.main, onClick: () => handleOrganizerApproval(organizer.id, true) },
                      { label: '却下', color: colors.status.error.main, onClick: () => handleOrganizerApproval(organizer.id, false) },
                    ]}
                  />
                ))}
              </div>
            )}
            {approvedOrganizers.length > 0 && (
              <>
                <SectionHeading title="承認済み主催者" count={approvedOrganizers.length} />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: spacing[12],
                }}>
                  {approvedOrganizers.map((organizer) => (
                    <ApprovalCard
                      key={organizer.id}
                      title={organizer.company_name}
                      subtitle={organizer.name}
                      statusLabel="承認済み"
                      statusColor={{ background: colors.status.success.light, color: colors.status.success.main }}
                      meta={[
                        `電話: ${organizer.phone_number}`,
                        `メール: ${organizer.email}`,
                        `登録日: ${formatDate(organizer.created_at)}`,
                      ]}
                    />
                  ))}
                </div>
              </>
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
            <SectionHeading title="審査中・未承認イベント" count={pendingEvents.length} />
            {pendingEvents.length === 0 ? (
              <p style={{ color: colors.neutral[500], marginBottom: spacing[12] }}>承認待ちのイベントはありません</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing[12],
                marginBottom: spacing[12],
              }}>
                {pendingEvents.map((event) => (
                  <ApprovalCard
                    key={event.id}
                    title={event.event_name}
                    subtitle={event.genre}
                    statusLabel={event.approval_status === 'pending' ? '審査中' : '却下'}
                    statusColor={{
                      background: event.approval_status === 'rejected' ? colors.status.error.light : colors.status.warning.light,
                      color: event.approval_status === 'rejected' ? colors.status.error.main : colors.status.warning.main,
                    }}
                    meta={[
                      `${formatDate(event.event_start_date)} 〜 ${formatDate(event.event_end_date)}`,
                      event.venue_name,
                    ]}
                    actions={[
                      { label: '承認', color: colors.status.success.main, onClick: () => handleEventApproval(event.id, 'approved') },
                      { label: '却下', color: colors.status.error.main, onClick: () => handleEventApproval(event.id, 'rejected') },
                    ]}
                  />
                ))}
              </div>
            )}
            {approvedEvents.length > 0 && (
              <>
                <SectionHeading title="承認済みイベント" count={approvedEvents.length} />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: spacing[12],
                }}>
                  {approvedEvents.map((event) => (
                    <ApprovalCard
                      key={event.id}
                      title={event.event_name}
                      subtitle={event.genre}
                      statusLabel="承認済み"
                      statusColor={{ background: colors.status.success.light, color: colors.status.success.main }}
                      meta={[
                        `${formatDate(event.event_start_date)} 〜 ${formatDate(event.event_end_date)}`,
                        event.venue_name,
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
            {events.length === 0 && (
              <p style={{ color: colors.neutral[500] }}>承認対象のイベントがありません</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
