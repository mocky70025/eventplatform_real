'use client'

import React from 'react'
import ProgressBar from './ProgressBar'

export default function SellerRegistrationConfirmationPreview() {
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
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
      {/* プログレスバー */}
      <div style={{
        width: '100%',
        height: '93px',
        marginTop: '32px',
        marginBottom: '16px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <ProgressBar currentStep={2} totalSteps={3} />
      </div>

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

        {/* 営業許可証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          営業許可証
        </label>
        <div style={{
          background: '#D9D9D9',
          borderRadius: '8px',
          height: '187px',
          marginBottom: '12px'
        }} />
        
        {/* 有効期限表示 */}
        <div style={{
          background: '#A8D5BA',
          borderRadius: '8px',
          padding: '9px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: '#A8D5BA', fontSize: '16px', fontWeight: 700 }}>✓</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>有効</p>
            <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>期限: 2025/12/31</p>
          </div>
        </div>

        {/* 車検証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          車検証
        </label>
        <div style={{
          background: '#D9D9D9',
          borderRadius: '8px',
          height: '187px',
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          自動車検査証
        </label>
        <div style={{
          background: '#D9D9D9',
          borderRadius: '8px',
          height: '187px',
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          PL保険
        </label>
        <div style={{
          background: '#D9D9D9',
          borderRadius: '8px',
          height: '187px',
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          火器類配置図
        </label>
        <div style={{
          background: '#D9D9D9',
          borderRadius: '8px',
          height: '187px',
          marginBottom: '24px'
        }} />

        {/* 次へ進むボタン */}
        <button
          type="button"
          style={{
            width: '100%',
            height: '52px',
            padding: '0',
            background: '#5DABA8', // Secondary Main（出店者用）
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '52px',
            textAlign: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 200ms ease'
          }}
        >
          <span>次へ進む</span>
          <span style={{ fontSize: '12px' }}>›</span>
        </button>
      </div>
      </div>
    </div>
  )
}

