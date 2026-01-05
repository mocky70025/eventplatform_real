'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile, isLiffEnvironment } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationFormModern'
import EventManagement from '@/components/EventManagement'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner'
import EmailConfirmationPending from '@/components/EmailConfirmationPending'

export default function Home() {
  const [userProfile, setUserProfile] = useState<LineProfile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasActiveSession, setHasActiveSession] = useState(false)

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
        // セッションストレージから認証情報を確認
        const authType = sessionStorage.getItem('auth_type')
        const storedUserId = sessionStorage.getItem('user_id')
        const storedEmail = sessionStorage.getItem('user_email')
        const storedIsRegistered = sessionStorage.getItem('is_registered') === 'true'
        
        if (session && session.user) {
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
            // エラーが発生した場合でも、セッションストレージに保存されていれば登録済みとして扱う
            if (storedIsRegistered) {
              console.log('[Home] Error fetching organizer, but is_registered in storage is true, setting isRegistered to true')
              setIsRegistered(true)
              return
            }
          }
          
          // データベースから取得できた場合、またはセッションストレージに保存されている場合
          const shouldBeRegistered = !!organizer || storedIsRegistered
          setIsRegistered(shouldBeRegistered)
          
          if (organizer) {
            // データベースから取得できた場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'true')
          } else if (!storedIsRegistered) {
            // 登録されていない場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'false')
          }
          
          console.log('[Home] Auth user profile set:', { 
            userId: session.user.id, 
            authType: detectedAuthType,
            isRegistered: shouldBeRegistered,
            is_approved: organizer?.is_approved,
            emailConfirmed: isEmailConfirmed || true,
            fromStorage: storedIsRegistered && !organizer
          })
        } else if ((authType === 'email' || authType === 'google') && storedUserId) {
          // セッションが存在しないが、セッションストレージにuser_idがある場合
          // セッションを再確認
          const { data: { session: storageSession } } = await supabase.auth.getSession()
          
          // セッションが無効な場合、sessionStorageをクリア
          if (!storageSession) {
            sessionStorage.removeItem('auth_type')
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('user_email')
            sessionStorage.removeItem('is_registered')
            sessionStorage.removeItem('email_confirmed')
            console.log('[Home] No valid session for email/google auth, cleared sessionStorage')
            return
          }
          
          // メール確認待ちの状態で登録フォームにアクセスできるようにする
          console.log('[Home] Email auth - session not found, but user_id in storage:', storedUserId)
          
          const emailConfirmedFromStorage = sessionStorage.getItem('email_confirmed') === 'true'
          
          // セッションが存在する場合、メール確認済みとして扱う
          // セッションが存在しない場合、メール確認待ちとして扱う
          const effectiveEmailConfirmed = emailConfirmedFromStorage || !!storageSession
          
          setUserProfile({
            userId: storedUserId,
            displayName: storedEmail || '',
            email: storedEmail || '',
            authType: 'email' as const,
            emailConfirmed: effectiveEmailConfirmed
          })
          
          // 登録済みかチェック
          const { data: organizer, error: organizerError } = await supabase
            .from('organizers')
            .select('id, is_approved')
            .eq('user_id', storedUserId)
            .maybeSingle()
          
          if (organizerError) {
            console.error('[Home] Error fetching organizer from storage:', organizerError)
            // エラーが発生した場合でも、セッションストレージに保存されていれば登録済みとして扱う
            if (storedIsRegistered) {
              console.log('[Home] Error fetching organizer from storage, but is_registered in storage is true, setting isRegistered to true')
              setIsRegistered(true)
              return
            }
          }
          
          // データベースから取得できた場合、またはセッションストレージに保存されている場合
          const shouldBeRegistered = !!organizer || storedIsRegistered
          setIsRegistered(shouldBeRegistered)
          
          if (organizer) {
            // データベースから取得できた場合、セッションストレージにも保存
            sessionStorage.setItem('is_registered', 'true')
          }
          
          console.log('[Home] Email auth user profile set from storage:', { 
            userId: storedUserId, 
            isRegistered: shouldBeRegistered,
            is_approved: organizer?.is_approved,
            emailConfirmed: effectiveEmailConfirmed,
            hasSession: !!storageSession,
            fromStorage: storedIsRegistered && !organizer
          })
        } else {
          // organizerアプリはメール認証のみ
          console.log('[Home] No email auth found - user not logged in')
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
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
          } else {
            setIsRegistered(true)
            sessionStorage.setItem('is_registered', 'true')
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
      <EventManagement userProfile={userProfile} />
    </>
  )
}