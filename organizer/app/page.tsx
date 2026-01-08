'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile, isLiffEnvironment } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreenCalm'
import RegistrationForm from '@/components/RegistrationFormModern'
import EventManagement from '@/components/EventManagementUltra'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'
import Button from '@/components/ui/Button'

export default function Home() {
  const [userProfile, setUserProfile] = useState<LineProfile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'create-event' | 'profile' | 'notifications'>('home')
  const [registrationComplete, setRegistrationComplete] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
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
          setUserProfile(null)
          setIsRegistered(false)
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
          
          if (!isEmailConfirmed && detectedAuthType === 'email') {
            console.log('[Home] Session exists but email not confirmed - may be disabled in Supabase settings')
          }
          
          // 登録済みかチェック
          const { data: organizer, error: organizerError } = await supabase
            .from('organizers')
            .select('id, is_approved')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          if (organizerError) {
            console.error('[Home] Error fetching organizer:', organizerError)
            setIsRegistered(false)
            sessionStorage.setItem('is_registered', 'false')
            setHasActiveSession(true)
          } else if (!organizer) {
            console.log('[Home] Organizer not found - allow registration')
            setIsRegistered(false)
            sessionStorage.setItem('is_registered', 'false')
            setHasActiveSession(true)
          } else {
            setIsRegistered(true)
            sessionStorage.setItem('is_registered', 'true')
            
            console.log('[Home] Auth user profile set:', { 
              userId: session.user.id, 
              authType: detectedAuthType,
              isRegistered: true,
              is_approved: organizer?.is_approved,
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
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!userProfile) {
    return <WelcomeScreen />
  }

  // メール確認待ちの状態で、まだ登録していない場合は、メール確認待ち画面を表示
  // ただし、セッションが存在する場合（メール確認が無効）は登録フォームに進める
  // 開発中はメール確認を無効にしているため、セッションがあれば登録フォームに進める
  const isEmailPending = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && !isRegistered && !hasActiveSession
  
  if (isEmailPending) {
    return (
      <EmailConfirmationPending
        email={userProfile.email || ''}
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
        userProfile={userProfile}
        onRegistrationComplete={async () => {
          // 登録完了後、データベースから再取得して状態を更新
          if (userProfile?.userId) {
            const { data: organizer, error } = await supabase
              .from('organizers')
              .select('id, is_approved')
              .eq('user_id', userProfile.userId)
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
  const showEmailConfirmationBanner = userProfile?.authType === 'email' && !userProfile?.emailConfirmed && userProfile?.email

  return (
    <>
      {showEmailConfirmationBanner && (
        <div style={{ padding: '9px 16px', maxWidth: '394px', margin: '0 auto' }}>
      <EmailConfirmationBanner email={userProfile.email || ''} />
    </div>
  )}
  <EventManagement userProfile={userProfile} onNavigate={setCurrentView} />
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
        <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: 1.6 }}>
          登録内容を保存しました。イベント管理に進む前に、プロフィールや必要情報を確認してください。
        </p>
        <Button variant="primary" fullWidth onClick={onProceed}>
          ダッシュボードへ進む
        </Button>
      </div>
    </div>
  )
}
