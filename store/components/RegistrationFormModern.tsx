'use client'

import { useEffect, useState } from 'react'
import { LineProfile } from '@/lib/auth'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import ImageUpload from './ImageUpload'
import { colors, spacing, typography, borderRadius, shadows, transitions } from '../styles/design-system'
import Button from './ui/Button'
import Input from './ui/Input'

interface RegistrationFormProps {
  userProfile: LineProfile | null
  onRegistrationComplete: () => void
}

type DocumentKey =
  | 'business_license'
  | 'vehicle_inspection'
  | 'automobile_inspection'
  | 'pl_insurance'
  | 'fire_equipment_layout'

const DOCUMENTS: { key: DocumentKey; label: string }[] = [
  { key: 'business_license', label: '営業許可証' },
  { key: 'vehicle_inspection', label: '車検証' },
  { key: 'automobile_inspection', label: '自動車検査証' },
  { key: 'pl_insurance', label: 'PL保険' },
  { key: 'fire_equipment_layout', label: '火器類配置図' },
]

const FORM_DRAFT_KEY = 'registration_form_draft'

export default function RegistrationFormModern({ userProfile, onRegistrationComplete }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const [formData, setFormData] = useState({
    shop_name: '',
    name: '',
    gender: '',
    age: '',
    phone_number: '',
    email: userProfile?.email || '',
    genre_category: '',
    genre_free_text: '',
  })
  const [documents, setDocuments] = useState({
    business_license_image_url: '',
    vehicle_inspection_image_url: '',
    automobile_inspection_image_url: '',
    pl_insurance_image_url: '',
    fire_equipment_layout_image_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [documentExpirations, setDocumentExpirations] = useState<Record<DocumentKey, string>>({
    business_license: '',
    vehicle_inspection: '',
    automobile_inspection: '',
    pl_insurance: '',
    fire_equipment_layout: '',
  })
  const [documentStatuses, setDocumentStatuses] = useState<Record<DocumentKey, { status: 'valid' | 'invalid' | 'unknown'; reason?: string }>>({
    business_license: { status: 'unknown' },
    vehicle_inspection: { status: 'unknown' },
    automobile_inspection: { status: 'unknown' },
    pl_insurance: { status: 'unknown' },
    fire_equipment_layout: { status: 'unknown' },
  })
  const [validatingDocuments, setValidatingDocuments] = useState(false)
  const loadDraftFromStorage = () => {
    if (typeof window === 'undefined') return
    const raw = sessionStorage.getItem(FORM_DRAFT_KEY)
    if (!raw) return

    try {
      const saved = JSON.parse(raw)
      if (saved.formData) {
        setFormData((prev) => ({
          ...prev,
          ...saved.formData,
        }))
      }
      if (saved.documents) {
        setDocuments((prev) => ({
          ...prev,
          ...saved.documents,
        }))
      }
      if (saved.currentStep) {
        setCurrentStep(saved.currentStep)
      }
    } catch (err) {
      console.warn('[RegistrationFormModern] Failed to load draft:', err)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!draftLoaded) {
      loadDraftFromStorage()
      setDraftLoaded(true)
    }
  }, [draftLoaded])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    return () => window.removeEventListener('resize', updateIsDesktop)
  }, [])

  const layoutColumns = isDesktop ? '400px 1fr' : '1fr'
  const containerMinHeight = isDesktop ? '700px' : 'auto'
  const sidebarPadding = isDesktop ? spacing[8] : spacing[6]
  const formPadding = isDesktop ? spacing[10] : spacing[6]
  const sidebarHeadingSpacing = isDesktop ? spacing[10] : spacing[6]

  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(
      FORM_DRAFT_KEY,
      JSON.stringify({
        formData,
        documents,
        currentStep,
      })
    )
  }, [formData, documents, currentStep])

  useEffect(() => {
    if (currentStep !== 3) return

    const checkDocuments = async () => {
      setValidatingDocuments(true)
      try {
        const payload = DOCUMENTS.map((doc) => ({
          key: doc.key,
          name: doc.label,
          expiration: documentExpirations[doc.key] || null,
          uploaded: Boolean((documents as any)[`${doc.key}_image_url`]),
        }))

        const res = await fetch('/api/documents/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documents: payload }),
        })

        if (!res.ok) throw new Error('書類の有効期限チェックに失敗しました')

        const { statuses }: {
          statuses: { key: DocumentKey; status: 'valid' | 'invalid' | 'unknown'; reason?: string }[]
        } = await res.json()

        setDocumentStatuses((prev) => {
          const normalized = { ...prev }
          statuses.forEach((item) => {
            normalized[item.key] = { status: item.status, reason: item.reason }
          })
          return normalized
        })
      } catch (error) {
        console.error('Document validation failed:', error)
      } finally {
        setValidatingDocuments(false)
      }
    }

    checkDocuments()
  }, [currentStep, documentExpirations, documents])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const storedLineProfileRaw = sessionStorage.getItem('line_profile')
      let storedLineProfile: LineProfile | null = null
      if (storedLineProfileRaw) {
        try {
          storedLineProfile = JSON.parse(storedLineProfileRaw)
        } catch {
          storedLineProfile = null
        }
      }

      const storedUserId = sessionStorage.getItem('user_id')
      const resolvedUserId = user?.id || storedUserId

      if (!resolvedUserId) throw new Error('Supabaseの認証済みユーザーが見つかりません。ページをリロードしてログインし直してください。')

      const exhibitorName = formData.shop_name || formData.name
      const authProvider =
        userProfile?.authType ||
        (storedLineProfile ? 'line' : 'email') ||
        (user?.app_metadata as any)?.provider
      const lineUserId =
        authProvider === 'line'
          ? userProfile?.userId || storedLineProfile?.userId || (user?.user_metadata as any)?.line_user_id
          : null

      const upsertData: any = {
        id: resolvedUserId,
        email: formData.email,
        name: exhibitorName,
        phone_number: formData.phone_number,
        gender: formData.gender,
        age: parseInt(formData.age),
        genre_category: formData.genre_category || null,
        genre_free_text: formData.genre_free_text || null,
        business_license_image_url: documents.business_license_image_url || null,
        vehicle_inspection_image_url: documents.vehicle_inspection_image_url || null,
        automobile_inspection_image_url: documents.automobile_inspection_image_url || null,
        pl_insurance_image_url: documents.pl_insurance_image_url || null,
        fire_equipment_layout_image_url: documents.fire_equipment_layout_image_url || null,
      }

      if (lineUserId) {
        upsertData.line_user_id = lineUserId
      }

      const { error: insertError } = await supabase
        .from('exhibitors')
        .upsert(upsertData)

      if (insertError) throw insertError

      sessionStorage.removeItem(FORM_DRAFT_KEY)
      onRegistrationComplete()
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.neutral[50],
      padding: spacing[8],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        background: colors.neutral[0],
        borderRadius: borderRadius['2xl'],
        boxShadow: shadows['2xl'],
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: layoutColumns,
        minHeight: containerMinHeight,
      }}>
        {isDesktop && (
          <div style={{
            background: colors.primary[100],
            padding: sidebarPadding,
            color: colors.primary[800],
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ marginBottom: sidebarHeadingSpacing }}>
              <h1 style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                marginBottom: spacing[2],
              }}>
                出店者登録
              </h1>
              <p style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                color: colors.primary[700],
              }}>
                イベントに出店するための登録を行います
              </p>
            </div>

            <div style={{ flex: 1 }}>
              {[
                { num: 1, title: '基本情報', desc: '店舗名・担当者名' },
                { num: 2, title: '連絡先情報', desc: '電話番号・メール' },
                { num: 3, title: '確認', desc: '入力内容の確認' },
              ].map((step) => (
                <div key={step.num} style={{
                  marginBottom: spacing[6],
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing[4],
                  opacity: currentStep >= step.num ? 1 : 0.5,
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.full,
                    background: colors.neutral[0],
                    color: currentStep >= step.num ? colors.primary[600] : colors.neutral[500],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.lg,
                    flexShrink: 0,
                    border: currentStep === step.num ? `3px solid ${colors.primary[200]}` : `1px solid ${colors.primary[200]}`,
                    boxShadow: currentStep === step.num ? shadows.md : 'none',
                  }}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: typography.fontWeight.semibold,
                      fontSize: typography.fontSize.base,
                      marginBottom: spacing[1],
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: typography.fontSize.sm,
                      opacity: 0.8,
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 右側 - フォーム */}
        <div style={{
          padding: formPadding,
          overflowY: 'auto',
        }}>
          {error && (
            <div style={{
              background: colors.status.error.light,
              color: colors.status.error.dark,
              padding: spacing[4],
              borderRadius: borderRadius.lg,
              marginBottom: spacing[6],
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.sm,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h2 style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  marginBottom: spacing[2],
                }}>
                  基本情報を入力
                </h2>
                <p style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral[600],
                  marginBottom: spacing[8],
                }}>
                  店舗名と担当者名を入力してください
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
                  <Input
                    label="店舗名"
                    type="text"
                    value={formData.shop_name}
                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    placeholder="デミセルショップ"
                    required
                    fullWidth
                  />

                  <Input
                    label="担当者名"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="山田 太郎"
                    required
                    fullWidth
                  />

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[700],
                      marginBottom: spacing[2],
                    }}>
                      性別
                    </label>
                    <div style={{ display: 'flex', gap: spacing[3] }}>
                      {[{ label: '男性', value: '男' }, { label: '女性', value: '女' }, { label: 'その他', value: 'それ以外' }].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: option.value })}
                          style={{
                            flex: 1,
                            padding: spacing[3],
                            background: formData.gender === option.value ? colors.primary[500] : colors.neutral[100],
                            color: formData.gender === option.value ? colors.neutral[0] : colors.neutral[700],
                            border: 'none',
                            borderRadius: borderRadius.lg,
                            fontFamily: typography.fontFamily.japanese,
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.medium,
                            cursor: 'pointer',
                            transition: `all ${transitions.normal}`,
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="年齢"
                    type="number"
                    value={Number(formData.age) < 0 ? '0' : Number(formData.age) > 99 ? '99' : formData.age}
                    onChange={(e) => {
                      const next = Math.min(99, Math.max(0, Number(e.target.value) || 0))
                      setFormData({ ...formData, age: String(next) })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' && Number(formData.age || 0) <= 0) {
                        e.preventDefault()
                      }
                    }}
                    placeholder="30"
                    min={0}
                    required
                    fullWidth
                  />
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[700],
                      marginBottom: spacing[2],
                    }}>
                      ジャンル
                    </label>
                    <select
                      value={formData.genre_category}
                      onChange={(e) => setFormData({ ...formData, genre_category: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 16px',
                        borderRadius: borderRadius.lg,
                        border: `1px solid ${colors.neutral[300]}`,
                        background: colors.neutral[0],
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.base,
                        color: colors.neutral[900],
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                    >
                      <option value="">選択してください</option>
                      <option value="飲食">飲食</option>
                      <option value="物販">物販</option>
                      <option value="サービス">サービス</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: typography.fontFamily.japanese,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[700],
                      marginBottom: spacing[2],
                    }}>
                      ジャンル（自由記述）
                    </label>
                    <textarea
                      value={formData.genre_free_text}
                      onChange={(e) => setFormData({ ...formData, genre_free_text: e.target.value })}
                      placeholder="例: 焼きそば、たこ焼きなど"
                      required
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px 16px',
                        borderRadius: borderRadius.lg,
                        border: `1px solid ${colors.neutral[300]}`,
                        background: colors.neutral[0],
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.base,
                        color: colors.neutral[900],
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h2 style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  marginBottom: spacing[2],
                }}>
                  連絡先情報を入力
                </h2>
                <p style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral[600],
                  marginBottom: spacing[8],
                }}>
                  電話番号とメールアドレスを入力してください
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
                  <Input
                    label="電話番号"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="090-1234-5678"
                    required
                    fullWidth
                  />

                  <Input
                    label="メールアドレス"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    fullWidth
                  />
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                    <div>
                      <div style={{
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                        marginBottom: spacing[1],
                      }}>
                        営業許可証（任意・未登録だとイベント申込不可）
                      </div>
                      <div style={{
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600],
                        lineHeight: typography.lineHeight.relaxed,
                      }}>
                        まだ手元にない場合はスキップできますが、アップロードしないとイベント申込はできません。
                      </div>
                    </div>
                    <ImageUpload
                      label="営業許可証"
                      documentType="business_license"
                      userId={userProfile?.userId || ''}
                      currentImageUrl={documents.business_license_image_url || undefined}
                      onUploadComplete={(url) => setDocuments((prev) => ({ ...prev, business_license_image_url: url }))}
                      onUploadError={(msg) => setError(msg)}
                      onImageDelete={() => setDocuments((prev) => ({ ...prev, business_license_image_url: '' }))}
                    />

                    <ImageUpload
                      label="車検証"
                      documentType="vehicle_inspection"
                      userId={userProfile?.userId || ''}
                      currentImageUrl={documents.vehicle_inspection_image_url || undefined}
                      onUploadComplete={(url) => setDocuments((prev) => ({ ...prev, vehicle_inspection_image_url: url }))}
                      onUploadError={(msg) => setError(msg)}
                      onImageDelete={() => setDocuments((prev) => ({ ...prev, vehicle_inspection_image_url: '' }))}
                    />

                    <ImageUpload
                      label="自動車検査証"
                      documentType="automobile_inspection"
                      userId={userProfile?.userId || ''}
                      currentImageUrl={documents.automobile_inspection_image_url || undefined}
                      onUploadComplete={(url) => setDocuments((prev) => ({ ...prev, automobile_inspection_image_url: url }))}
                      onUploadError={(msg) => setError(msg)}
                      onImageDelete={() => setDocuments((prev) => ({ ...prev, automobile_inspection_image_url: '' }))}
                    />

                    <ImageUpload
                      label="PL保険"
                      documentType="pl_insurance"
                      userId={userProfile?.userId || ''}
                      currentImageUrl={documents.pl_insurance_image_url || undefined}
                      onUploadComplete={(url) => setDocuments((prev) => ({ ...prev, pl_insurance_image_url: url }))}
                      onUploadError={(msg) => setError(msg)}
                      onImageDelete={() => setDocuments((prev) => ({ ...prev, pl_insurance_image_url: '' }))}
                    />

                    <ImageUpload
                      label="火器類配置図"
                      documentType="fire_equipment_layout"
                      userId={userProfile?.userId || ''}
                      currentImageUrl={documents.fire_equipment_layout_image_url || undefined}
                      onUploadComplete={(url) => setDocuments((prev) => ({ ...prev, fire_equipment_layout_image_url: url }))}
                      onUploadError={(msg) => setError(msg)}
                      onImageDelete={() => setDocuments((prev) => ({ ...prev, fire_equipment_layout_image_url: '' }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <h2 style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  marginBottom: spacing[2],
                }}>
                  入力内容の確認
                </h2>
                <p style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize.base,
                  color: colors.neutral[600],
                  marginBottom: spacing[8],
                }}>
                  以下の内容で登録します
                </p>

                <div style={{
                  background: colors.neutral[50],
                  padding: spacing[6],
                  borderRadius: borderRadius.xl,
                  marginBottom: spacing[6],
                }}>
                  {[
                    { label: '店舗名', value: formData.shop_name },
                    { label: '担当者名', value: formData.name },
                    { label: '性別', value: formData.gender },
                    { label: '年齢', value: formData.age + '歳' },
                    { label: '電話番号', value: formData.phone_number },
                    { label: 'メールアドレス', value: formData.email },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: spacing[4],
                        borderBottom: index < 5 ? `1px solid ${colors.neutral[200]}` : 'none',
                      }}
                    >
                      <span style={{
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600],
                        fontWeight: typography.fontWeight.medium,
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontFamily: typography.fontFamily.japanese,
                        fontSize: typography.fontSize.base,
                        color: colors.neutral[900],
                        fontWeight: typography.fontWeight.semibold,
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}


          {/* フッターボタン */}
          <div style={{
            marginTop: spacing[10],
            display: 'flex',
            gap: spacing[4],
            justifyContent: 'flex-end',
          }}>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                >
                  戻る
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                style={{ minWidth: '200px' }}
              >
                {currentStep === 3 ? '登録する' : '次へ'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
