'use client'

import React from 'react'

export default function EventConfirmationPreview() {
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
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
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
        <img
          src="/progress-bar-confirmation.svg"
          alt="進捗バー"
          style={{
            width: '100%',
            height: '61px',
            display: 'block',
            objectFit: 'contain'
          }}
        />
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
          イベント情報を確認してください
        </h2>

        {/* イベント名 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          イベント名
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          静岡フリーマーケット
        </p>

        {/* イベント名フリガナ */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          イベント名フリガナ
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          シズオカフリーマーケット
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
          その他
        </p>

        {/* イベント日程 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          イベント日程
        </label>
        <p style={{
          margin: '0 0 4px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          2026年2月5日
        </p>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          2026年2月6日
        </p>

        {/* イベント開催時間 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          イベント開催時間
        </label>
        <p style={{
          margin: '0 0 4px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          10:00~19:00
        </p>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          10:00~19:00
        </p>

        {/* 会場名 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          会場名
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          総合公園
        </p>

        {/* 次へ進むボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: '#FF8A5C', // Primary Default
          borderRadius: '12px',
          border: 'none',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>次へ進む</span>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L6.5 5L1.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      </div>
    </div>
  )
}

