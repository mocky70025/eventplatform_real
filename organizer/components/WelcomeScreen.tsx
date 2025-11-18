'use client'

import { getLineLoginUrl } from '@/lib/auth'

export default function WelcomeScreen() {
  const handleLogin = () => {
    try {
      console.log('[WelcomeScreen] Login button clicked')
      // LIFF環境でもWeb環境でも、常にLINE Login（OAuth）を使用
      const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] Login URL generated, redirecting...')
      window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLogin:', error)
      alert('ログインエラーが発生しました。コンソールを確認してください。')
    }
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '24px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '16px'
          }}>
            イベント主催プラットフォーム
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666',
            marginBottom: '32px'
          }}>
            イベント主催者向けプラットフォーム
          </p>
        </div>

        <button
          onClick={handleLogin}
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
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19px',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          LINEでログイン
        </button>

        <div style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '24px'
          }}>
            ご利用の流れ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                1
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>LINEアカウントでログイン</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                2
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>基本情報を登録</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                background: '#06C755',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}>
                3
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#000000'
              }}>イベントを掲載・管理</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
