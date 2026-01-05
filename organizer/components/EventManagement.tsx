'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, type Event, type Organizer } from '@/lib/supabase'
import EventForm from './EventForm'
import EventList from './EventList'
import EventApplications from './EventApplications'
import OrganizerProfile from './OrganizerProfile'
import NotificationBox from './NotificationBox'
import EventDetail from './EventDetail'

import { type LineProfile } from '@/lib/auth'

interface EventManagementProps {
  userProfile: LineProfile
}

export default function EventManagement({ userProfile }: EventManagementProps) {
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
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [eventForApplications, setEventForApplications] = useState<Event | null>(null)
  const [eventForDetail, setEventForDetail] = useState<Event | null>(null)
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'notifications' | 'profile'>('home')
  const [loading, setLoading] = useState(true)
  const [navVisible, setNavVisible] = useState(true)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchOrganizerData()
  }, [userProfile])

  // 未読通知数を取得
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userProfile?.userId || !organizer) return

      try {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userProfile.userId)
          .eq('user_type', 'organizer')
          .eq('is_read', false)

        setUnreadNotificationCount(count || 0)
      } catch (error) {
        console.error('Failed to fetch unread notification count:', error)
      }
    }

    fetchUnreadCount()
    // 30秒ごとに未読通知数を更新
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [userProfile, organizer])

  useEffect(() => {
    const handleScroll = () => {
      setNavVisible(false)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setNavVisible(true)
      }, 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const fetchOrganizerData = async () => {
    try {
      if (!userProfile?.userId) {
        console.log('[EventManagement] No userProfile.userId')
        setLoading(false)
        return
      }

      // 主催者情報を取得（認証タイプに応じて）
      const authType = (userProfile as any).authType || 'line'
      console.log('[EventManagement] Fetching organizer data, authType:', authType, 'userId:', userProfile.userId)
      let organizerData
      let error: any = null

      if (authType === 'email') {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', userProfile.userId)
          .maybeSingle()
        organizerData = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .maybeSingle()
        organizerData = result.data
        error = result.error
      }

      if (error) {
        console.error('[EventManagement] Error fetching organizer data:', error)
        setOrganizer(null)
        setLoading(false)
        return
      }

      if (organizerData) {
        console.log('[EventManagement] Organizer data found:', {
          id: organizerData.id,
          name: organizerData.name,
          is_approved: organizerData.is_approved
        })
        setOrganizer(organizerData)
        
        // 主催者のイベント一覧を取得
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', organizerData.id)
          .order('created_at', { ascending: false })

        if (eventsError) {
          console.error('[EventManagement] Error fetching events:', eventsError)
        }

        setEvents(eventsData || [])
      } else {
        console.log('[EventManagement] No organizer data found')
        setOrganizer(null)
      }
    } catch (error) {
      console.error('[EventManagement] Failed to fetch organizer data:', error)
      setOrganizer(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEventCreated = (savedEvent: Event) => {
    // 更新の場合: 既存のイベントを置き換え
    // 作成の場合: 先頭に追加
    const existingIndex = events.findIndex(e => e.id === savedEvent.id)
    if (existingIndex >= 0) {
      // 更新: 既存イベントを置き換え
      const updatedEvents = [...events]
      updatedEvents[existingIndex] = savedEvent
      setEvents(updatedEvents)
    } else {
      // 新規: 先頭に追加
      setEvents([savedEvent, ...events])
    }
    setShowEventForm(false)
    setEventToEdit(null)
  }

  // 編集イベントを受け取るカスタムイベント
  useEffect(() => {
    const handler = (e: any) => {
      const id = e.detail?.id
      const target = events.find(ev => ev.id === id)
      if (target) {
        setEventToEdit(target)
        setShowEventForm(true)
      }
    }
    window.addEventListener('edit-event', handler)
    return () => window.removeEventListener('edit-event', handler)
  }, [events])

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
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
          }}>読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!organizer) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>主催者情報が見つかりません</p>
        </div>
      </div>
    )
  }

  // 承認待ちでもイベント掲載ページを表示（ただしイベント作成は無効化）

  if (showEventForm) {
    return (
      <EventForm
        organizer={organizer}
        onEventCreated={handleEventCreated}
        // @ts-ignore
        initialEvent={eventToEdit || undefined}
        onCancel={() => {
          setShowEventForm(false)
          setEventToEdit(null)
        }}
      />
    )
  }

  if (eventForApplications && organizer) {
    return (
      <EventApplications
        eventId={eventForApplications.id}
        eventName={eventForApplications.event_name}
        organizerId={organizer.id}
        organizerEmail={organizer.email}
        onBack={() => setEventForApplications(null)}
      />
    )
  }

  if (eventForDetail) {
    return (
      <EventDetail
        event={eventForDetail}
        onBack={() => setEventForDetail(null)}
        onEdit={() => {
          setEventToEdit(eventForDetail)
          setEventForDetail(null)
          setShowEventForm(true)
        }}
      />
    )
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
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
                  マイイベント
                </h1>
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
                  <EventList 
                    events={events} 
                    onEventUpdated={fetchOrganizerData}
                    onEdit={(ev) => { setEventToEdit(ev); setShowEventForm(true) }}
                    onViewApplications={(ev) => { setEventForApplications(ev) }}
                    onViewDetail={(ev) => { setEventForDetail(ev) }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      case 'create':
        // イベント作成画面（EventForm）は別途表示されるため、ここでは何も表示しない
        return null
      case 'profile':
        return (
          <div style={{ paddingBottom: '24px' }}>
            <OrganizerProfile userProfile={userProfile} onBack={() => setCurrentView('home')} />
          </div>
        )
      case 'notifications':
        // TODO: 通知一覧コンポーネントを実装
        return null
      default:
        return null
    }
  }

  const HomeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L2 12H5V20H11V14H13V20H19V12H22L12 2Z"
        fill="currentColor"
      />
    </svg>
  )

  const CreateIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3C13 2.44772 12.5523 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  )

  const ProfileIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
        fill="currentColor"
      />
      <path
        d="M4 19.5C4 16.462 7.582 14 12 14s8 2.462 8 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-.5Z"
        fill="currentColor"
      />
    </svg>
  )

  const NotificationIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25-2.5 7.5-2.5 7.5h19S19 14.25 19 9c0-3.87-3.13-7-7-7zm0 20c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"
        fill="currentColor"
      />
    </svg>
  )

  const tabItems: Array<{ key: typeof currentView; label: string; icon: JSX.Element }> = [
    { key: 'home', label: 'ホーム', icon: <HomeIcon /> },
    { key: 'create', label: 'イベント作成', icon: <CreateIcon /> },
    { key: 'notifications', label: '通知', icon: <NotificationIcon /> },
    { key: 'profile', label: 'プロフィール', icon: <ProfileIcon /> }
  ]

  return (
    <div>
      {!showEventForm && renderCurrentView()}

      {!showEventForm && (
      <nav
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 0,
          zIndex: 1000,
          width: '393px',
          minWidth: '393px',
          flexShrink: 0,
          height: '80px',
          background: '#E8F5F5',
          borderTop: '1px solid #E9ECEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          willChange: 'transform',
          transition: 'transform 0.25s ease-out',
          transform: navVisible ? 'translateX(-50%) translateY(0) translateZ(0)' : 'translateX(-50%) translateY(110%) translateZ(0)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            padding: '0 8px',
            boxSizing: 'border-box'
          }}
        >
          {tabItems.map((item) => {
            const isActive = currentView === item.key || (item.key === 'create' && showEventForm)
            return (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1
                }}
              >
                <button
                  onClick={() => {
                    if (item.key === 'create') {
                      if (!organizer.is_approved) {
                        alert('運営側の承認が必要です。承認後、イベントの掲載が可能になります。')
                        return
                      }
                      setShowEventForm(true)
                    } else {
                      setCurrentView(item.key)
                    }
                  }}
                  style={{
                    width: '56px',
                    height: '56px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    position: 'relative'
                  }}
                >
                  <div style={{ color: '#2C3E50', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                    {item.key === 'notifications' && unreadNotificationCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#FF3B30',
                        color: '#FFFFFF',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                      </span>
                    )}
                  </div>
                </button>
                <span style={{
                  fontSize: '12px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>
      )}
    </div>
  )
}
