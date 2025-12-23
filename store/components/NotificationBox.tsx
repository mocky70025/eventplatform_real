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
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes <= 0 ? 'たった今' : `${minutes}分前`
    } else if (hours < 24) {
      return `${hours}時間前`
    } else if (days === 1) {
      return '1日前'
    } else {
      return `${days}日前`
    }
  }

  const getNotificationIcon = (type: string, isRead: boolean) => {
    // 通知タイプに応じてアイコンを返す
    switch (type) {
      case 'application_approved':
        // ベルアイコン
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#5DABA8"/>
            <path d="M20 14C19.4477 14 19 14.4477 19 15V16C18.4477 16 18 16.4477 18 17V20C18 20.5523 18.4477 21 19 21H21C21.5523 21 22 20.5523 22 20V17C22 16.4477 21.5523 16 21 16V15C21 14.4477 20.5523 14 20 14Z" fill="white"/>
            <path d="M21 24H19C18.4477 24 18 24.4477 18 25C18 25.5523 18.4477 26 19 26H21C21.5523 26 22 25.5523 22 25C22 24.4477 21.5523 24 21 24Z" fill="white"/>
          </svg>
        )
      case 'new_event':
        // 四角アイコン
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#5DABA8"/>
            <rect x="14" y="14" width="12" height="12" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        )
      case 'document_verified':
        // チェックマークアイコン（円の中）
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#5DABA8"/>
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M16 20L19 23L24 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        // デフォルトはベルアイコン
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#5DABA8"/>
            <path d="M20 14C19.4477 14 19 14.4477 19 15V16C18.4477 16 18 16.4477 18 17V20C18 20.5523 18.4477 21 19 21H21C21.5523 21 22 20.5523 22 20V17C22 16.4477 21.5523 16 21 16V15C21 14.4477 20.5523 14 20 14Z" fill="white"/>
            <path d="M21 24H19C18.4477 24 18 24.4477 18 25C18 25.5523 18.4477 26 19 26H21C21.5523 26 22 25.5523 22 25C22 24.4477 21.5523 24 21 24Z" fill="white"/>
          </svg>
        )
    }
  }

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
            color: '#6C757D'
          }}>通知を読み込み中...</p>
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
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '100vh',
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
            通知
          </h1>
        </div>

        <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
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
              color: '#6C757D'
            }}>通知はありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '353px', margin: '0 auto' }}>
              {notifications.map((notification) => {
                return (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                style={{
                  width: '100%',
                  height: '120px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: notification.is_read ? 'default' : 'pointer',
                  border: notification.is_read ? '1px solid #E9ECEF' : '2px solid #FF8A5C',
                  position: 'relative',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {/* 未読インジケーター */}
                {!notification.is_read && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#FF8A5C'
                  }} />
                )}

                {/* アイコン */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notification.notification_type, notification.is_read)}
                </div>

                {/* コンテンツ */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#2C3E50',
                    margin: '0 0 8px 0',
                    lineHeight: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    {notification.title}
                  </h3>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#6C757D',
                    margin: '0 0 8px 0',
                    lineHeight: 'normal',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line'
                  }}>
                    {notification.message}
                  </p>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#6C757D',
                    margin: 0,
                    lineHeight: 'normal'
                  }}>
                    {formatDate(notification.created_at)}
                  </p>
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
