'use client'

import React from 'react'

export default function EventDetailPreview() {
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
        background: 'linear-gradient(180deg, #FF8A5C 0%, #FF7840 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
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
        background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
      {/* コンテンツエリア */}
      <div style={{
        width: '100%'
      }}>
      {/* イベント詳細 */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        boxSizing: 'border-box'
      }}>
        {/* カテゴリ */}
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: '#FF8A5C',
          borderRadius: '12px',
          fontSize: '12px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          marginBottom: '12px'
        }}>
          祭り・イベント
        </div>

        {/* タイトル */}
        <h1 style={{
          margin: '0 0 16px',
          fontSize: '24px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          夏祭りイベント2024
        </h1>

        {/* 日時 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2H11V1H9V2H7V1H5V2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H12C13.1 16 14 15.1 14 14V4C14 2.9 13.1 2 12 2ZM12 14H4V8H12V14ZM12 6H4V4H12V6Z" fill="#2C3E50"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            2024年7月20日 - 7月21日
          </p>
        </div>

        {/* 時間 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2ZM8 13C5.24 13 3 10.76 3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13ZM8.5 5H7.5V8.5L10.5 10.5L11.25 9.5L8.5 8V5Z" fill="#2C3E50"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            10:00 - 20:00
          </p>
        </div>

        {/* 場所 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C4.13 0 1 3.13 1 7C1 12.25 8 16 8 16C8 16 15 12.25 15 7C15 3.13 11.87 0 8 0ZM8 9.5C6.62 9.5 5.5 8.38 5.5 7C5.5 5.62 6.62 4.5 8 4.5C9.38 4.5 10.5 5.62 10.5 7C10.5 8.38 9.38 9.5 8 9.5Z" fill="#2C3E50"/>
          </svg>
          <div>
            <p style={{
              margin: '0 0 2px',
              fontSize: '14px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#2C3E50'
            }}>
              静岡市民広場
            </p>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              静岡県静岡市葵区追手町1-1
            </p>
          </div>
        </div>

        {/* イベント概要 */}
        <h2 style={{
          margin: '0 0 12px',
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          イベント概要
        </h2>
        <p style={{
          margin: '0 0 8px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D',
          lineHeight: '1.6'
        }}>
          地域最大級の夏祭りイベント！
        </p>
        <p style={{
          margin: '0 0 8px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D',
          lineHeight: '1.6'
        }}>
          毎年5万人以上が来場する人気イベントです。
        </p>
        <p style={{
          margin: '0 0 24px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D',
          lineHeight: '1.6'
        }}>
          多彩なジャンルの出店を募集しています。
        </p>

        {/* 詳細情報 */}
        <h2 style={{
          margin: '0 0 12px',
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          詳細情報
        </h2>
        <div style={{
          borderTop: '1px solid #E9ECEF',
          paddingTop: '12px',
          marginBottom: '12px'
        }}>
          <p style={{
            margin: '0 0 4px',
            fontSize: '13px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#6C757D'
          }}>
            申込期間
          </p>
          <p style={{
            margin: '0 0 12px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            2024年6月1日 - 7月10日
          </p>
        </div>
        <div style={{
          borderTop: '1px solid #E9ECEF',
          paddingTop: '12px',
          marginBottom: '12px'
        }}>
          <p style={{
            margin: '0 0 4px',
            fontSize: '13px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#6C757D'
          }}>
            出店料
          </p>
          <p style={{
            margin: '0 0 12px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            ¥10,000 / 1日
          </p>
        </div>
        <div style={{
          borderTop: '1px solid #E9ECEF',
          paddingTop: '12px',
          marginBottom: '24px'
        }}>
          <p style={{
            margin: '0 0 4px',
            fontSize: '13px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#6C757D'
          }}>
            募集区画数
          </p>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            30区画
          </p>
        </div>

        {/* お問い合わせ */}
        <h2 style={{
          margin: '0 0 12px',
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          お問い合わせ
        </h2>
        <div style={{
          borderTop: '1px solid #E9ECEF',
          paddingTop: '12px',
          marginBottom: '24px'
        }}>
          <p style={{
            margin: '0 0 4px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            主催者: 静岡市観光協会
          </p>
          <p style={{
            margin: '0 0 4px',
            fontSize: '14px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            TEL: 054-123-4567
          </p>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            event@shizuoka-kanko.jp
          </p>
        </div>

        {/* 編集ボタン */}
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
          このイベントを編集する
        </button>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

