// EventFormUltra - イベント作成フォーム (型安全版)
'use client'

import { useState } from 'react'
import type { ChangeEvent, Dispatch, FocusEvent, ReactNode, SetStateAction } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'
import { DocumentIcon, CalendarIcon, GearIcon, CheckIcon } from './icons'
import { uploadEventImage, getPublicUrl } from '@/lib/storage'

interface EventFormProps {
  organizer: any
  onEventCreated: (event: any) => void
  onCancel: () => void
}

interface EventFormData {
  event_name: string
  genre: string
  lead_text: string
  event_description: string
  event_start_date: string
  event_end_date: string
  event_time: string
  venue_name: string
  venue_city: string
  venue_town: string
  venue_address: string
  application_end_date: string
  main_image_caption: string
  additional_image1_caption: string
  additional_image2_caption: string
}

type ImageField = 'main' | 'additional1' | 'additional2'

const CAPTION_FIELD_MAP: Record<ImageField, keyof EventFormData> = {
  main: 'main_image_caption',
  additional1: 'additional_image1_caption',
  additional2: 'additional_image2_caption',
}

export default function EventFormUltra({ organizer, onEventCreated, onCancel }: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    // 基本情報
    event_name: '',
    genre: '',
    lead_text: '',
    event_description: '',
    
    // 日程
    event_start_date: '',
    event_end_date: '',
    event_time: '',
    
    // 会場
    venue_name: '',
    venue_city: '',
    venue_town: '',
    venue_address: '',
    
    // 申込
    application_end_date: '',
    main_image_caption: '',
    additional_image1_caption: '',
    additional_image2_caption: '',
  })
  const [imageFiles, setImageFiles] = useState<Record<ImageField, File | null>>({
    main: null,
    additional1: null,
    additional2: null,
  })
  const [imagePreviews, setImagePreviews] = useState<Record<ImageField, string>>({
    main: '',
    additional1: '',
    additional2: '',
  })
  const handleImageChange = (field: ImageField, file: File | null, preview: string) => {
    setImageFiles((prev) => ({ ...prev, [field]: file }))
    setImagePreviews((prev) => ({ ...prev, [field]: preview }))
  }

  const handleCaptionChange = (field: ImageField, value: string) => {
    setFormData((prev) => ({ ...prev, [CAPTION_FIELD_MAP[field]]: value }))
  }

  const steps = [
    { number: 1, title: '基本情報', icon: <DocumentIcon width={20} height={20} /> },
    { number: 2, title: '日程・会場', icon: <CalendarIcon width={20} height={20} /> },
    { number: 3, title: '申込設定', icon: <GearIcon width={20} height={20} /> },
    { number: 4, title: '確認', icon: <CheckIcon width={20} height={20} /> },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('ログインが必要です')
        return
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...formData,
          organizer_id: user.id,
          approval_status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      const uploadUrls: Record<ImageField, string | null> = {
        main: null,
        additional1: null,
        additional2: null,
      }

      for (const field of Object.keys(imageFiles) as ImageField[]) {
        const file = imageFiles[field]
        if (!file) continue
        const imageType = field === 'main' ? 'main' : 'additional'
        const imageIndex = field === 'main' ? undefined : field === 'additional1' ? 1 : 2
        const uploadResult = await uploadEventImage(file, data.id, imageType, imageIndex)
        if (uploadResult.error) throw uploadResult.error
        uploadUrls[field] = getPublicUrl('event-images', uploadResult.data!.path)
      }

      if (uploadUrls.main || uploadUrls.additional1 || uploadUrls.additional2) {
        const updatePayload: any = {}
        if (uploadUrls.main) updatePayload.main_image_url = uploadUrls.main
        if (uploadUrls.additional1) updatePayload.additional_image1_url = uploadUrls.additional1
        if (uploadUrls.additional2) updatePayload.additional_image2_url = uploadUrls.additional2
        const { error: updateError } = await supabase
          .from('events')
          .update(updatePayload)
          .eq('id', data.id)
        if (updateError) throw updateError
      }

      alert('イベントを作成しました！審査をお待ちください。')
      onEventCreated(data)
  } catch (error: any) {
    console.error('Failed to create event:', error)
    alert('イベントの作成に失敗しました: ' + error.message)
  } finally {
    setLoading(false)
  }
}

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />
      case 2:
        return <Step2Schedule formData={formData} setFormData={setFormData} />
      case 3:
        return <Step3Application formData={formData} setFormData={setFormData} />
      case 4:
        return (
          <Step4Confirmation
            formData={formData}
            imagePreviews={imagePreviews}
            onImageChange={handleImageChange}
            onCaptionChange={handleCaptionChange}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.event_name && formData.genre && formData.lead_text
      case 2:
        return formData.event_start_date && formData.venue_name && formData.venue_city
      case 3:
        return formData.application_end_date
      default:
        return true
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
            <Button variant="ghost" onClick={onCancel}>
              ← 戻る
            </Button>
            <h1 style={{
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            }}>
              新しいイベントを作成
            </h1>
          </div>

          {/* ステップインジケーター */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* プログレスバー */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '0',
              right: '0',
              height: '4px',
              background: colors.neutral[200],
              borderRadius: borderRadius.full,
              zIndex: 0,
            }}>
              <div style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                height: '100%',
                background: colors.primary[500],
                borderRadius: borderRadius.full,
                transition: `width ${transitions.normal}`,
              }} />
            </div>

            {/* ステップ */}
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing[2],
                  zIndex: 1,
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: borderRadius.full,
                  background: currentStep >= step.number ? colors.primary[500] : colors.neutral[200],
                  color: currentStep >= step.number ? colors.neutral[0] : colors.neutral[600],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  transition: `all ${transitions.normal}`,
                  boxShadow: currentStep === step.number ? shadows.lg : 'none',
                }}>
                {currentStep > step.number ? <CheckIcon width={20} height={20} /> : step.icon}
                </div>
                <div style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: currentStep === step.number ? typography.fontWeight.bold : typography.fontWeight.normal,
                  color: currentStep >= step.number ? colors.neutral[900] : colors.neutral[600],
                }}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* フォームコンテンツ */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: spacing[8],
      }}>
      <div style={{
        background: colors.neutral[0],
        borderRadius: borderRadius.xl,
        padding: spacing[8],
        boxShadow: shadows.card,
        minHeight: '500px',
      }}>
        {renderStep()}
      </div>

        {/* ナビゲーションボタン */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: spacing[6],
        }}>
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel()}
          >
            {currentStep === 1 ? 'キャンセル' : '← 前へ'}
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              次へ →
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '作成中...' : 'イベントを作成'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ステップ1: 基本情報
interface StepProps {
  formData: EventFormData
  setFormData: Dispatch<SetStateAction<EventFormData>>
}

