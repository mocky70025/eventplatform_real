'use client'

import React from 'react'

export default function SellerApplicationManagementPreview() {
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
          申し込み管理
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
        width: '100%',
        maxWidth: '353px'
      }}>
      {/* フィルター */}
      <div style={{
        width: '100%',
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <button style={{
          flex: 1,
          padding: '8px 16px',
          background: '#5DABA8', // Secondary Main（出店者用）
          borderRadius: '8px',
          border: 'none',
          fontSize: '13px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer'
        }}>
          すべて
        </button>
        <button style={{
          flex: 1,
          padding: '8px 16px',
          background: 'transparent',
          borderRadius: '8px',
          border: 'none',
          fontSize: '13px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#6C757D',
          cursor: 'pointer'
        }}>
          承認待ち
        </button>
        <button style={{
          flex: 1,
          padding: '8px 16px',
          background: 'transparent',
          borderRadius: '8px',
          border: 'none',
          fontSize: '13px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#6C757D',
          cursor: 'pointer'
        }}>
          承認済み
        </button>
      </div>

      {/* 申し込みリスト */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 申し込み1: 承認済み */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              padding: '4px 12px',
              background: '#5DABA8', // Secondary Main（出店者用）
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'white'
            }}>
              承認済み
            </div>
          </div>
          <h3 style={{
            margin: '0 0 8px',
            fontSize: '16px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            夏祭りイベント2024
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="10" height="10" rx="1" stroke="#6C757D" strokeWidth="1.5" fill="none"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              申込日: 2024/06/15
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C4.13 0 1 3.13 1 7C1 12.25 8 16 8 16C8 16 15 12.25 15 7C15 3.13 11.87 0 8 0ZM8 9.5C6.62 9.5 5.5 8.38 5.5 7C5.5 5.62 6.62 4.5 8 4.5C9.38 4.5 10.5 5.62 10.5 7C10.5 8.38 9.38 9.5 8 9.5Z" fill="#6C757D"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              静岡市民広場
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: '#5DABA8',
              cursor: 'pointer'
            }}>
              詳細を見る
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#5DABA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* 申し込み2: 承認待ち */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              padding: '4px 12px',
              background: '#FFD88A',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: '#8B6914'
            }}>
              承認待ち
            </div>
          </div>
          <h3 style={{
            margin: '0 0 8px',
            fontSize: '16px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            秋のグルメフェスタ
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="10" height="10" rx="1" stroke="#6C757D" strokeWidth="1.5" fill="none"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              申込日: 2024/06/20
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C4.13 0 1 3.13 1 7C1 12.25 8 16 8 16C8 16 15 12.25 15 7C15 3.13 11.87 0 8 0ZM8 9.5C6.62 9.5 5.5 8.38 5.5 7C5.5 5.62 6.62 4.5 8 4.5C9.38 4.5 10.5 5.62 10.5 7C10.5 8.38 9.38 9.5 8 9.5Z" fill="#6C757D"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              浜松アリーナ
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: '#5DABA8',
              cursor: 'pointer'
            }}>
              詳細を見る
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#5DABA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* 申し込み3: 却下 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              padding: '4px 12px',
              background: '#FF3B30',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'white'
            }}>
              却下
            </div>
          </div>
          <h3 style={{
            margin: '0 0 8px',
            fontSize: '16px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            春のマルシェ
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="10" height="10" rx="1" stroke="#6C757D" strokeWidth="1.5" fill="none"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              申込日: 2024/06/10
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C4.13 0 1 3.13 1 7C1 12.25 8 16 8 16C8 16 15 12.25 15 7C15 3.13 11.87 0 8 0ZM8 9.5C6.62 9.5 5.5 8.38 5.5 7C5.5 5.62 6.62 4.5 8 4.5C9.38 4.5 10.5 5.62 10.5 7C10.5 8.38 9.38 9.5 8 9.5Z" fill="#6C757D"/>
            </svg>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: '#6C757D'
            }}>
              富士山麓公園
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: '#5DABA8',
              cursor: 'pointer'
            }}>
              詳細を見る
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#5DABA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

