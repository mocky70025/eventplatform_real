'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'

interface OrganizerProfileProps {
  userProfile: LineProfile
  onBack?: () => void
}

interface OrganizerData {
  id: string
  company_name: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  line_user_id: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export default function OrganizerProfile({ userProfile, onBack }: OrganizerProfileProps) {
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (userProfile?.userId) {
      fetchOrganizerData()
    }
  }, [userProfile])

  const fetchOrganizerData = async () => {
    try {
      if (!userProfile?.userId) {
        console.error('[OrganizerProfile] No userProfile.userId')
        setLoading(false)
        return
      }

      console.log('[OrganizerProfile] Fetching organizer data for userId:', userProfile.userId)

      const authType = (userProfile as any).authType || 'line'
      let data, error

      if (authType === 'line') {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      }

      console.log('[OrganizerProfile] Fetch result:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[OrganizerProfile] No organizer found')
          setOrganizerData(null)
        } else {
          throw error
        }
      } else {
        setOrganizerData(data)
      }
    } catch (error) {
      console.error('[OrganizerProfile] Failed to fetch organizer data:', error)
      alert('プロフィール情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '600px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#E8F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#FF8A5C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

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
            プロフィール
          </h1>
          <button
            onClick={() => {
              if (onBack) {
                onBack()
              } else if (typeof window !== 'undefined' && window.history.length > 1) {
                window.history.back()
              }
            }}
            style={{
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
            }}
          >
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
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}>
          {!organizerData ? (
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
              <p style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#6C757D'
              }}>登録情報が見つかりませんでした</p>
            </div>
          ) : (
            <div style={{
              width: '100%',
              boxSizing: 'border-box'
            }}>
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
                  情報を確認してください
                </h2>

                {/* お名前 */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  お名前
                </label>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.name || '未設定'}
                </p>

                {/* 性別 */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  性別
                </label>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.gender ? (organizerData.gender === '男' ? '男性' : organizerData.gender === '女' ? '女性' : 'その他') : '未設定'}
                </p>

                {/* 年齢 */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  年齢
                </label>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.age ?? '未設定'}
                </p>

                {/* 電話番号 */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  電話番号
                </label>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.phone_number || '未設定'}
                </p>

                {/* メールアドレス */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  メールアドレス
                </label>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.email || '未設定'}
                </p>

                {/* 会社名 */}
                <label style={{
                  display: 'block',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50',
                  marginBottom: '8px'
                }}>
                  会社名
                </label>
                <p style={{
                  margin: '0 0 32px',
                  fontSize: '15px',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {organizerData.company_name || '未設定'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