function Step1BasicInfo({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[6],
      }}>
        イベントの基本情報
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
        <FormField
          label="イベント名"
          required
          value={formData.event_name}
          onChange={(value: string) => {
            setFormData({ ...formData, event_name: value })
          }}
          placeholder="例: 春の手作り市"
        />

        <FormField
          label="ジャンル"
          required
          type="select"
          value={formData.genre}
          onChange={(value: string) => {
            setFormData({ ...formData, genre: value })
          }}
          options={['フリーマーケット', 'クラフト市', '音楽フェス', '食イベント', 'その他']}
        />

        <FormField
          label="イベント概要"
          required
          type="textarea"
          value={formData.lead_text}
          onChange={(value: string) => {
            setFormData({ ...formData, lead_text: value })
          }}
          placeholder="イベントの簡単な説明を記入してください"
          rows={3}
        />

        <FormField
          label="詳細説明"
          type="textarea"
          value={formData.event_description}
          onChange={(value: string) => {
            setFormData({ ...formData, event_description: value })
          }}
          placeholder="イベントの詳しい内容を記入してください"
          rows={6}
        />
      </div>
    </div>
  )
}

// ステップ2: 日程・会場
function Step2Schedule({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[6],
      }}>
        日程と会場
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing[4],
        }}>
          <FormField
            label="開始日"
            required
            type="date"
            value={formData.event_start_date}
            onChange={(value: string) => {
              setFormData({ ...formData, event_start_date: value })
            }}
          />

          <FormField
            label="終了日"
            type="date"
            value={formData.event_end_date}
            onChange={(value: string) => {
              setFormData({ ...formData, event_end_date: value })
            }}
          />
        </div>

        <FormField
          label="開催時間"
          value={formData.event_time}
          onChange={(value: string) => {
            setFormData({ ...formData, event_time: value })
          }}
          placeholder="例: 10:00〜17:00"
        />

        <FormField
          label="会場名"
          required
          value={formData.venue_name}
          onChange={(value: string) => {
            setFormData({ ...formData, venue_name: value })
          }}
          placeholder="例: 〇〇公園"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing[4],
        }}>
          <FormField
            label="市区町村"
            required
            value={formData.venue_city}
            onChange={(value: string) => {
              setFormData({ ...formData, venue_city: value })
            }}
            placeholder="例: 静岡市"
          />

          <FormField
            label="町名"
            value={formData.venue_town}
            onChange={(value: string) => {
              setFormData({ ...formData, venue_town: value })
            }}
            placeholder="例: 葵区"
          />
        </div>

        <FormField
          label="住所"
          value={formData.venue_address}
          onChange={(value: string) => {
            setFormData({ ...formData, venue_address: value })
          }}
          placeholder="例: 〇〇1-2-3"
        />
      </div>
    </div>
  )
}

// ステップ3: 申込設定
function Step3Application({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[6],
      }}>
        出店申込の設定
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
        <FormField
          label="申込締切日"
          required
          type="date"
          value={formData.application_end_date}
          onChange={(value: string) => {
            setFormData({ ...formData, application_end_date: value })
          }}
        />

        <div style={{
          background: colors.primary[50],
          borderRadius: borderRadius.lg,
          padding: spacing[4],
        }}>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral[700],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            💡 <strong>ヒント:</strong> 申込締切日は、イベント開始日の1週間前以上に設定することをおすすめします。
          </div>
        </div>
      </div>
    </div>
  )
}

