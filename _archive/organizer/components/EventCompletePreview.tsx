'use client'

import React from 'react'

export default function EventCompletePreview() {
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
          src="/progress-bar-complete.svg"
          alt="進捗バー"
          style={{
            width: '100%',
            height: '61px',
            display: 'block',
            objectFit: 'contain'
          }}
        />
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
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
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
          margin: '0 0 8px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          イベントが完了しました
        </p>
        <p style={{
          margin: '0 0 32px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          運営の承諾があり次第出店者募集を始めます
        </p>

        {/* ホームへ戻るボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: '#FF8A5C', // Primary Default
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          ホームへ戻る
        </button>
      </div>
      </div>
    </div>
  )
}

