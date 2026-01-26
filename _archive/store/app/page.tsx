'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreenCalm'
import RegistrationForm from '@/components/RegistrationFormModern'
import EventList from '@/components/EventListUltra'
import ExhibitorProfile from '@/components/ExhibitorProfileUltra'
import ApplicationManagement from '@/components/ApplicationManagementUltra'
import NotificationBox from '@/components/NotificationBox'
import ExhibitorHome from '@/components/ExhibitorHomeUltra'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'
import EmailSent from '@/components/EmailSent'
import Button from '@/components/ui/Button'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'events' | 'profile' | 'applications' | 'notifications'>('home')
  const [navVisible, setNavVisible] = useState(true)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const lineAuthParam = searchParams.get('line_auth')
  const lineEmailParam = searchParams.get('email')
  const lineNameParam = searchParams.get('line_name')
  const lineIdParam = searchParams.get('line_id')
  const linePictureParam = searchParams.get('line_picture')
  const supabaseUserIdParam = searchParams.get('supabase_user_id')
  const initialLineAuth = lineAuthParam
  const lineProfileFromParams =
    lineAuthParam === 'success'
      ? {
          userId: lineIdParam || `line_${Date.now()}`,
          displayName: lineNameParam || '',
          pictureUrl: linePictureParam || undefined,
          statusMessage: '',
          authType: 'line',
          email: lineEmailParam || '',
        }
      : null
  const effectiveProfile = userProfile ?? lineProfileFromParams
  const activeProfile = userProfile ?? effectiveProfile

useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[Home] Starting auth initialization...')
        
        // まず、Supabase Authのセッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('[Home] Session check result:', {
          hasSession: !!session,
          sessionError: sessionError?.message,
          userId: session?.user?.id
        })
        
        // セッションが無効な場合、すべてのsessionStorageをクリア
        const isLineCallbackFlow = initialLineAuth === 'success'

        if (!session || sessionError) {
          console.log('[Home] No valid session, clearing selective sessionStorage and showing WelcomeScreen')
          const storedIsRegistered = sessionStorage.getItem('is_registered') === 'true'
          const storedUserId = sessionStorage.getItem('user_id')
          if (!isLineCallbackFlow) {
            sessionStorage.removeItem('auth_type')
            sessionStorage.removeItem('user_email')
            sessionStorage.removeItem('email_confirmed')
            sessionStorage.removeItem('line_profile')
          }
          setUserProfile(null)
          setIsRegistered(storedIsRegistered || !!storedUserId)
          setHasActiveSession(false)
          setLoading(false)
          return
        }
        
        // セッションが有効な場合のみ、認証情報を読み込む
        const savedProfile = sessionStorage.getItem('line_profile')
        const authType = sessionStorage.getItem('auth_type')
        const storedUserId = sessionStorage.getItem('user_id')
        const storedEmail = sessionStorage.getItem('user_email')
        const storedIsRegistered = sessionStorage.getItem('is_registered') === 'true'
        
        console.log('[Home] Session exists, checking auth type:', {
          hasSavedProfile: !!savedProfile,
          authType,
          storedUserId,
          storedIsRegistered
        })
        
        if (session && session.user) {
          // Supabaseのセッションが存在する場合、優先的に使用
          console.log('[Home] Auth session found:', session.user.id, 'authType from storage:', authType)
          
          // LINE認証のプロフィールを確認
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile) as LineProfile
              const isRegisteredValue = storedIsRegistered
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
              // パースエラーの場合、セッションをクリア
              sessionStorage.clear()
              setUserProfile(null)
              setIsRegistered(false)
              setHasActiveSession(false)
            }
          } else {
            // メール認証またはGoogle認証
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
            
            // 登録済みかチェック（exhibitorsはid/line_user_idのどちらかで紐づく）
            const { data: exhibitor, error: exhibitorError } = await supabase
              .from('exhibitors')
              .select('id')
              .or(`id.eq.${session.user.id},line_user_id.eq.${session.user.id}`)
              .maybeSingle()
            
            if (exhibitorError) {
              console.error('[Home] Error fetching exhibitor:', exhibitorError)
              if (storedIsRegistered) {
                console.log('[Home] Error fetching exhibitor, but is_registered in storage is true, setting isRegistered to true')
                setIsRegistered(true)
                setLoading(false)
                return
              }
            }

            const shouldBeRegistered = !!exhibitor || storedIsRegistered
            setIsRegistered(shouldBeRegistered)
            
            if (exhibitor) {
              sessionStorage.setItem('is_registered', 'true')
            } else if (!storedIsRegistered) {
              sessionStorage.setItem('is_registered', 'false')
            }
            
            console.log('[Home] Email auth user profile set:', { 
              userId: session.user.id, 
              authType: detectedAuthType,
              isRegistered: shouldBeRegistered,
              emailConfirmed: isEmailConfirmed || true
            })
          }
        } else {
          // セッションが存在しない場合
          console.log('[Home] No session.user, clearing sessionStorage and showing WelcomeScreen')
          sessionStorage.clear()
          setUserProfile(null)
          setIsRegistered(false)
          setHasActiveSession(false)
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
        sessionStorage.clear() // エラー時もクリア
        setUserProfile(null)
        setIsRegistered(false)
        setHasActiveSession(false)
      } finally {
        console.log('[Home] Auth initialization complete, setting loading to false. userProfile:', userProfile ? 'exists' : 'null')
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
      initializeAuth()
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [initialLineAuth])

  useEffect(() => {
    if (lineAuthParam !== 'success') return

    const lineUserId = lineIdParam || `line_${Date.now()}`
    const lineProfile = {
      userId: lineUserId,
      displayName: lineNameParam || '',
      pictureUrl: linePictureParam || undefined,
      statusMessage: '',
      authType: 'line',
      email: lineEmailParam || '',
    }

    sessionStorage.setItem('line_profile', JSON.stringify({ ...lineProfile }))
    sessionStorage.setItem('auth_type', 'line')
    const storedIdForRegistration = supabaseUserIdParam || lineUserId
    sessionStorage.setItem('user_id', storedIdForRegistration)
    sessionStorage.setItem('user_email', lineEmailParam || '')
    sessionStorage.setItem('is_registered', 'false')

    setUserProfile(lineProfile)
    setIsRegistered(false)
    setHasActiveSession(false)

    router.replace('/', { scroll: false })
  }, [lineAuthParam])

  // 未読通知数を取得
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!activeProfile?.userId || !isRegistered) return

      try {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', activeProfile.userId)
          .eq('user_type', 'exhibitor')
          .eq('is_read', false)

        setUnreadNotificationCount(count || 0)
      } catch (error) {
        console.error('Failed to fetch unread notification count:', error)
      }
    }

    fetchUnreadCount()
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
    console.log('[Home] Still loading, showing LoadingSpinner')
    return <LoadingSpinner />
  }

    console.log('[Home] Render check:', {
    loading,
    hasUserProfile: !!activeProfile,
    userProfile: activeProfile ? { userId: activeProfile.userId, authType: activeProfile.authType } : null,
    isRegistered,
    hasActiveSession
  })

  // EmailSent画面を表示するかチェック（セッションが有効な場合のみ）
  const showEmailSent = typeof window !== 'undefined' && 
    activeProfile && 
    sessionStorage.getItem('show_email_sent') === 'true'
  
  if (showEmailSent) {
    console.log('[Home] Showing EmailSent screen')
    return <EmailSent />
  }

  // ログイン状態のチェック
  if (!effectiveProfile) {
    console.log('[Home] No userProfile, showing WelcomeScreen')
    console.log('[Home] SessionStorage state:', {
      line_profile: sessionStorage.getItem('line_profile') ? 'exists' : 'null',
      auth_type: sessionStorage.getItem('auth_type'),
      user_id: sessionStorage.getItem('user_id'),
      is_registered: sessionStorage.getItem('is_registered')
    })
    return <WelcomeScreen />
  }

  console.log('[Home] Rendering with activeProfile:', { 
    userId: activeProfile?.userId, 
    authType: activeProfile?.authType, 
    isRegistered, 
    loading 
  })

  // メール確認待ちの状態で、まだ登録していない場合は、メール確認待ち画面を表示
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
        email={activeProfile?.email || ''}
        onEmailConfirmed={async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (session && session.user) {
            setUserProfile({
              userId: session.user.id,
              email: session.user.email,
              authType: 'email',
              emailConfirmed: true
            })
            const { data: exhibitor } = await supabase
              .from('exhibitors')
              .select('id')
              .or(`id.eq.${session.user.id},line_user_id.eq.${session.user.id}`)
              .maybeSingle()
            setIsRegistered(!!exhibitor)
          }
        }}
      />
    )
  }

  if (registrationComplete) {
    return (
      <RegistrationComplete
        onProceed={() => {
          setRegistrationComplete(false)
          setIsRegistered(true)
          sessionStorage.setItem('is_registered', 'true')
          setCurrentView('home')
        }}
      />
    )
  }

  if (!isRegistered) {
    console.log('[Home] User not registered, showing RegistrationForm')
    return (
        <RegistrationForm
          userProfile={effectiveProfile}
        onRegistrationComplete={async () => {
          const profileId = activeProfile?.userId

          if (profileId) {
            const { data: exhibitor, error } = await supabase
              .from('exhibitors')
              .select('id')
              .or(`id.eq.${profileId},line_user_id.eq.${profileId}`)
              .maybeSingle()

            if (error) {
              console.error('[Home] Error fetching exhibitor after registration:', error)
            }

            if (exhibitor) {
              sessionStorage.setItem('is_registered', 'true')
            } else {
              sessionStorage.setItem('is_registered', 'false')
            }
          } else {
            sessionStorage.setItem('is_registered', 'true')
          }

          setIsRegistered(true)
          setRegistrationComplete(true)
          sessionStorage.setItem('registration_complete', 'true')
          console.log('[Home] Registration completed, setting isRegistered to true')
        }}
      />
    )
  }

  console.log('[Home] User is registered, showing home screen')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
    return <ExhibitorHome userProfile={activeProfile} onNavigate={setCurrentView} />
      case 'events':
        return <EventList userProfile={activeProfile} onBack={() => setCurrentView('home')} />
      case 'profile':
        return <ExhibitorProfile userProfile={activeProfile} onBack={() => setCurrentView('home')} />
      case 'applications':
        return <ApplicationManagement userProfile={activeProfile} onBack={() => setCurrentView('home')} />
      case 'notifications':
        // TODO: 通知一覧コンポーネントを実装
        return <ExhibitorHome userProfile={activeProfile} onNavigate={setCurrentView} />
      default:
        return <ExhibitorHome userProfile={activeProfile} onNavigate={setCurrentView} />
    }
  }

  // メール未確認の場合はバナーを表示
  const showEmailConfirmationBanner = activeProfile?.authType === 'email' && !activeProfile?.emailConfirmed && activeProfile?.email

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      {showEmailConfirmationBanner && (
        <div style={{ padding: '9px 16px', maxWidth: '394px', margin: '0 auto' }}>
          <EmailConfirmationBanner email={activeProfile?.email || ''} />
        </div>
      )}
      {renderCurrentView()}

      <nav
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          width: 'min(92vw, 720px)',
          minWidth: '340px',
          maxWidth: '720px',
          height: '72px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(226,232,240,0.9)',
          borderRadius: '28px',
          boxShadow: '0 18px 48px rgba(15,160,94,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 22px',
          gap: '12px',
          zIndex: 1000,
          willChange: 'transform',
          transition: 'transform 0.25s ease-out',
          transform: navVisible
            ? 'translateX(-50%) translateY(0) translateZ(0)'
            : 'translateX(-50%) translateY(120%) translateZ(0)'
        }}
      >
        {[
          { key: 'notifications' as const, label: '通知', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor" />
            </svg>
          )},
          { key: 'applications' as const, label: '履歴', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor" />
            </svg>
          )},
          { key: 'events' as const, label: '検索', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
            </svg>
          )},
          { key: 'profile' as const, label: 'プロフィール', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
            </svg>
          )}
        ].map((item) => {
          const isActive = currentView === item.key
          return (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flex: 1,
                background: isActive ? 'rgba(15,169,88,0.10)' : 'transparent',
                border: isActive ? '1px solid rgba(15,169,88,0.40)' : '1px solid transparent',
                borderRadius: '16px',
                boxShadow: isActive ? '0 12px 26px rgba(15,160,94,0.18)' : 'none',
                cursor: 'pointer',
                padding: '12px 14px'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: isActive ? '#E7F8EF' : '#F6F8FB',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #0FA958' : '1px solid #E5E7EB',
                  boxShadow: isActive ? '0 8px 16px rgba(15,160,94,0.14)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#0FA958' : '#2C3E50',
                  position: 'relative'
                }}
              >
                {item.key === 'notifications' && unreadNotificationCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
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
                    }}
                  >
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  color: isActive ? '#0FA958' : '#2C3E50'
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}

function RegistrationComplete({ onProceed }: { onProceed: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: '32px',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        padding: '32px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: 'Noto Sans JP, sans-serif', fontSize: '24px', marginBottom: '12px' }}>
          登録が完了しました
        </h1>
        <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: 1.6 }}>
          登録内容を保存しました。イベント申込に進む前に、書類が揃っているかを確認してください。
        </p>
        <Button variant="primary" fullWidth onClick={onProceed}>
          ダッシュボードへ進む
        </Button>
      </div>
    </div>
  )
}
