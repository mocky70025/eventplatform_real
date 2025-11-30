'use client'

import { useState } from 'react'
import { getLineLoginUrl } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email' | 'google'
type RegisterMethod = 'line' | 'email' | 'google'

// LINEアイコン（SVG）- Figmaからコピー
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_46_28)">
      <mask id="mask0_46_28" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
        <path d="M32 0H0V32H32V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_46_28)">
        <path d="M25.82 13.1507C26.0372 13.1593 26.2426 13.2517 26.3932 13.4084C26.5437 13.5651 26.6278 13.774 26.6278 13.9913C26.6278 14.2087 26.5437 14.4176 26.3932 14.5743C26.2426 14.731 26.0372 14.8233 25.82 14.832H23.48V16.332H25.82C25.933 16.3275 26.0458 16.3459 26.1516 16.386C26.2573 16.4262 26.3539 16.4873 26.4355 16.5656C26.517 16.644 26.5819 16.7381 26.6263 16.8422C26.6706 16.9462 26.6935 17.0582 26.6935 17.1713C26.6935 17.2845 26.6706 17.3964 26.6263 17.5005C26.5819 17.6046 26.517 17.6986 26.4355 17.777C26.3539 17.8554 26.2573 17.9165 26.1516 17.9566C26.0458 17.9968 25.933 18.0152 25.82 18.0107H22.6387C22.4168 18.0096 22.2044 17.9208 22.0478 17.7637C21.8911 17.6066 21.803 17.3939 21.8027 17.172V10.8107C21.8027 10.3507 22.1787 9.97066 22.6427 9.97066H25.824C26.0468 9.9712 26.2602 10.0602 26.4174 10.2181C26.5745 10.376 26.6625 10.5899 26.662 10.8127C26.6615 11.0354 26.5725 11.2489 26.4146 11.406C26.2567 11.5632 26.0428 11.6512 25.82 11.6507H23.48V13.1507H25.82ZM20.68 17.172C20.6789 17.3943 20.5898 17.6072 20.4321 17.7639C20.2744 17.9206 20.061 18.0084 19.8387 18.008C19.707 18.0106 19.5765 17.9818 19.4583 17.9238C19.34 17.8658 19.2373 17.7804 19.1587 17.6747L15.9013 13.252V17.172C15.8867 17.3842 15.792 17.583 15.6365 17.7282C15.4809 17.8733 15.2761 17.9541 15.0633 17.9541C14.8506 17.9541 14.6458 17.8733 14.4902 17.7282C14.3347 17.583 14.24 17.3842 14.2253 17.172V10.8107C14.225 10.5894 14.3124 10.377 14.4683 10.2201C14.6243 10.0631 14.8361 9.97439 15.0573 9.97333C15.3173 9.97333 15.5573 10.112 15.7173 10.312L19 14.752V10.8107C19 10.3507 19.376 9.97066 19.84 9.97066C20.3 9.97066 20.68 10.3507 20.68 10.8107V17.172ZM13.0253 17.172C13.0252 17.2823 13.0033 17.3915 12.9609 17.4934C12.9185 17.5952 12.8565 17.6877 12.7784 17.7656C12.7002 17.8435 12.6075 17.9052 12.5056 17.9472C12.4036 17.9893 12.2943 18.0108 12.184 18.0107C11.9621 18.0096 11.7497 17.9208 11.5931 17.7637C11.4365 17.6066 11.3483 17.3939 11.348 17.172V10.8107C11.348 10.3507 11.724 9.97066 12.188 9.97066C12.6493 9.97066 13.0253 10.3507 13.0253 10.8107V17.172ZM9.73733 18.0107H6.556C6.33388 18.0093 6.12123 17.9205 5.96404 17.7636C5.80685 17.6066 5.71775 17.3941 5.716 17.172V10.8107C5.716 10.3507 6.096 9.97066 6.556 9.97066C7.02 9.97066 7.396 10.3507 7.396 10.8107V16.332H9.73733C9.95415 16.3406 10.1592 16.4329 10.3096 16.5893C10.4599 16.7458 10.5439 16.9543 10.5439 17.1713C10.5439 17.3883 10.4599 17.5969 10.3096 17.7534C10.1592 17.9098 9.95415 18.002 9.73733 18.0107ZM32 13.752C32 6.59067 24.82 0.762665 16 0.762665C7.18 0.762665 0 6.59067 0 13.752C0 20.1667 5.69333 25.5413 13.38 26.5627C13.9013 26.672 14.6107 26.9067 14.7907 27.3493C14.9507 27.7507 14.896 28.3707 14.8413 28.7893L14.6227 30.1493C14.5627 30.5507 14.3027 31.7307 16.0213 31.0093C17.7427 30.2907 25.2427 25.572 28.6027 21.7093C30.9013 19.1907 32 16.6107 32 13.752Z" fill="white"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_46_28">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）- 白背景用
const MailIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  

  const handleLineLogin = () => {
    try {
      console.log('[WelcomeScreen] LINE Login button clicked')
      const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] LINE Login URL generated, redirecting to:', loginUrl.replace(/state=[^&]+/, 'state=***'))
      window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLineLogin:', error)
      setError('LINEログインのURL生成に失敗しました。もう一度お試しください。')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('[WelcomeScreen] Google Login button clicked')
      setLoading(true)
      setError('')

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('[WelcomeScreen] Google Login error:', error)
        setError('Googleログインに失敗しました。もう一度お試しください。')
        setLoading(false)
      } else if (data.url) {
        // リダイレクトURLに遷移
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleGoogleLogin:', error)
      setError('GoogleログインのURL生成に失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // セッションストレージに保存（既存のLINE Loginと同じ形式）
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        
        // ページをリロードして認証状態を反映
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Email login error:', err)
      setError(err.message || 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (registerPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      // メール確認用のリダイレクトURLを設定
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '') // 末尾のスラッシュを削除
      const redirectUrl = `${appUrl}/auth/verify-email`
      console.log('[WelcomeScreen] Email registration - redirectUrl:', redirectUrl)
      console.log('[WelcomeScreen] Email registration - window.location.origin:', window.location.origin)
      console.log('[WelcomeScreen] Email registration - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
      console.log('[WelcomeScreen] Email registration - email:', registerEmail)
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('[WelcomeScreen] SignUp response:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at,
        hasSession: !!data.session,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      })
      
      // メール送信の状態を確認
      if (data.user && !data.session) {
        console.log('[WelcomeScreen] ⚠️ Email confirmation required but no session - email should be sent')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Users to verify user creation')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      } else if (data.user && data.session) {
        console.log('[WelcomeScreen] ⚠️ Session exists - email confirmation may be disabled')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      }

      if (error) {
        console.error('[WelcomeScreen] SignUp error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        })
        
        // 既存のメールアドレスの場合のエラーハンドリング
        if (error.message?.includes('already registered') || error.message?.includes('already exists') || error.status === 422) {
          setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
          setLoading(false)
          return
        }
        
        throw error
      }

      if (data.user) {
        console.log('[WelcomeScreen] User created successfully:', {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          hasSession: !!data.session,
          createdAt: data.user.created_at
        })
        
        // セッションが存在する場合（メール確認が無効）、すぐに登録フォームに進める
        // セッションが存在しない場合（メール確認が必要）、メール確認待ち画面を表示
        if (data.session) {
          console.log('[WelcomeScreen] Session exists - email confirmation disabled, proceeding to registration')
          // セッションストレージに保存
          sessionStorage.setItem('auth_type', 'email')
          sessionStorage.setItem('user_id', data.user.id)
          sessionStorage.setItem('user_email', data.user.email || '')
          sessionStorage.setItem('email_confirmed', 'true') // メール確認が無効なのでtrueとして扱う
          
          // ページをリロードして認証状態を反映
          window.location.reload()
          return
        }
        
        // メール確認が必要な場合（data.sessionが存在しない）
        console.log('[WelcomeScreen] Email confirmation required - no session, showing email confirmation pending screen')
        
        // セッションをクリア（メール確認が必要な場合）
        await supabase.auth.signOut()
        
        // user_idを保存（メール確認後に使用するため）
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        sessionStorage.setItem('email_confirmed', 'false') // メール確認が必要なのでfalse
        
        // メール確認待ち画面を表示するため、ページをリロード
        setError('')
        window.location.reload()
      } else {
        console.error('[WelcomeScreen] SignUp succeeded but no user data returned')
        setError('ユーザー登録に失敗しました。もう一度お試しください。')
      }
    } catch (err: any) {
      console.error('[WelcomeScreen] Email register error:', {
        message: err.message,
        status: err.status,
        name: err.name,
        stack: err.stack
      })
      
      // 既存のメールアドレスの場合のエラーハンドリング
      if (err.message?.includes('already registered') || err.message?.includes('already exists') || err.status === 422) {
        setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
      } else {
        setError(err.message || '登録に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#FFFFFF'
    }}>
      {/* タイトル */}
      <div style={{
        position: 'absolute',
        width: '333px',
        height: '96px',
        left: '30px',
        top: '32px',
        fontFamily: '"Noto Sans JP", sans-serif',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '48px',
        textAlign: 'center',
        color: '#000000'
      }}>
        キッチンカー・屋台の<br />イベントを探すなら
      </div>

      {/* ロゴプレースホルダー */}
      <div style={{
        position: 'absolute',
        width: '256px',
        height: '256px',
        left: '69px',
        top: '144px',
        background: '#D9D9D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '48px',
          textAlign: 'center',
          color: '#000000'
        }}>
          将来的にロゴ
        </div>
      </div>

      {/* 初期画面：ログイン or 新規登録を選択 */}
      {authMode === 'initial' && (
        <>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* LINEログインボタン */}
          <button
            onClick={handleLineLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '456px',
              background: '#06C755',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <LineIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>LINE</span>
          </button>

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '520.5px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <GoogleIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>Google</span>
          </button>

          {/* メールアドレスログインボタン */}
          <button
            onClick={() => setLoginMethod('email')}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '584px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <MailIcon color="#000000" />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 新規登録ボタン */}
          <button
            onClick={() => setAuthMode('register')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684.5px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            新規登録
          </button>
        </>
      )}

      {/* ログイン方法選択 */}
      {authMode === 'login' && !loginMethod && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                ログイン
              </h2>
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setLoginMethod(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* LINEでログイン */}
              <button
                onClick={handleLineLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <LineIcon />
                <span>LINEでログイン</span>
              </button>
              
              {/* Googleでログイン */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <GoogleIcon />
                <span>{loading ? '読み込み中...' : 'Googleでログイン'}</span>
              </button>
              
              {/* メールアドレスでログイン */}
              {(
                <button
                  onClick={() => setLoginMethod('email')}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 24px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '24px',
                    color: '#000000',
                    cursor: 'pointer'
                  }}
                >
                  <MailIcon color="#000000" />
                  <span>メールアドレスでログイン</span>
                </button>
              )}
            </div>
          </div>
        )}

      {/* メールアドレスでログイン */}
      {authMode === 'login' && loginMethod === 'email' && (
        <form onSubmit={handleEmailLogin}>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* メールアドレス入力フィールド */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '12px 16px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '456px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#999999'
            }}
            placeholder="入力してください"
          />

          {/* パスワード入力フィールド */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '12px 16px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '520px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#999999'
            }}
            placeholder="入力してください"
          />

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '584px',
              background: loading ? '#CCCCCC' : '#06C755',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 別の方法でログインボタン */}
          <button
            type="button"
            onClick={() => {
              setLoginMethod(null)
              setError('')
              setEmail('')
              setPassword('')
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            別の方法でログイン
          </button>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              position: 'absolute',
              top: '750px',
              left: '53px',
              width: '288px',
              padding: '12px',
              background: '#FFEBEE',
              borderRadius: '8px'
            }}>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '14px',
                color: '#C62828',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}
        </form>
      )}

      {/* 新規登録方法選択 */}
      {authMode === 'register' && !registerMethod && (
        <>
          {/* 新規登録セクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            新規登録
          </div>

          {/* LINEログインボタン */}
          <button
            onClick={handleLineLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '456px',
              background: '#06C755',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 10
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <LineIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>LINE</span>
          </button>

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '520.5px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 10
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <GoogleIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>Google</span>
          </button>

          {/* メールアドレスログインボタン */}
          <button
            onClick={() => setRegisterMethod('email')}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '584px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 10
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <MailIcon color="#000000" />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF',
            zIndex: 2
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000',
            zIndex: 2
          }}>
            または
          </div>

          {/* ログインボタン */}
          <button
            onClick={() => setAuthMode('initial')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684.5px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            ログイン
          </button>
        </>
      )}

      {/* メールアドレスで新規登録 */}
      {authMode === 'register' && registerMethod === 'email' && (
        <>
          {/* タイトル */}
          <div style={{
            position: 'absolute',
            width: '333px',
            height: '96px',
            left: '30px',
            top: '32px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            キッチンカー・屋台の<br />イベントを探すなら
          </div>

          {/* ロゴプレースホルダー */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '256px',
            left: '69px',
            top: '144px',
            background: '#D9D9D9'
          }} />
          <div style={{
            position: 'absolute',
            width: '192px',
            height: '48px',
            left: '101px',
            top: '248px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            将来的にロゴ
          </div>

          {/* 新規登録セパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            新規登録
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              position: 'absolute',
              width: '288px',
              left: '53px',
              top: '440px',
              padding: '8px',
              background: '#FFEBEE',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              color: '#C62828',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <form onSubmit={handleEmailRegister}>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '456px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerEmail ? '#000000' : '#999999'
              }}
              placeholder="入力してください"
            />

            {/* パスワード入力フィールド */}
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              minLength={6}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '520px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerPassword ? '#000000' : '#999999'
              }}
              placeholder="入力してください"
            />

            {/* 新規登録ボタン */}
            <button
              type="submit"
              disabled={loading}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '584px',
                background: loading ? '#CCCCCC' : '#06C755',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '登録中...' : '新規登録'}
            </button>
          </form>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 別の方法で新規登録ボタン */}
          <button
            onClick={() => {
              setRegisterMethod(null)
              setError('')
              setRegisterEmail('')
              setRegisterPassword('')
              setRegisterPasswordConfirm('')
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            別の方法で新規登録
          </button>
        </>
      )}
    </div>
  )
}
