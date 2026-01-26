'use client'

import { useState } from 'react'

export default function SellerEmailConfirmationPreview() {
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
        {/* ヘッダー（ロゴ、タイトル、サブタイトル） */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          {/* ロゴ */}
          <div style={{
            width: '64px',
            height: '64px',
            background: '#5DABA8', // Secondary Main（出店者用）
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            margin: '0 auto 12px'
          }} />
          {/* タイトル */}
          <h1 style={{
            margin: '0 0 8px',
            fontSize: '24px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            デミセル
          </h1>
          {/* サブタイトル */}
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* メインコンテンツ */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          {/* メインタイトル */}
          <h2 style={{
            margin: '0 0 16px',
            fontSize: '24px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            メールを送信しました
          </h2>
          
          {/* 説明文 */}
          <p style={{
            margin: '0 0 4px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5
          }}>
            確認メールを送信しました
          </p>
          <p style={{
            margin: '0 0 4px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5
          }}>
            メール内のリンクをクリックして
          </p>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5
          }}>
            登録を完了してください
          </p>
        </div>

        {/* メールが届かない場合のセクション */}
        <div style={{
          background: '#F8F9FA',
          border: '1px solid #E9ECEF',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            margin: '0 0 12px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50',
            textAlign: 'center'
          }}>
            メールが届かない場合
          </h3>
          <p style={{
            margin: '0 0 8px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            迷惑メールフォルダをご確認ください
          </p>
          <p style={{
            margin: '0 0 8px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            それでもメールを確認できない場合
          </p>
          <p style={{
            margin: 0,
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D',
            lineHeight: 1.5,
            textAlign: 'center'
          }}>
            再送信ボタンを押してください
          </p>
        </div>

        {/* 再送信ボタン */}
        <button
          type="button"
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            padding: '0',
            background: loading ? '#CCCCCC' : '#5DABA8', // Secondary Main（出店者用）
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '52px',
            textAlign: 'center',
            color: '#FFFFFF',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 200ms ease'
          }}
        >
          {loading ? '送信中...' : 'メール再送信'}
        </button>
      </div>
      </div>
    </div>
  )
}

