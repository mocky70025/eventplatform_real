'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import OrganizerEditForm from './OrganizerEditForm'

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
  const [isEditing, setIsEditing] = useState(false)
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

      if (authType === 'email') {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('line_user_id', userProfile.userId)
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

  const handleUpdateComplete = (updatedData: OrganizerData) => {
    setOrganizerData(updatedData)
    setIsEditing(false)
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

  if (isEditing && organizerData) {
    return (
      <OrganizerEditForm
        organizerData={organizerData}
        userProfile={userProfile}
        onUpdateComplete={handleUpdateComplete}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#E8F5F5'
    }}>
      {/* ヘッダー */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#FF8A5C',
        color: '#FFFFFF',
        padding: '16px',
        textAlign: 'center',
        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
        fontSize: '18px',
        fontWeight: 700,
        lineHeight: '120%',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        maxWidth: isDesktop ? '1000px' : '393px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '64px'
      }}>
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
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Inter", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '1'
          }}
        >
          &lt;
        </button>
        プロフィール
      </div>

      <div style={{ paddingTop: '64px', paddingBottom: '24px' }}>
        <div style={{ 
          padding: isDesktop ? '20px 32px' : '0 20px',
          maxWidth: isDesktop ? '600px' : '353px',
          margin: '0 auto'
        }}>
          {!organizerData ? (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#6C757D'
              }}>登録情報が見つかりませんでした</p>
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '24px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '20px',
                fontStyle: 'italic',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#2C3E50',
                marginBottom: '24px',
                paddingLeft: '4px'
              }}>
                情報を確認してください
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* お名前 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    お名前
                  </label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.name}</p>
                </div>

                {/* 性別 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    性別
                  </label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.gender === '男' ? '男性' : organizerData.gender === '女' ? '女性' : 'その他'}</p>
                </div>

                {/* 年齢 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    年齢
                  </label>
                  <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.age}</p>
                </div>

                {/* 電話番号 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    電話番号
                  </label>
                  <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.phone_number}</p>
                </div>

                {/* メールアドレス */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    メールアドレス
                  </label>
                  <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.email}</p>
                </div>

                {/* 会社名 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    会社名
                  </label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.company_name}</p>
                </div>
              </div>

              {/* 編集するボタン */}
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  width: '100%',
                  maxWidth: '289px',
                  height: '52px',
                  padding: '0',
                  background: '#FF8A5C',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '15px',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  lineHeight: '52px',
                  cursor: 'pointer',
                  marginTop: '24px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                編集する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

