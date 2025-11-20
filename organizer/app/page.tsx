'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationForm'
import EventManagement from '@/components/EventManagement'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [userProfile, setUserProfile] = useState<LineProfile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Supabase Authのセッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // セッションストレージから認証情報を確認
        const authType = sessionStorage.getItem('auth_type')
        const storedUserId = sessionStorage.getItem('user_id')
        const storedEmail = sessionStorage.getItem('user_email')
        
        if (session && session.user) {
          // メールアドレス・パスワード認証の場合
          console.log('[Home] Email auth session found:', session.user.id)
          
          if (authType === 'email') {
            // メール確認済みかチェック
            const isEmailConfirmed = !!session.user.email_confirmed_at
            
            setUserProfile({
              userId: session.user.id,
              displayName: session.user.email || '',
              email: session.user.email,
              authType: 'email' as const,
              emailConfirmed: isEmailConfirmed
            })
            
            // メール未確認の場合は警告を表示
            if (!isEmailConfirmed) {
              console.warn('[Home] Email not confirmed yet')
            }
            
            // 登録済みかチェック
            const { data: organizer } = await supabase
              .from('organizers')
              .select('id')
              .eq('user_id', session.user.id)
              .single()
            
            setIsRegistered(!!organizer)
            console.log('[Home] Email auth user profile set:', { 
              userId: session.user.id, 
              isRegistered: !!organizer,
              emailConfirmed: isEmailConfirmed
            })
          }
        } else if (authType === 'email' && storedUserId) {
          // セッションが存在しないが、セッションストレージにuser_idがある場合
          // メール確認待ちの状態で登録フォームにアクセスできるようにする
          console.log('[Home] Email auth - session not found, but user_id in storage:', storedUserId)
          
          const emailConfirmed = sessionStorage.getItem('email_confirmed') === 'true'
          
          setUserProfile({
            userId: storedUserId,
            displayName: storedEmail || '',
            email: storedEmail || '',
            authType: 'email' as const,
            emailConfirmed: emailConfirmed
          })
          
          // 登録済みかチェック
          const { data: organizer } = await supabase
            .from('organizers')
            .select('id')
            .eq('user_id', storedUserId)
            .single()
          
          setIsRegistered(!!organizer)
          console.log('[Home] Email auth user profile set from storage:', { 
            userId: storedUserId, 
            isRegistered: !!organizer,
            emailConfirmed: emailConfirmed
          })
        } else {
          // LINE Loginの場合
          const savedProfile = sessionStorage.getItem('line_profile')
          const savedIsRegistered = sessionStorage.getItem('is_registered')
          
          console.log('[Home] Saved profile from sessionStorage:', savedProfile)
          console.log('[Home] Is registered from sessionStorage:', savedIsRegistered)
          
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile) as LineProfile
              console.log('[Home] User ID from session:', profile.userId)
              console.log('[Home] Display Name:', profile.displayName)
              setUserProfile(profile)
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (!userProfile) {
    return <WelcomeScreen />
  }

  if (!isRegistered) {
    return <RegistrationForm userProfile={userProfile} onRegistrationComplete={() => setIsRegistered(true)} />
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
