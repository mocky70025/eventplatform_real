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
        maxWidth: '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
      position: 'relative',
      width: '100%',
      maxWidth: '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#FFFFFF'
    }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '393px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '24px' }}>
          <div style={{ width: '60px' }}></div>
          <h1 style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            textAlign: 'center'
          }}>登録情報</h1>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '8px 16px',
              background: '#06C755',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '120%',
              cursor: 'pointer'
            }}
          >
            編集
          </button>
        </div>

        {exhibitorData && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

              {/* 書類画像の表示 */}
              <div>
                <label style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '16px',
                  display: 'block'
                }}>登録書類</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {getImageUrl(exhibitorData.business_license_image_url) && (
                    <div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '8px'
                      }}>営業許可証</p>
                      <img
                        src={getImageUrl(exhibitorData.business_license_image_url)!}
                        alt="営業許可証"
                        onError={(e) => {
                          console.error('[ExhibitorProfile] Failed to load business_license image:', getImageUrl(exhibitorData.business_license_image_url))
                          e.currentTarget.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                    </div>
                  )}
                  {getImageUrl(exhibitorData.vehicle_inspection_image_url) && (
                    <div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '8px'
                      }}>車検証</p>
                      <img
                        src={getImageUrl(exhibitorData.vehicle_inspection_image_url)!}
                        alt="車検証"
                        onError={(e) => {
                          console.error('[ExhibitorProfile] Failed to load vehicle_inspection image:', getImageUrl(exhibitorData.vehicle_inspection_image_url))
                          e.currentTarget.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                    </div>
                  )}
                  {getImageUrl(exhibitorData.automobile_inspection_image_url) && (
                    <div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '8px'
                      }}>自動車検査証</p>
                      <img
                        src={getImageUrl(exhibitorData.automobile_inspection_image_url)!}
                        alt="自動車検査証"
                        onError={(e) => {
                          console.error('[ExhibitorProfile] Failed to load automobile_inspection image:', getImageUrl(exhibitorData.automobile_inspection_image_url))
                          e.currentTarget.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                    </div>
                  )}
                  {getImageUrl(exhibitorData.pl_insurance_image_url) && (
                    <div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '8px'
                      }}>PL保険</p>
                      <img
                        src={getImageUrl(exhibitorData.pl_insurance_image_url)!}
                        alt="PL保険"
                        onError={(e) => {
                          console.error('[ExhibitorProfile] Failed to load pl_insurance image:', getImageUrl(exhibitorData.pl_insurance_image_url))
                          e.currentTarget.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                    </div>
                  )}
                  {getImageUrl(exhibitorData.fire_equipment_layout_image_url) && (
                    <div>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '8px'
                      }}>火器類配置図</p>
                      <img
                        src={getImageUrl(exhibitorData.fire_equipment_layout_image_url)!}
                        alt="火器類配置図"
                        onError={(e) => {
                          console.error('[ExhibitorProfile] Failed to load fire_equipment_layout image:', getImageUrl(exhibitorData.fire_equipment_layout_image_url))
                          e.currentTarget.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                    </div>
                  )}
                </div>
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
                }}>登録日時</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '150%',
                  color: '#000000'
                }}>
                  {new Date(exhibitorData.created_at).toLocaleString('ja-JP')}
                </p>
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
                }}>最終更新日時</label>
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  lineHeight: '150%',
                  color: '#000000'
                }}>
                  {new Date(exhibitorData.updated_at).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          </div>
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
  )
}
