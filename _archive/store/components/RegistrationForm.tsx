'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, type Exhibitor } from '@/lib/supabase'
import ImageUpload from './ImageUpload'
import ProgressBar from './ProgressBar'

interface RegistrationFormProps {
  userProfile: any
  onRegistrationComplete: () => void
}

type Step = 1 | 2 | 3

interface ExhibitorFormState {
  name: string
  gender: '' | '男' | '女' | 'それ以外'
  age: number
  phone_number: string
  email: string
  genre_category: string
  genre_free_text: string
}

interface ExhibitorDocumentState {
  business_license: string
  vehicle_inspection: string
  automobile_inspection: string
  pl_insurance: string
  fire_equipment_layout: string
}

interface ExhibitorDraftPayload {
  currentStep: Step
  formData: ExhibitorFormState
  documentUrls: ExhibitorDocumentState
  termsAccepted: boolean
  hasViewedTerms: boolean
}

const SAVE_DEBOUNCE_MS = 800
const EXHIBITOR_DRAFT_TYPE = 'exhibitor_registration'

const EXHIBITOR_FORM_INITIAL: ExhibitorFormState = {
  name: '',
  gender: '',
  age: 0,
  phone_number: '',
  email: '',
  genre_category: '',
  genre_free_text: '',
}

const EXHIBITOR_DOCUMENT_INITIAL: ExhibitorDocumentState = {
  business_license: '',
  vehicle_inspection: '',
  automobile_inspection: '',
  pl_insurance: '',
  fire_equipment_layout: '',
}

const hasExhibitorDraftContent = (payload: ExhibitorDraftPayload): boolean => {
  const hasFormValue = Object.values(payload.formData).some((value) => {
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'number') return value > 0
    return false
  })

  if (hasFormValue) return true

  const hasDocument = Object.values(payload.documentUrls).some((value) => value.trim() !== '')
  return hasDocument
}

const coerceStep = (value: number): Step => {
  if (value === 2) return 2
  if (value === 3) return 3
  return 1
}

