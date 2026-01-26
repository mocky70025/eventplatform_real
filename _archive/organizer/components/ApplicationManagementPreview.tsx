'use client'

import React from 'react'

export default function ApplicationManagementPreview() {
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
          background: '#FF8A5C',
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
        {/* 申し込み1 */}
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
              background: '#5DABA8',
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
          <p style={{
            margin: '0 0 12px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            申込日: 2024/06/15
          </p>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            borderRadius: '8px',
            border: '1px solid #5DABA8',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#5DABA8',
            cursor: 'pointer'
          }}>
            詳細を見る
          </button>
        </div>

        {/* 申し込み2 */}
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
          <p style={{
            margin: '0 0 12px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            申込日: 2024/06/20
          </p>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            borderRadius: '8px',
            border: '1px solid #5DABA8',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#5DABA8',
            cursor: 'pointer'
          }}>
            詳細を見る
          </button>
        </div>

        {/* 申し込み3 */}
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
          <p style={{
            margin: '0 0 12px',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            申込日: 2024/06/10
          </p>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            borderRadius: '8px',
            border: '1px solid #5DABA8',
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#5DABA8',
            cursor: 'pointer'
          }}>
            詳細を見る
          </button>
        </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

