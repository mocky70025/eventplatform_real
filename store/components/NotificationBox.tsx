'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  notification_type: string
  title: string
  message: string
  related_event_id?: string
  related_application_id?: string
  is_read: boolean
  created_at: string
  events?: {
    event_name: string
  }
}

interface NotificationBoxProps {
  userProfile: any
  onBack: () => void
  onUnreadCountChange?: (count: number) => void
}

export default function NotificationBox({ userProfile, onBack, onUnreadCountChange }: NotificationBoxProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
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

  const fetchNotifications = async () => {
    try {
      const userId = userProfile.userId
      const userType = 'exhibitor'

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          notification_type,
          title,
          message,
          related_event_id,
          related_application_id,
          is_read,
          created_at,
          events(event_name)
        `)
        .eq('user_id', userId)
        .eq('user_type', userType)
        .order('created_at', { ascending: false })

      if (error) throw error

      const notificationsData = (data || []).map((notif: any) => ({
        ...notif,
        events: Array.isArray(notif.events) ? notif.events[0] : notif.events
      }))

      setNotifications(notificationsData)
      const unread = notificationsData.filter((n: Notification) => !n.is_read).length
      setUnreadCount(unread)
      onUnreadCountChange?.(unread)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      alert('通知の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      // ローカル状態を更新
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1)
        onUnreadCountChange?.(newCount)
        return newCount
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨日'
    } else if (days < 7) {
      return `${days}日前`
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#fff5f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isDesktop ? '40px 20px' : 0
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '393px',
          width: '100%'
        }}>
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
          }}>通知を読み込み中...</p>
        </div>
      </div>
    )
  }

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
        width: '100%',
        maxWidth: '393px',
        background: '#fff5f0',
        minHeight: isDesktop ? 'auto' : '100vh'
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
            onClick={onBack}
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
            通知
          </h1>
        </div>

        <div className="container mx-auto" style={{ padding: '16px', maxWidth: '394px' }}>
          {notifications.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#666666'
              }}>通知はありません</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((notification) => {
                // 通知タイプに応じたアイコンを取得
                const getNotificationIcon = () => {
                  if (notification.notification_type === 'application_approved') {
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#5DABA8"/>
                        <path d="M2 17L12 22L22 17" stroke="#5DABA8" strokeWidth="2"/>
                        <path d="M2 12L12 17L22 12" stroke="#5DABA8" strokeWidth="2"/>
                      </svg>
                    )
                  } else if (notification.notification_type === 'event_added') {
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#5DABA8" strokeWidth="2"/>
                        <path d="M3 10H21" stroke="#5DABA8" strokeWidth="2"/>
                      </svg>
                    )
                  } else {
                    return (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#5DABA8" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#5DABA8" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )
                  }
                }

                return (
                  <div
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: notification.is_read ? 'default' : 'pointer',
                      border: '1px solid #FF8A5C',
                      position: 'relative',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#f0f8f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getNotificationIcon()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            lineHeight: '120%',
                            color: '#000000',
                            margin: 0
                          }}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#FF8A5C',
                              flexShrink: 0,
                              marginTop: '6px'
                            }}></span>
                          )}
                        </div>
                        <p style={{
                          fontSize: '14px',
                          lineHeight: '150%',
                          color: '#000000',
                          margin: '4px 0 8px 0'
                        }}>
                          {notification.message}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          lineHeight: '120%',
                          color: '#999999',
                          margin: 0
                        }}>
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
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