export default function RegistrationForm({ userProfile, onRegistrationComplete }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<ExhibitorFormState>({ ...EXHIBITOR_FORM_INITIAL })
  const [documentUrls, setDocumentUrls] = useState<ExhibitorDocumentState>({ ...EXHIBITOR_DOCUMENT_INITIAL })

  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsPage, setShowTermsPage] = useState(false)
  const [hasViewedTerms, setHasViewedTerms] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [licenseVerificationStatus, setLicenseVerificationStatus] = useState<{
    verifying: boolean
    result: 'yes' | 'no' | null
    expirationDate: string | null
    reason: string | null
  }>({
    verifying: false,
    result: null,
    expirationDate: null,
    reason: null
  })

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPayloadRef = useRef<string>('')
  const draftExistsRef = useRef(false)

  const upsertDraft = useCallback(
    async (payload: ExhibitorDraftPayload) => {
      if (!userProfile?.userId) return
      const { error } = await supabase
        .from('form_drafts')
        .upsert(
          {
            user_id: userProfile.userId,
            form_type: EXHIBITOR_DRAFT_TYPE,
            payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id, form_type' }
        )

      if (error) throw error
      draftExistsRef.current = true
    },
    [userProfile?.userId]
  )

  const removeDraft = useCallback(async () => {
    if (!userProfile?.userId || !draftExistsRef.current) return
    const { error } = await supabase
      .from('form_drafts')
      .delete()
      .eq('user_id', userProfile.userId)
      .eq('form_type', EXHIBITOR_DRAFT_TYPE)

    if (error) throw error
    draftExistsRef.current = false
  }, [userProfile?.userId])

  const scheduleDraftUpsert = useCallback(
    (payload: ExhibitorDraftPayload) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        saveTimeoutRef.current = null
        try {
          await upsertDraft(payload)
        } catch (error) {
          console.error('Failed to save registration draft:', error)
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [upsertDraft]
  )

  const scheduleDraftDeletion = useCallback(() => {
    if (!draftExistsRef.current) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      saveTimeoutRef.current = null
      try {
        await removeDraft()
      } catch (error) {
        console.error('Failed to delete registration draft:', error)
      }
    }, SAVE_DEBOUNCE_MS)
  }, [removeDraft])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    const loadDraft = async () => {
      if (!userProfile?.userId) {
        if (!isCancelled) setDraftLoaded(true)
        return
      }

      try {
        const { data, error } = await supabase
          .from('form_drafts')
          .select('payload')
          .eq('user_id', userProfile.userId)
          .eq('form_type', EXHIBITOR_DRAFT_TYPE)
          .limit(1)

        if (error) {
          throw error
        }

        const record = data?.[0]

        if (record?.payload && !isCancelled) {
          const payload = record.payload as Partial<ExhibitorDraftPayload>

          const restoredFormData: ExhibitorFormState = {
            ...EXHIBITOR_FORM_INITIAL,
            ...(payload.formData ?? {}),
          }
          const restoredDocuments: ExhibitorDocumentState = {
            ...EXHIBITOR_DOCUMENT_INITIAL,
            ...(payload.documentUrls ?? {}),
          }
          const restoredStep = payload.currentStep ? coerceStep(Number(payload.currentStep)) : 1
          const restoredTermsAccepted = Boolean(payload.termsAccepted)
          const restoredHasViewedTerms = Boolean(payload.hasViewedTerms)

          setFormData(restoredFormData)
          setDocumentUrls(restoredDocuments)
          setCurrentStep(restoredStep)
          setTermsAccepted(restoredTermsAccepted)
          setHasViewedTerms(restoredHasViewedTerms)

          draftExistsRef.current = true
          lastPayloadRef.current = JSON.stringify({
            currentStep: restoredStep,
            formData: restoredFormData,
            documentUrls: restoredDocuments,
            termsAccepted: restoredTermsAccepted,
            hasViewedTerms: restoredHasViewedTerms,
          })
        }
      } catch (error) {
        console.error('Failed to load registration draft:', error)
      } finally {
        if (!isCancelled) {
          setDraftLoaded(true)
        }
      }
    }

    loadDraft()

    return () => {
      isCancelled = true
    }
  }, [userProfile?.userId])

  useEffect(() => {
    if (!draftLoaded) return

    const payload: ExhibitorDraftPayload = {
      currentStep,
      formData,
      documentUrls,
      termsAccepted,
      hasViewedTerms,
    }

    if (!hasExhibitorDraftContent(payload)) {
      lastPayloadRef.current = ''
      scheduleDraftDeletion()
      return
    }

    const serializedPayload = JSON.stringify(payload)
    if (lastPayloadRef.current === serializedPayload) return

    lastPayloadRef.current = serializedPayload
    scheduleDraftUpsert(payload)
  }, [
    formData,
    documentUrls,
    currentStep,
    termsAccepted,
    hasViewedTerms,
    draftLoaded,
    scheduleDraftUpsert,
    scheduleDraftDeletion,
  ])

  // 全角数字を半角に変換
  const convertToHalfWidth = (str: string): string => {
    return str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
  }

  // 電話番号のバリデーション（全角/半角数字を認識、ハイフンなし）
  const validatePhoneNumber = (phone: string): boolean => {
    const halfWidth = convertToHalfWidth(phone.replace(/-/g, ''))
    return /^\d+$/.test(halfWidth) && halfWidth.length >= 10 && halfWidth.length <= 15
  }

  // メールアドレスのバリデーション
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 年齢のバリデーション
  const validateAge = (age: number): boolean => {
    return age >= 0 && age <= 100
  }

  // フォームフィールドの共通スタイル（プレビューに基づく）
  const formFieldStyle = (hasError: boolean) => ({
    width: '100%',
    height: '44px',
    padding: '0 16px',
    background: '#FFFFFF',
    border: hasError ? '1px solid #FF3B30' : '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '15px',
    lineHeight: '44px',
    marginBottom: '20px',
    boxSizing: 'border-box' as const,
    fontFamily: '"Inter", "Noto Sans JP", sans-serif'
  })

  const labelStyle = {
    display: 'block',
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal' as const,
    fontWeight: 700,
    color: '#2C3E50',
    marginBottom: '8px'
  }

  const inputStyle = (hasValue: boolean) => ({
    width: '100%',
    height: '44px',
    padding: '0 16px',
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    lineHeight: '44px',
    color: hasValue ? '#2C3E50' : '#6C757D',
    marginBottom: '20px',
    boxSizing: 'border-box' as const,
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    outline: 'none'
  })

  // バリデーション実行
  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.name.trim()) newErrors.name = true
    if (!formData.gender) newErrors.gender = true
    if (!validateAge(formData.age)) newErrors.age = true
    if (!validatePhoneNumber(formData.phone_number)) newErrors.phone_number = true
    if (!validateEmail(formData.email)) newErrors.email = true
    if (!formData.genre_category) newErrors.genre_category = true
    if (!formData.genre_free_text.trim()) newErrors.genre_free_text = true
    if (!documentUrls.business_license) newErrors.business_license = true
    if (!documentUrls.vehicle_inspection) newErrors.vehicle_inspection = true
    if (!documentUrls.automobile_inspection) newErrors.automobile_inspection = true
    if (!documentUrls.pl_insurance) newErrors.pl_insurance = true
    if (!documentUrls.fire_equipment_layout) newErrors.fire_equipment_layout = true
    if (!termsAccepted) newErrors.termsAccepted = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1) {
      // ステップ1からステップ2へ
      if (!validateForm()) {
        // エラーがある場合、最初のエラーフィールドにスクロール
        const firstErrorKey = Object.keys(errors).find(key => errors[key])
        if (firstErrorKey) {
          const errorElement = document.querySelector(`[data-error-field="${firstErrorKey}"]`)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // フォーカス可能な要素があればフォーカス
            const inputElement = errorElement.querySelector('input, select, textarea')
            if (inputElement) {
              (inputElement as HTMLElement).focus()
            }
          }
        }
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // ステップ2からステップ3へ
      setCurrentStep(3)
    }
    // 次のステップに進んだときにページトップにスクロール
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  // 利用規約ページから戻ったときのチェック
  const handleBackFromTerms = () => {
    setShowTermsPage(false)
    setHasViewedTerms(true) // 利用規約ページを見たことを記録
    // スクロール位置は保持（ページトップに戻さない）
    // フォームがすべて入力されているかチェック
    const isValid = validateForm()
    // エラーがある場合は、最初のエラーフィールドにスクロール（ただし、現在のスクロール位置を基準に）
    if (!isValid) {
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors).find(key => errors[key])
        if (firstErrorKey) {
          const errorElement = document.querySelector(`[data-error-field="${firstErrorKey}"]`)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 100)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const verifyBusinessLicense = async (imageUrl: string) => {
    console.log('[RegistrationForm] Starting business license verification, imageUrl:', imageUrl)
    setLicenseVerificationStatus({
      verifying: true,
      result: null,
      expirationDate: null,
      reason: null
    })

    try {
      const response = await fetch('/api/events/verify-business-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl
        })
      })

      console.log('[RegistrationForm] API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[RegistrationForm] API error:', errorData)
        throw new Error(errorData.error || 'Failed to verify business license')
      }

      const data = await response.json()
      console.log('[RegistrationForm] API response data:', data)
      
      setLicenseVerificationStatus({
        verifying: false,
        result: data.result,
        expirationDate: data.expirationDate,
        reason: data.reason
      })

      console.log('[RegistrationForm] License verification status updated:', {
        result: data.result,
        expirationDate: data.expirationDate,
        reason: data.reason
      })

      // 期限切れの場合は警告を表示（登録は可能）
      if (data.result === 'no') {
        alert('⚠️ 営業許可証の期限が切れています。\n\n登録は可能ですが、期限切れの営業許可証ではイベントへの出店ができない場合があります。\n\n営業許可証の更新をお願いします。')
      }
    } catch (error: any) {
      console.error('[RegistrationForm] Failed to verify business license:', error)
      // エラー時も結果を表示（登録は可能）
      setLicenseVerificationStatus({
        verifying: false,
        result: 'no',
        expirationDate: null,
        reason: error.message || '期限確認に失敗しました。画像を確認してください。'
      })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const authType = (userProfile as any).authType || 'line'

      const { data: existingUser } = await supabase
        .from('exhibitors')
        .select('id')
        .or(`id.eq.${userProfile.userId},line_user_id.eq.${userProfile.userId}`)
        .maybeSingle()

      if (existingUser) {
        alert('既に登録済みです。')
        setLoading(false)
        return
      }

      // 電話番号を半角に変換（ハイフン削除）
      const normalizedPhone = convertToHalfWidth(formData.phone_number.replace(/-/g, ''))

      // 書類のURLを設定
      const documentImageUrls: Partial<Exhibitor> = {}
      
      if (documentUrls.business_license) {
        documentImageUrls.business_license_image_url = documentUrls.business_license
      }
      if (documentUrls.vehicle_inspection) {
        documentImageUrls.vehicle_inspection_image_url = documentUrls.vehicle_inspection
      }
      if (documentUrls.automobile_inspection) {
        documentImageUrls.automobile_inspection_image_url = documentUrls.automobile_inspection
      }
      if (documentUrls.pl_insurance) {
        documentImageUrls.pl_insurance_image_url = documentUrls.pl_insurance
      }
      if (documentUrls.fire_equipment_layout) {
        documentImageUrls.fire_equipment_layout_image_url = documentUrls.fire_equipment_layout
      }

      // 挿入データの準備
      const insertData: any = {
        ...formData,
        phone_number: normalizedPhone,
        ...documentImageUrls,
      }

      if (authType === 'line') {
        insertData.line_user_id = userProfile.userId
      } else {
        insertData.id = userProfile.userId
      }

      const { error } = await supabase
        .from('exhibitors')
        .insert(insertData)

      if (error) {
        console.error('Supabase error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Insert data:', JSON.stringify(insertData, null, 2))
        console.error('User profile:', userProfile)
        
        // より詳細なエラーメッセージを表示
        let errorMessage = '不明なエラー'
        if (error.message) {
          errorMessage = error.message
        } else if (error.details) {
          errorMessage = error.details
        } else if (error.hint) {
          errorMessage = error.hint
        }
        
        throw new Error(errorMessage)
      }

      try {
        await removeDraft()
        lastPayloadRef.current = ''
        setDraftLoaded(false)
      } catch (draftError) {
        console.error('Failed to clear registration draft after submit:', draftError)
      }

      setCurrentStep(3)
    } catch (error) {
      console.error('Registration failed:', error)
      const errorMessage = error instanceof Error ? error.message : '不明なエラー'
      alert(`登録に失敗しました。エラー: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 進捗インジケーター（3ステップ）- 完成図に合わせて実装
  const ProgressIndicator = () => {
    const step1Color = currentStep >= 1 ? '#5DABA8' : '#D9D9D9'
    const step2Color = currentStep >= 2 ? '#5DABA8' : '#D9D9D9'
    const step3Color = currentStep >= 3 ? '#5DABA8' : '#D9D9D9'
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '32px', 
        paddingTop: '24px',
        background: '#E8F5F5',
        padding: '24px 16px'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px', display: 'flex', alignItems: 'center' }}>
          {/* ステップ1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {currentStep === 1 ? (
              <div style={{ color: step1Color, fontSize: '24px' }}>🚚</div>
            ) : currentStep > 1 ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                background: step1Color,
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(-45deg)' }}>
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
              </div>
            ) : (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                border: `2px solid ${step1Color}`,
                transform: 'rotate(45deg)',
                background: 'transparent'
              }} />
            )}
            <span style={{ 
              fontSize: '12px', 
              color: currentStep >= 1 ? '#5DABA8' : '#999999',
              marginTop: '8px',
              fontWeight: currentStep === 1 ? 600 : 400
            }}>
              情報登録
            </span>
        </div>
        
          {/* 線1 */}
          <div style={{ 
            flex: 1, 
            height: '2px', 
            background: step2Color,
            margin: '0 8px',
            marginTop: '-20px'
          }} />
        
          {/* ステップ2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {currentStep === 2 ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                background: step2Color,
                transform: 'rotate(45deg)'
              }} />
            ) : currentStep > 2 ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                background: step2Color,
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(-45deg)' }}>
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
              </div>
            ) : (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                border: `2px solid ${step2Color}`,
                transform: 'rotate(45deg)',
                background: 'transparent'
              }} />
            )}
            <span style={{ 
              fontSize: '12px', 
              color: currentStep >= 2 ? '#5DABA8' : '#999999',
              marginTop: '8px',
              fontWeight: currentStep === 2 ? 600 : 400
            }}>
              情報確認
            </span>
        </div>
        
          {/* 線2 */}
          <div style={{ 
            flex: 1, 
            height: '2px', 
            background: step3Color,
            margin: '0 8px',
            marginTop: '-20px'
          }} />
        
          {/* ステップ3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {currentStep >= 3 ? (
              <div style={{ color: step3Color, fontSize: '24px' }}>🚚</div>
            ) : (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px',
                border: `2px solid ${step3Color}`,
                transform: 'rotate(45deg)',
                background: 'transparent'
              }} />
            )}
            <span style={{ 
              fontSize: '12px', 
              color: currentStep >= 3 ? '#5DABA8' : '#999999',
              marginTop: '8px',
              fontWeight: currentStep === 3 ? 600 : 400
            }}>
            登録完了
          </span>
        </div>
      </div>
    </div>
  )
  }

  // ステップ1: 情報登録
  const renderStep1 = () => (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* プログレスバー */}
        <div style={{
          width: '100%',
          height: '93px',
          marginTop: '32px',
          marginBottom: '16px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          <ProgressBar currentStep={1} totalSteps={3} />
        </div>

        {/* フォーム */}
        <div style={{
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          paddingTop: '32px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}>
          {/* タイトル */}
          <h2 style={{
            margin: '0 0 24px',
            fontSize: '20px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            情報を入力してください
          </h2>
        
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* お名前 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="name">
              <label style={labelStyle}>お名前</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors({ ...errors, name: false })
                }}
                placeholder="例: 山田太郎"
                style={{
                  ...inputStyle(!!formData.name),
                  border: errors.name ? '1px solid #FF3B30' : '1px solid #E5E7EB'
                }}
              />
              {errors.name && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* 性別 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="gender">
              <label style={labelStyle}>性別</label>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, gender: e.target.value as any })
                    if (errors.gender) setErrors({ ...errors, gender: false })
                  }}
                  style={{
                    ...inputStyle(!!formData.gender),
                    border: errors.gender ? '1px solid #FF3B30' : '1px solid #E5E7EB',
                    paddingRight: '40px',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="男">男性</option>
                  <option value="女">女性</option>
                  <option value="それ以外">その他</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid #6C757D',
                  pointerEvents: 'none'
                }} />
              </div>
              {errors.gender && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* 年齢 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="age">
              <label style={labelStyle}>年齢</label>
              <input
                type="number"
                min={0}
                value={
                  formData.age < 0
                    ? 0
                    : formData.age > 99
                    ? 99
                    : formData.age || ''
                }
                onChange={(e) => {
                  const age = Math.min(99, Math.max(0, parseInt(e.target.value) || 0))
                  setFormData({ ...formData, age })
                  if (errors.age) setErrors({ ...errors, age: false })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && (formData.age || 0) <= 0) {
                    e.preventDefault()
                  }
                }}
                placeholder="例: 35"
                style={{
                  ...inputStyle(formData.age > 0),
                  border: errors.age ? '1px solid #FF3B30' : '1px solid #E5E7EB'
                }}
              />
              {errors.age && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* 電話番号 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="phone_number">
              <label style={labelStyle}>電話番号</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => {
                  setFormData({ ...formData, phone_number: e.target.value })
                  if (errors.phone_number) setErrors({ ...errors, phone_number: false })
                }}
                placeholder="例: 090-1234-5678"
                style={{
                  ...inputStyle(!!formData.phone_number),
                  border: errors.phone_number ? '1px solid #FF3B30' : '1px solid #E5E7EB'
                }}
              />
              {errors.phone_number && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* メールアドレス */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="email">
              <label style={labelStyle}>メールアドレス</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: false })
                }}
                placeholder="例: example@email.com"
                style={{
                  ...inputStyle(!!formData.email),
                  border: errors.email ? '1px solid #FF3B30' : '1px solid #E5E7EB'
                }}
              />
              {errors.email && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* ジャンル */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="genre_category">
              <label style={labelStyle}>ジャンル</label>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <select
                  value={formData.genre_category}
                  onChange={(e) => {
                    setFormData({ ...formData, genre_category: e.target.value })
                    if (errors.genre_category) setErrors({ ...errors, genre_category: false })
                  }}
                  style={{
                    ...inputStyle(!!formData.genre_category),
                    border: errors.genre_category ? '1px solid #FF3B30' : '1px solid #E5E7EB',
                    paddingRight: '40px',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="飲食">飲食</option>
                  <option value="物販">物販</option>
                  <option value="サービス">サービス</option>
                  <option value="その他">その他</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid #6C757D',
                  pointerEvents: 'none'
                }} />
              </div>
              {errors.genre_category && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* ジャンル（自由回答） */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="genre_free_text">
              <label style={labelStyle}>ジャンル（自由回答）</label>
              <textarea
                value={formData.genre_free_text}
                onChange={(e) => {
                  setFormData({ ...formData, genre_free_text: e.target.value })
                  if (errors.genre_free_text) setErrors({ ...errors, genre_free_text: false })
                }}
                placeholder="例: 焼きそば、たこ焼きなど"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px 16px',
                  background: '#FFFFFF',
                  border: errors.genre_free_text ? '1px solid #FF3B30' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: formData.genre_free_text ? '#2C3E50' : '#6C757D',
                  marginBottom: '20px',
                  boxSizing: 'border-box',
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              {errors.genre_free_text && (
                <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-16px', marginBottom: '20px' }}>入力してください</p>
              )}
            </div>

            {/* 書類アップロード */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>営業許可証</label>
              <ImageUpload
                label=""
                documentType="business_license"
                userId={userProfile.userId}
                currentImageUrl={documentUrls.business_license}
                onUploadComplete={async (url) => {
                  console.log('[RegistrationForm] business_license upload complete, URL:', url)
                  setDocumentUrls(prev => {
                    const updated = { ...prev, business_license: url }
                    console.log('[RegistrationForm] Updated documentUrls:', updated)
                    return updated
                  })
                  if (errors.business_license) setErrors({ ...errors, business_license: false })
                  
                  // アップロード完了後、自動で期限確認を実行
                  await verifyBusinessLicense(url)
                }}
                onUploadError={(error) => alert(error)}
                onImageDelete={() => {
                  setDocumentUrls(prev => ({ ...prev, business_license: '' }))
                  setLicenseVerificationStatus({
                    verifying: false,
                    result: null,
                    expirationDate: null,
                    reason: null
                  })
                }}
                hasError={errors.business_license}
              />
              {!documentUrls.business_license && (
                <p style={{
                  fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                  fontSize: '13px',
                  color: '#6C757D',
                  textAlign: 'center',
                  marginTop: '8px',
                  marginBottom: 0
                }}>
                  AI確認機能付き
                </p>
              )}
              {licenseVerificationStatus.result === 'yes' && licenseVerificationStatus.expirationDate && (
                <div style={{
                  width: '100%',
                  maxWidth: '289px',
                  marginTop: '16px',
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
                    期限: {licenseVerificationStatus.expirationDate}
                  </p>
                </div>
              )}
              {licenseVerificationStatus.verifying && (
                <p style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '12px',
                  lineHeight: '120%',
                  color: '#666666',
                  marginTop: '8px'
                }}>
                  期限を確認中...
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>車検証</label>
              <ImageUpload
                label=""
                documentType="vehicle_inspection"
                userId={userProfile.userId}
                currentImageUrl={documentUrls.vehicle_inspection}
                onUploadComplete={(url) => {
                  setDocumentUrls(prev => ({ ...prev, vehicle_inspection: url }))
                  if (errors.vehicle_inspection) setErrors({ ...errors, vehicle_inspection: false })
                }}
                onUploadError={(error) => alert(error)}
                onImageDelete={() => {
                  setDocumentUrls(prev => ({ ...prev, vehicle_inspection: '' }))
                }}
                hasError={errors.vehicle_inspection}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>自動車検査証</label>
              <ImageUpload
                label=""
                documentType="automobile_inspection"
                userId={userProfile.userId}
                currentImageUrl={documentUrls.automobile_inspection}
                onUploadComplete={(url) => {
                  setDocumentUrls(prev => ({ ...prev, automobile_inspection: url }))
                  if (errors.automobile_inspection) setErrors({ ...errors, automobile_inspection: false })
                }}
                onUploadError={(error) => alert(error)}
                onImageDelete={() => {
                  setDocumentUrls(prev => ({ ...prev, automobile_inspection: '' }))
                }}
                hasError={errors.automobile_inspection}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>PL保険</label>
              <ImageUpload
                label=""
                documentType="pl_insurance"
                userId={userProfile.userId}
                currentImageUrl={documentUrls.pl_insurance}
                onUploadComplete={(url) => {
                  setDocumentUrls(prev => ({ ...prev, pl_insurance: url }))
                  if (errors.pl_insurance) setErrors({ ...errors, pl_insurance: false })
                }}
                onUploadError={(error) => alert(error)}
                onImageDelete={() => {
                  setDocumentUrls(prev => ({ ...prev, pl_insurance: '' }))
                }}
                hasError={errors.pl_insurance}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>火器類配置図</label>
              <ImageUpload
                label=""
                documentType="fire_equipment_layout"
                userId={userProfile.userId}
                currentImageUrl={documentUrls.fire_equipment_layout}
                onUploadComplete={(url) => {
                  setDocumentUrls(prev => ({ ...prev, fire_equipment_layout: url }))
                  if (errors.fire_equipment_layout) setErrors({ ...errors, fire_equipment_layout: false })
                }}
                onUploadError={(error) => alert(error)}
                onImageDelete={() => {
                  setDocumentUrls(prev => ({ ...prev, fire_equipment_layout: '' }))
                }}
                hasError={errors.fire_equipment_layout}
              />
            </div>

          </div>

          {/* 次へ進むボタン */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              padding: '0',
              background: loading ? '#CCCCCC' : '#5DABA8', // Secondary Main（出店者用）
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '52px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 200ms ease'
            }}
          >
            <span>次へ進む</span>
            <span style={{ fontSize: '12px' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  )

  // ステップ2: 情報確認
  const renderStep2 = () => (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* プログレスバー */}
        <div style={{
          width: '100%',
          height: '93px',
          marginTop: '32px',
          marginBottom: '16px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          <ProgressBar currentStep={2} totalSteps={3} />
        </div>

        {/* フォーム */}
        <div style={{
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          paddingTop: '32px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}>
          {/* タイトル */}
          <h2 style={{
            margin: '0 0 24px',
            fontSize: '20px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            情報を確認してください
          </h2>

          {/* お名前 */}
          <label style={labelStyle}>お名前</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.name || '未入力'}
          </p>

          {/* 性別 */}
          <label style={labelStyle}>性別</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.gender || '未入力'}
          </p>

          {/* 年齢 */}
          <label style={labelStyle}>年齢</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.age > 0 ? formData.age : '未入力'}
          </p>

          {/* 電話番号 */}
          <label style={labelStyle}>電話番号</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.phone_number || '未入力'}
          </p>

          {/* メールアドレス */}
          <label style={labelStyle}>メールアドレス</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.email || '未入力'}
          </p>

          {/* ジャンル */}
          <label style={labelStyle}>ジャンル</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.genre_category || '未入力'}
          </p>

          {/* ジャンル（自由回答） */}
          <label style={labelStyle}>ジャンル（自由回答）</label>
          <p style={{
            margin: '0 0 24px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#2C3E50'
          }}>
            {formData.genre_free_text || '未入力'}
          </p>

          {/* 営業許可証 */}
          <label style={{ ...labelStyle, marginTop: '20px' }}>営業許可証</label>
          {documentUrls.business_license ? (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '12px',
              backgroundImage: `url(${documentUrls.business_license})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '12px'
            }} />
          )}
          
          {/* 有効期限表示 */}
          {licenseVerificationStatus.result === 'yes' && licenseVerificationStatus.expirationDate && (
            <div style={{
              background: '#A8D5BA',
              borderRadius: '8px',
              padding: '9px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#A8D5BA', fontSize: '16px', fontWeight: 700 }}>✓</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>有効</p>
                <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>期限: {licenseVerificationStatus.expirationDate}</p>
              </div>
            </div>
          )}

          {/* 車検証 */}
          <label style={{ ...labelStyle, marginTop: '20px' }}>車検証</label>
          {documentUrls.vehicle_inspection ? (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px',
              backgroundImage: `url(${documentUrls.vehicle_inspection})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px'
            }} />
          )}

          {/* 自動車検査証 */}
          <label style={{ ...labelStyle, marginTop: '20px' }}>自動車検査証</label>
          {documentUrls.automobile_inspection ? (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px',
              backgroundImage: `url(${documentUrls.automobile_inspection})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px'
            }} />
          )}

          {/* PL保険 */}
          <label style={{ ...labelStyle, marginTop: '20px' }}>PL保険</label>
          {documentUrls.pl_insurance ? (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px',
              backgroundImage: `url(${documentUrls.pl_insurance})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px'
            }} />
          )}

          {/* 火器類配置図 */}
          <label style={{ ...labelStyle, marginTop: '20px' }}>火器類配置図</label>
          {documentUrls.fire_equipment_layout ? (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px',
              backgroundImage: `url(${documentUrls.fire_equipment_layout})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <div style={{
              background: '#D9D9D9',
              borderRadius: '8px',
              height: '187px',
              marginBottom: '24px'
            }} />
          )}

          {/* 次へ進むボタン */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              padding: '0',
              background: loading ? '#CCCCCC' : '#5DABA8', // Secondary Main（出店者用）
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '52px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 200ms ease'
            }}
          >
            <span>次へ進む</span>
            <span style={{ fontSize: '12px' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  )

  // ステップ3: 登録完了
  const renderStep3 = () => (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* プログレスバー */}
        <div style={{
          width: '100%',
          height: '93px',
          marginTop: '32px',
          marginBottom: '16px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          <ProgressBar currentStep={3} totalSteps={3} />
        </div>

        {/* コンテンツ */}
        <div style={{
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
          paddingTop: '32px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {/* チェックマークアイコン */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#5DABA8', // Secondary Main（出店者用）
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 style={{
            margin: '0 0 16px',
            fontSize: '24px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            登録完了
          </h1>
          <p style={{
            margin: '0 0 32px',
            fontSize: '14px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#6C757D'
          }}>
            出店者登録が完了しました
          </p>

          {/* ホームへ戻るボタン */}
          <button 
            onClick={onRegistrationComplete}
            style={{
              width: '100%',
              height: '52px',
              padding: '0',
              background: '#5DABA8', // Secondary Main（出店者用）
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '52px',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            ホームへ戻る
          </button>
        </div>
      </div>
    </div>
  )

  // 利用規約ページ
  if (showTermsPage) {
    return (
      <div style={{
        minHeight: '100vh',
      width: '100%',
      background: '#E8F5F5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#E8F5F5',
        minHeight: isDesktop ? 'auto' : '852px'
      }}>
        <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '393px' }}>
          <h2 style={{ 
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '24px',
            textAlign: 'center',
            paddingTop: '24px'
          }}>
            利用規約
          </h2>
          
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            minHeight: '400px'
          }}>
            {/* 利用規約の内容は後で追加 */}
            <p style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666'
            }}>
              出店者向け利用規約の内容はこちらに表示されます。
            </p>
          </div>

          <button
            onClick={handleBackFromTerms}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              width: '100%',
              height: '48px',
              background: '#5DABA8',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '19px',
              color: '#FFFFFF',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            元のページに戻る
          </button>
        </div>
        </div>
      </div>
    )
  }

  if (currentStep === 1) return renderStep1()
  if (currentStep === 2) return renderStep2()
  if (currentStep === 3) return renderStep3()
  
  return null
}
