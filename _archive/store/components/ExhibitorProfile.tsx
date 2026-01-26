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
    const { data, error } = await supabase
      .from('exhibitors')
      .select('*')
      .or(`id.eq.${userProfile.userId},line_user_id.eq.${userProfile.userId}`)
      .maybeSingle()

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
            borderTopColor: '#5DABA8',
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
      background: '#FFF5F0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '852px',
        margin: '0 auto'
      }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        height: '64px',
        background: '#5DABA8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &lt;
        </button>
        <h1 style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '18px',
          fontWeight: 700,
          color: '#FFFFFF',
          margin: 0,
          textAlign: 'center'
        }}>
          プロフィール
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {exhibitorData && (
          <>
            {/* メインフォームカード */}
            <div style={{
              width: '100%',
              maxWidth: '353px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              padding: '20px',
              marginBottom: '24px'
            }}>
              {/* フォームタイトル */}
              <h2 style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#2C3E50',
                margin: '0 0 24px 0'
              }}>
                情報を確認してください
              </h2>

              {/* 情報確認項目 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>お名前</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.name}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>性別</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.gender === '男' ? '男性' : exhibitorData.gender === '女' ? '女性' : 'その他'}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>年齢</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.age}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>電話番号</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.phone_number}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>メールアドレス</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.email}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>ジャンル</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.genre_category || '-'}</p>
                </div>

                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>ジャンル（自由回答）</label>
                  <p style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#2C3E50',
                    margin: 0
                  }}>{exhibitorData.genre_free_text || '-'}</p>
                </div>
              </div>
            </div>

            {/* 書類プレビューカード */}
            <div style={{
              width: '100%',
              maxWidth: '353px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 営業許可証 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>営業許可証</label>
                  {getImageUrl(exhibitorData.business_license_image_url) ? (
                    <>
                      <div style={{
                        width: '100%',
                        maxWidth: '289px',
                        height: '187px',
                        background: '#D9D9D9',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={getImageUrl(exhibitorData.business_license_image_url)!}
                          alt="営業許可証"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                      {/* 有効期限表示（データベースに保存されている場合のみ表示） */}
                      {(exhibitorData as any).business_license_expiration_date && (
                        <div style={{
                          width: '100%',
                          maxWidth: '289px',
                          padding: '9px 16px',
                          background: '#A8D5BA',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{
                              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                              fontSize: '15px',
                              color: '#FFFFFF',
                              fontWeight: 400
                            }}>
                              有効
                            </span>
                          </div>
                          <p style={{
                            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                            fontSize: '15px',
                            color: '#FFFFFF',
                            fontWeight: 400,
                            margin: 0
                          }}>
                            期限: {(exhibitorData as any).business_license_expiration_date}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>

                {/* 車検証 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>車検証</label>
                  {getImageUrl(exhibitorData.vehicle_inspection_image_url) ? (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getImageUrl(exhibitorData.vehicle_inspection_image_url)!}
                        alt="車検証"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>

                {/* 自動車検査証 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>自動車検査証</label>
                  {getImageUrl(exhibitorData.automobile_inspection_image_url) ? (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getImageUrl(exhibitorData.automobile_inspection_image_url)!}
                        alt="自動車検査証"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>

                {/* PL保険 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>PL保険</label>
                  {getImageUrl(exhibitorData.pl_insurance_image_url) ? (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getImageUrl(exhibitorData.pl_insurance_image_url)!}
                        alt="PL保険"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>

                {/* 火器類配置図 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>火器類配置図</label>
                  {getImageUrl(exhibitorData.fire_equipment_layout_image_url) ? (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={getImageUrl(exhibitorData.fire_equipment_layout_image_url)!}
                        alt="火器類配置図"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '187px',
                      background: '#D9D9D9',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>
              </div>
            </div>

            {/* 編集するボタン */}
            <div style={{ padding: '0 20px', marginBottom: '100px' }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  width: '100%',
                  maxWidth: '289px',
                  height: '52px',
                  margin: '0 auto',
                  display: 'block',
                  background: '#5DABA8',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
                }}
              >
                編集する
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
