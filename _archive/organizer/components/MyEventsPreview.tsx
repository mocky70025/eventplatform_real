'use client'

import React from 'react'

export default function MyEventsPreview() {
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
          マイイベント
        </h1>
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
      {/* イベントリスト */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* イベント1 */}
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
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#FF8A5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '24px' }}>🎪</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '16px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#2C3E50'
              }}>
                春のフードフェス
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <img 
                  src="/mdi_calendar-outline.svg" 
                  alt="カレンダー" 
                  style={{ width: '16px', height: '16px' }}
                />
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#6C757D'
                }}>
                  2024年3月15日 - 3月17日
                </p>
              </div>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                東京都 渋谷区
              </p>
            </div>
          </div>
        </div>

        {/* イベント2 */}
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
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#FF8A5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '24px' }}>🎪</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '16px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#2C3E50'
              }}>
                夏祭りマーケット
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <img 
                  src="/mdi_calendar-outline.svg" 
                  alt="カレンダー" 
                  style={{ width: '16px', height: '16px' }}
                />
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#6C757D'
                }}>
                  2024年7月20日 - 7月22日
                </p>
              </div>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                東京都 新宿区
              </p>
            </div>
          </div>
        </div>

        {/* イベント3 */}
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
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#FF8A5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '24px' }}>🎪</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: '16px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                color: '#2C3E50'
              }}>
                秋のアートフェア
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <img 
                  src="/mdi_calendar-outline.svg" 
                  alt="カレンダー" 
                  style={{ width: '16px', height: '16px' }}
                />
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#6C757D'
                }}>
                  2024年10月5日 - 10月7日
                </p>
              </div>
              <p style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                color: '#6C757D'
              }}>
                東京都 港区
              </p>
            </div>
          </div>
        </div>
      </div>

      </div>
      </div>
      {/* ボトムナビゲーション */}
      <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '393px',
          minWidth: '393px',
          flexShrink: 0,
          height: '80px',
          background: '#E8F5F5',
          borderTop: '1px solid #E9ECEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px'
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>通知</span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>作成</span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7V9C7 7.9 7.9 7 9 7H11V9H9V11ZM13 7H15C16.1 7 17 7.9 17 9V11H15V9H13V7ZM7 13H9V15H11V17H9C7.9 17 7 16.1 7 15V13ZM17 13V15C17 16.1 16.1 17 15 17H13V15H15V13H17Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>申し込み</span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flex: 1
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2C3E50"/>
            </svg>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>プロフィール</span>
        </div>
      </div>
      </div>
    </div>
  )
}

