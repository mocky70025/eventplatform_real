'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationForm'
import EventList from '@/components/EventList'
import ExhibitorProfile from '@/components/ExhibitorProfile'
import ApplicationManagement from '@/components/ApplicationManagement'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'events' | 'profile' | 'applications'>('events')
  const [navVisible, setNavVisible] = useState(true)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLiffReady(true)
        
        // Supabase Authのセッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (session && session.user) {
          // メールアドレス・パスワード認証の場合
          console.log('[Home] Email auth session found:', session.user.id)
          const authType = sessionStorage.getItem('auth_type')
          
          if (authType === 'email') {
            setUserProfile({
              userId: session.user.id, // Supabase AuthのUUID
              email: session.user.email,
              authType: 'email'
            })
            
            // 登録済みかチェック
            const { data: exhibitor } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('user_id', session.user.id)
              .single()
            
            setIsRegistered(!!exhibitor)
            console.log('[Home] Email auth user profile set:', { userId: session.user.id, isRegistered: !!exhibitor })
          }
        } else {
          // LINE Loginの場合
          const savedProfile = sessionStorage.getItem('line_profile')
          const savedIsRegistered = sessionStorage.getItem('is_registered')
          
          console.log('[Home] Saved profile from sessionStorage:', savedProfile)
          console.log('[Home] Is registered from sessionStorage:', savedIsRegistered)
          
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile) as LineProfile
              console.log('[LINE Login] User ID from session:', profile.userId)
              console.log('[LINE Login] Display Name:', profile.displayName)
              setUserProfile({
                userId: profile.userId,
                displayName: profile.displayName,
                pictureUrl: profile.pictureUrl,
                statusMessage: profile.statusMessage,
                authType: 'line'
              })
              setIsRegistered(savedIsRegistered === 'true')
              console.log('[Home] LINE Login user profile set:', { userId: profile.userId, isRegistered: savedIsRegistered === 'true' })
            } catch (error) {
              console.error('[Home] Failed to parse profile from sessionStorage:', error)
            }
          } else {
            console.log('[Home] No profile found in sessionStorage')
          }
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

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

  // ログイン状態のチェック（常にLINE Loginを使用）
  if (!userProfile) {
    return <WelcomeScreen />
  }

  if (!isRegistered) {
    return <RegistrationForm userProfile={userProfile} onRegistrationComplete={() => setIsRegistered(true)} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'events':
        return <EventList userProfile={userProfile} onBack={() => setCurrentView('events')} />
      case 'profile':
        return <ExhibitorProfile userProfile={userProfile} onBack={() => setCurrentView('events')} />
      case 'applications':
        return <ApplicationManagement userProfile={userProfile} onBack={() => setCurrentView('events')} />
      default:
        return <EventList userProfile={userProfile} onBack={() => setCurrentView('events')} />
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

  const ChecklistIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm0 2h10v16H7V4Zm2.707 7.293a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0-1.414-1.414L10.5 12.086l-.793-.793Z"
        fill="currentColor"
      />
    </svg>
  )

  const tabItems: Array<{ key: typeof currentView; label: string; icon: JSX.Element }> = [
    { key: 'events', label: 'イベント', icon: <CalendarIcon /> },
    { key: 'profile', label: '登録情報', icon: <ProfileIcon /> },
    { key: 'applications', label: '申し込み', icon: <ChecklistIcon /> }
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
                <span style={{ color: isActive ? activeColor : inactiveColor }}>
                  {item.icon}
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
