'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getLineLoginCode, exchangeLineLoginCode } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLパラメータから認証情報を取得
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        
        // URLフラグメント（#以降）を確認（Google認証の場合）
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const provider = hashParams.get('provider') || searchParams.get('provider')
        
        if (error) {
          setErrorMessage(`認証エラー: ${error}`)
          setStatus('error')
          return
        }
        
        // Google認証の場合（URLフラグメントにaccess_tokenがある、またはproviderがgoogle）
        if (provider === 'google' || accessToken) {
          console.log('[Callback] Google authentication detected')
          console.log('[Callback] Current URL:', window.location.href)
          console.log('[Callback] Current origin:', window.location.origin)
          
          // セッションストレージからアプリタイプを確認（主催者アプリから来た場合）
          const appType = sessionStorage.getItem('app_type')
          const isFromOrganizer = appType === 'organizer'
          
          // 主催者アプリのURLパターンを確認
          const currentOrigin = window.location.origin
          const organizerUrl = process.env.NEXT_PUBLIC_ORGANIZER_URL
          
          console.log('[Callback] App type from sessionStorage:', appType)
          console.log('[Callback] Is from organizer:', isFromOrganizer)
          console.log('[Callback] Current origin:', currentOrigin)
          console.log('[Callback] Organizer URL:', organizerUrl)
          
          // 主催者アプリから来た場合、主催者アプリにリダイレクト
          if (isFromOrganizer && organizerUrl && organizerUrl !== currentOrigin) {
            console.log('[Callback] Redirected from organizer app, redirecting back to organizer')
            // セッションストレージをクリア
            sessionStorage.removeItem('app_type')
            const redirectUrl = `${organizerUrl}/auth/callback${window.location.search}${window.location.hash}`
            window.location.href = redirectUrl
            return
          }
          
          // 出店者アプリの場合は、app_typeをクリア
          if (appType) {
            sessionStorage.removeItem('app_type')
          }
          
          // Supabaseが自動的にセッションを確立するのを待つ
          // 最大5秒間、セッションが確立されるまで待機
          let session = null
          for (let i = 0; i < 10; i++) {
            const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
            
            if (sessionError) {
              console.error('[Callback] Session error:', sessionError)
            }
            
            if (currentSession && currentSession.user) {
              session = currentSession
              break
            }
            
            // 500ms待機してから再試行
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          if (session && session.user) {
            console.log('[Callback] Google auth session found:', session.user.id)
            console.log('[Callback] User email:', session.user.email)
            
            // セッションストレージに保存
            sessionStorage.setItem('auth_type', 'google')
            sessionStorage.setItem('user_id', session.user.id)
            sessionStorage.setItem('user_email', session.user.email || '')
            
            // 既存ユーザーかチェック（exhibitorsはline_user_idで管理）
            const { data: existingUser, error: exhibitorError } = await supabase
              .from('exhibitors')
              .select('*')
              .eq('line_user_id', session.user.id)
              .maybeSingle()
            
            if (exhibitorError) {
              console.error('[Callback] Error checking exhibitor:', exhibitorError)
            }
            
            const isRegistered = !!existingUser
            console.log('[Callback] Existing exhibitor found:', isRegistered ? 'yes' : 'no')
            
            // セッションストレージに登録状態を保存
            sessionStorage.setItem('is_registered', isRegistered ? 'true' : 'false')
            
            setStatus('success')
            // 少し待ってからリダイレクト（UI更新のため）
            setTimeout(() => {
              window.location.href = '/'
            }, 500)
            return
          } else {
            console.error('[Callback] No session found after Google authentication')
            setErrorMessage('認証に失敗しました。もう一度お試しください。')
            setStatus('error')
            return
          }
        }
        
        // LINE認証の場合（既存の処理）
        if (!code || !state) {
          setErrorMessage('認証コードが取得できませんでした')
          setStatus('error')
          return
        }
        
        // stateの検証
        const savedState = sessionStorage.getItem('line_login_state')
        if (savedState !== state) {
          setErrorMessage('セキュリティ検証に失敗しました')
          setStatus('error')
          return
        }
        
        sessionStorage.removeItem('line_login_state')
        
        // 認証コードをユーザー情報に交換
        const result = await exchangeLineLoginCode(code)
        if (!result || !result.profile || !result.tokenData) {
          setErrorMessage('ユーザー情報の取得に失敗しました')
          setStatus('error')
          return
        }
        const { profile, tokenData } = result
        
        if (!profile) {
          setErrorMessage('ユーザー情報の取得に失敗しました')
          setStatus('error')
          return
        }
        
        // デバッグログ
        console.log('[LINE Login] User ID:', profile.userId)
        console.log('[LINE Login] Display Name:', profile.displayName)
        console.log('[LINE Login] Token data keys:', Object.keys(tokenData))

        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || '',
        })

        if (setSessionError) {
          console.error('[Callback] Failed to set Supabase session:', setSessionError)
          setErrorMessage('認証処理中にセッションを生成できませんでした')
          setStatus('error')
          return
        }
        console.log('[LINE Login] App Type: store')
        
        // store側の処理
        // 既存ユーザーかチェック
        console.log('[Callback] Checking for existing exhibitor with line_user_id:', profile.userId)
        const { data: existingUser, error: exhibitorError } = await supabase
          .from('exhibitors')
          .select('*')
          .or(`id.eq.${profile.userId},line_user_id.eq.${profile.userId}`)
          .maybeSingle()
        
        if (exhibitorError) {
          console.error('[Callback] Error checking exhibitor:', exhibitorError)
        }
        
        const isRegistered = !!existingUser
        console.log('[Callback] Existing exhibitor found:', isRegistered ? 'yes' : 'no')
        if (existingUser) {
          console.log('[Callback] Existing exhibitor data:', existingUser)
        }
        
        // セッションストレージにプロフィール情報を保存
        const profileJson = JSON.stringify(profile)
        sessionStorage.setItem('line_profile', profileJson)
        sessionStorage.setItem('is_registered', isRegistered ? 'true' : 'false')
        
        console.log('[Callback] Profile saved to sessionStorage:', profile)
        console.log('[Callback] is_registered saved to sessionStorage:', isRegistered ? 'true' : 'false')
        console.log('[Callback] Verifying sessionStorage values:', {
          line_profile: sessionStorage.getItem('line_profile') ? 'exists' : 'missing',
          is_registered: sessionStorage.getItem('is_registered')
        })
        
        setStatus('success')
        
        console.log('[Callback] Redirecting to home page immediately...')
        window.location.href = '/?line_auth=success'
      } catch (error) {
        console.error('Auth callback error:', error)
        setErrorMessage('認証処理中にエラーが発生しました')
        setStatus('error')
      }
    }
    
    handleCallback()
  }, [searchParams, router])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'error') {
    return (
      <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#000000',
            marginBottom: '16px'
          }}>
            認証エラー
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#666666',
            marginBottom: '24px'
          }}>
            {errorMessage}
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              background: '#06C755',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            トップに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #E5E5E5',
          borderTopColor: '#06C755',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#666666'
        }}>認証完了しました</p>
      </div>
    </div>
  )
}
