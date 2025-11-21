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
        // URLパラメータから認証コードを取得
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        
        if (error) {
          setErrorMessage(`認証エラー: ${error}`)
          setStatus('error')
          return
        }
        
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
        const profile = await exchangeLineLoginCode(code)
        
        if (!profile) {
          setErrorMessage('ユーザー情報の取得に失敗しました')
          setStatus('error')
          return
        }
        
        // デバッグログ
        console.log('[LINE Login] User ID:', profile.userId)
        console.log('[LINE Login] Display Name:', profile.displayName)
        console.log('[LINE Login] App Type: store')
        
        // store側の処理
        // 既存ユーザーかチェック
        console.log('[Callback] Checking for existing exhibitor with userId:', profile.userId)
        const { data: existingUser, error: exhibitorError } = await supabase
          .from('exhibitors')
          .select('*')
          .eq('line_user_id', profile.userId)
          .single()
        
        if (exhibitorError && exhibitorError.code !== 'PGRST116') {
          console.error('[Callback] Error checking exhibitor:', exhibitorError)
        }
        
        const isRegistered = !!existingUser
        console.log('[Callback] Existing exhibitor found:', isRegistered ? 'yes' : 'no')
        
        // セッションストレージにプロフィール情報を保存
        sessionStorage.setItem('line_profile', JSON.stringify(profile))
        sessionStorage.setItem('is_registered', isRegistered ? 'true' : 'false')
        sessionStorage.setItem('auth_type', 'line')
        
        console.log('[Callback] Profile saved to sessionStorage:', profile)
        console.log('[Callback] Is registered:', isRegistered)
        console.log('[Callback] Auth type set to: line')
        
        setStatus('success')
        
        // メインページにリダイレクト
        setTimeout(() => {
          console.log('[Callback] Redirecting to home page...')
          router.push('/')
        }, 1000)
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


