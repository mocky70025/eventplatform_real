'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile, isLiffEnvironment } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationForm'
import EventList from '@/components/EventList'
import ExhibitorProfile from '@/components/ExhibitorProfile'
import ApplicationManagement from '@/components/ApplicationManagement'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'

export default function Home() {
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [currentView, setCurrentView] = useState<'events' | 'profile' | 'applications'>('events')
  const [navVisible, setNavVisible] = useState(true)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLiffReady(true)
        
        // 環境に応じて認証方法を判定
        const isLiff = isLiffEnvironment()
        
        if (isLiff) {
          // LIFF環境: LINE認証のみ
          const savedProfile = sessionStorage.getItem('line_profile')
          const savedIsRegistered = sessionStorage.getItem('is_registered')
          
          if (savedProfile) {
            console.log('[Home] LIFF environment - LINE Login profile found')
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
          } else {
            console.log('[Home] LIFF environment - No LINE profile found')
          }
        } else {
          // Web環境: メール認証のみ
          const { data: { session } } = await supabase.auth.getSession()
          const authType = sessionStorage.getItem('auth_type')
          const storedUserId = sessionStorage.getItem('user_id')
          const storedEmail = sessionStorage.getItem('user_email')
          
          if (session && session.user && authType === 'email') {
            console.log('[Home] Web environment - Email auth session found:', session.user.id)
            const isEmailConfirmed = !!session.user.email_confirmed_at
            
            // メール確認が無効な場合、セッションが存在すればemailConfirmedをtrueとして扱う
            // これにより、メール確認待ち画面を表示せずに登録フォームに進める
            // 開発中はメール確認を無効にしているため、セッションがあれば確認済みとして扱う
            const effectiveEmailConfirmed = isEmailConfirmed || true // 開発中は常に確認済みとして扱う
            
            setHasActiveSession(true) // セッションが存在することを記録
            setUserProfile({
              userId: session.user.id,
              email: session.user.email,
              authType: 'email',
              emailConfirmed: effectiveEmailConfirmed
            })
            
            if (!isEmailConfirmed) {
              console.log('[Home] Email confirmation disabled - session exists, proceeding to registration')
            }
            
            const { data: exhibitor } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('user_id', session.user.id)
              .maybeSingle()
            
            setIsRegistered(!!exhibitor)
            console.log('[Home] Email auth user profile set:', { 
              userId: session.user.id, 
              isRegistered: !!exhibitor,
              emailConfirmed: effectiveEmailConfirmed
            })
          } else if (authType === 'email' && storedUserId) {
            console.log('[Home] Web environment - Email auth from storage:', storedUserId)
            // セッションを確認して、メール確認が無効かどうかを判定
            const { data: { session: storageSession } } = await supabase.auth.getSession()
            const emailConfirmedFromStorage = sessionStorage.getItem('email_confirmed') === 'true'
            // セッションが存在する場合、メール確認が無効なので確認済みとして扱う
            const effectiveEmailConfirmed = emailConfirmedFromStorage || !!storageSession || true // 開発中は常に確認済みとして扱う
            
            if (storageSession) {
              setHasActiveSession(true)
            }
            
            setUserProfile({
              userId: storedUserId,
              email: storedEmail || '',
              authType: 'email',
              emailConfirmed: effectiveEmailConfirmed
            })
            
            const { data: exhibitor } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('user_id', storedUserId)
              .maybeSingle()
            
            setIsRegistered(!!exhibitor)
            console.log('[Home] Email auth user profile set from storage:', { 
              userId: storedUserId, 
              isRegistered: !!exhibitor,
              emailConfirmed: effectiveEmailConfirmed,
              hasSession: !!storageSession
            })
          } else {
            console.log('[Home] Web environment - No email auth found')
          }
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
  // 開発中はメール確認を無効にしているため、セッションがあれば登録フォームに進める
  const isEmailPending = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && !isRegistered && !hasActiveSession
  
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
    return <RegistrationForm userProfile={userProfile} onRegistrationComplete={() => {
      console.log('[Home] Registration completed, setting isRegistered to true')
      setIsRegistered(true)
    }} />
  }

  console.log('[Home] User is registered, showing home screen')

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

  // メール未確認の場合はバナーを表示
  const showEmailConfirmationBanner = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && userProfile?.email

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 88px)' }}>
      {showEmailConfirmationBanner && (
        <div style={{ padding: '9px 16px', maxWidth: '394px', margin: '0 auto' }}>
          <EmailConfirmationBanner email={userProfile.email} />
        </div>
      )}
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
