'use client'

import { useState, useEffect } from 'react'
import { LineProfile } from '@/lib/auth'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { colors, spacing, typography, borderRadius, shadows, transitions } from '@/styles/design-system'
import Button from './ui/Button'
import Input from './ui/Input'

interface RegistrationFormProps {
  userProfile: any
  onRegistrationComplete: () => void
}

const FORM_DRAFT_KEY = 'registration_form_draft'

export default function RegistrationFormModern({ userProfile, onRegistrationComplete }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const isLineLogin = userProfile?.authType === 'line'

  const [formData, setFormData] = useState({
    company_name: '',
    name: '',
    gender: '',
    age: '',
    phone_number: '',
    email:
    isLineLogin && userProfile?.email?.startsWith('line_') && userProfile?.email.includes('@line.local')
      ? ''
      : userProfile?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)
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
      if (saved.currentStep) {
        setCurrentStep(saved.currentStep)
      }
    } catch (err) {
      console.warn('[RegistrationFormModern] Failed to load draft:', err)
    }
  }
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

      const userId = user?.id || userProfile?.userId || storedLineProfile?.userId

      if (!userId)
        throw new Error('LINE認証が完了していません。もう一度LINEでログインしてください。')

      const upsertPayload: Record<string, any> = {
        id: userId,
        line_user_id: isLineLogin ? (userProfile?.userId ?? userId) : userId,
        email: formData.email,
        name: formData.name,
        company_name: formData.company_name,
        phone_number: formData.phone_number,
        gender: formData.gender,
        age: parseInt(formData.age),
        is_approved: false,
      }

      const { error: insertError } = await supabase
        .from('organizers')
        .upsert({
          ...upsertPayload,
        })

      if (insertError) throw insertError

      onRegistrationComplete()
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

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
        currentStep,
      })
    )
  }, [formData, currentStep])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!draftLoaded) {
      loadDraftFromStorage()
      setDraftLoaded(true)
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadDraftFromStorage()
      }
    }

    window.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pageshow', handleVisibility)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pageshow', handleVisibility)
    }
  }, [draftLoaded])

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 100%)`,
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
            background: `linear-gradient(180deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
            padding: sidebarPadding,
            color: colors.neutral[0],
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
                主催者登録
              </h1>
              <p style={{
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                opacity: 0.9,
              }}>
                イベントを開催するための登録を行います
              </p>
            </div>

            <div style={{ flex: 1 }}>
              {[
                { num: 1, title: '基本情報', desc: '会社名・担当者名' },
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
                    color: currentStep >= step.num ? colors.primary[500] : colors.neutral[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: typography.fontWeight.bold,
                    fontSize: typography.fontSize.lg,
                    flexShrink: 0,
                    border: currentStep === step.num ? `3px solid ${colors.neutral[0]}` : 'none',
                    boxShadow: currentStep === step.num ? shadows.lg : 'none',
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
                  会社名と担当者名を入力してください
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
                  <Input
                    label="会社名・団体名"
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="株式会社デミセル"
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
                    placeholder="30"
                    min={0}
                    required
                    fullWidth
                  />
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
                  {isLineLogin && (
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginTop: spacing[2] }}>
                      LINEアカウントで登録済みのメールアドレス（例: your@email.com）を入力してください。
                    </p>
                  )}
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
                    { label: '会社名・団体名', value: formData.company_name },
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
              justifyContent: isDesktop ? 'flex-end' : 'stretch',
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'center' : 'stretch',
              width: '100%',
            }}>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                  fullWidth={!isDesktop}
                >
                  戻る
                </Button>
              )}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                style={{ minWidth: isDesktop ? '200px' : 'auto' }}
                fullWidth={!isDesktop}
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
