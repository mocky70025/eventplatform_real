'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'

interface EventFormProps {
  organizer: any
  onEventCreated: (event: any) => void
  onCancel: () => void
}

export default function EventFormUltra({ organizer, onEventCreated, onCancel }: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  })

  const steps = [
    { number: 1, title: '基本情報', icon: '📝' },
    { number: 2, title: '日程・会場', icon: '📅' },
    { number: 3, title: '申込設定', icon: '⚙️' },
    { number: 4, title: '確認', icon: '✓' },
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
        return <Step4Confirmation formData={formData} />
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
                  {currentStep > step.number ? '✓' : step.icon}
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
function Step1BasicInfo({ formData, setFormData }: any) {
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
          onChange={(value) => setFormData({ ...formData, event_name: value })}
          placeholder="例: 春の手作り市"
        />

        <FormField
          label="ジャンル"
          required
          type="select"
          value={formData.genre}
          onChange={(value) => setFormData({ ...formData, genre: value })}
          options={['フリーマーケット', 'クラフト市', '音楽フェス', '食イベント', 'その他']}
        />

        <FormField
          label="イベント概要"
          required
          type="textarea"
          value={formData.lead_text}
          onChange={(value) => setFormData({ ...formData, lead_text: value })}
          placeholder="イベントの簡単な説明を記入してください"
          rows={3}
        />

        <FormField
          label="詳細説明"
          type="textarea"
          value={formData.event_description}
          onChange={(value) => setFormData({ ...formData, event_description: value })}
          placeholder="イベントの詳しい内容を記入してください"
          rows={6}
        />
      </div>
    </div>
  )
}

// ステップ2: 日程・会場
function Step2Schedule({ formData, setFormData }: any) {
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
            onChange={(value) => setFormData({ ...formData, event_start_date: value })}
          />

          <FormField
            label="終了日"
            type="date"
            value={formData.event_end_date}
            onChange={(value) => setFormData({ ...formData, event_end_date: value })}
          />
        </div>

        <FormField
          label="開催時間"
          value={formData.event_time}
          onChange={(value) => setFormData({ ...formData, event_time: value })}
          placeholder="例: 10:00〜17:00"
        />

        <FormField
          label="会場名"
          required
          value={formData.venue_name}
          onChange={(value) => setFormData({ ...formData, venue_name: value })}
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
            onChange={(value) => setFormData({ ...formData, venue_city: value })}
            placeholder="例: 静岡市"
          />

          <FormField
            label="町名"
            value={formData.venue_town}
            onChange={(value) => setFormData({ ...formData, venue_town: value })}
            placeholder="例: 葵区"
          />
        </div>

        <FormField
          label="住所"
          value={formData.venue_address}
          onChange={(value) => setFormData({ ...formData, venue_address: value })}
          placeholder="例: 〇〇1-2-3"
        />
      </div>
    </div>
  )
}

// ステップ3: 申込設定
function Step3Application({ formData, setFormData }: any) {
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
          onChange={(value) => setFormData({ ...formData, application_end_date: value })}
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
function Step4Confirmation({ formData }: any) {
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
      </div>
    </div>
  )
}

// フォームフィールドコンポーネント
function FormField({ label, required, type = 'text', value, onChange, placeholder, options, rows }: any) {
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

  const handleFocus = (e: any) => {
    e.currentTarget.style.borderColor = colors.primary[500]
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
  }

  const handleBlur = (e: any) => {
    e.currentTarget.style.borderColor = colors.neutral[200]
    e.currentTarget.style.boxShadow = 'none'
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
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
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
function ConfirmSection({ title, children }: any) {
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
function ConfirmRow({ label, value }: any) {
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

