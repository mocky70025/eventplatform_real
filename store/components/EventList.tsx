'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { supabase } from '@/lib/supabase'

interface Event {
  id: string
  event_name: string
  event_name_furigana: string
  genre: string
  event_start_date: string
  event_end_date: string
  event_display_period: string
  event_time?: string
  lead_text: string
  event_description: string
  venue_name: string
  venue_city?: string
  venue_town?: string
  venue_address?: string
  main_image_url?: string
  main_image_caption?: string
  homepage_url?: string
  created_at: string
  application_end_date?: string | null
}

interface EventListProps {
  userProfile: any
  onBack: () => void
}

type SearchFilters = {
  keyword: string
  periodStart: string
  periodEnd: string
  prefecture: string
  city: string
}

export default function EventList({ userProfile, onBack }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showSearchPage, setShowSearchPage] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [city, setCity] = useState('')
  const [formKeyword, setFormKeyword] = useState('')
  const [formPeriodStart, setFormPeriodStart] = useState('')
  const [formPeriodEnd, setFormPeriodEnd] = useState('')
  const [formPrefecture, setFormPrefecture] = useState('')
  const [formCity, setFormCity] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const normalizeForSearch = (value: string) => {
    if (!value) return ''
    let normalized = value.normalize('NFKC')
    normalized = normalized.replace(/[\u30A1-\u30F6]/g, char =>
      String.fromCharCode(char.charCodeAt(0) - 0x60)
    )
    return normalized.toLowerCase()
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async (overrideFilters?: Partial<SearchFilters>) => {
    setLoading(true)
    try {
      const effectiveFilters: SearchFilters = {
        keyword,
        periodStart,
        periodEnd,
        prefecture,
        city,
        ...overrideFilters
      }

      let query = supabase
        .from('events')
        .select('*')

      // approval_statusカラムが存在する場合のみフィルタリング
      // 注意: カラムが存在しない場合は、クエリ実行時にエラーが発生する可能性があります
      // その場合は、エラーハンドリングで処理します
      query = query.eq('approval_status', 'approved')

      if (effectiveFilters.periodStart) {
        query = query.gte('event_end_date', effectiveFilters.periodStart)
      }

      if (effectiveFilters.periodEnd) {
        query = query.lte('event_start_date', effectiveFilters.periodEnd)
      }

      const today = new Date().toISOString().split('T')[0]
      query = query.or(`application_end_date.is.null,application_end_date.gte.${today}`)

      query = query.order('event_start_date', { ascending: true })

      const { data, error } = await query

      if (error) {
        console.error('[EventList] Supabase query error:', error)
        // エラーの詳細をログに出力
        console.error('[EventList] Error code:', error.code)
        console.error('[EventList] Error message:', error.message)
        console.error('[EventList] Error details:', error.details)
        console.error('[EventList] Error hint:', error.hint)
        throw error
      }

      let filteredEvents = (data || []) as Event[]

      // approval_statusカラムが存在する場合、クライアント側でもフィルタリング
      if (filteredEvents.length > 0 && 'approval_status' in filteredEvents[0]) {
        filteredEvents = filteredEvents.filter(event => 
          (event as any).approval_status === 'approved' || (event as any).approval_status === null
        )
      }

      const normalizedKeyword = normalizeForSearch(effectiveFilters.keyword)
      if (normalizedKeyword) {
        filteredEvents = filteredEvents.filter(event => {
          const fields = [event.event_name, event.event_description, event.lead_text]
            .filter(Boolean)
            .map(field => normalizeForSearch(field as string))
          return fields.some(field => field.includes(normalizedKeyword))
        })
      }

      const normalizedPrefecture = normalizeForSearch(effectiveFilters.prefecture)
      if (normalizedPrefecture) {
        filteredEvents = filteredEvents.filter(event => {
          const candidates = [event.venue_city, event.venue_address]
            .filter(Boolean)
            .map(field => normalizeForSearch(String(field)))
          return candidates.some(field => field.includes(normalizedPrefecture))
        })
      }

      const normalizedCity = normalizeForSearch(effectiveFilters.city)
      if (normalizedPrefecture && normalizedCity) {
        filteredEvents = filteredEvents.filter(event => {
          const candidates = [event.venue_city, event.venue_town, event.venue_address]
            .filter(Boolean)
            .map(field => normalizeForSearch(String(field)))
          return candidates.some(field => field.includes(normalizedCity))
        })
      }

      setEvents(filteredEvents)
      console.log('[EventList] Fetched events:', filteredEvents.length, 'events')
    } catch (error) {
      console.error('[EventList] Failed to fetch events:', error)
      const errorMessage = error instanceof Error ? error.message : '不明なエラー'
      const errorCode = (error as any)?.code || 'UNKNOWN'
      console.error('[EventList] Error details:', { errorMessage, errorCode })
      
      // エラーの種類に応じてメッセージを変更
      if (errorCode === 'PGRST116' || errorMessage.includes('column') || errorMessage.includes('does not exist')) {
        // カラムが存在しない場合やテーブルが空の場合
        console.log('[EventList] No events found or column issue, showing empty list')
        setEvents([])
      } else {
        // その他のエラー
        alert(`イベント一覧の取得に失敗しました。\nエラー: ${errorMessage}\nコード: ${errorCode}`)
        setEvents([])
      }
    } finally {
      setLoading(false)
    }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleOpenSearchPage = () => {
    setFormKeyword(keyword)
    setFormPeriodStart(periodStart)
    setFormPeriodEnd(periodEnd)
    setFormPrefecture(prefecture)
    setFormCity(city)
    setShowSearchPage(true)
  }

  const handleCloseSearchPage = () => {
    setShowSearchPage(false)
  }

  const handlePrefectureChange = (value: string) => {
    setFormPrefecture(value)
    if (!value) {
      setFormCity('')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextKeyword = formKeyword.trim()
    const nextPeriodStart = formPeriodStart
    const nextPeriodEnd = formPeriodEnd
    const nextPrefecture = formPrefecture
    const nextCity = formPrefecture ? formCity.trim() : ''

    setKeyword(nextKeyword)
    setPeriodStart(nextPeriodStart)
    setPeriodEnd(nextPeriodEnd)
    setPrefecture(nextPrefecture)
    setCity(nextCity)
    setHasSearched(true)
    setShowSearchPage(false)

    fetchEvents({
      keyword: nextKeyword,
      periodStart: nextPeriodStart,
      periodEnd: nextPeriodEnd,
      prefecture: nextPrefecture,
      city: nextCity
    })
  }

  const handleClearSearch = () => {
    setFormKeyword('')
    setFormPeriodStart('')
    setFormPeriodEnd('')
    setFormPrefecture('')
    setFormCity('')
    setKeyword('')
    setPeriodStart('')
    setPeriodEnd('')
    setPrefecture('')
    setCity('')
    setHasSearched(false)
    fetchEvents({
      keyword: '',
      periodStart: '',
      periodEnd: '',
      prefecture: '',
      city: ''
    })
  }

  const handleApply = async (eventId: string) => {
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
        alert('出店者登録が完了していません。まず登録を行ってください。')
        return
      }

      // 申し込み状況をチェック
      const { data: existingApplications } = await supabase
        .from('event_applications')
        .select('id')
        .eq('exhibitor_id', exhibitor.id)
        .eq('event_id', eventId)

      if (existingApplications && existingApplications.length > 0) {
        alert('既にこのイベントに申し込み済みです。')
        return
      }

      // 申し込みを登録
      const { data: applicationData, error } = await supabase
        .from('event_applications')
        .insert({
          exhibitor_id: exhibitor.id,
          event_id: eventId,
          application_status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // イベント情報と主催者情報を取得
      const { data: eventData } = await supabase
        .from('events')
        .select('event_name, organizer_id')
        .eq('id', eventId)
        .single()

      if (eventData && eventData.organizer_id) {
        console.log('[EventList] Organizer ID:', eventData.organizer_id)
        // 主催者情報を取得
        const { data: organizerData, error: organizerError } = await supabase
          .from('organizers')
          .select('email, user_id, line_user_id')
          .eq('id', eventData.organizer_id)
          .single()

        console.log('[EventList] Organizer data:', organizerData)
        console.log('[EventList] Organizer error:', organizerError)

        if (organizerData) {
          const organizerUserId = organizerData.user_id || organizerData.line_user_id
          console.log('[EventList] Organizer user ID:', organizerUserId)

          // 主催者に通知を作成
          if (organizerUserId) {
            try {
              console.log('[EventList] Creating notification...')
              const notificationResponse = await fetch('/api/notifications/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: organizerUserId,
                  userType: 'organizer',
                  notificationType: 'application_received',
                  title: '新しい出店申し込み',
                  message: `${eventData.event_name}に新しい出店申し込みがありました。`,
                  relatedEventId: eventId,
                  relatedApplicationId: applicationData.id
                })
              })

              const notificationResult = await notificationResponse.json()
              console.log('[EventList] Notification response:', notificationResponse.status, notificationResult)

              if (!notificationResponse.ok) {
                console.error('[EventList] Notification creation failed:', notificationResult)
              }

              // 主催者にメール通知を送信
              if (organizerData.email) {
                const emailSubject = `【${eventData.event_name}】新しい出店申し込みがありました`
                const emailHtml = `
                  <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #06C755; margin-bottom: 16px;">新しい出店申し込み</h2>
                    <p>${eventData.event_name}に新しい出店申し込みがありました。</p>
                    <p style="margin-top: 24px; margin-bottom: 8px;">アプリ内で申し込み内容を確認し、承認または却下を行ってください。</p>
                    <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">
                    <p style="font-size: 12px; color: #666666;">このメールは自動送信されています。</p>
                  </div>
                `

                await fetch('/api/notifications/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to: organizerData.email,
                    subject: emailSubject,
                    html: emailHtml
                  })
                })
              }
            } catch (notificationError) {
              console.error('[EventList] Failed to create notification or send email:', notificationError)
              // 通知の失敗は申し込みの成功を妨げない
            }
          }
        }
      }

      alert('出店申し込みが完了しました。')
      setSelectedEvent(null)
    } catch (error) {
      console.error('Application failed:', error)
      alert('申し込みに失敗しました。')
    }
  }

  const searchEntryWrapperStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: '24px',
    marginBottom: '16px'
  }

  const searchEntryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    minHeight: '48px',
    borderRadius: '8px',
    border: '1px solid #E5E5E5',
    background: '#FFFFFF',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '120%',
    color: '#000000',
    cursor: 'pointer'
  }

  const searchEntryIconStyle = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#06C755'
  }

  const searchEntryLabelStyle = {
    lineHeight: '20px',
    whiteSpace: 'nowrap' as const
  }

  const searchCardStyle = {
    background: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  }

  const searchLabelStyle = {
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '120%',
    color: '#000000'
  }

  const searchFieldContainerStyle = {
    position: 'relative' as const,
    flex: 1
  }

  const searchInputStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 44px 12px 44px',
    minHeight: '48px',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    lineHeight: '150%',
    color: '#000000',
    background: '#FFFFFF',
    outline: 'none'
  }

  const searchIconStyle = {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6B6B6B',
    pointerEvents: 'none' as const
  }

  const clearButtonStyle = {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'none',
    color: '#6B6B6B',
    cursor: 'pointer',
    fontSize: '18px',
    padding: 0,
    display: 'flex',
    alignItems: 'center'
  }

  const rangeContainerStyle = {
    boxSizing: 'border-box' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    minHeight: 56,
    background: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '8px'
  }

  const rangeSeparatorStyle = {
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    flexShrink: 0
  }

  const dateInputStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    lineHeight: '150%',
    color: '#000000'
  }

  const selectStyle = {
    boxSizing: 'border-box' as const,
    padding: '0 16px',
    width: '100%',
    minHeight: '56px',
    height: '56px',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    lineHeight: '150%',
    color: '#000000',
    background: '#FFFFFF'
  }

  const actionRowStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  }

  const secondaryButtonStyle = {
    flex: 1,
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #E5E5E5',
    background: '#FFFFFF',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '19px',
    color: '#000000',
    cursor: 'pointer'
  }

  const primaryButtonStyle = {
    flex: 1,
    height: '48px',
    borderRadius: '8px',
    border: 'none',
    background: '#06C755',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '19px',
    color: '#FFFFFF',
    cursor: 'pointer'
  }

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '800px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#06C755',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>イベント一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (selectedEvent) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#fff5f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: isDesktop ? '40px 20px' : 0
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '393px',
          minHeight: isDesktop ? 'auto' : '852px',
          background: '#fff5f0'
        }}>
        {/* ヘッダー */}
        <div style={{
          background: '#F7F7F7',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666666',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontSize: '24px' }}>🎪</div>
          </div>
          <div style={{ width: '32px' }}></div>
        </div>

        <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '16px', maxWidth: isDesktop ? '800px' : '393px' }}>
          {/* カテゴリとタイトル */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              fontSize: '12px',
              color: '#FF8A5C',
              fontWeight: 500
            }}>
              祭り・イベント
            </span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#000000',
              marginTop: '4px'
            }}>
              {selectedEvent.event_name}
            </h1>
          </div>

          {/* イベント詳細カード */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#666666" strokeWidth="2"/>
                  <path d="M3 10H21" stroke="#666666" strokeWidth="2"/>
                  <path d="M8 4V8" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 4V8" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '14px', color: '#000000' }}>
                  {formatDate(selectedEvent.event_start_date)} - {formatDate(selectedEvent.event_end_date)}
                </span>
              </div>
              {selectedEvent.event_time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#666666" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#000000' }}>{selectedEvent.event_time}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px' }}>
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#666666" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="#666666" strokeWidth="2"/>
                </svg>
                <div>
                  <div style={{ fontSize: '14px', color: '#000000' }}>{selectedEvent.venue_name}</div>
                  {selectedEvent.venue_address && (
                    <div style={{ fontSize: '12px', color: '#666666', marginTop: '4px' }}>
                      {selectedEvent.venue_address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* イベント概要 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '12px'
            }}>
              イベント概要
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#000000',
              lineHeight: '1.6'
            }}>
              {selectedEvent.event_description || selectedEvent.lead_text}
            </p>
          </div>

          {/* 詳細情報 */}
          {selectedEvent.application_end_date && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px'
              }}>
                詳細情報
              </h2>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #E9ECEF'
                }}>
                  <span style={{ fontSize: '14px', color: '#000000' }}>申込期間</span>
                  <span style={{ fontSize: '14px', color: '#000000' }}>
                    {formatDate(selectedEvent.created_at)} - {formatDate(selectedEvent.application_end_date)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* お問い合わせ */}
          {selectedEvent.homepage_url && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px'
              }}>
                お問い合わせ
              </h2>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <a
                  href={selectedEvent.homepage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px',
                    color: '#5DABA8',
                    textDecoration: 'underline'
                  }}
                >
                  {selectedEvent.homepage_url}
                </a>
              </div>
            </div>
          )}

          {/* 申し込みボタン */}
          <button
            onClick={() => handleApply(selectedEvent.id)}
            style={{
              width: '100%',
              padding: '16px',
              background: '#5DABA8',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            このイベントに申し込む
          </button>
        </div>
        </div>
      </div>
    )
  }

  if (showSearchPage) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#fff5f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: isDesktop ? '40px 20px' : 0
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '393px',
          minHeight: isDesktop ? 'auto' : '852px',
          background: '#fff5f0'
        }}>
        {/* ヘッダー */}
        <div style={{
          background: '#5DABA8',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={handleCloseSearchPage}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: 0,
            flex: 1
          }}>
            イベント検索
          </h1>
        </div>

        <div className="container mx-auto" style={{ padding: '16px', maxWidth: isDesktop ? '800px' : '393px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>キーワード</label>
                <input
                  type="text"
                  value={formKeyword}
                  onChange={(e) => setFormKeyword(e.target.value)}
                  placeholder="イベント名、会場名など"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: formKeyword ? '#000000' : '#999999',
                    background: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>開催期間(開始)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={formPeriodStart}
                    onChange={(e) => setFormPeriodStart(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      fontSize: '14px',
                      color: formPeriodStart ? '#000000' : '#999999',
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="年/月/日"
                  />
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5DABA8',
                    fontSize: '20px',
                    pointerEvents: 'none'
                  }}>+</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>開催期間(終了)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={formPeriodEnd}
                    onChange={(e) => setFormPeriodEnd(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      fontSize: '14px',
                      color: formPeriodEnd ? '#000000' : '#999999',
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="年/月/日"
                  />
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5DABA8',
                    fontSize: '20px',
                    pointerEvents: 'none'
                  }}>+</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>都道府県</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formPrefecture}
                    onChange={(e) => handlePrefectureChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      fontSize: '14px',
                      color: formPrefecture ? '#000000' : '#999999',
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      appearance: 'none'
                    }}
                  >
                    <option value="">選択してください</option>
                    {prefectures.map((pref) => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999999',
                    pointerEvents: 'none'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>市区町村</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="例:静岡市"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: formCity ? '#000000' : '#999999',
                    background: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button type="submit" style={{
                width: '100%',
                padding: '16px',
                background: '#5DABA8',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                検索する
              </button>
              <button type="button" onClick={handleClearSearch} style={{
                width: '100%',
                padding: '16px',
                background: '#FFFFFF',
                color: '#666666',
                borderRadius: '8px',
                border: '1px solid #E9ECEF',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                条件をクリア
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '800px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#fff5f0'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: '#5DABA8',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: 0
          }}>
            デミセル
          </h1>
        </div>

        <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '16px', maxWidth: isDesktop ? '800px' : '393px' }}>

        {events.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666'
            }}>
              {hasSearched ? '該当するイベントが見つかりませんでした' : '開催予定のイベントがありません'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {event.main_image_url && (
                  <img
                    src={event.main_image_url}
                    alt={event.event_name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      background: '#FFFFFF'
                    }}
                  />
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: '120%',
                    color: '#000000',
                    marginBottom: '8px'
                  }}>{event.event_name}</h3>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#666666',
                    marginBottom: '8px'
                  }}>{event.genre}</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#666666',
                    marginBottom: '4px'
                  }}>
                    {formatDate(event.event_start_date)} 〜 {formatDate(event.event_end_date)}
                  </p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#666666',
                    marginBottom: '8px'
                  }}>{event.venue_name}</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#000000',
                    marginTop: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{event.lead_text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  )
}
