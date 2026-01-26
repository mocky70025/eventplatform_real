'use client'

import React from 'react'

export default function SellerNotificationPreview() {
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
          通知
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
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
      {/* コンテンツエリア */}
      <div style={{
        width: '100%'
      }}>
      {/* 通知リスト */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box'
      }}>
        {/* 通知1: 申し込みが承認されました */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          border: '1px solid #FF8A5C',
          position: 'relative'
        }}>
          {/* 未読ドット */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#FF8A5C'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#5DABA8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C8.9 2 8 2.9 8 4V5.5C6.9 5.5 6 6.4 6 7.5V14.5C6 15.6 6.9 16.5 8 16.5H12C13.1 16.5 14 15.6 14 14.5V7.5C14 6.4 13.1 5.5 12 5.5V4C12 2.9 11.1 2 10 2ZM10 3.5C10.3 3.5 10.5 3.7 10.5 4V5.5H9.5V4C9.5 3.7 9.7 3.5 10 3.5ZM8.5 7H11.5V14H8.5V7Z" fill="white"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#2C3E50'
              }}>
                申し込みが承認されました
              </h3>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                「夏祭りイベント2024」への申し込み
              </p>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                が承認されました。
              </p>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                2時間前
              </p>
            </div>
          </div>
        </div>

        {/* 通知2: 新着イベントが追加されました */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          border: '1px solid #FF8A5C',
          position: 'relative'
        }}>
          {/* 未読ドット */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#FF8A5C'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#5DABA8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="12" height="12" rx="2" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#2C3E50'
              }}>
                新着イベントが追加されました
              </h3>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                「秋のグルメフェスタ」があなたの
              </p>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                エリアで開催されます。
              </p>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                1日前
              </p>
            </div>
          </div>
        </div>

        {/* 通知3: 書類の確認が完了しました */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          border: '1px solid #E9ECEF'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#5DABA8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 5.5L7.5 14.5L3.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#2C3E50'
              }}>
                書類の確認が完了しました
              </h3>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                営業許可証の確認が完了し、出店が
              </p>
              <p style={{
                margin: '0 0 4px',
                fontSize: '13px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D',
                lineHeight: '1.5'
              }}>
                可能になりました。
              </p>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                3日前
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

