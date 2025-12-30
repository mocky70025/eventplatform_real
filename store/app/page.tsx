'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationForm'
import EventList from '@/components/EventList'
import ExhibitorProfile from '@/components/ExhibitorProfile'
import ApplicationManagement from '@/components/ApplicationManagement'
import NotificationBox from '@/components/NotificationBox'
import ExhibitorHome from '@/components/ExhibitorHome'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'
import EmailSent from '@/components/EmailSent'

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'events' | 'profile' | 'applications' | 'notifications'>('home')
  const [navVisible, setNavVisible] = useState(true)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // まず、セッションを確認
        const { data: { session } } = await supabase.auth.getSession()
        const savedProfile = sessionStorage.getItem('line_profile')
        const authType = sessionStorage.getItem('auth_type')
        
        // セッションが無効な場合、すべてのsessionStorageをクリア
        if (!session) {
          console.log('[Home] No valid session, clearing all sessionStorage')
          sessionStorage.removeItem('line_profile')
          sessionStorage.removeItem('auth_type')
          sessionStorage.removeItem('user_id')
          sessionStorage.removeItem('user_email')
          sessionStorage.removeItem('is_registered')
          sessionStorage.removeItem('email_confirmed')
          sessionStorage.removeItem('show_email_sent')
          setUserProfile(null)
          setIsRegistered(false)
          setHasActiveSession(false)
          return
        }
        
        // セッションが有効な場合のみ、認証情報を読み込む
        const savedIsRegistered = sessionStorage.getItem('is_registered')
        
        // LINE認証のプロフィールを確認（セッションが有効な場合のみ）
        if (savedProfile && session) {
          console.log('[Home] LINE Login profile found')
          try {
            const profile = JSON.parse(savedProfile) as LineProfile
            const isRegisteredValue = savedIsRegistered === 'true'
            setUserProfile({
              userId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
              statusMessage: profile.statusMessage,
              authType: 'line'
            })
            setIsRegistered(isRegisteredValue)
            console.log('[Home] LINE Login user profile set:', { userId: profile.userId, isRegistered: isRegisteredValue })
          } catch (error) {
            console.error('[Home] Failed to parse profile from sessionStorage:', error)
          }
        }
        
        // LINE認証のプロフィールがない場合のみ、メール認証またはGoogle認証を確認
        if (!savedProfile && session && session.user) {
          const storedUserId = sessionStorage.getItem('user_id')
          const storedEmail = sessionStorage.getItem('user_email')
          const storedIsRegistered = sessionStorage.getItem('is_registered') === 'true'
          
          // Supabaseのセッションが存在する場合、優先的に使用
          console.log('[Home] Auth session found:', session.user.id, 'authType from storage:', authType)
          
          // セッションストレージにauth_typeがない場合、セッションから推測する
          // Google認証の場合はapp_metadataにprovider情報がある
          const provider = (session.user.app_metadata as any)?.provider || 'email'
          const detectedAuthType = provider === 'google' ? 'google' : (authType || 'email')
          
          // セッションストレージに保存（次回のために）
          if (!authType) {
            sessionStorage.setItem('auth_type', detectedAuthType)
            sessionStorage.setItem('user_id', session.user.id)
            sessionStorage.setItem('user_email', session.user.email || '')
          }
          
          const isEmailConfirmed = !!session.user.email_confirmed_at
          
          setHasActiveSession(true)
          setUserProfile({
            userId: session.user.id,
            email: session.user.email,
            authType: detectedAuthType === 'google' ? 'google' : 'email',
            emailConfirmed: isEmailConfirmed || true
          })
          
          if (!isEmailConfirmed && detectedAuthType === 'email') {
            console.log('[Home] Session exists but email not confirmed - may be disabled in Supabase settings')
          }
          
          const { data: exhibitor, error: exhibitorError } = await supabase
            .from('exhibitors')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          if (exhibitorError) {
            console.error('[Home] Error fetching exhibitor:', exhibitorError)
            // エラーが発生した場合でも、セッションストレージに保存されていれば登録済みとして扱う
            if (storedIsRegistered) {
              console.log('[Home] Error fetching exhibitor, but is_registered in storage is true, setting isRegistered to true')
              setIsRegistered(true)
              return
            }
          }
          
          // データベースから取得できた場合、またはセッションストレージに保存されている場合
          const shouldBeRegistered = !!exhibitor || storedIsRegistered
          setIsRegistered(shouldBeRegistered)
          
          if (exhibitor) {
            // データベースから取得できた場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'true')
          } else if (!storedIsRegistered) {
            // 登録されていない場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'false')
          }
          
          console.log('[Home] Email auth user profile set:', { 
            userId: session.user.id, 
            authType: detectedAuthType,
            isRegistered: shouldBeRegistered,
            emailConfirmed: isEmailConfirmed || true,
            fromStorage: storedIsRegistered && !exhibitor
          })
        } else if (!savedProfile && authType === 'email' && sessionStorage.getItem('user_id')) {
          const storedUserId = sessionStorage.getItem('user_id')
          const storedEmail = sessionStorage.getItem('user_email')
          const storedIsRegistered = sessionStorage.getItem('is_registered') === 'true'
          
          // セッションが無効な場合、sessionStorageをクリア
          if (!session) {
            sessionStorage.removeItem('auth_type')
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('user_email')
            sessionStorage.removeItem('is_registered')
            sessionStorage.removeItem('email_confirmed')
            console.log('[Home] No valid session for email auth, cleared sessionStorage')
            return
          }
          
          console.log('[Home] Email auth from storage:', storedUserId)
          const { data: { session: storageSession } } = await supabase.auth.getSession()
          const emailConfirmedFromStorage = sessionStorage.getItem('email_confirmed') === 'true'
          
          const effectiveEmailConfirmed = emailConfirmedFromStorage || !!storageSession
          
          if (storageSession) {
            setHasActiveSession(true)
          } else {
            setHasActiveSession(false)
          }
          
          setUserProfile({
            userId: storedUserId,
            email: storedEmail || '',
            authType: 'email',
            emailConfirmed: effectiveEmailConfirmed
          })
          
          const { data: exhibitor, error: exhibitorError } = await supabase
            .from('exhibitors')
            .select('id')
            .eq('user_id', storedUserId)
            .maybeSingle()
          
          if (exhibitorError) {
            console.error('[Home] Error fetching exhibitor from storage:', exhibitorError)
            // エラーが発生した場合でも、セッションストレージに保存されていれば登録済みとして扱う
            if (storedIsRegistered) {
              console.log('[Home] Error fetching exhibitor from storage, but is_registered in storage is true, setting isRegistered to true')
              setIsRegistered(true)
              return
            }
          }
          
          // データベースから取得できた場合、またはセッションストレージに保存されている場合
          const shouldBeRegistered = !!exhibitor || storedIsRegistered
          setIsRegistered(shouldBeRegistered)
          
          if (exhibitor) {
            // データベースから取得できた場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'true')
          }
          
          console.log('[Home] Email auth user profile set from storage:', { 
            userId: storedUserId, 
            isRegistered: shouldBeRegistered,
            emailConfirmed: effectiveEmailConfirmed,
            hasSession: !!storageSession,
            emailConfirmedFromStorage: emailConfirmedFromStorage,
            fromStorage: storedIsRegistered && !exhibitor
          })
        } else if (!savedProfile) {
          console.log('[Home] No auth found')
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
      } finally {
        console.log('[Home] Auth initialization complete, setting loading to false')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // 未読通知数を取得
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userProfile?.userId || !isRegistered) return

      try {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userProfile.userId)
          .eq('user_type', 'exhibitor')
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
  }, [userProfile, isRegistered])

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

  if (loading) {
    return <LoadingSpinner />
  }

  // EmailSent画面を表示するかチェック
  const showEmailSent = typeof window !== 'undefined' && sessionStorage.getItem('show_email_sent') === 'true'
  
  if (showEmailSent) {
    return <EmailSent />
  }

  // ログイン状態のチェック（常にLINE Loginを使用）
  if (!userProfile) {
    console.log('[Home] No userProfile, showing WelcomeScreen')
    return <WelcomeScreen />
  }

  console.log('[Home] Rendering with userProfile:', { 
    userId: userProfile.userId, 
    authType: userProfile.authType, 
    isRegistered, 
    loading 
  })

  // メール確認待ちの状態で、まだ登録していない場合は、メール確認待ち画面を表示
  // ただし、セッションが存在する場合（メール確認が無効）は登録フォームに進める
  // メール確認が必要な場合（email_confirmed='false'）で、セッションが存在しない場合のみメール確認待ち画面を表示
  const isEmailPending = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && !isRegistered && !hasActiveSession
  
  console.log('[Home] Email pending check:', {
    authType: userProfile?.authType,
    emailConfirmed: userProfile?.emailConfirmed,
    isRegistered,
    hasActiveSession,
    isEmailPending
  })
  
  if (isEmailPending) {
    console.log('[Home] Email confirmation pending, showing EmailConfirmationPending')
    return (
      <EmailConfirmationPending
        email={userProfile.email || ''}
        onEmailConfirmed={async () => {
          // メール確認が完了したら、セッションを再取得してuserProfileを更新
          const { data: { session } } = await supabase.auth.getSession()
          if (session && session.user) {
            setUserProfile({
              userId: session.user.id,
              email: session.user.email,
              authType: 'email',
              emailConfirmed: true
            })
            // 登録済みかチェック
            const { data: exhibitor } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('user_id', session.user.id)
              .maybeSingle()
            setIsRegistered(!!exhibitor)
          }
        }}
      />
    )
  }

  if (!isRegistered) {
    console.log('[Home] User not registered, showing RegistrationForm')
    return (
      <RegistrationForm
        userProfile={userProfile}
        onRegistrationComplete={async () => {
          // 登録完了後、データベースから再取得して状態を更新
          if (userProfile?.userId) {
            const { data: exhibitor, error } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('user_id', userProfile.userId)
              .maybeSingle()
            
            if (error) {
              console.error('[Home] Error fetching exhibitor after registration:', error)
            }
            
            if (exhibitor) {
              console.log('[Home] Exhibitor found after registration:', exhibitor)
              setIsRegistered(true)
              // セッションストレージにも保存
              sessionStorage.setItem('is_registered', 'true')
            } else {
              console.warn('[Home] Exhibitor not found after registration, but setting isRegistered to true anyway')
              setIsRegistered(true)
              sessionStorage.setItem('is_registered', 'true')
            }
          } else {
            setIsRegistered(true)
            sessionStorage.setItem('is_registered', 'true')
          }
          console.log('[Home] Registration completed, setting isRegistered to true')
        }}
      />
    )
  }

  console.log('[Home] User is registered, showing home screen')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <ExhibitorHome userProfile={userProfile} onNavigate={setCurrentView} />
      case 'events':
        return <EventList userProfile={userProfile} onBack={() => setCurrentView('home')} />
      case 'profile':
        return <ExhibitorProfile userProfile={userProfile} onBack={() => setCurrentView('home')} />
      case 'applications':
        return <ApplicationManagement userProfile={userProfile} onBack={() => setCurrentView('home')} />
      case 'notifications':
        return <NotificationBox userProfile={userProfile} onBack={() => setCurrentView('home')} onUnreadCountChange={setUnreadNotificationCount} />
      default:
        return <ExhibitorHome userProfile={userProfile} onNavigate={setCurrentView} />
    }
  }

  const NotificationIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25-2.5 7.5-2.5 7.5h19S19 14.25 19 9c0-3.87-3.13-7-7-7zm0 20c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"
        fill="currentColor"
      />
    </svg>
  )

  const HistoryIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 2a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1Zm12 6v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8h14Z"
        fill="currentColor"
      />
    </svg>
  )

  const SearchIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 4a7 7 0 0 1 5.472 11.41l3.559 3.558a1 1 0 0 1-1.414 1.414l-3.558-3.559A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
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

  const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  // メール未確認の場合はバナーを表示
  const showEmailConfirmationBanner = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && userProfile?.email

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      {showEmailConfirmationBanner && (
        <div style={{ padding: '9px 16px', maxWidth: '394px', margin: '0 auto' }}>
          <EmailConfirmationBanner email={userProfile.email} />
        </div>
      )}
      {renderCurrentView()}

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '393px',
          minWidth: '393px',
          flexShrink: 0,
          height: '80px',
          background: '#E8F5F5', // Secondary Light（出店者用）
          borderTop: '1px solid #E9ECEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 1000,
          willChange: 'transform',
          transition: 'transform 0.25s ease-out',
          transform: navVisible ? 'translateY(0) translateZ(0)' : 'translateY(110%) translateZ(0)'
        }}
      >
        <button
          onClick={() => setCurrentView('notifications')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#2C3E50"/>
            </svg>
            {unreadNotificationCount > 0 && (
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
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>通知</span>
        </button>
        <button
          onClick={() => setCurrentView('applications')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>履歴</span>
        </button>
        <button
          onClick={() => setCurrentView('events')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>検索</span>
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>プロフィール</span>
        </button>
      </nav>
    </div>
  )
}
