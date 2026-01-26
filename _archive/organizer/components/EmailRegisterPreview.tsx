'use client'

import { useState } from 'react'

export default function EmailRegisterPreview() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        {/* ロゴ */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#FF8A5C',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }} />
        </div>

        {/* タイトルとサブタイトル */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <h1 style={{
            margin: '0 0 8px',
            fontSize: '24px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            デミセル
          </h1>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            主催者向けプラットフォーム
          </p>
        </div>

        {/* 新規登録テキスト */}
        <div style={{
          marginBottom: '32px',
          position: 'relative',
          paddingBottom: '16px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '16px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 600, // Semi Bold
            color: '#FF8A5C', // Primary Main
            textAlign: 'center'
          }}>
            新規登録
          </p>
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
        </div>

        <div>
          {/* エラーメッセージ */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '14px 18px',
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>!</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#991b1b',
                fontWeight: 500,
                lineHeight: 1.5
              }}>{error}</p>
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <label style={{
            display: 'block',
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50', // Gray Dark
            marginBottom: '8px'
          }}>
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              height: '44px',
              padding: '0 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB', // Gray Border
              borderRadius: '8px',
              fontSize: '15px',
              lineHeight: '44px',
              color: email ? '#2C3E50' : '#6C757D', // Gray Dark / Gray
              marginBottom: '20px',
              boxSizing: 'border-box',
              fontFamily: '"Inter", sans-serif'
            }}
            placeholder="example@email.com"
          />

          {/* パスワード入力フィールド */}
          <label style={{
            display: 'block',
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50', // Gray Dark
            marginBottom: '8px'
          }}>
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              height: '44px',
              padding: '0 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB', // Gray Border
              borderRadius: '8px',
              fontSize: '15px',
              lineHeight: '44px',
              color: password ? '#2C3E50' : '#6C757D', // Gray Dark / Gray
              marginBottom: '24px',
              boxSizing: 'border-box',
              fontFamily: '"Inter", sans-serif'
            }}
            placeholder="6文字以上"
          />

          {/* ボタン（縦並び） */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 新規登録ボタン */}
            <button
              type="button"
              disabled={loading}
              style={{
                width: '100%',
                height: '52px',
                padding: '0',
                background: loading ? '#CCCCCC' : '#FF8A5C', // Primary Main
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: '"Inter", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '52px',
                textAlign: 'center',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Shadow MD
              }}
            >
              {loading ? '登録中...' : '新規登録'}
            </button>

            {/* 別の方法ボタン */}
            <button
              type="button"
              style={{
                width: '100%',
                height: '52px',
                padding: '0',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB', // Gray Border
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: '"Inter", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700, // Bold
                lineHeight: '52px',
                textAlign: 'center',
                color: '#6C757D', // Gray
                cursor: 'pointer',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // Shadow SM
              }}
            >
              別の方法
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

