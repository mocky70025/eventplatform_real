'use client'

import { useState } from 'react'

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）
const MailIcon = ({ color = '#000000' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function InitialRegisterPreview() {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        flexShrink: 0,
        background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
      {/* 白いカード（基盤） */}
      <div style={{
        width: '353px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Shadow LG
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        {/* ヘッダー（ロゴ、タイトル、サブタイトル） */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          {/* ロゴ */}
          <div style={{
            width: '64px',
            height: '64px',
            background: '#FF8A5C',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            margin: '0 auto 12px'
          }} />
          {/* タイトル */}
          <h1 style={{
            margin: '0 0 8px',
            fontSize: '24px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50',
            lineHeight: 'normal'
          }}>
            デミセル
          </h1>
          {/* サブタイトル */}
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 'normal'
          }}>
            主催者向けプラットフォーム
          </p>
        </div>

        {/* タブ切り替え */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            position: 'relative'
          }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '16px 0',
                background: 'transparent',
                border: 'none',
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400, // Regular（非アクティブ時）
                color: '#666666', // Gray
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 200ms ease'
              }}
            >
              ログイン
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '16px 0',
                background: 'transparent',
                border: 'none',
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600, // Semi Bold（アクティブ時）
                color: '#FF8A5C', // Primary Main
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 200ms ease'
              }}
            >
              新規登録
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '2px',
                background: '#FF8A5C', // Primary Main
                borderRadius: '1px 1px 0 0'
              }} />
            </button>
          </div>
        </div>

        {/* 新規登録セクション */}
        <div>
          {/* Google新規登録ボタン */}
          <button
            type="button"
            disabled={loading}
            style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #E5E7EB', // Gray Border
              fontSize: '16px',
              fontWeight: 600,
              color: '#1A1A1A', // Gray Dark
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Shadow SM
              marginBottom: '16px',
              fontFamily: '"Inter", sans-serif',
              lineHeight: '100%'
            }}
          >
            <div style={{ position: 'absolute', left: '24px' }}>
              <GoogleIcon />
            </div>
            <span>Google</span>
          </button>

          {/* メールアドレス新規登録ボタン */}
          <button
            type="button"
            disabled={loading}
            style={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              background: '#FF8A5C', // Primary Main
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              fontFamily: '"Inter", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Shadow MD
              lineHeight: '100%'
            }}
          >
            <div style={{ position: 'absolute', left: '24px' }}>
              <MailIcon color="#ffffff" />
            </div>
            <span>メールアドレス</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

