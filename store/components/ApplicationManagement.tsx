'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
      // 出店者情報を取得（認証タイプに応じて）
      const authType = userProfile.authType || 'line'
      let exhibitor

      if (authType === 'email') {
        const { data } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('user_id', userProfile.userId)
          .single()
        exhibitor = data
      } else {
        const { data } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('line_user_id', userProfile.userId)
          .single()
        exhibitor = data
      }

      if (!exhibitor) {
        alert('出店者登録が完了していません。')
        return
      }

      // 申し込み一覧を取得
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
      
      // データを正しい型に変換
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

  const getStatusTagStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#5DABA8', text: '#FFFFFF' }
      case 'pending':
        return { bg: '#FFD88A', text: '#FFFFFF' }
      case 'rejected':
        return { bg: '#8B2632', text: '#FFFFFF' }
      default:
        return { bg: '#E9ECEF', text: '#6C757D' }
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
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isDesktop ? '40px 20px' : 0
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '393px',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#5DABA8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#2C3E50'
          }}>申し込み一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#FFF5F0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '852px',
        margin: '0 auto'
      }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        height: '64px',
        background: '#5DABA8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &lt;
        </button>
        <h1 style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '18px',
          fontWeight: 700,
          color: '#FFFFFF',
          margin: 0,
          textAlign: 'center'
        }}>
          申し込み管理
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* フィルタータブ */}
        <div style={{
          width: '100%',
          maxWidth: '353px',
          margin: '0 auto 20px auto',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '10px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'all' ? '#5DABA8' : 'transparent',
              color: filterStatus === 'all' ? '#FFFFFF' : '#6C757D',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            すべて
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'pending' ? '#5DABA8' : 'transparent',
              color: filterStatus === 'pending' ? '#FFFFFF' : '#6C757D',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            承認待ち
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filterStatus === 'approved' ? '#5DABA8' : 'transparent',
              color: filterStatus === 'approved' ? '#FFFFFF' : '#6C757D',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            承認済み
          </button>
        </div>

        {filteredApplications.length === 0 ? (
          <div style={{
            width: '100%',
            maxWidth: '353px',
            margin: '0 auto',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#2C3E50'
            }}>申し込みがありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '353px', margin: '0 auto' }}>
            {filteredApplications.map((application) => {
              const statusStyle = getStatusTagStyle(application.application_status)
              return (
                <div
                  key={application.id}
                  style={{
                    width: '100%',
                    height: '140px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    padding: '20px',
                    position: 'relative'
                  }}
                >
                  {/* ステータスタグ */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: statusStyle.bg,
                    color: statusStyle.text,
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    lineHeight: 'normal'
                  }}>
                    {getStatusText(application.application_status)}
                  </div>

                  {/* イベント名 */}
                  <h3 style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#2C3E50',
                    margin: '48px 0 8px 0',
                    lineHeight: 'normal'
                  }}>
                    {application.event.event_name}
                  </h3>

                  {/* 申込日 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6C757D" strokeWidth="1.5"/>
                      <path d="M3 10H21" stroke="#6C757D" strokeWidth="1.5"/>
                      <path d="M8 4V8" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M16 4V8" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#6C757D',
                      lineHeight: 'normal'
                    }}>
                      申込日: {formatDate(application.applied_at)}
                    </span>
                  </div>

                  {/* 会場名 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <svg width="6" height="8" viewBox="0 0 8 11.5" fill="none">
                      <path d="M4 0C1.79 0 0 1.79 0 4C0 7 4 11.5 4 11.5C4 11.5 8 7 8 4C8 1.79 6.21 0 4 0Z" fill="#6C757D"/>
                      <circle cx="4" cy="4" r="2" fill="white"/>
                    </svg>
                    <span style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#6C757D',
                      lineHeight: 'normal'
                    }}>
                      {application.event.venue_name}
                    </span>
                  </div>

                  {/* 区切り線 */}
                  <div style={{
                    width: '100%',
                    height: '1px',
                    background: '#E9ECEF',
                    marginBottom: '12px'
                  }} />

                  {/* 詳細を見るリンク */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#5DABA8',
                      lineHeight: 'normal'
                    }}>
                      詳細を見る
                    </span>
                    <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                      <path d="M1 1L4 4L1 7" stroke="#5DABA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
