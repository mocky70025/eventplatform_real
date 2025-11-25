'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, type Event, type Organizer } from '@/lib/supabase'
import EventForm from './EventForm'
import EventList from './EventList'
import EventApplications from './EventApplications'
import OrganizerProfile from './OrganizerProfile'
import NotificationBox from './NotificationBox'

import { type LineProfile } from '@/lib/auth'

interface EventManagementProps {
  userProfile: LineProfile
}

export default function EventManagement({ userProfile }: EventManagementProps) {
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [eventForApplications, setEventForApplications] = useState<Event | null>(null)
  const [currentView, setCurrentView] = useState<'events' | 'profile' | 'notifications'>('events')
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
      if (!userProfile?.userId) return

      // 主催者情報を取得（認証タイプに応じて）
      const authType = (userProfile as any).authType || 'line'
      let organizerData

      if (authType === 'email') {
        const { data } = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        organizerData = data
      } else {
        const { data } = await supabase
          .from('organizers')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .single()
        organizerData = data
      }

      if (organizerData) {
        setOrganizer(organizerData)
        
        // 主催者のイベント一覧を取得
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', organizerData.id)
          .order('created_at', { ascending: false })

        setEvents(eventsData || [])
      }
    } catch (error) {
      console.error('Failed to fetch organizer data:', error)
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
      <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            fontFamily: 'Inter, sans-serif',
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
      <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>主催者情報が見つかりません</p>
        </div>
      </div>
    )
  }

  if (!organizer.is_approved) {
    return (
      <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
        <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
          <div style={{
            background: '#FFF9E6',
            border: '1px solid #F5D76E',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <h2 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#B8860B',
              marginBottom: '8px'
            }}>
              承認待ち
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#B8860B'
            }}>
              運営側の承認をお待ちください。承認後、イベントの掲載が可能になります。
            </p>
          </div>
        </div>
      </div>
    )
  }

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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'events':
        return (
          <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
            <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '24px' }}>
                <h1 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '120%',
                  color: '#000000'
                }}>イベント管理</h1>
                <button
                  onClick={() => setShowEventForm(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#06C755',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    cursor: 'pointer'
                  }}
                >
                  新しいイベントを掲載
                </button>
              </div>

              <EventList 
                events={events} 
                onEventUpdated={fetchOrganizerData}
                onEdit={(ev) => { setEventToEdit(ev); setShowEventForm(true) }}
                onViewApplications={(ev) => { setEventForApplications(ev) }}
              />
            </div>
          </div>
        )
      case 'profile':
        return (
          <div style={{ paddingBottom: '24px' }}>
            <OrganizerProfile userProfile={userProfile} />
          </div>
        )
      case 'notifications':
        return (
          <NotificationBox userProfile={userProfile} onBack={() => setCurrentView('events')} onUnreadCountChange={setUnreadNotificationCount} />
        )
      default:
        return null
    }
  }

  const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 2a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1Zm12 6v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8h14Z"
        fill="currentColor"
      />
      <path d="M7 11h4v4H7v-4Zm6 0h4v4h-4v-4Z" fill="currentColor" />
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
    { key: 'events', label: 'イベント', icon: <CalendarIcon /> },
    { key: 'profile', label: '登録情報', icon: <ProfileIcon /> },
    { key: 'notifications', label: '通知', icon: <NotificationIcon /> }
  ]

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 88px)' }}>
      {renderCurrentView()}

      <nav
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: '#FFFFFF',
          borderTop: '1px solid #E5E5E5',
          boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
          willChange: 'transform',
          transition: 'transform 0.25s ease-out',
          transform: navVisible ? 'translateY(0) translateZ(0)' : 'translateY(110%) translateZ(0)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            padding: '8px 16px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 8px)'
          }}
        >
          {tabItems.map((item) => {
            const isActive = currentView === item.key
            const activeColor = '#06C755'
            const inactiveColor = '#666666'
            return (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <span style={{ color: isActive ? activeColor : inactiveColor, position: 'relative' }}>
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
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: '12px', color: isActive ? activeColor : inactiveColor }}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
