'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ExhibitorDetail {
  id: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  genre_category?: string
  genre_free_text?: string
  business_license_image_url?: string
  vehicle_inspection_image_url?: string
  automobile_inspection_image_url?: string
  pl_insurance_image_url?: string
  fire_equipment_layout_image_url?: string
  created_at: string
}

interface Application {
  id: string
  application_status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  exhibitor: {
    id: string
    name: string
    gender?: string
    age?: number
    email: string
    phone_number: string
    genre_category?: string
    genre_free_text?: string
    business_license_image_url?: string
    vehicle_inspection_image_url?: string
    automobile_inspection_image_url?: string
    pl_insurance_image_url?: string
    fire_equipment_layout_image_url?: string
    created_at?: string
  }
}

interface EventApplicationsProps {
  eventId: string
  eventName: string
  organizerId: string
  organizerEmail: string
  onBack: () => void
}

export default function EventApplications({ eventId, eventName, organizerId, organizerEmail, onBack }: EventApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isApplicationClosed, setIsApplicationClosed] = useState(false)
  const [closingApplication, setClosingApplication] = useState(false)
  const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorDetail | null>(null)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all')
  const [licenseVerificationStatus, setLicenseVerificationStatus] = useState<{
    verifying: boolean
    result: 'yes' | 'no' | null
    expirationDate: string | null
    reason: string | null
  }>({
    verifying: false,
    result: null,
    expirationDate: null,
    reason: null
  })

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const [loadingExhibitorDetail, setLoadingExhibitorDetail] = useState(false)

  useEffect(() => {
    fetchApplications()
    fetchEventStatus()
  }, [eventId])

  const fetchEventStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('is_application_closed')
        .eq('id', eventId)
        .single()

      if (error) throw error

      setIsApplicationClosed(data?.is_application_closed || false)
    } catch (error) {
      console.error('Failed to fetch event status:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('event_applications')
        .select(`
          id,
          application_status,
          applied_at,
          exhibitor:exhibitors(
            id,
            name,
            gender,
            age,
            email,
            phone_number,
            genre_category,
            genre_free_text,
            business_license_image_url,
            vehicle_inspection_image_url,
            automobile_inspection_image_url,
            pl_insurance_image_url,
            fire_equipment_layout_image_url,
            created_at
          )
        `)
        .eq('event_id', eventId)
        .order('applied_at', { ascending: false })

      if (error) throw error

      // データを正しい型に変換
      const applicationsData = (data || []).map((app: any) => ({
        id: app.id,
        application_status: app.application_status,
        applied_at: app.applied_at,
        exhibitor: Array.isArray(app.exhibitor) ? app.exhibitor[0] : app.exhibitor
      }))

      setApplications(applicationsData)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      alert('申し込み一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationApproval = async (applicationId: string, status: 'approved' | 'rejected') => {
    // 確認ダイアログを表示
    const statusText = status === 'approved' ? '承認' : '却下'
    const confirmMessage = status === 'approved' 
      ? 'この申し込みを承認しますか？\n\n承認すると、出店者に通知が送信されます。'
      : 'この申し込みを却下しますか？\n\n却下すると、出店者に通知が送信されます。'
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      // 申し込み情報を取得
      const { data: applicationData } = await supabase
        .from('event_applications')
        .select('id, exhibitor_id, event_id')
        .eq('id', applicationId)
        .single()

      if (!applicationData) {
        throw new Error('Application not found')
      }

      // ステータスを更新
      const { error: updateError } = await supabase
        .from('event_applications')
        .update({ application_status: status })
        .eq('id', applicationId)

      if (updateError) throw updateError

      // 申し込み一覧を更新
      await fetchApplications()

      // イベント情報を取得
      const { data: eventData } = await supabase
        .from('events')
        .select('event_name')
        .eq('id', applicationData.event_id)
        .single()

      // 出店者情報を取得
      const { data: exhibitorData } = await supabase
        .from('exhibitors')
        .select('email, user_id, line_user_id')
        .eq('id', applicationData.exhibitor_id)
        .single()

      // 出店者に通知を作成
      if (exhibitorData && eventData) {
        const exhibitorUserId = exhibitorData.user_id || exhibitorData.line_user_id

        if (exhibitorUserId) {
          try {
            const notificationType = status === 'approved' ? 'application_approved' : 'application_rejected'
            const title = status === 'approved' ? '出店申し込みが承認されました' : '出店申し込みが却下されました'
            const message = status === 'approved' 
              ? `${eventData.event_name}への出店申し込みが承認されました。`
              : `${eventData.event_name}への出店申し込みが却下されました。`

            await fetch('/api/notifications/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: exhibitorUserId,
                userType: 'exhibitor',
                notificationType,
                title,
                message,
                relatedEventId: applicationData.event_id,
                relatedApplicationId: applicationId
              })
            })

            // 出店者にメール通知を送信
            if (exhibitorData.email) {
              const emailSubject = status === 'approved' 
                ? `【${eventData.event_name}】出店申し込みが承認されました`
                : `【${eventData.event_name}】出店申し込みが却下されました`
              const emailHtml = `
                <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333;">
                  <h2 style="color: ${status === 'approved' ? '#FF8A5C' : '#FF3B30'}; margin-bottom: 16px;">${title}</h2>
                  <p>${message}</p>
                  <p style="margin-top: 24px; margin-bottom: 8px;">アプリ内で詳細を確認してください。</p>
                  <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">
                  <p style="font-size: 12px; color: #666666;">このメールは自動送信されています。</p>
                </div>
              `

              await fetch('/api/notifications/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: exhibitorData.email,
                  subject: emailSubject,
                  html: emailHtml
                })
              })
            }
          } catch (notificationError) {
            console.error('Failed to create notification or send email:', notificationError)
            // 通知の失敗はステータス更新の成功を妨げない
          }
        }
      }

      // データを再取得
      await fetchApplications()
      
      // 出店者詳細画面を閉じる
      setSelectedExhibitor(null)
      setSelectedApplicationId(null)
      
      alert(status === 'approved' ? '申し込みを承認しました' : '申し込みを却下しました')
    } catch (error) {
      console.error('Failed to update application:', error)
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
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFD88A', text: '#FFFFFF' }
      case 'approved':
        return { bg: '#5DABA8', text: '#FFFFFF' }
      case 'rejected':
        return { bg: '#8B2632', text: '#FFFFFF' }
      default:
        return { bg: '#F7F7F7', text: '#666666' }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査中'
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '却下'
      default:
        return '不明'
    }
  }

  const handleCloseApplication = async () => {
    if (!confirm('申し込みを締め切りますか？\n\n締め切ると、出店者情報をCSV形式でダウンロードできるようになります。')) {
      return
    }

    setClosingApplication(true)
    try {
      const response = await fetch('/api/events/close-and-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          organizerId,
          eventName,
          organizerEmail
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close application')
      }

      const data = await response.json()
      
      setIsApplicationClosed(true)
      await fetchApplications()
      
      // CSV形式でダウンロード
      await handleDownloadExcel(data.applications)
      
      alert(`申し込みを締め切りました。\n\n出店者数: ${data.applicationCount}名\nCSVファイルをダウンロードしました。`)
    } catch (error: any) {
      console.error('Failed to close application:', error)
      alert(`申し込みの締め切りに失敗しました: ${error.message}`)
    } finally {
      setClosingApplication(false)
    }
  }

  const handleDownloadExcel = async (applications: any[]) => {
    try {
      const response = await fetch('/api/events/export-to-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          eventName,
          applications
        })
      })

      if (!response.ok) {
        throw new Error('Failed to export to CSV')
      }

      // レスポンスからBlobを取得
      const blob = await response.blob()
      
      // ダウンロードリンクを作成
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${eventName}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Failed to download CSV:', error)
      alert('CSVファイルのダウンロードに失敗しました')
    }
  }

  const handleVerifyBusinessLicense = async () => {
    if (!selectedExhibitor?.business_license_image_url) {
      alert('営業許可証の画像が見つかりません')
      return
    }

    setLicenseVerificationStatus({
      verifying: true,
      result: null,
      expirationDate: null,
      reason: null
    })

    try {
      const response = await fetch('/api/events/verify-business-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl: selectedExhibitor.business_license_image_url
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to verify business license')
      }

      const data = await response.json()
      
      setLicenseVerificationStatus({
        verifying: false,
        result: data.result,
        expirationDate: data.expirationDate,
        reason: data.reason
      })
    } catch (error: any) {
      console.error('Failed to verify business license:', error)
      alert(`営業許可証の確認に失敗しました: ${error.message}`)
      setLicenseVerificationStatus({
        verifying: false,
        result: null,
        expirationDate: null,
        reason: null
      })
    }
  }

  const handleViewExhibitorDetail = async (exhibitorId: string, applicationId?: string) => {
    setLoadingExhibitorDetail(true)
    try {
      const response = await fetch(`/api/events/applicants?eventId=${eventId}&organizerId=${organizerId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch exhibitor detail')
      }

      const data = await response.json()
      const exhibitor = data.applicants.find((app: any) => app.exhibitor.id === exhibitorId)?.exhibitor

      if (!exhibitor) {
        throw new Error('Exhibitor not found')
      }

      setSelectedExhibitor(exhibitor)
      if (applicationId) {
        setSelectedApplicationId(applicationId)
      } else {
        // applicationIdが指定されていない場合、applicationsから見つける
        const app = applications.find((a) => a.exhibitor.id === exhibitorId)
        if (app) {
          setSelectedApplicationId(app.id)
        }
      }
      // 出店者詳細を開くときに期限確認の状態をリセット
      setLicenseVerificationStatus({
        verifying: false,
        result: null,
        expirationDate: null,
        reason: null
      })
    } catch (error: any) {
      console.error('Failed to fetch exhibitor detail:', error)
      alert(`出店者情報の取得に失敗しました: ${error.message}`)
    } finally {
      setLoadingExhibitorDetail(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#E8F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#FF8A5C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>申し込み一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (selectedExhibitor) {
    // 該当する申し込み情報を取得
    const selectedApplication = selectedApplicationId 
      ? applications.find((app) => app.id === selectedApplicationId)
      : null
    
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#E8F5F5'
      }}>
        <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '9px 16px', maxWidth: isDesktop ? '1000px' : '393px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '24px' }}>
            <button
              onClick={() => {
                setSelectedExhibitor(null)
                setSelectedApplicationId(null)
                setLicenseVerificationStatus({
                  verifying: false,
                  result: null,
                  expirationDate: null,
                  reason: null
                })
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#FF8A5C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← 戻る
            </button>
            <h1 style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50'
            }}>主催者申し込み確認画面</h1>
            <div style={{ width: '60px' }}></div>
          </div>

          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '16px'
            }}>基本情報</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>名前</p>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#2C3E50'
                }}>{selectedExhibitor.name}</p>
              </div>
              
              <div>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>性別</p>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#2C3E50'
                }}>{selectedExhibitor.gender}</p>
              </div>
              
              <div>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>年齢</p>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#2C3E50'
                }}>{selectedExhibitor.age}歳</p>
              </div>
              
              <div>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>電話番号</p>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#2C3E50'
                }}>{selectedExhibitor.phone_number}</p>
              </div>
              
              <div>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>メールアドレス</p>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#2C3E50'
                }}>{selectedExhibitor.email}</p>
              </div>
              
              {selectedExhibitor.genre_category && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '4px'
                  }}>ジャンルカテゴリ</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    lineHeight: '120%',
                    color: '#2C3E50'
                  }}>{selectedExhibitor.genre_category}</p>
                </div>
              )}
              
              {selectedExhibitor.genre_free_text && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '4px'
                  }}>ジャンル自由回答</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    lineHeight: '120%',
                    color: '#2C3E50'
                  }}>{selectedExhibitor.genre_free_text}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '16px'
            }}>書類</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedExhibitor.business_license_image_url && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{
                      fontFamily: '"Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      lineHeight: '120%',
                      color: '#6C757D',
                      margin: 0
                    }}>営業許可証</p>
                    <button
                      onClick={handleVerifyBusinessLicense}
                      disabled={licenseVerificationStatus.verifying}
                      style={{
                        padding: '6px 12px',
                        background: licenseVerificationStatus.verifying ? '#CCCCCC' : '#FF8A5C',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        border: 'none',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '120%',
                        cursor: licenseVerificationStatus.verifying ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {licenseVerificationStatus.verifying ? '確認中...' : '期限確認'}
                    </button>
                  </div>
                  {licenseVerificationStatus.result && (
                    <div style={{
                      marginBottom: '8px',
                      padding: '8px 12px',
                      background: licenseVerificationStatus.result === 'yes' ? '#E6F7E6' : '#FFE6E6',
                      borderRadius: '6px',
                      border: `1px solid ${licenseVerificationStatus.result === 'yes' ? '#FF8A5C' : '#FF3B30'}`
                    }}>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '12px',
                        lineHeight: '120%',
                        color: '#2C3E50',
                        margin: 0,
                        fontWeight: 700
                      }}>
                        期限: {licenseVerificationStatus.result === 'yes' ? '有効' : '期限切れ'}
                        {licenseVerificationStatus.expirationDate && ` (${licenseVerificationStatus.expirationDate})`}
                      </p>
                      {licenseVerificationStatus.reason && (
                        <p style={{
                          fontFamily: '"Noto Sans JP", sans-serif',
                          fontSize: '11px',
                          lineHeight: '120%',
                          color: '#6C757D',
                          margin: '4px 0 0 0'
                        }}>
                          {licenseVerificationStatus.reason}
                        </p>
                      )}
                    </div>
                  )}
                  <img
                    src={selectedExhibitor.business_license_image_url}
                    alt="営業許可証"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #E5E5E5'
                    }}
                  />
                </div>
              )}
              
              {selectedExhibitor.vehicle_inspection_image_url && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px'
                  }}>車検証</p>
                  <img
                    src={selectedExhibitor.vehicle_inspection_image_url}
                    alt="車検証"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #E5E5E5'
                    }}
                  />
                </div>
              )}
              
              {selectedExhibitor.automobile_inspection_image_url && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px'
                  }}>自動車検査証</p>
                  <img
                    src={selectedExhibitor.automobile_inspection_image_url}
                    alt="自動車検査証"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #E5E5E5'
                    }}
                  />
                </div>
              )}
              
              {selectedExhibitor.pl_insurance_image_url && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px'
                  }}>PL保険</p>
                  <img
                    src={selectedExhibitor.pl_insurance_image_url}
                    alt="PL保険"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #E5E5E5'
                    }}
                  />
                </div>
              )}
              
              {selectedExhibitor.fire_equipment_layout_image_url && (
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px'
                  }}>火器類配置図</p>
                  <img
                    src={selectedExhibitor.fire_equipment_layout_image_url}
                    alt="火器類配置図"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #E5E5E5'
                    }}
                  />
                </div>
              )}
              
              {!selectedExhibitor.business_license_image_url && 
               !selectedExhibitor.vehicle_inspection_image_url && 
               !selectedExhibitor.automobile_inspection_image_url && 
               !selectedExhibitor.pl_insurance_image_url && 
               !selectedExhibitor.fire_equipment_layout_image_url && (
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '120%',
                  color: '#6C757D'
                }}>登録されている書類はありません</p>
              )}
            </div>
          </div>

          {/* 承認・却下ボタン */}
          {selectedApplication && selectedApplication.application_status === 'pending' && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '16px'
            }}>
              <button
                onClick={() => handleApplicationApproval(selectedApplication.id, 'approved')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#FF8A5C',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '19px',
                  cursor: 'pointer',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF7840'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF8A5C'
                }}
              >
                承認
              </button>
              <button
                onClick={() => handleApplicationApproval(selectedApplication.id, 'rejected')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#FF3B30',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '19px',
                  cursor: 'pointer',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF2B20'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF3B30'
                }}
              >
                却下
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // フィルター適用
  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return app.application_status === 'pending'
    if (filterStatus === 'approved') return app.application_status === 'approved'
    return true
  })

  // 日付をフォーマット（YYYY/MM/DD形式）
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        maxWidth: '393px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}>
        {/* ヘッダー */}
        <div style={{
          width: '100%',
          flexShrink: 0,
          height: '64px',
          background: 'linear-gradient(180deg, #FF8A5C 0%, #FF7840 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'white'
          }}>
            申し込み管理
          </h1>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              left: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontFamily: '"Inter", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &lt;
          </button>
        </div>

        <div style={{
          width: '100%',
          flexShrink: 0,
          background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '16px',
          paddingBottom: '80px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}>
          {/* コンテンツエリア */}
          <div style={{
            width: '100%',
            maxWidth: '353px'
          }}>
            {/* フィルター */}
            <div style={{
              width: '100%',
              display: 'flex',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setFilterStatus('all')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: filterStatus === 'all' ? '#FF8A5C' : 'transparent',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: filterStatus === 'all' ? 'white' : '#6C757D',
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
                  background: filterStatus === 'pending' ? '#FF8A5C' : 'transparent',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: filterStatus === 'pending' ? 'white' : '#6C757D',
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
                  background: filterStatus === 'approved' ? '#FF8A5C' : 'transparent',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: filterStatus === 'approved' ? 'white' : '#6C757D',
                  cursor: 'pointer'
                }}
              >
                承認済み
              </button>
            </div>

            {/* 申し込みリスト */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {filteredApplications.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '48px 24px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    lineHeight: '150%',
                    color: '#6C757D'
                  }}>申し込みはありません</p>
                </div>
              ) : (
                filteredApplications.map((application) => {
                  const statusColor = getStatusColor(application.application_status)
                  return (
                    <div
                      key={application.id}
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          padding: '4px 12px',
                          background: statusColor.bg,
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          color: statusColor.text
                        }}>
                          {getStatusText(application.application_status)}
                        </div>
                      </div>
                      <h3 style={{
                        margin: '0 0 8px',
                        fontSize: '16px',
                        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        color: '#2C3E50'
                      }}>
                        {application.exhibitor.name}
                      </h3>
                      <p style={{
                        margin: '0 0 12px',
                        fontSize: '12px',
                        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        color: '#6C757D'
                      }}>
                        申込日: {formatDateShort(application.applied_at)}
                      </p>
                      <button
                        onClick={() => handleViewExhibitorDetail(application.exhibitor.id, application.id)}
                        disabled={loadingExhibitorDetail}
                        style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          borderRadius: '8px',
                          border: '1px solid #5DABA8',
                          fontSize: '12px',
                          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          color: '#5DABA8',
                          cursor: loadingExhibitorDetail ? 'not-allowed' : 'pointer'
                        }}
                      >
                        詳細を見る
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
