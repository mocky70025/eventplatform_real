'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/design-system'
import Button from './ui/Button'

interface Event {
  id: string
  event_name: string
  genre: string
  event_start_date: string
  event_end_date: string
  lead_text: string
  venue_city?: string
  venue_town?: string
  main_image_url?: string
  application_end_date?: string | null
}

interface EventListProps {
  userProfile: any
  onBack: () => void
}

export default function EventListUltra({ userProfile, onBack }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      let data: Event[] | null = null
      let error: any = null

      ;({ data, error } = await supabase
        .from('events')
        .select('*')
        .eq('approval_status', 'approved')
        .order('event_start_date', { ascending: true }))

      if (error && (error.code === '42703' || `${error.message}`.includes('approval_status'))) {
        const fallback = await supabase
          .from('events')
          .select('*')
          .order('event_start_date', { ascending: true })

        if (fallback.error) throw fallback.error
        data = fallback.data
      } else if (error) {
        throw error
      }

      const normalized = data && data.length > 0 && 'approval_status' in data[0]
        ? data.filter((event: any) => event.approval_status === 'approved' || event.approval_status === null)
        : data

      setEvents(normalized || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesKeyword = !searchKeyword || 
      event.event_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      event.lead_text?.toLowerCase().includes(searchKeyword.toLowerCase())
    
    const matchesGenre = selectedGenre === 'all' || event.genre === selectedGenre

    return matchesKeyword && matchesGenre
  })

  const genres = ['all', ...Array.from(new Set(events.map(e => e.genre).filter(Boolean)))]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (selectedEvent) {
    return <EventDetailUltra event={selectedEvent} userProfile={userProfile} onBack={() => setSelectedEvent(null)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.primary[50],
    }}>
      {/* ヘッダー */}
      <div style={{
        background: colors.neutral[0],
        borderBottom: `1px solid ${colors.neutral[200]}`,
        boxShadow: shadows.sm,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `${spacing[6]} ${spacing[8]}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            marginBottom: spacing[6],
          }}>
            <Button variant="ghost" onClick={onBack}>
              ← 戻る
            </Button>
            <h1 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            }}>
              イベントを探す
            </h1>
          </div>

          {/* 検索バー */}
          <div style={{
            display: 'flex',
            gap: spacing[4],
            alignItems: 'center',
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="イベント名で検索..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing[3]} ${spacing[4]} ${spacing[3]} ${spacing[12]}`,
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.japanese,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.lg,
                  outline: 'none',
                  transition: `all ${transitions.fast}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[500]
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.neutral[200]
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                left: spacing[4],
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: typography.fontSize.xl,
              }}>
                🔍
              </span>
            </div>

            {/* ジャンルフィルター */}
            <div style={{
              display: 'flex',
              gap: spacing[2],
              flexWrap: 'wrap',
            }}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: `${spacing[2]} ${spacing[4]}`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    fontFamily: typography.fontFamily.japanese,
                    borderRadius: borderRadius.full,
                    border: 'none',
                    cursor: 'pointer',
                    transition: `all ${transitions.fast}`,
                    background: selectedGenre === genre ? colors.primary[500] : colors.neutral[100],
                    color: selectedGenre === genre ? colors.neutral[0] : colors.neutral[700],
                  }}
                  onMouseEnter={(e) => {
                    if (selectedGenre !== genre) {
                      e.currentTarget.style.background = colors.neutral[200]
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGenre !== genre) {
                      e.currentTarget.style.background = colors.neutral[100]
                    }
                  }}
                >
                  {genre === 'all' ? 'すべて' : genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* イベント一覧 */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing[6],
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: colors.neutral[100],
                  borderRadius: borderRadius.xl,
                  height: '400px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[12],
            textAlign: 'center',
            boxShadow: shadows.card,
          }}>
            <div style={{ fontSize: typography.fontSize['5xl'], marginBottom: spacing[4] }}>
              🔍
            </div>
            <h3 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[2],
            }}>
              イベントが見つかりませんでした
            </h3>
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[600],
            }}>
              検索条件を変更してみてください
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing[6],
          }}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: colors.neutral[0],
                  borderRadius: borderRadius.xl,
                  overflow: 'hidden',
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.neutral[100]}`,
                  cursor: 'pointer',
                  transition: `all ${transitions.normal}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = shadows.xl
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = shadows.card
                }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* イベント画像 */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: event.main_image_url
                    ? `url(${event.main_image_url}) center/cover`
                    : `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
                  position: 'relative',
                }}>
                  {event.genre && (
                    <div style={{
                      position: 'absolute',
                      top: spacing[3],
                      left: spacing[3],
                      padding: `${spacing[1.5]} ${spacing[3]}`,
                      background: colors.neutral[0],
                      borderRadius: borderRadius.full,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                      boxShadow: shadows.sm,
                    }}>
                      {event.genre}
                    </div>
                  )}
                </div>

                {/* イベント情報 */}
                <div style={{ padding: spacing[5] }}>
                  <h3 style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    marginBottom: spacing[3],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '3.5rem',
                  }}>
                    {event.event_name}
                  </h3>

                  {event.lead_text && (
                    <p style={{
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                      marginBottom: spacing[4],
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.5rem',
                    }}>
                      {event.lead_text}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                    marginBottom: spacing[4],
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <span>📅</span>
                      <span>{formatDate(event.event_start_date)}</span>
                    </div>
                    {event.venue_city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                        <span>📍</span>
                        <span>{event.venue_city} {event.venue_town}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="primary" size="sm" fullWidth>
                    詳細を見る
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

// イベント詳細コンポーネント
function EventDetailUltra({ event, userProfile, onBack }: { event: Event; userProfile: any; onBack: () => void }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
  }

  if (showApplicationForm) {
    return <ApplicationFormUltra event={event} userProfile={userProfile} onBack={() => setShowApplicationForm(false)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.primary[50],
    }}>
      {/* ヘッダー画像 */}
      <div style={{
        width: '100%',
        height: '400px',
        background: event.main_image_url
          ? `url(${event.main_image_url}) center/cover`
          : `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: spacing[8],
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          padding: `0 ${spacing[8]}`,
        }}>
          <Button
            variant="ghost"
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: colors.neutral[0],
              marginBottom: spacing[4],
            }}
          >
            ← 戻る
          </Button>
          
          {event.genre && (
            <div style={{
              display: 'inline-block',
              padding: `${spacing[2]} ${spacing[4]}`,
              background: colors.neutral[0],
              borderRadius: borderRadius.full,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[4],
            }}>
              {event.genre}
            </div>
          )}
          
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[0],
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {event.event_name}
          </h1>
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing[8],
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: spacing[8],
      }}>
        {/* 左カラム: イベント詳細 */}
        <div>
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.card,
            marginBottom: spacing[6],
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[4],
            }}>
              イベント概要
            </h2>
            
            <p style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              color: colors.neutral[700],
              lineHeight: typography.lineHeight.relaxed,
            }}>
              {event.lead_text}
            </p>
          </div>

          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.card,
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[6],
            }}>
              開催情報
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[4],
            }}>
              <InfoRow icon="📅" label="開催期間" value={`${formatDate(event.event_start_date)} 〜 ${formatDate(event.event_end_date)}`} />
              {event.venue_city && (
                <InfoRow icon="📍" label="開催場所" value={`${event.venue_city} ${event.venue_town || ''}`} />
              )}
              {event.application_end_date && (
                <InfoRow icon="⏰" label="申込締切" value={formatDate(event.application_end_date)} />
              )}
            </div>
          </div>
        </div>

        {/* 右カラム: 申込カード */}
        <div>
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.xl,
            border: `2px solid ${colors.primary[200]}`,
            position: 'sticky',
            top: spacing[8],
          }}>
            <h3 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[6],
              textAlign: 'center',
            }}>
              このイベントに出店する
            </h3>

            <div style={{
              background: colors.primary[50],
              borderRadius: borderRadius.lg,
              padding: spacing[4],
              marginBottom: spacing[6],
            }}>
              <div style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[700],
                marginBottom: spacing[2],
              }}>
                申込締切
              </div>
              <div style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.primary[700],
              }}>
                {event.application_end_date ? formatDate(event.application_end_date) : '未定'}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowApplicationForm(true)}
            >
              申し込む
            </Button>

            <p style={{
              fontSize: typography.fontSize.xs,
              color: colors.neutral[600],
              textAlign: 'center',
              marginTop: spacing[4],
            }}>
              ※ 申込後、主催者による審査があります
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 情報行コンポーネント
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[3],
      padding: spacing[4],
      background: colors.neutral[50],
      borderRadius: borderRadius.lg,
    }}>
      <span style={{ fontSize: typography.fontSize.xl }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: typography.fontSize.sm,
          color: colors.neutral[600],
          marginBottom: spacing[1],
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// 申込フォームコンポーネント（簡易版）
function ApplicationFormUltra({ event, userProfile, onBack }: { event: Event; userProfile: any; onBack: () => void }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('ログインが必要です')
        return
      }

      const { error } = await supabase.from('event_applications').insert({
        event_id: event.id,
        exhibitor_id: user.id,
        status: 'pending',
        message: message,
      })

      if (error) throw error

      alert('申し込みが完了しました！')
      onBack()
    } catch (error: any) {
      console.error('Application error:', error)
      alert('申し込みに失敗しました: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.primary[50],
      padding: spacing[8],
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <Button variant="ghost" onClick={onBack} style={{ marginBottom: spacing[6] }}>
          ← 戻る
        </Button>

        <div style={{
          background: colors.neutral[0],
          borderRadius: borderRadius.xl,
          padding: spacing[8],
          boxShadow: shadows.card,
        }}>
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2],
          }}>
            出店申込
          </h1>
          
          <p style={{
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            marginBottom: spacing[8],
          }}>
            {event.event_name}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: spacing[6] }}>
              <label style={{
                display: 'block',
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[2],
              }}>
                メッセージ（任意）
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="主催者へのメッセージがあれば記入してください"
                style={{
                  width: '100%',
                  padding: spacing[4],
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.japanese,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.lg,
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? '送信中...' : '申し込む'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
