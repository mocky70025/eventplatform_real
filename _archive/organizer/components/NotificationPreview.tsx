'use client'

import React from 'react'

export default function NotificationPreview() {
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
        width: '100%',
        maxWidth: '353px'
      }}>
      {/* 通知リスト */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 通知1 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
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
              background: '#FF8A5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L2 7V9C2 13.55 5.16 17.74 10 19C14.84 17.74 18 13.55 18 9V7L10 2Z" fill="white"/>
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
                出店の申し込みがあります
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
                「夏祭りイベント2024」への申し込みがあります。
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

        {/* 通知2 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
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
              background: '#FFD88A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L2 7V9C2 13.55 5.16 17.74 10 19C14.84 17.74 18 13.55 18 9V7L10 2Z" fill="white"/>
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
                新規イベントが承認されました
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
                「秋のグルメフェスタ」が承認されました。
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

        {/* 通知3 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
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
                <path d="M10 2L2 7V9C2 13.55 5.16 17.74 10 19C14.84 17.74 18 13.55 18 9V7L10 2Z" fill="white"/>
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
                イベント掲載が許可されました
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
                運営があなたを承認したため、イベントの掲載が可能になりました。
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