// ステップ4: 確認
interface Step4Props {
  formData: EventFormData
  imagePreviews: Record<ImageField, string>
  onImageChange: (field: ImageField, file: File | null, preview: string) => void
  onCaptionChange: (field: ImageField, value: string) => void
}

function Step4Confirmation({ formData, imagePreviews, onImageChange, onCaptionChange }: Step4Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '未設定'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div>
      <h2 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[6],
      }}>
        内容を確認
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[6],
      }}>
        <ConfirmSection title="基本情報">
          <ConfirmRow label="イベント名" value={formData.event_name} />
          <ConfirmRow label="ジャンル" value={formData.genre} />
          <ConfirmRow label="概要" value={formData.lead_text} />
        </ConfirmSection>

        <ConfirmSection title="日程・会場">
          <ConfirmRow label="開催期間" value={`${formatDate(formData.event_start_date)} 〜 ${formatDate(formData.event_end_date)}`} />
          <ConfirmRow label="開催時間" value={formData.event_time || '未設定'} />
          <ConfirmRow label="会場" value={`${formData.venue_name} (${formData.venue_city} ${formData.venue_town || ''})`} />
        </ConfirmSection>

        <ConfirmSection title="申込設定">
          <ConfirmRow label="申込締切" value={formatDate(formData.application_end_date)} />
        </ConfirmSection>

        <div style={{
          background: colors.status.warning.light,
          borderRadius: borderRadius.lg,
          padding: spacing[4],
        }}>
          <div style={{
            fontSize: typography.fontSize.sm,
            color: colors.status.warning.dark,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            ⚠️ <strong>注意:</strong> イベントを作成すると、管理者による審査が行われます。承認されるまでイベントは公開されません。
          </div>
        </div>
        <div style={{
          marginTop: spacing[4],
        }}>
          <h3 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[3],
          }}>
            イベント画像
          </h3>
          <div style={{ display: 'flex', gap: spacing[4], flexWrap: 'wrap' }}>
            {[
              { field: 'main' as ImageField, label: 'メイン画像', captionPlaceholder: '例: ブース全体の雰囲気' },
              { field: 'additional1' as ImageField, label: '追加画像①', captionPlaceholder: '例: 代表メニューのアップ' },
              { field: 'additional2' as ImageField, label: '追加画像②', captionPlaceholder: '例: 会場の賑わい' },
            ].map(({ field, label, captionPlaceholder }) => (
              <div key={field} style={{
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[2],
              }}>
                <label style={{
                  fontFamily: typography.fontFamily.japanese,
                  color: colors.neutral[600],
                }}>{label}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    const preview = file ? URL.createObjectURL(file) : ''
                    onImageChange(field, file, preview)
                  }}
                  style={{
                    border: `1px dashed ${colors.neutral[300]}`,
                    borderRadius: borderRadius.lg,
                    padding: spacing[3],
                    cursor: 'pointer',
                  }}
                />
                {imagePreviews[field] && (
                  <img
                    src={imagePreviews[field]}
                    alt={label}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: borderRadius.lg,
                    }}
                  />
                )}
                <label style={{
                  fontFamily: typography.fontFamily.japanese,
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: 0,
                }}>キャプション（任意）</label>
                <input
                  type="text"
                  maxLength={80}
                  placeholder={captionPlaceholder}
                  value={formData[CAPTION_FIELD_MAP[field]]}
                  onChange={(e) => onCaptionChange(field, e.target.value)}
                  style={{
                    borderRadius: borderRadius.lg,
                    border: `1px solid ${colors.neutral[200]}`,
                    padding: spacing[2],
                    fontFamily: typography.fontFamily.japanese,
                    fontSize: typography.fontSize.sm,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// フォームフィールドコンポーネント
interface FormFieldProps {
  label: string
  required?: boolean
  type?: 'text' | 'textarea' | 'select' | 'date' | 'tel' | 'email'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options?: string[]
  rows?: number
}

function FormField({ label, required, type = 'text', value, onChange, placeholder, options, rows }: FormFieldProps) {
  const inputStyle = {
    width: '100%',
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.japanese,
    border: `2px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.lg,
    outline: 'none',
    transition: `all ${transitions.fast}`,
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = colors.primary[500]
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = colors.neutral[200]
    e.currentTarget.style.boxShadow = 'none'
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutral[900],
        marginBottom: spacing[2],
      }}>
        {label} {required && <span style={{ color: colors.status.error.main }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows || 4}
          required={required}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          required={required}
          style={{ ...inputStyle, background: colors.neutral[0] }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option value="">選択してください</option>
          {options?.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </div>
  )
}

// 確認セクション
function ConfirmSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{
      background: colors.neutral[50],
      borderRadius: borderRadius.lg,
      padding: spacing[5],
    }}>
      <h3 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[4],
      }}>
        {title}
      </h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
      }}>
        {children}
      </div>
    </div>
  )
}

// 確認行
function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      gap: spacing[3],
    }}>
      <div style={{
        fontSize: typography.fontSize.sm,
        color: colors.neutral[600],
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
  )
}
