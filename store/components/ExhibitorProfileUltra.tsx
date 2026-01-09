'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/design-system'
interface ExhibitorProfileProps {
  userProfile: any
  onBack: () => void
}

export default function ExhibitorProfileUltra({ userProfile, onBack }: ExhibitorProfileProps) {
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || userProfile?.displayName || '',
    email: userProfile?.email || '',
    phone_number: '',
    gender: '',
    age: '',
  })
  const [docUrls, setDocUrls] = useState({
    business_license_image_url: '',
    vehicle_inspection_image_url: '',
    automobile_inspection_image_url: '',
    pl_insurance_image_url: '',
    fire_equipment_layout_image_url: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const query = supabase
          .from('exhibitors')
          .select('name,email,phone_number,gender,age,business_license_image_url,vehicle_inspection_image_url,automobile_inspection_image_url,pl_insurance_image_url,fire_equipment_layout_image_url')
          .limit(1)

        let data = null
        let error = null

        ;({ data, error } = await query.eq('line_user_id', user.id).maybeSingle())

        if (error) throw error
        
        if (data) {
          setProfileData({
            name: data.name || userProfile?.name || userProfile?.displayName || '',
            email: data.email || userProfile?.email || user?.email || '',
            phone_number: data.phone_number || '',
            gender: data.gender || '',
            age: data.age?.toString() || '',
          })
          setDocUrls({
            business_license_image_url: data.business_license_image_url || '',
            vehicle_inspection_image_url: data.vehicle_inspection_image_url || '',
            automobile_inspection_image_url: data.automobile_inspection_image_url || '',
            pl_insurance_image_url: data.pl_insurance_image_url || '',
            fire_equipment_layout_image_url: data.fire_equipment_layout_image_url || '',
          })
        } else {
          setProfileData((prev) => ({
            ...prev,
            name: userProfile?.name || userProfile?.displayName || prev.name,
            email: userProfile?.email || user?.email || prev.email,
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing[6]} ${spacing[8]}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
        }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary[600],
              cursor: 'pointer',
            }}
          >
            ← 戻る
          </button>
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
          }}>
            プロフィール
          </h1>
          {loading && (
            <span style={{
              color: colors.neutral[500],
              fontSize: typography.fontSize.sm,
            }}>
              読み込み中…
            </span>
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[8],
        }}>
          {/* 基本情報 */}
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.card,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing[6],
            }}>
              {[
                { label: '名前', value: profileData.name },
                { label: 'メールアドレス', value: profileData.email },
                { label: '電話番号', value: profileData.phone_number },
                { label: '性別', value: profileData.gender },
                { label: '年齢', value: profileData.age },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: spacing[4],
                  borderRadius: borderRadius.lg,
                  border: `1px solid ${colors.neutral[200]}`,
                  background: colors.neutral[50],
                }}>
                  <div style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[600],
                    marginBottom: spacing[1],
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                  }}>
                    {item.value || '未設定'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 提出書類プレビュー */}
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.card,
          }}>
            <h2 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              marginBottom: spacing[4],
            }}>
              提出書類
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: spacing[5],
            }}>
              {[
                { key: 'business_license_image_url', label: '営業許可証' },
                { key: 'vehicle_inspection_image_url', label: '車検証' },
                { key: 'automobile_inspection_image_url', label: '自動車点検記録簿' },
                { key: 'pl_insurance_image_url', label: 'PL保険' },
                { key: 'fire_equipment_layout_image_url', label: '消防設備配置図' },
              ].map((doc) => {
                const url = (docUrls as any)[doc.key] as string
                return (
                  <div key={doc.key} style={{
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: borderRadius.lg,
                    overflow: 'hidden',
                    background: colors.neutral[50],
                  }}>
                    <div style={{
                      padding: spacing[3],
                      borderBottom: `1px solid ${colors.neutral[200]}`,
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[800],
                    }}>
                      {doc.label}
                    </div>
                    <div style={{
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: colors.neutral[0],
                    }}>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img
                            src={url}
                            alt={doc.label}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </a>
                      ) : (
                        <span style={{
                          color: colors.neutral[400],
                          fontSize: typography.fontSize.sm,
                        }}>
                          未アップロード
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
