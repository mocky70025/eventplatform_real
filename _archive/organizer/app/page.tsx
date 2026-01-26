'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile, isLiffEnvironment } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreenCalm'
import RegistrationForm from '@/components/RegistrationFormModern'
import EventManagement from '@/components/EventManagementUltra'
import EventFormUltra from '@/components/EventFormUltra'
import OrganizerProfileUltra from '@/components/OrganizerProfileUltra'
import NotificationBox from '@/components/NotificationBox'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'
import Button from '@/components/ui/Button'
import { spacing } from '@/styles/design-system'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Home() {
  const [userProfile, setUserProfile] = useState<LineProfile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'create-event' | 'profile' | 'notifications'>('home')
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const lineAuthParam = searchParams.get('line_auth')
  const lineEmailParam = searchParams.get('email')
  const lineNameParam = searchParams.get('line_name')
  const lineIdParam = searchParams.get('line_id')
  const linePictureParam = searchParams.get('line_picture')
  const lineProfileFromParams =
    lineAuthParam === 'success'
      ? {
          userId: lineIdParam || `line_${Date.now()}`,
          displayName: lineNameParam || '',
          email: lineEmailParam || '',
          authType: 'line' as const,
          pictureUrl: linePictureParam || undefined,
          statusMessage: '',
        }
      : null

  const [isApproved, setIsApproved] = useState(false)
  const [approvalNoticeVisible, setApprovalNoticeVisible] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isLineCallbackFlow = lineAuthParam === 'success'
        // まず、Supabase Authのセッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // セッションが無効な場合、すべてのsessionStorageをクリア
        if (!session) {
          console.log('[Home] No valid session, clearing all sessionStorage')
          sessionStorage.removeItem('auth_type')
          sessionStorage.removeItem('user_id')
          sessionStorage.removeItem('user_email')
          sessionStorage.removeItem('is_registered')
          sessionStorage.removeItem('email_confirmed')
          if (!isLineCallbackFlow) {
            setUserProfile(null)
          }
          setIsRegistered(false)
          setIsApproved(false)
          return
        }
        
        // セッションが有効な場合のみ、認証情報を読み込む
        if (session && session.user) {
          // Supabaseのセッションが存在する場合、優先的に使用
          console.log('[Home] Auth session found:', session.user.id)
          
          // Google認証の場合はapp_metadataにprovider情報がある
          const provider = (session.user.app_metadata as any)?.provider || 'email'
          const detectedAuthType = provider === 'google' ? 'google' : 'email'
          
          // セッションストレージに保存（次回のために）
          sessionStorage.setItem('auth_type', detectedAuthType)
          sessionStorage.setItem('user_id', session.user.id)
          sessionStorage.setItem('user_email', session.user.email || '')
          
          // メール確認済みかチェック
          const isEmailConfirmed = !!session.user.email_confirmed_at
          
          // セッションが存在する場合、メール確認済みとして扱う
          // （セッションが存在する = メール確認が完了している、またはメール確認が無効）
          setUserProfile({
            userId: session.user.id,
            displayName: session.user.email || '',
            email: session.user.email,
            authType: detectedAuthType === 'google' ? 'google' : 'email',
            emailConfirmed: isEmailConfirmed || true // セッションがあれば確認済みとして扱う
          })
          setHasActiveSession(true)
          
          if (!isEmailConfirmed && detectedAuthType === 'email') {
            console.log('[Home] Session exists but email not confirmed - may be disabled in Supabase settings')
          }
          
          // 登録済みかチェック
          // ユーザーIDで取得できない場合でも、プロバイダによっては line_user_id に保存されているケースがあるためフォールバックする
          const { data: organizer, error: organizerError } = await supabase
            .from('organizers')
            .select('id, is_approved')
            .or(`user_id.eq.${session.user.id},line_user_id.eq.${session.user.id}`)
            .maybeSingle()

          let organizerRecord = organizer
          let fetchError = organizerError

          if ((!organizerRecord || fetchError) && detectedAuthType === 'google') {
            const { data: organizerByLine, error: organizerByLineError } = await supabase
              .from('organizers')
              .select('id, is_approved')
              .eq('line_user_id', session.user.id)
              .maybeSingle()
            organizerRecord = organizerByLine
            fetchError = fetchError || organizerByLineError
          }
          
          if (fetchError) {
            console.error('[Home] Error fetching organizer:', fetchError)
            setIsRegistered(false)
            sessionStorage.setItem('is_registered', 'false')
            setHasActiveSession(true)
            setIsApproved(false)
          } else if (!organizerRecord) {
            console.log('[Home] Organizer not found - allow registration')
            setIsRegistered(false)
            sessionStorage.setItem('is_registered', 'false')
            setHasActiveSession(true)
            setIsApproved(false)
          } else {
            setIsRegistered(true)
            sessionStorage.setItem('is_registered', 'true')
            setIsApproved(Boolean(organizerRecord.is_approved))
            
            console.log('[Home] Auth user profile set:', { 
              userId: session.user.id, 
              authType: detectedAuthType,
              isRegistered: true,
              is_approved: organizerRecord?.is_approved,
              emailConfirmed: isEmailConfirmed || true,
            })
          }
        } else {
          // organizerアプリはメール認証のみ
          console.log('[Home] No email auth found - user not logged in')
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
        await supabase.auth.signOut()
        sessionStorage.clear()
        setUserProfile(null)
        setIsRegistered(false)
        setHasActiveSession(false)
      } finally {
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
  }, [])

  useEffect(() => {
    if (!lineProfileFromParams) return
    if (userProfile) return

    sessionStorage.setItem('line_profile', JSON.stringify(lineProfileFromParams))
    sessionStorage.setItem('auth_type', 'line')
    sessionStorage.setItem('user_id', lineProfileFromParams.userId)
    sessionStorage.setItem('user_email', lineProfileFromParams.email)
    sessionStorage.setItem('is_registered', 'false')

    setUserProfile(lineProfileFromParams)
    setIsRegistered(false)
    setHasActiveSession(false)

    router.replace('/', { scroll: false })
  }, [lineProfileFromParams])

  useEffect(() => {
    if (isApproved) {
      setApprovalNoticeVisible(false)
    }
  }, [isApproved])

  const profileToUse = userProfile ?? lineProfileFromParams

  if (loading) {
    return <LoadingSpinner />
  }

  if (!profileToUse) {
    return <WelcomeScreen />
  }

  // メール確認待ちの状態で、まだ登録していない場合は、メール確認待ち画面を表示
  // ただし、セッションが存在する場合（メール確認が無効）は登録フォームに進める
  // 開発中はメール確認を無効にしているため、セッションがあれば登録フォームに進める
  const isEmailPending = profileToUse?.authType === 'email' && !profileToUse?.emailConfirmed && !isRegistered && !hasActiveSession
 
  if (isEmailPending) {
    return (
      <EmailConfirmationPending
        email={profileToUse.email || ''}
        onEmailConfirmed={async () => {
          // メール確認が完了したら、セッションを再取得してuserProfileを更新
          const { data: { session } } = await supabase.auth.getSession()
          if (session && session.user) {
            setUserProfile({
              userId: session.user.id,
              displayName: session.user.email || '',
              email: session.user.email,
              authType: 'email' as const,
              emailConfirmed: true
            })
            // 登録済みかチェック
            const { data: organizer } = await supabase
              .from('organizers')
              .select('id')
              .eq('user_id', session.user.id)
              .single()
            setIsRegistered(!!organizer)
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
    return (
      <RegistrationForm
        userProfile={profileToUse}
        onRegistrationComplete={async () => {
          // 登録完了後、データベースから再取得して状態を更新
          if (profileToUse?.userId) {
            const { data: organizer, error } = await supabase
              .from('organizers')
              .select('id, is_approved')
              .eq('user_id', profileToUse.userId)
              .maybeSingle()
            
            if (error) {
              console.error('[Home] Error fetching organizer after registration:', error)
            }
            
            if (organizer) {
              console.log('[Home] Organizer found after registration:', organizer)
              setIsRegistered(true)
              // セッションストレージにも保存
              sessionStorage.setItem('is_registered', 'true')
            } else {
              console.warn('[Home] Organizer not found after registration, but setting isRegistered to true anyway')
              setIsRegistered(true)
              sessionStorage.setItem('is_registered', 'true')
            }
            setRegistrationComplete(true)
          } else {
            setIsRegistered(true)
            sessionStorage.setItem('is_registered', 'true')
            setRegistrationComplete(true)
          }
        }}
      />
    )
  }

  // メール未確認の場合はバナーを表示
  const showEmailConfirmationBanner = profileToUse?.authType === 'email' && !profileToUse?.emailConfirmed && profileToUse?.email

  const handleRequestCreateEvent = () => {
    if (!isApproved) {
      setApprovalNoticeVisible(true)
      return
    }
    setCurrentView('create-event')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-event':
        if (!isApproved) {
          return (
            <div style={{
              minHeight: 'calc(100vh - 72px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing[8],
            }}>
              <div style={{ width: '100%', maxWidth: '640px' }}>
                <NotificationBox
                  type="warning"
                  title="承認待ちのためイベント作成できません"
                  message="運営管理者からの承認が完了するまではイベント作成機能を利用できません。承認が完了したら再度お試しください。"
                />
                <div style={{
                  marginTop: spacing[6],
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <Button variant="outline" onClick={() => setCurrentView('home')}>
                    ダッシュボードへ戻る
                  </Button>
                </div>
              </div>
            </div>
          )
        }
        return (
          <EventFormUltra
            organizer={null}
            onEventCreated={() => setCurrentView('home')}
            onCancel={() => setCurrentView('home')}
          />
        )
      case 'profile':
        return (
          <OrganizerProfileUltra
            userProfile={profileToUse}
            onBack={() => setCurrentView('home')}
          />
        )
      case 'notifications':
        return (
          <div style={{ padding: spacing[8], maxWidth: '720px', margin: '0 auto' }}>
            <NotificationBox
              title="通知"
              message="通知機能は準備中です。しばらくお待ちください。"
              type="info"
              action={{ label: 'ダッシュボードに戻る', onClick: () => setCurrentView('home') }}
            />
          </div>
        )
      default:
        return (
          <EventManagement
            userProfile={profileToUse}
            onNavigate={(view) => setCurrentView(view)}
            onRequestCreateEvent={handleRequestCreateEvent}
            isApproved={isApproved}
          />
        )
    }
  }

  return (
    <>
      {showEmailConfirmationBanner && (
        <div style={{ padding: '9px 16px', maxWidth: '394px', margin: '0 auto' }}>
          <EmailConfirmationBanner email={profileToUse.email || ''} />
        </div>
      )}
      {approvalNoticeVisible && (
        <div style={{ padding: '0 16px', maxWidth: '640px', margin: '0 auto 16px' }}>
          <NotificationBox
            type="error"
            title="承認が必要です"
            message="管理者の承認がないためイベント作成はできません。承認が完了するまでお待ちください。"
            onClose={() => setApprovalNoticeVisible(false)}
          />
        </div>
      )}
      {renderCurrentView()}
    </>
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
        <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px', lineHeight: 1.6 }}>
          登録内容を保存しました。イベント掲載には管理者の承認が必要です。承認されるまではイベント管理画面から掲載できないことをご承知おきください。
        </p>
        <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: 1.6 }}>
          承認の進捗は、しばらく経ってからダッシュボードのステータスでご確認ください。
        </p>
        <Button variant="primary" fullWidth onClick={onProceed}>
          ダッシュボードへ進む
        </Button>
      </div>
    </div>
  )
}
