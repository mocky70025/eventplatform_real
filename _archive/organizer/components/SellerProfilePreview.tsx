'use client'

import React from 'react'

export default function SellerProfilePreview() {
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
          プロフィール
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
      {/* フォーム */}
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
        {/* タイトル */}
        <h2 style={{
          margin: '0 0 24px',
          fontSize: '20px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          情報を確認してください
        </h2>

        {/* お名前 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          お名前
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          山田太郎
        </p>

        {/* 性別 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          性別
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          男性
        </p>

        {/* 年齢 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          年齢
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          35
        </p>

        {/* 電話番号 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          電話番号
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          090-1234-5678
        </p>

        {/* メールアドレス */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          メールアドレス
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          example@email.com
        </p>

        {/* ジャンル */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          ジャンル
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          飲食
        </p>

        {/* ジャンル（自由回答） */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          ジャンル（自由回答）
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          焼きそば
        </p>

        {/* ステータスバッジ */}
        <div style={{
          background: '#A8D5BA', // System Success
          borderRadius: '8px',
          padding: '9px 16px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
            </svg>
            <span style={{
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: 'white'
            }}>
              有効
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: 'white'
          }}>
            期限: 2025/12/31
          </p>
        </div>

        {/* 営業許可証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          営業許可証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          background: '#D9D9D9',
          borderRadius: '8px',
          marginBottom: '24px'
        }} />

        {/* 車検証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          車検証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          background: '#D9D9D9',
          borderRadius: '8px',
          marginBottom: '24px'
        }} />

        {/* 自動車検査証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          自動車検査証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          background: '#D9D9D9',
          borderRadius: '8px',
          marginBottom: '24px'
        }} />

        {/* PL保険 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          PL保険
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          background: '#D9D9D9',
          borderRadius: '8px',
          marginBottom: '24px'
        }} />

        {/* 火器類配置図 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          火器類配置図
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          background: '#D9D9D9',
          borderRadius: '8px',
          marginBottom: '32px'
        }} />

        {/* 編集するボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: '#5DABA8', // Secondary Main（出店者用）
          borderRadius: '12px',
          border: 'none',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          編集する
        </button>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

