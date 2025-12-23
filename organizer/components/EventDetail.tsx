'use client'

import { type Event } from '@/lib/supabase'

interface EventDetailProps {
  event: Event
  onBack: () => void
  onEdit: () => void
}

export default function EventDetail({ event, onBack, onEdit }: EventDetailProps) {
  // 日付をフォーマット
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }

  // 期間をフォーマット
  const formatPeriod = () => {
    if (event.event_display_period) {
      return event.event_display_period
    }
    const startDate = formatDate(event.event_start_date)
    const endDate = formatDate(event.event_end_date)
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`
    }
    return startDate || endDate || ''
  }

  // 住所を結合
  const formatAddress = () => {
    const parts = []
    if (event.venue_postal_code) parts.push(event.venue_postal_code)
    if (event.venue_city) parts.push(event.venue_city)
    if (event.venue_town) parts.push(event.venue_town)
    if (event.venue_address) parts.push(event.venue_address)
    return parts.join('')
  }

  // 申込期間をフォーマット
  const formatApplicationPeriod = () => {
    if (event.application_display_period) {
      return event.application_display_period
    }
    const startDate = formatDate(event.application_start_date)
    const endDate = formatDate(event.application_end_date)
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`
    }
    return startDate || endDate || ''
  }

  return (
    <div style={{ background: '#E8F5F5', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '0', maxWidth: '393px' }}>
        {/* ヘッダー */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          background: 'linear-gradient(180deg, #E8F5F5 0%, #FFFFFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0'
        }}>
          {/* 戻るボタン */}
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
              background: 'transparent',
              border: 'none',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#2C3E50',
              cursor: 'pointer',
              zIndex: 10,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &lt;
          </button>

          {/* イベントアイコン */}
          <div style={{
            fontSize: '48px',
            lineHeight: '48px',
            marginTop: '40px'
          }}>
            🎪
          </div>
        </div>

        {/* メインコンテンツ */}
        <div style={{ padding: '16px', paddingTop: '0' }}>
          {/* ジャンルタグ */}
          <div style={{
            display: 'inline-block',
            background: '#FF8A5C',
            borderRadius: '14px',
            padding: '6px 12px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              {event.genre || 'イベント'}
            </span>
          </div>

          {/* イベント名 */}
          <h1 style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#2C3E50',
            marginTop: '0',
            marginBottom: '16px'
          }}>
            {event.event_name}
          </h1>

          {/* イベント詳細カード */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            {/* 日付 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="12" height="11" rx="1" stroke="#2C3E50" strokeWidth="1.5"/>
                  <line x1="6" y1="2" x2="6" y2="4" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="2" x2="12" y2="4" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="6" y1="8" x2="6" y2="8" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="9" y1="8" x2="9" y2="8" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="8" x2="12" y2="8" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#2C3E50'
              }}>
                {formatPeriod()}
              </span>
            </div>

            {/* 時間 */}
            {event.event_time && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="7.5" stroke="#2C3E50" strokeWidth="1.5"/>
                    <line x1="9" y1="9" x2="9" y2="5" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="9" y1="9" x2="12" y2="9" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: '#2C3E50'
                }}>
                  {event.event_time}
                </span>
              </div>
            )}

            {/* 会場 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}>
                <svg width="8" height="11.5" viewBox="0 0 8 11.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 0C1.79 0 0 1.79 0 4C0 7 4 11.5 4 11.5C4 11.5 8 7 8 4C8 1.79 6.21 0 4 0ZM4 5.5C3.17 5.5 2.5 4.83 2.5 4C2.5 3.17 3.17 2.5 4 2.5C4.83 2.5 5.5 3.17 5.5 4C5.5 4.83 4.83 5.5 4 5.5Z" fill="#2C3E50"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: '#2C3E50',
                  marginBottom: '4px'
                }}>
                  {event.venue_name || ''}
                </div>
                {formatAddress() && (
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    lineHeight: '150%',
                    color: '#6C757D'
                  }}>
                    {formatAddress()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* イベント概要 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '16px'
            }}>
              イベント概要
            </h2>
            {event.event_description && (
              <div style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#6C757D',
                whiteSpace: 'pre-line'
              }}>
                {event.event_description.split('\n').map((line, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 詳細情報カード */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '16px'
            }}>
              詳細情報
            </h2>

            {/* 申込期間 */}
            {formatApplicationPeriod() && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: '150%',
                    color: '#6C757D',
                    marginBottom: '4px'
                  }}>
                    申込期間
                  </div>
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#2C3E50'
                  }}>
                    {formatApplicationPeriod()}
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '1px',
                  background: '#E9ECEF',
                  marginBottom: '16px'
                }} />
              </>
            )}

            {/* 出店料 */}
            {event.fee_info && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: '150%',
                    color: '#6C757D',
                    marginBottom: '4px'
                  }}>
                    出店料
                  </div>
                  <div style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#2C3E50'
                  }}>
                    {event.fee_info}
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '1px',
                  background: '#E9ECEF',
                  marginBottom: '16px'
                }} />
              </>
            )}

            {/* 募集区画数 */}
            {event.organizer_info && (
              <div>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: '150%',
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  募集区画数
                </div>
                <div style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  lineHeight: '150%',
                  color: '#2C3E50'
                }}>
                  {event.organizer_info}
                </div>
              </div>
            )}
          </div>

          {/* お問い合わせカード */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '16px'
            }}>
              お問い合わせ
            </h2>
            {event.contact_name && (
              <div style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#2C3E50',
                marginBottom: '8px'
              }}>
                主催者: {event.contact_name}
              </div>
            )}
            {event.contact_phone && (
              <div style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#6C757D',
                marginBottom: '8px'
              }}>
                TEL: {event.contact_phone}
              </div>
            )}
            {event.contact_email && (
              <div style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                lineHeight: '150%',
                color: '#6C757D'
              }}>
                {event.contact_email}
              </div>
            )}
          </div>

          {/* このイベントを編集するボタン */}
          <button
            onClick={onEdit}
            style={{
              width: '100%',
              maxWidth: '353px',
              height: '52px',
              background: '#FF8A5C',
              borderRadius: '12px',
              border: 'none',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '52px',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              marginBottom: '24px'
            }}
          >
            このイベントを編集する
          </button>
        </div>
      </div>
    </div>
  )
}

