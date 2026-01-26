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
  genre: string
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
  const [genre, setGenre] = useState('')
  const [formKeyword, setFormKeyword] = useState('')
  const [formPeriodStart, setFormPeriodStart] = useState('')
  const [formPeriodEnd, setFormPeriodEnd] = useState('')
  const [formPrefecture, setFormPrefecture] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formGenre, setFormGenre] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [currentDate, setCurrentDate] = useState('')

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 現在の日付を取得
  useEffect(() => {
    const now = new Date()
    const day = now.getDate()
    setCurrentDate(`${day}日`)
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

  const genres = ['祭り・イベント', 'フード', 'アート', '音楽', 'スポーツ', 'その他']

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
        genre,
        ...overrideFilters
      }

      const buildQuery = (withApprovalStatus: boolean) => {
        let query = supabase
          .from('events')
          .select('*')

        if (withApprovalStatus) {
          query = query.eq('approval_status', 'approved')
        }

        if (effectiveFilters.periodStart) {
          query = query.gte('event_end_date', effectiveFilters.periodStart)
        }

        if (effectiveFilters.periodEnd) {
          query = query.lte('event_start_date', effectiveFilters.periodEnd)
        }

        const today = new Date().toISOString().split('T')[0]
        query = query.or(`application_end_date.is.null,application_end_date.gte.${today}`)

        query = query.order('event_start_date', { ascending: true })

        return query
      }

      let { data, error } = await buildQuery(true)

      if (error && (error.code === '42703' || `${error.message}`.includes('approval_status'))) {
        console.log('[EventList] approval_status column missing, retrying without filter')
        ;({ data, error } = await buildQuery(false))
      }

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

      // ジャンルでフィルタリング
      if (genre) {
        filteredEvents = filteredEvents.filter(event => 
          event.genre && event.genre.includes(genre)
        )
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
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startYear = start.getFullYear()
    const startMonth = start.getMonth() + 1
    const startDay = start.getDate()
    const endMonth = end.getMonth() + 1
    const endDay = end.getDate()
    return `${startYear}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`
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
    setFormGenre(genre)
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
    const nextGenre = formGenre

    setKeyword(nextKeyword)
    setPeriodStart(nextPeriodStart)
    setPeriodEnd(nextPeriodEnd)
    setPrefecture(nextPrefecture)
    setCity(nextCity)
    setGenre(nextGenre)
    setHasSearched(true)
    setShowSearchPage(false)

    fetchEvents({
      keyword: nextKeyword,
      periodStart: nextPeriodStart,
      periodEnd: nextPeriodEnd,
      prefecture: nextPrefecture,
      city: nextCity,
      genre: nextGenre
    })
  }

  const handleClearSearch = () => {
    setFormKeyword('')
    setFormPeriodStart('')
    setFormPeriodEnd('')
    setFormPrefecture('')
    setFormCity('')
    setFormGenre('')
    setKeyword('')
    setPeriodStart('')
    setPeriodEnd('')
    setPrefecture('')
    setCity('')
    setGenre('')
    setHasSearched(false)
    fetchEvents({
      keyword: '',
      periodStart: '',
      periodEnd: '',
      prefecture: '',
      city: '',
      genre: ''
    })
  }

  const handleApply = async (eventId: string) => {
    try {
      const { data: exhibitor } = await supabase
        .from('exhibitors')
        .select('id')
        .or(`id.eq.${userProfile.userId},line_user_id.eq.${userProfile.userId}`)
        .maybeSingle()

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
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 0
      }}>
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0'
      }}>
        {/* ヘッダー */}
        <div style={{
          width: '100%',
          height: '220px',
          background: '#E9ECEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
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
          <div style={{
            fontSize: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🎪
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* ジャンルタグとタイトル */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '12px',
              color: '#FFFFFF',
              fontWeight: 700,
              background: '#FF8A5C',
              padding: '4px 12px',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              {selectedEvent.genre || '祭り・イベント'}
            </span>
            <h1 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#2C3E50',
              marginTop: '8px',
              lineHeight: '120%'
            }}>
              {selectedEvent.event_name}
            </h1>
          </div>

          {/* イベント詳細カード */}
          <div style={{
            width: '100%',
            maxWidth: '353px',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 日付 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#2C3E50" strokeWidth="1.5"/>
                  <path d="M3 10H21" stroke="#2C3E50" strokeWidth="1.5"/>
                  <path d="M8 4V8" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 4V8" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ 
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2C3E50',
                  lineHeight: 'normal'
                }}>
                  {formatDateRange(selectedEvent.event_start_date, selectedEvent.event_end_date)}
                </span>
              </div>

              {/* 時間 */}
              {selectedEvent.event_time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#2C3E50" strokeWidth="1.5"/>
                    <path d="M12 6V12L16 14" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ 
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    lineHeight: 'normal'
                  }}>
                    {selectedEvent.event_time}
                  </span>
                </div>
              )}

              {/* 場所 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="8" height="11.5" viewBox="0 0 8 11.5" fill="none" style={{ marginTop: '4px' }}>
                  <path d="M4 0C1.79 0 0 1.79 0 4C0 7 4 11.5 4 11.5C4 11.5 8 7 8 4C8 1.79 6.21 0 4 0Z" fill="#2C3E50"/>
                  <circle cx="4" cy="4" r="2" fill="white"/>
                </svg>
                <div>
                  <div style={{ 
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    lineHeight: 'normal',
                    marginBottom: '4px'
                  }}>
                    {selectedEvent.venue_name}
                  </div>
                  {selectedEvent.venue_address && (
                    <div style={{ 
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#6C757D',
                      lineHeight: 'normal'
                    }}>
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
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '12px',
              lineHeight: 'normal'
            }}>
              イベント概要
            </h2>
            <div style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6C757D',
              lineHeight: '1.5',
              whiteSpace: 'pre-line'
            }}>
              {selectedEvent.event_description || selectedEvent.lead_text}
            </div>
          </div>

          {/* 詳細情報 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '12px',
              lineHeight: 'normal'
            }}>
              詳細情報
            </h2>
            <div style={{
              width: '100%',
              maxWidth: '353px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              {/* 申込期間 */}
              {selectedEvent.application_end_date && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#6C757D',
                      marginBottom: '4px'
                    }}>
                      申込期間
                    </div>
                    <div style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#2C3E50'
                    }}>
                      {formatDateRange(selectedEvent.created_at, selectedEvent.application_end_date)}
                    </div>
                  </div>
                  <div style={{
                    height: '1px',
                    background: '#E9ECEF',
                    marginBottom: '16px'
                  }} />
                </>
              )}
              
              {/* 出店料（プレースホルダー - データベースにフィールドがない場合） */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  出店料
                </div>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {(selectedEvent as any).booth_fee ? `¥${(selectedEvent as any).booth_fee.toLocaleString()} / 1日` : '要問い合わせ'}
                </div>
              </div>
              <div style={{
                height: '1px',
                background: '#E9ECEF',
                marginBottom: '16px'
              }} />
              
              {/* 募集区画数（プレースホルダー - データベースにフィールドがない場合） */}
              <div>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  募集区画数
                </div>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {(selectedEvent as any).number_of_booths ? `${(selectedEvent as any).number_of_booths}区画` : '要問い合わせ'}
                </div>
              </div>
            </div>
          </div>

          {/* お問い合わせ */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: '12px',
              lineHeight: 'normal'
            }}>
              お問い合わせ
            </h2>
            <div style={{
              width: '100%',
              maxWidth: '353px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              {(selectedEvent as any).organizer_name && (
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  主催者: {(selectedEvent as any).organizer_name}
                </div>
              )}
              {(selectedEvent as any).contact_phone && (
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginBottom: '8px'
                }}>
                  TEL: {(selectedEvent as any).contact_phone}
                </div>
              )}
              {(selectedEvent as any).contact_email && (
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D'
                }}>
                  {(selectedEvent as any).contact_email}
                </div>
              )}
              {selectedEvent.homepage_url && (
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginTop: selectedEvent.homepage_url ? '8px' : 0
                }}>
                  <a
                    href={selectedEvent.homepage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#6C757D',
                      textDecoration: 'none'
                    }}
                  >
                    {selectedEvent.homepage_url}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 申し込みボタン */}
          <div style={{ padding: '0 20px', marginBottom: '100px' }}>
            <button
              onClick={() => handleApply(selectedEvent.id)}
              style={{
                width: '100%',
                maxWidth: '353px',
                height: '52px',
                margin: '0 auto',
                display: 'block',
                background: '#5DABA8',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
              }}
            >
              このイベントに申し込む
            </button>
          </div>
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
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0'
      }}>
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        minHeight: '852px',
        background: '#FFF5F0'
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
            type="button"
            onClick={handleCloseSearchPage}
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
            イベント検索
          </h1>
        </div>

        <div style={{ padding: '20px' }}>
          <form onSubmit={handleSearchSubmit}>
            {/* 検索フォームカード */}
            <div style={{
              width: '100%',
              maxWidth: '358px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              {/* キーワード */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2C3E50',
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
                    maxWidth: '313px',
                    height: '44px',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: formKeyword ? '#2C3E50' : '#6C757D',
                    background: '#FFFFFF',
                    border: '1px solid #E9ECEF',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif'
                  }}
                />
              </div>

              {/* 開催期間（開始） */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px',
                  display: 'block'
                }}>開催期間（開始）</label>
                <div style={{ position: 'relative', width: '100%', maxWidth: '313px' }}>
                  <input
                    type="date"
                    value={formPeriodStart}
                    onChange={(e) => setFormPeriodStart(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 40px 0 16px',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: formPeriodStart ? '#2C3E50' : '#6C757D',
                      background: '#FFFFFF',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5DABA8',
                    fontSize: '16px',
                    fontWeight: 400,
                    pointerEvents: 'none'
                  }}>+</div>
                </div>
              </div>

              {/* 開催期間（終了） */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px',
                  display: 'block'
                }}>開催期間（終了）</label>
                <div style={{ position: 'relative', width: '100%', maxWidth: '313px' }}>
                  <input
                    type="date"
                    value={formPeriodEnd}
                    onChange={(e) => setFormPeriodEnd(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 40px 0 16px',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: formPeriodEnd ? '#2C3E50' : '#6C757D',
                      background: '#FFFFFF',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5DABA8',
                    fontSize: '16px',
                    fontWeight: 400,
                    pointerEvents: 'none'
                  }}>+</div>
                </div>
              </div>

              {/* 都道府県 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px',
                  display: 'block'
                }}>都道府県</label>
                <div style={{ position: 'relative', width: '100%', maxWidth: '313px' }}>
                  <select
                    value={formPrefecture}
                    onChange={(e) => handlePrefectureChange(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 40px 0 16px',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: formPrefecture ? '#2C3E50' : '#6C757D',
                      background: '#FFFFFF',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">選択してください</option>
                    {prefectures.map((pref) => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 市区町村 */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px',
                  display: 'block'
                }}>市区町村</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="例: 静岡市"
                  style={{
                    width: '100%',
                    maxWidth: '313px',
                    height: '44px',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: formCity ? '#2C3E50' : '#6C757D',
                    background: '#FFFFFF',
                    border: '1px solid #E9ECEF',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif'
                  }}
                />
              </div>
            </div>

            {/* ボタン */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              marginTop: '32px',
              padding: '0 20px'
            }}>
              {/* 検索するボタン */}
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  maxWidth: '289px',
                  height: '52px',
                  margin: '0 auto',
                  background: '#5DABA8',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 700,
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
                }}
              >
                検索する
              </button>

              {/* 条件をクリアボタン */}
              <button 
                type="button" 
                onClick={handleClearSearch} 
                style={{
                  width: '100%',
                  maxWidth: '289px',
                  height: '52px',
                  margin: '0 auto',
                  background: '#FFFFFF',
                  color: '#6C757D',
                  borderRadius: '12px',
                  border: '1px solid #E9ECEF',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  cursor: 'pointer'
                }}
              >
                条件をクリア
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    )
  }

  const handleQuickSearch = () => {
    setKeyword(formKeyword)
    setGenre(formGenre)
    setHasSearched(true)
    fetchEvents({
      keyword: formKeyword,
      genre: formGenre,
      periodStart: '',
      periodEnd: '',
      prefecture: '',
      city: ''
    })
  }

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#F0FDF4',
        paddingBottom: '100px'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: '#22C55E',
          padding: isDesktop ? '0 48px' : '0 16px',
          height: isDesktop ? '80px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: isDesktop ? '24px' : '20px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ←
          </button>
          <div style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: isDesktop ? '28px' : '20px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.02em'
          }}>
            デミセル
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isDesktop ? '24px' : '16px'
          }}>
            <div style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: isDesktop ? '18px' : '16px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              {currentDate}
            </div>
            <div style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: isDesktop ? '18px' : '16px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              検索
            </div>
          </div>
        </div>

        <div style={{ 
          maxWidth: isDesktop ? '1400px' : '100%',
          margin: '0 auto',
          padding: isDesktop ? '32px 48px' : '16px'
        }}>
          {/* 検索バー */}
          <div style={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            gap: '12px',
            marginBottom: isDesktop ? '32px' : '16px'
          }}>
            {/* キーワード検索 */}
            <div style={{
              flex: isDesktop ? 2 : 1,
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #E5E5E5',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#6C757D" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={formKeyword}
                onChange={(e) => setFormKeyword(e.target.value)}
                placeholder="キーワード"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleQuickSearch()
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  color: formKeyword ? '#000000' : '#6C757D',
                  background: 'transparent'
                }}
              />
            </div>

            {/* ジャンル検索 */}
            <div style={{
              flex: isDesktop ? 1 : 1,
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #E5E5E5',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6C757D" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <select
                value={formGenre}
                onChange={(e) => setFormGenre(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  color: formGenre ? '#000000' : '#6C757D',
                  background: 'transparent',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">ジャンル</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* 詳細検索ボタン */}
            <button
              onClick={handleOpenSearchPage}
              style={{
                flex: isDesktop ? 0.8 : 1,
                background: '#22C55E',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#16A34A'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#22C55E'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              詳細検索
            </button>
          </div>

          {events.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #E5E5E5',
              padding: '64px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px' }}>
                <circle cx="11" cy="11" r="8" stroke="#E5E5E5" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="#E5E5E5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '18px',
                lineHeight: '150%',
                color: '#666666',
                fontWeight: 500
              }}>
                {hasSearched ? '該当するイベントが見つかりませんでした' : '開催予定のイベントがありません'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(360px, 1fr))' : '1fr',
                gap: isDesktop ? '24px' : '16px',
                marginBottom: '24px'
              }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '2px solid #E5E5E5',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    {event.main_image_url ? (
                      <img
                        src={event.main_image_url}
                        alt={event.event_name}
                        style={{
                          width: '100%',
                          height: isDesktop ? '220px' : '200px',
                          objectFit: 'cover',
                          background: '#F5F5F5'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: isDesktop ? '220px' : '200px',
                        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                      }}>
                        🎪
                      </div>
                    )}
                    <div style={{ padding: isDesktop ? '20px' : '16px' }}>
                      <div style={{
                        display: 'inline-block',
                        background: '#22C55E',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        {event.genre || '祭り・イベント'}
                      </div>
                      <h3 style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: isDesktop ? '20px' : '18px',
                        fontWeight: 700,
                        lineHeight: '130%',
                        color: '#2C3E50',
                        marginBottom: '12px'
                      }}>{event.event_name}</h3>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginBottom: '12px'
                      }}>
                        <p style={{
                          fontFamily: '"Noto Sans JP", sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: '#6C757D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                          {formatDate(event.event_start_date)} 〜 {formatDate(event.event_end_date)}
                        </p>
                        <p style={{
                          fontFamily: '"Noto Sans JP", sans-serif',
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: '#6C757D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                          {event.venue_name}
                        </p>
                      </div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '150%',
                        color: '#2C3E50',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{event.lead_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
