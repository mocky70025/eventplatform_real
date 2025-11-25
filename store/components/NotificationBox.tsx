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

  useEffect(() => {
    fetchNotifications()
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

  const markAllAsRead = async () => {
    try {
      const userId = userProfile.userId
      const userType = 'exhibitor'

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('user_type', userType)
        .eq('is_read', false)

      if (error) throw error

      // ローカル状態を更新
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
      onUnreadCountChange?.(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      alert('すべて既読にするのに失敗しました')
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
          }}>通知を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#06C755',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#000000'
            }}>
              通知
            </h1>
            {unreadCount > 0 && (
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#FF3B30',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#666666',
                cursor: 'pointer'
              }}
            >
              すべて既読
            </button>
          )}
        </div>

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
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                style={{
                  background: notification.is_read ? '#FFFFFF' : '#F0F9FF',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: notification.is_read ? 'default' : 'pointer',
                  border: notification.is_read ? 'none' : '2px solid #06C755'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '120%',
                    color: '#000000',
                    marginBottom: '4px'
                  }}>
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#06C755',
                      flexShrink: 0,
                      marginTop: '4px'
                    }}></span>
                  )}
                </div>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: '#666666',
                  marginBottom: '8px'
                }}>
                  {notification.message}
                </p>
                {notification.events && (
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    lineHeight: '120%',
                    color: '#999999',
                    marginBottom: '8px'
                  }}>
                    イベント: {notification.events.event_name}
                  </p>
                )}
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  lineHeight: '120%',
                  color: '#999999'
                }}>
                  {formatDate(notification.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

