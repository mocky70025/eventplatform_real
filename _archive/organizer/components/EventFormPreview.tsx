'use client'

import React, { useState } from 'react'

export default function EventFormPreview() {
  const [eventName, setEventName] = useState('')
  const [eventNameKana, setEventNameKana] = useState('')
  const [genre, setGenre] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')

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
          src="/progress-bar.svg"
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
          イベント情報を入力してください
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
        <input
          type="text"
          placeholder="例: 静岡フリーマーケット"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

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
        <input
          type="text"
          placeholder="例: シズオカフリーマーケット"
          value={eventNameKana}
          onChange={(e) => setEventNameKana(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

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
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              color: '#6C757D',
              appearance: 'none',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">選択してください</option>
            <option value="food">飲食</option>
            <option value="craft">手工芸</option>
            <option value="other">その他</option>
          </select>
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 0.75L4 4.25L7.25 0.75" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

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
        <input
          type="text"
          placeholder="例: 10:00~19:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

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
        <input
          type="text"
          placeholder="例: 総合公園"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '32px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

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

