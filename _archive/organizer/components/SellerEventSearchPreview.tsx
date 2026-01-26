'use client'

import React from 'react'

export default function SellerEventSearchPreview() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        maxWidth: '393px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        flexShrink: 0,
        height: '64px',
        background: '#5DABA8', // Secondary Main（出店者用）
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white'
        }}>
          イベント検索
        </h1>
        <button style={{
          position: 'absolute',
          left: '16px',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          padding: 0,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          &lt;
        </button>
      </div>

      <div style={{
        width: '100%',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
      {/* コンテンツエリア */}
      <div style={{
        width: '100%'
      }}>
      {/* 検索フォーム */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* キーワード */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            キーワード
          </label>
          <input
            type="text"
            placeholder="イベント名、会場名など"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#2C3E50',
              background: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 開催期間（開始） */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            開催期間（開始）
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="年/月/日"
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: '1px solid #E9ECEF',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#2C3E50',
                background: 'white',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6C757D',
              cursor: 'pointer'
            }}>
              +
            </div>
          </div>
        </div>

        {/* 開催期間（終了） */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            開催期間（終了）
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="年/月/日"
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: '1px solid #E9ECEF',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#2C3E50',
                background: 'white',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6C757D',
              cursor: 'pointer'
            }}>
              +
            </div>
          </div>
        </div>

        {/* 都道府県 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            都道府県
          </label>
          <div style={{ position: 'relative' }}>
            <select
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: '1px solid #E9ECEF',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#2C3E50',
                background: 'white',
                boxSizing: 'border-box',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">選択してください</option>
            </select>
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 市区町村 */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            市区町村
          </label>
          <input
            type="text"
            placeholder="例: 静岡市"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#2C3E50',
              background: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 検索するボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: '#5DABA8', // Secondary Main（出店者用）
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          marginBottom: '16px'
        }}>
          検索する
        </button>

        {/* 条件をクリアボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#6C757D',
          cursor: 'pointer'
        }}>
          条件をクリア
        </button>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

