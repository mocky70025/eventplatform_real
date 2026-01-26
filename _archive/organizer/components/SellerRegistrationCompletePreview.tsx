'use client'

import React from 'react'
import ProgressBar from './ProgressBar'

export default function SellerRegistrationCompletePreview() {
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
        <ProgressBar currentStep={3} totalSteps={3} />
      </div>

      {/* コンテンツ */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* チェックマークアイコン */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#5DABA8', // Secondary Main（出店者用）
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{
          margin: '0 0 16px',
          fontSize: '24px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          登録完了
        </h1>
        <p style={{
          margin: '0 0 32px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          出店者登録が完了しました
        </p>

        {/* ホームへ戻るボタン */}
        <button style={{
          width: '100%',
          height: '52px',
          padding: '0',
          background: '#5DABA8', // Secondary Main（出店者用）
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '52px',
          textAlign: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          ホームへ戻る
        </button>
      </div>
      </div>
    </div>
  )
}

