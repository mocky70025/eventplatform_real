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

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const userId = userProfile.userId
      const userType = 'organizer'

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}分前`
    } else if (diffHours < 24) {
      return `${diffHours}時間前`
    } else if (diffDays === 1) {
      return '1日前'
    } else {
      return `${diffDays}日前`
    }
  }

  // 通知タイプに応じたアイコンを返す
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
        // ベルアイコン
        return (
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0C4.067 0 2.5 1.567 2.5 3.5V5.5C2.5 7.25 1.25 8.5 1.25 8.5H10.75C10.75 8.5 9.5 7.25 9.5 5.5V3.5C9.5 1.567 7.933 0 6 0ZM6 15C5.175 15 4.5 14.325 4.5 13.5H7.5C7.5 14.325 6.825 15 6 15Z" fill="#2C3E50"/>
            <rect x="4" y="5" width="4" height="3" rx="0.5" fill="#2C3E50"/>
          </svg>
        )
      case 'event_approved':
        // 四角アイコン（承認済み）
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="10" height="10" rx="1" stroke="#2C3E50" strokeWidth="1.5" fill="none"/>
            <path d="M3 6L5.5 8.5L9 5" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'organizer_approved':
        // チェックマークアイコン
        return (
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4L4.5 7.5L11 1" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        // デフォルトのベルアイコン
        return (
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0C4.067 0 2.5 1.567 2.5 3.5V5.5C2.5 7.25 1.25 8.5 1.25 8.5H10.75C10.75 8.5 9.5 7.25 9.5 5.5V3.5C9.5 1.567 7.933 0 6 0ZM6 15C5.175 15 4.5 14.325 4.5 13.5H7.5C7.5 14.325 6.825 15 6 15Z" fill="#2C3E50"/>
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#E8F5F5',
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
            borderTopColor: '#FF8A5C',
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
      background: '#E8F5F5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
        background: '#E8F5F5',
        minHeight: isDesktop ? 'auto' : '100vh',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#FF8A5C',
          height: '64px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: isDesktop ? '1000px' : '393px',
          margin: '0 auto',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1'
            }}
          >
            &lt;
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            flex: 1,
            textAlign: 'center',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            lineHeight: '120%'
          }}>
            通知
          </h1>
          {/* 右側のスペース（戻るボタンとバランスを取る） */}
          <div style={{ width: '24px', height: '24px' }}></div>
        </div>

        <div style={{ 
          paddingTop: '88px',
          paddingBottom: '24px',
          paddingLeft: '20px',
          paddingRight: '20px',
          maxWidth: isDesktop ? '600px' : '353px', 
          margin: '0 auto' 
        }}>
          {notifications.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  style={{
                    width: '100%',
                    height: '120px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: notification.is_read ? 'default' : 'pointer',
                    border: notification.is_read ? '1px solid #E9ECEF' : '2px solid #FF8A5C',
                    position: 'relative',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* アイコン */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#E8F5F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  
                  {/* 内容 */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: notification.is_read ? 400 : 700,
                        lineHeight: '150%',
                        color: '#2C3E50',
                        margin: 0,
                        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                        wordBreak: 'break-word',
                        flex: 1
                      }}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#FF8A5C',
                          flexShrink: 0,
                          marginLeft: '8px',
                          marginTop: '6px'
                        }}></div>
                      )}
                    </div>
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '150%',
                      color: '#6C757D',
                      margin: 0,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      wordBreak: 'break-word'
                    }}>
                      {notification.message}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      lineHeight: '150%',
                      color: '#6C757D',
                      margin: 0,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif'
                    }}>
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

