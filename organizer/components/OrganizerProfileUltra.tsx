'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'

interface OrganizerProfileProps {
  userProfile: any
  onBack: () => void
}

export default function OrganizerProfileUltra({ userProfile, onBack }: OrganizerProfileProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile?.name || userProfile?.displayName || '',
    email: userProfile?.email || '',
    phone_number: '',
    company_name: '',
    gender: '',
    age: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const lineUserId = (userProfile as any)?.userId || user?.id

      if (user) {
        const query = supabase
          .from('organizers')
          .select('name,email,phone_number,company_name,gender,age')
          .limit(1)

        const lookupIds = [user.id, lineUserId].filter(Boolean)
        const { data, error } = await query.in('line_user_id', lookupIds).maybeSingle()

        if (error) throw error

        if (data) {
          setFormData({
            name: data.name || userProfile?.name || userProfile?.displayName || '',
            email: data.email || userProfile?.email || user?.email || '',
            phone_number: data.phone_number || '',
            company_name: data.company_name || '',
            gender: data.gender || '',
            age: data.age?.toString() || '',
          })
        } else {
          setFormData((prev) => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('ログインが必要です')
        return
      }

      const isLineLogin = (userProfile as any)?.authType === 'line'
      const lineUserId = (userProfile as any)?.userId

      const payload = {
        user_id: user.id,
        line_user_id: isLineLogin ? lineUserId : null,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        company_name: formData.company_name,
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age, 10) : null,
      }

      const { error } = await supabase
        .from('organizers')
        .upsert(payload, { onConflict: isLineLogin ? 'line_user_id' : 'user_id' })
        .eq(isLineLogin ? 'line_user_id' : 'user_id', isLineLogin ? lineUserId : user.id)

      if (error) throw error

      alert('プロフィールを更新しました')
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      alert('更新に失敗しました: ' + error.message)
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
          <Button variant="ghost" onClick={onBack}>
            ← 戻る
          </Button>
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
          }}>
            プロフィール編集
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
          {/* メインフォーム */}
          <div style={{
            background: colors.neutral[0],
            borderRadius: borderRadius.xl,
            padding: spacing[8],
            boxShadow: shadows.card,
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: spacing[6],
                marginBottom: spacing[6],
              }}>
                {/* 名前 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    担当者名 <span style={{ color: colors.status.error.main }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>

                {/* メールアドレス */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    メールアドレス <span style={{ color: colors.status.error.main }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>

                {/* 電話番号 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>

                {/* 団体名 */}
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    団体名・組織名
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>
              </div>

              {/* 性別・年齢 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: spacing[6],
                marginBottom: spacing[8],
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    性別
                  </label>
                  <input
                    type="text"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[2],
                  }}>
                    年齢
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[3],
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
                </div>
              </div>

              {/* アクションボタン */}
              <div style={{
                display: 'flex',
                gap: spacing[4],
                justifyContent: 'flex-end',
              }}>
                <Button variant="outline" onClick={onBack} disabled={loading}>
                  キャンセル
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? '保存中...' : '保存する'}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
