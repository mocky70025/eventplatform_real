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

// LINEアイコン（SVG）
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.27l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="#00C300"/>
  </svg>
)

// メールアイコン（SVG）
const MailIcon = ({ color = '#000000' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function SellerInitialRegisterPreview() {
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
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
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
        {/* ロゴ */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#5DABA8', // Secondary Main（出店者用）
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }} />
        </div>

        {/* タイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#2C3E50'
          }}>
            デミセル
          </h1>
        </div>

        {/* サブタイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#6C757D'
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* タブ */}
        <div style={{
          display: 'flex',
          position: 'relative',
          marginBottom: '32px',
          paddingBottom: '16px'
        }}>
          <button style={{
            flex: 1,
            padding: '16px 0',
            background: 'transparent',
            border: 'none',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#666666',
            cursor: 'pointer'
          }}>
            ログイン
          </button>
          <button style={{
            flex: 1,
            padding: '16px 0',
            background: 'transparent',
            border: 'none',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600,
            color: '#5DABA8', // Secondary Main（出店者用）
            cursor: 'pointer',
            position: 'relative'
          }}>
            新規登録
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '2px',
              background: '#5DABA8',
              borderRadius: '1px 1px 0 0'
            }} />
          </button>
        </div>

        {/* ボタン */}
        <div>
          {/* LINEボタン */}
          <button style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 24px',
            background: '#00C300', // LINE Green
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '16px'
          }}>
            <div style={{ position: 'absolute', left: '24px' }}>
              <LineIcon />
            </div>
            <span>LINE</span>
          </button>

          {/* Googleボタン */}
          <button style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 24px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            fontSize: '16px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            color: '#1A1A1A',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            marginBottom: '16px'
          }}>
            <div style={{ position: 'absolute', left: '24px' }}>
              <GoogleIcon />
            </div>
            <span>Google</span>
          </button>

          {/* メールアドレスボタン */}
          <button style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 24px',
            background: '#5DABA8', // Secondary Main（出店者用）
            borderRadius: '12px',
            border: 'none',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
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

