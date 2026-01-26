'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows } from '../styles/design-system'
import Badge from './ui/Badge'

interface Application {
  id: string
  application_status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  event: {
    id: string
    event_name: string
    event_start_date: string
    event_end_date: string
    venue_name: string
    main_image_url?: string
  }
}

interface ApplicationManagementProps {
  userProfile: any
  onBack: () => void
}

export default function ApplicationManagement({ userProfile, onBack }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all')

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
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const { data: exhibitor } = await supabase
        .from('exhibitors')
        .select('id')
        .or(`id.eq.${userProfile.userId},line_user_id.eq.${userProfile.userId}`)
        .maybeSingle()

      if (!exhibitor) {
        alert('出店者登録が完了していません。')
        return
      }

      const { data, error } = await supabase
        .from('event_applications')
        .select(`
          id,
          application_status,
          applied_at,
          event:events(
            id,
            event_name,
            event_start_date,
            event_end_date,
            venue_name,
            main_image_url
          )
        `)
        .eq('exhibitor_id', exhibitor.id)
        .order('applied_at', { ascending: false })

      if (error) throw error
      
      const applications = (data || []).map((app: any) => ({
        id: app.id,
        application_status: app.application_status,
        applied_at: app.applied_at,
        event: Array.isArray(app.event) ? app.event[0] : app.event
      }))
      
      setApplications(applications)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      alert('申し込み一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'neutral' => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'neutral'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '承認待ち'
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '却下'
      default:
        return '不明'
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return app.application_status === 'pending'
    if (filterStatus === 'approved') return app.application_status === 'approved'
    return true
  })

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
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.neutral[200]}`,
            borderTopColor: colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: `0 auto ${spacing[4]}`
          }}></div>
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
            color: colors.neutral[600]
          }}>申し込み一覧を読み込み中...</p>
        </div>
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
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: isDesktop ? spacing[12] : spacing[4],
            background: 'transparent',
            border: 'none',
            color: colors.neutral[0],
            fontSize: isDesktop ? '28px' : '24px',
            fontWeight: typography.fontWeight.bold,
            cursor: 'pointer',
            padding: spacing[2],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: borderRadius.md,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          ←
        </button>
        <h1 style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: isDesktop ? typography.fontSize['3xl'] : typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[0],
          margin: 0
        }}>
          申し込み管理
        </h1>
      </div>

      {/* コンテンツエリア */}
      <div style={{
        maxWidth: isDesktop ? '1400px' : '100%',
        margin: '0 auto',
        padding: isDesktop ? `${spacing[10]} ${spacing[12]}` : `${spacing[6]} ${spacing[4]}`
      }}>
        {/* フィルタータブ */}
        <div style={{
          background: colors.neutral[0],
          borderRadius: borderRadius.xl,
          boxShadow: shadows.card,
          padding: spacing[2],
          display: 'inline-flex',
          gap: spacing[2],
          marginBottom: isDesktop ? spacing[8] : spacing[6]
        }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: `${spacing[2.5]} ${spacing[5]}`,
              borderRadius: borderRadius.lg,
              border: 'none',
              background: filterStatus === 'all' ? colors.primary[500] : 'transparent',
              color: filterStatus === 'all' ? colors.neutral[0] : colors.neutral[600],
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            すべて
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: `${spacing[2.5]} ${spacing[5]}`,
              borderRadius: borderRadius.lg,
              border: 'none',
              background: filterStatus === 'pending' ? colors.primary[500] : 'transparent',
              color: filterStatus === 'pending' ? colors.neutral[0] : colors.neutral[600],
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            承認待ち
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            style={{
              padding: `${spacing[2.5]} ${spacing[5]}`,
              borderRadius: borderRadius.lg,
              border: 'none',
              background: filterStatus === 'approved' ? colors.primary[500] : 'transparent',
              color: filterStatus === 'approved' ? colors.neutral[0] : colors.neutral[600],
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            承認済み
          </button>
        </div>

        {filteredApplications.length === 0 ? (
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            boxShadow: shadows.card,
            padding: isDesktop ? `${spacing[16]} ${spacing[10]}` : `${spacing[10]} ${spacing[6]}`,
            textAlign: 'center'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: `0 auto ${spacing[4]}` }}>
              <path d="M9 11L12 14L22 4" stroke={colors.neutral[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={colors.neutral[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.lg,
              color: colors.neutral[500],
              fontWeight: typography.fontWeight.medium
            }}>申し込みがありません</p>
          </div>
        ) : isDesktop ? (
          // PC版: テーブル表示
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            boxShadow: shadows.card,
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.neutral[50] }}>
                  <th style={{
                    padding: `${spacing[4]} ${spacing[5]}`,
                    textAlign: 'left',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[700]
                  }}>イベント名</th>
                  <th style={{
                    padding: `${spacing[4]} ${spacing[5]}`,
                    textAlign: 'left',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[700]
                  }}>会場</th>
                  <th style={{
                    padding: `${spacing[4]} ${spacing[5]}`,
                    textAlign: 'left',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[700]
                  }}>申込日</th>
                  <th style={{
                    padding: `${spacing[4]} ${spacing[5]}`,
                    textAlign: 'center',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[700]
                  }}>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, index) => (
                  <tr 
                    key={application.id}
                    style={{
                      borderTop: index === 0 ? 'none' : `1px solid ${colors.neutral[200]}`,
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.neutral[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{
                      padding: `${spacing[4]} ${spacing[5]}`,
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.base,
                      color: colors.neutral[900],
                      fontWeight: typography.fontWeight.medium
                    }}>
                      {application.event.event_name}
                    </td>
                    <td style={{
                      padding: `${spacing[4]} ${spacing[5]}`,
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}>
                      {application.event.venue_name}
                    </td>
                    <td style={{
                      padding: `${spacing[4]} ${spacing[5]}`,
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}>
                      {formatDate(application.applied_at)}
                    </td>
                    <td style={{
                      padding: `${spacing[4]} ${spacing[5]}`,
                      textAlign: 'center'
                    }}>
                      <Badge variant={getStatusBadgeVariant(application.application_status)}>
                        {getStatusText(application.application_status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // スマホ版: カード表示
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                style={{
                  background: colors.neutral[0],
                  borderRadius: borderRadius.xl,
                  boxShadow: shadows.card,
                  padding: spacing[5],
                  border: `1px solid ${colors.neutral[200]}`,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
                  <h3 style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    flex: 1
                  }}>
                    {application.event.event_name}
                  </h3>
                  <Badge variant={getStatusBadgeVariant(application.application_status)} size="sm">
                    {getStatusText(application.application_status)}
                  </Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                      <path d="M3 10H21" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                    </svg>
                    <span style={{
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}>
                      申込日: {formatDate(application.applied_at)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                      <circle cx="12" cy="9" r="2.5" stroke={colors.neutral[500]} strokeWidth="1.5"/>
                    </svg>
                    <span style={{
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600]
                    }}>
                      {application.event.venue_name}
                    </span>
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
