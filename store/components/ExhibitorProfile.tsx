'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getPublicUrl } from '@/lib/storage'
import ExhibitorEditForm from './ExhibitorEditForm'

interface ExhibitorProfileProps {
  userProfile: any
  onBack: () => void
}

interface ExhibitorData {
  id: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  genre_category?: string
  genre_free_text?: string
  business_license_image_url?: string | null
  vehicle_inspection_image_url?: string | null
  automobile_inspection_image_url?: string | null
  pl_insurance_image_url?: string | null
  fire_equipment_layout_image_url?: string | null
  line_user_id: string
  created_at: string
  updated_at: string
}

export default function ExhibitorProfile({ userProfile, onBack }: ExhibitorProfileProps) {
  const [exhibitorData, setExhibitorData] = useState<ExhibitorData | null>(null)
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
    fetchExhibitorData()
  }, [])

  const fetchExhibitorData = async () => {
    try {
      const authType = userProfile.authType || 'line'
      let data, error

      if (authType === 'email') {
        // メールアドレス・パスワード認証の場合
        const result = await supabase
          .from('exhibitors')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      } else {
        // LINE Loginの場合
        const result = await supabase
          .from('exhibitors')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      
      console.log('[ExhibitorProfile] Fetched exhibitor data:', data)
      console.log('[ExhibitorProfile] Image URLs:', {
        business_license: data.business_license_image_url,
        vehicle_inspection: data.vehicle_inspection_image_url,
        automobile_inspection: data.automobile_inspection_image_url,
        pl_insurance: data.pl_insurance_image_url,
        fire_equipment: data.fire_equipment_layout_image_url
      })
      
      setExhibitorData(data)
    } catch (error) {
      console.error('Failed to fetch exhibitor data:', error)
      alert('プロフィール情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 画像URLを取得（完全なURLの場合はそのまま、相対パスの場合は公開URLを取得）
  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    
    // 既に完全なURLの場合はそのまま返す
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // 相対パスの場合は公開URLを取得
    // URLの形式: bucket/path または path
    const parts = url.split('/')
    if (parts.length >= 2) {
      const bucket = parts[0]
      const path = parts.slice(1).join('/')
      return getPublicUrl(bucket, path)
    }
    
    // パスがbucket名を含まない場合は、exhibitor-documentsバケットを想定
    return getPublicUrl('exhibitor-documents', url)
  }

  const handleUpdateComplete = (updatedData: ExhibitorData) => {
    setExhibitorData(updatedData)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '600px' : '393px',
        minHeight: isDesktop ? '800px' : '852px',
        margin: '0 auto',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isDesktop && {
          padding: '40px 0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        })
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#06C755',
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

  if (isEditing && exhibitorData) {
    return (
      <ExhibitorEditForm
        exhibitorData={exhibitorData}
        userProfile={userProfile}
        onUpdateComplete={handleUpdateComplete}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#fff5f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#fff5f0',
        minHeight: isDesktop ? 'auto' : '852px'
      }}>
      {/* ヘッダー */}
      <div style={{
        background: '#5DABA8',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#FFFFFF',
          margin: 0,
          flex: 1
        }}>
          プロフィール
        </h1>
      </div>

      <div className="container mx-auto" style={{ padding: '16px', maxWidth: isDesktop ? '800px' : '393px' }}>

        {exhibitorData && (
          <>
            {/* 情報確認セクション */}
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#000000',
                marginBottom: '24px'
              }}>
                情報を確認してください
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>お名前</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.name}</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>性別</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.gender === '男' ? '男性' : exhibitorData.gender === '女' ? '女性' : 'その他'}</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>年齢</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.age}歳</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>電話番号</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.phone_number}</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>メールアドレス</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.email}</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>ジャンル</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.genre_category || '-'}</p>
              </div>

              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>ジャンル詳細</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '150%',
                  color: '#000000'
                }}>{exhibitorData.genre_free_text || '-'}</p>
              </div>

              </div>
            </div>

            {/* 書類セクション */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* 営業許可証 */}
              <div style={{
                background: '#FFFFFF',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '12px'
                }}>営業許可証</h3>
                <div style={{
                  width: '100%',
                  height: '160px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {getImageUrl(exhibitorData.business_license_image_url) ? (
                    <img
                      src={getImageUrl(exhibitorData.business_license_image_url)!}
                      alt="営業許可証"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span style={{ color: '#999999', fontSize: '14px' }}>画像なし</span>
                  )}
                </div>
                {getImageUrl(exhibitorData.business_license_image_url) && (
                  <div style={{
                    background: '#E6F7ED',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#06C755" strokeWidth="2"/>
                      <path d="M9 12L11 14L15 10" stroke="#06C755" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#06C755' }}>有効</div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>期限: 2025/12/31</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ログアウトボタン */}
        <div style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <button
            onClick={async () => {
              if (!confirm('ログアウトしますか？')) return
              
              try {
                // Supabase Authのセッションを確認
                const { data: { session } } = await supabase.auth.getSession()
                
                // メール認証の場合はSupabaseからログアウト
                if (session) {
                  await supabase.auth.signOut()
                }
                
                // セッションストレージをクリア
                sessionStorage.clear()
                
                // ページをリロードしてログイン画面に戻る
                window.location.href = '/'
              } catch (error) {
                console.error('Logout error:', error)
                alert('ログアウトに失敗しました')
              }
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: '#FF4444',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '120%',
              cursor: 'pointer'
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
