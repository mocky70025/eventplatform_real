'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, type Organizer } from '@/lib/supabase'

import { type LineProfile } from '@/lib/auth'

interface RegistrationFormProps {
  userProfile: LineProfile
  onRegistrationComplete: () => void
}

interface OrganizerFormState {
  company_name: string
  name: string
  gender: '' | '男' | '女' | 'それ以外'
  age: number
  phone_number: string
  email: string
}

interface OrganizerDraftPayload {
  formData: OrganizerFormState
  termsAccepted: boolean
  hasViewedTerms: boolean
}

const SAVE_DEBOUNCE_MS = 800
const ORGANIZER_DRAFT_TYPE = 'organizer_registration'

const ORGANIZER_FORM_INITIAL: OrganizerFormState = {
  company_name: '',
  name: '',
  gender: '',
  age: 0,
  phone_number: '',
  email: '',
}

const hasOrganizerDraftContent = (payload: OrganizerDraftPayload): boolean => {
  const hasFormValue = Object.values(payload.formData).some((value) => {
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'number') return value > 0
    return false
  })

  if (hasFormValue) return true
  if (payload.termsAccepted || payload.hasViewedTerms) return true

  return false
}

export default function RegistrationForm({ userProfile, onRegistrationComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState<OrganizerFormState>({ ...ORGANIZER_FORM_INITIAL })

  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsPage, setShowTermsPage] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [hasViewedTerms, setHasViewedTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1) // ステップ1: 情報登録、ステップ2: 情報確認、ステップ3: 登録完了
  const [draftLoaded, setDraftLoaded] = useState(false)
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

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPayloadRef = useRef<string>('')
  const draftExistsRef = useRef(false)

  const upsertDraft = useCallback(
    async (payload: OrganizerDraftPayload) => {
      if (!userProfile?.userId) return
      // line_user_idをuser_idとして使用（form_draftsテーブルはuser_idを使用）
      const { error } = await supabase
        .from('form_drafts')
        .upsert(
          {
            user_id: userProfile.userId,
            form_type: ORGANIZER_DRAFT_TYPE,
            payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id, form_type' }
        )

      if (error) throw error
      draftExistsRef.current = true
    },
    [userProfile]
  )

  const removeDraft = useCallback(async () => {
    if (!userProfile?.userId || !draftExistsRef.current) return
    // line_user_idをuser_idとして使用
    const { error } = await supabase
      .from('form_drafts')
      .delete()
      .eq('user_id', userProfile.userId)
      .eq('form_type', ORGANIZER_DRAFT_TYPE)

    if (error) throw error
    draftExistsRef.current = false
  }, [userProfile])

  const scheduleDraftUpsert = useCallback(
    (payload: OrganizerDraftPayload) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        saveTimeoutRef.current = null
        try {
          await upsertDraft(payload)
        } catch (error) {
          console.error('Failed to save organizer registration draft:', error)
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
        console.error('Failed to delete organizer registration draft:', error)
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
        // line_user_idをuser_idとして使用
        const { data, error } = await supabase
          .from('form_drafts')
          .select('payload')
          .eq('user_id', userProfile.userId)
          .eq('form_type', ORGANIZER_DRAFT_TYPE)
          .limit(1)

        if (error) throw error

        const record = data?.[0]

        if (record?.payload && !isCancelled) {
          const payload = record.payload as Partial<OrganizerDraftPayload>
          const restoredFormData: OrganizerFormState = {
            ...ORGANIZER_FORM_INITIAL,
            ...(payload.formData ?? {}),
          }
          const restoredTermsAccepted = Boolean(payload.termsAccepted)
          const restoredHasViewedTerms = Boolean(payload.hasViewedTerms)

          setFormData(restoredFormData)
          setTermsAccepted(restoredTermsAccepted)
          setHasViewedTerms(restoredHasViewedTerms)

          draftExistsRef.current = true
          lastPayloadRef.current = JSON.stringify({
            formData: restoredFormData,
            termsAccepted: restoredTermsAccepted,
            hasViewedTerms: restoredHasViewedTerms,
          })
        }
      } catch (error) {
        console.error('Failed to load organizer registration draft:', error)
      } finally {
        if (!isCancelled) setDraftLoaded(true)
      }
    }

    loadDraft()

    return () => {
      isCancelled = true
    }
  }, [userProfile])

  useEffect(() => {
    if (!draftLoaded) return

    const payload: OrganizerDraftPayload = {
      formData,
      termsAccepted,
      hasViewedTerms,
    }

    if (!hasOrganizerDraftContent(payload)) {
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

  // フォームフィールドの共通スタイル
  const formFieldStyle = (hasError: boolean) => ({
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    padding: '12px 16px',
    gap: '10px',
    width: '100%',
    height: '48px',
    background: '#FFFFFF',
    border: hasError ? '2px solid #ef4444' : '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#111827'
  })

  const labelStyle = {
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '1.4',
    color: '#111827',
    marginBottom: '8px',
    display: 'block' as const
  }

  const inputStyle = (hasValue: boolean) => ({
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: '16px',
    lineHeight: '1.5',
    color: hasValue ? '#111827' : '#6b7280',
    border: 'none',
    outline: 'none',
    width: '100%',
    background: 'transparent'
  })

  // バリデーション実行
  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.company_name.trim()) newErrors.company_name = true
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.gender) newErrors.gender = true
    if (!validateAge(formData.age)) newErrors.age = true
    if (!formData.phone_number.trim() || !validatePhoneNumber(formData.phone_number)) newErrors.phone_number = true
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = true
    if (!termsAccepted) newErrors.termsAccepted = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 利用規約ページから戻ったときのチェック
  const handleBackFromTerms = () => {
    setShowTermsPage(false)
    setHasViewedTerms(true)
    // スクロール位置は保持
    const isValid = validateForm()
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

  const handleNext = () => {
    if (!validateForm()) {
      console.log('[RegistrationForm] Validation failed, errors:', errors)
      const firstErrorKey = Object.keys(errors).find(key => errors[key])
      if (firstErrorKey) {
        const errorElement = document.querySelector(`[data-error-field="${firstErrorKey}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const inputElement = errorElement.querySelector('input, select, textarea')
          if (inputElement) {
            (inputElement as HTMLElement).focus()
          }
        }
      }
      return
    }

    if (!termsAccepted) {
      console.log('[RegistrationForm] Terms not accepted')
      alert('利用規約に同意してください。')
      return
    }

    setCurrentStep(2)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    console.log('[RegistrationForm] Submit started')
    console.log('[RegistrationForm] Form data:', formData)
    console.log('[RegistrationForm] Terms accepted:', termsAccepted)

    setLoading(true)

    try {
      if (!userProfile?.userId) {
        console.error('[RegistrationForm] No user profile or userId')
        alert('ログインが必要です。')
        return
      }

      console.log('[RegistrationForm] User ID:', userProfile.userId)

      // 重複登録チェック（認証タイプに応じて）
      const authType = (userProfile as any).authType || 'line'
      console.log('[RegistrationForm] Checking for existing organizer...')
      let existingUser = null
      let checkError = null

      if (authType === 'email') {
        const result = await supabase
          .from('organizers')
          .select('id')
          .eq('user_id', userProfile.userId)
          .single()
        existingUser = result.data
        checkError = result.error
      } else {
        const result = await supabase
        .from('organizers')
        .select('id')
        .eq('line_user_id', userProfile.userId)
        .single()
        existingUser = result.data
        checkError = result.error
      }

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('[RegistrationForm] Error checking existing user:', checkError)
      }

      if (existingUser) {
        console.log('[RegistrationForm] User already exists:', existingUser.id)
        alert('既に登録済みです。')
        return
      }

      // 電話番号を半角に変換（ハイフン削除）
      const normalizedPhone = convertToHalfWidth(formData.phone_number.replace(/-/g, ''))
      console.log('[RegistrationForm] Normalized phone:', normalizedPhone)

      const insertData: any = {
          ...formData,
          phone_number: normalizedPhone,
          is_approved: false,
      }

      // 認証タイプに応じてuser_idまたはline_user_idを設定
      if (authType === 'email') {
        insertData.user_id = userProfile.userId
      } else {
        insertData.line_user_id = userProfile.userId
      }
      console.log('[RegistrationForm] Insert data:', insertData)

      console.log('[RegistrationForm] Inserting into organizers table...')
      console.log('[RegistrationForm] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('[RegistrationForm] Supabase Key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      try {
        const { data: insertData_result, error } = await supabase
          .from('organizers')
          .insert(insertData)
          .select()

        console.log('[RegistrationForm] Insert result:', { data: insertData_result, error })

      if (error) {
          console.error('[RegistrationForm] Supabase error:', error)
          console.error('[RegistrationForm] Error code:', error.code)
          console.error('[RegistrationForm] Error message:', error.message)
          console.error('[RegistrationForm] Error details:', error.details)
          console.error('[RegistrationForm] Error hint:', error.hint)
        throw error
        }

        console.log('[RegistrationForm] Insert successful:', insertData_result)
      } catch (fetchError) {
        console.error('[RegistrationForm] Fetch error:', fetchError)
        console.error('[RegistrationForm] Fetch error type:', typeof fetchError)
        console.error('[RegistrationForm] Fetch error details:', JSON.stringify(fetchError, null, 2))
        
        // ネットワークエラーの場合、より詳細な情報を提供
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error(`ネットワークエラー: Supabaseへの接続に失敗しました。環境変数が正しく設定されているか確認してください。URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '未設定'}`)
        }
        throw fetchError
      }

      try {
        await removeDraft()
        lastPayloadRef.current = ''
        setDraftLoaded(false)
        console.log('[RegistrationForm] Draft removed successfully')
      } catch (draftError) {
        console.error('[RegistrationForm] Failed to clear organizer registration draft after submit:', draftError)
      }

      setCurrentStep(3)
    } catch (error) {
      console.error('[RegistrationForm] Registration failed:', error)
      console.error('[RegistrationForm] Error details:', JSON.stringify(error, null, 2))
      const errorMessage = error instanceof Error ? error.message : '不明なエラー'
      const errorCode = (error as any)?.code || 'UNKNOWN'
      const errorDetails = (error as any)?.details || ''
      const errorHint = (error as any)?.hint || ''
      alert(`登録に失敗しました。\nエラー: ${errorMessage}\nコード: ${errorCode}\n詳細: ${errorDetails}\nヒント: ${errorHint}`)
    } finally {
      setLoading(false)
    }
  }

  // 進捗インジケーター（3ステップ）
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center" style={{ marginBottom: '48px', paddingTop: '24px' }}>
      <div className="relative" style={{ width: '250.5px', height: '16px' }}>
        {/* ステップ1の円 */}
        <div 
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: '16px',
            height: '16px',
            left: '0px',
            top: '0px',
            backgroundColor: currentStep >= 1 ? '#FF8A5C' : 'transparent',
            border: currentStep >= 1 ? 'none' : '1px solid #FF8A5C',
          }}
        >
          {currentStep > 1 && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* 線1（ステップ1と2の間） */}
        <div 
          className="absolute"
          style={{
            width: '101.75px',
            height: '4px',
            left: '15.75px',
            top: '6px',
            backgroundColor: currentStep >= 2 ? '#FF8A5C' : '#D9D9D9',
          }}
        />
        
        {/* ステップ2の円 */}
        <div 
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: '16px',
            height: '16px',
            left: '117px',
            top: '0px',
            backgroundColor: currentStep >= 2 ? '#FF8A5C' : 'transparent',
            border: currentStep >= 2 ? 'none' : '1px solid #FF8A5C',
          }}
        >
          {currentStep > 2 && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* 線2（ステップ2と3の間） */}
        <div 
          className="absolute"
          style={{
            width: '101.75px',
            height: '4px',
            left: '133px',
            top: '6px',
            backgroundColor: currentStep >= 3 ? '#FF8A5C' : '#D9D9D9',
          }}
        />
        
        {/* ステップ3の円 */}
        <div 
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: '16px',
            height: '16px',
            left: '234.5px',
            top: '0px',
            backgroundColor: currentStep >= 3 ? '#FF8A5C' : 'transparent',
            border: currentStep >= 3 ? 'none' : '1px solid #FF8A5C',
          }}
        >
          {currentStep >= 3 && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* ラベル */}
        <div className="absolute top-6 left-0" style={{ width: '250.5px', height: '20px' }}>
          {/* 情報登録 - 円の中心は8px（left: 0px + 円の半径8px） */}
          <span 
            className="absolute text-[14px] text-gray-700 whitespace-nowrap"
            style={{
              left: '8px',
              transform: 'translateX(-50%)',
              fontFamily: '"Noto Sans JP", sans-serif'
            }}
          >
            情報登録
          </span>
          {/* 情報確認 - 円の中心は125px（left: 117px + 円の半径8px） */}
          <span 
            className="absolute text-[14px] text-gray-700 whitespace-nowrap"
            style={{
              left: '125px',
              transform: 'translateX(-50%)',
              fontFamily: '"Noto Sans JP", sans-serif'
            }}
          >
            情報確認
          </span>
          {/* 登録完了 - 円の中心は242.5px（left: 234.5px + 円の半径8px） */}
          <span 
            className="absolute text-[14px] text-gray-700 whitespace-nowrap"
            style={{
              left: '242.5px',
              transform: 'translateX(-50%)',
              fontFamily: '"Noto Sans JP", sans-serif'
            }}
          >
            登録完了
          </span>
        </div>
      </div>
    </div>
  )

  // 利用規約ページ
  if (showTermsPage) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '600px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#E8F5F5'
      }}>
        <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '9px 16px', maxWidth: isDesktop ? '600px' : '393px' }}>
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
            <p style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666'
            }}>
              主催者向け利用規約の内容はこちらに表示されます。
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
              background: '#FF8A5C',
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
    )
  }

  // ステップ2: 情報確認
  const renderStep2 = () => (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: isDesktop ? '800px' : '852px',
      margin: '0 auto',
      background: '#E8F5F5',
      ...(isDesktop && {
        padding: '40px 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px'
      })
    }}>
      <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '9px 16px', maxWidth: isDesktop ? '600px' : '393px' }}>
        <ProgressIndicator />
        
        <h2 style={{ 
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '120%',
          color: '#000000',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          情報確認をしてください
        </h2>
        
        <div style={{
          background: '#FFFFFF',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>会社名</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>{formData.company_name}</p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>名前</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>{formData.name}</p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>性別</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>
                {formData.gender === '男' ? '男性' : formData.gender === '女' ? '女性' : formData.gender === 'それ以外' ? 'その他' : ''}
              </p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>年齢</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>{formData.age}歳</p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>電話番号</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>{formData.phone_number}</p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px', display: 'block' }}>メールアドレス</label>
              <p style={{ fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '150%', color: '#000000' }}>{formData.email}</p>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '14px 24px',
              gap: '10px',
              height: '48px',
              background: '#FFFFFF',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '1.5',
              color: '#2563eb',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            修正する
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '14px 24px',
              gap: '10px',
              height: '48px',
              background: loading ? '#9ca3af' : '#2563eb',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '1.5',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: loading ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#1d4ed8'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#2563eb'
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  )

  // ステップ1: 情報登録
  const renderStep1 = () => (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: isDesktop ? '800px' : '852px',
      margin: '0 auto',
      background: '#E8F5F5',
      ...(isDesktop && {
        padding: '40px 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px'
      })
    }}>
      <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '9px 16px', maxWidth: isDesktop ? '600px' : '393px' }}>
        <ProgressIndicator />
        
        <h2 style={{ 
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '120%',
          color: '#000000',
          marginBottom: '24px',
          marginTop: '16px',
          textAlign: 'center'
        }}>
          情報登録をしてください
        </h2>
        
        <div style={{
          background: '#FFFFFF',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            {/* 会社名 */}
            <div style={{ width: '100%', maxWidth: '330px', height: '73px', position: 'relative' }} data-error-field="company_name">
              <label style={labelStyle}>会社名</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ ...formFieldStyle(errors.company_name), width: '100%' }}>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => {
                      setFormData({ ...formData, company_name: e.target.value })
                      if (errors.company_name) setErrors({ ...errors, company_name: false })
                    }}
                    placeholder="株式会社サンプル"
                    style={inputStyle(!!formData.company_name)}
                  />
                </div>
              </div>
              {errors.company_name && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 名前 */}
            <div style={{ width: '100%', maxWidth: '330px', height: '73px', position: 'relative' }} data-error-field="name">
              <label style={labelStyle}>名前</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ ...formFieldStyle(errors.name), width: '100%' }}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: false })
                    }}
                    placeholder="山田太郎"
                    style={inputStyle(!!formData.name)}
                  />
                </div>
              </div>
              {errors.name && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 性別と年齢（同じ行） */}
            <div style={{ width: '100%', maxWidth: '330px', display: 'flex', flexDirection: 'row', gap: '16px' }}>
            {/* 性別 */}
              <div style={{ flex: 1, height: '73px', position: 'relative' }} data-error-field="gender">
              <label style={labelStyle}>性別</label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ ...formFieldStyle(errors.gender), width: '100%' }}>
                    <select
                      value={formData.gender || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, gender: e.target.value as any })
                          if (errors.gender) setErrors({ ...errors, gender: false })
                        }}
                      style={inputStyle(!!formData.gender)}
                    >
                      <option value="">選択してください</option>
                      <option value="男">男性</option>
                      <option value="女">女性</option>
                      <option value="それ以外">その他</option>
                    </select>
                  </div>
              </div>
              {errors.gender && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 年齢 */}
              <div style={{ flex: 1, height: '73px', position: 'relative' }} data-error-field="age">
              <label style={labelStyle}>年齢</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ ...formFieldStyle(errors.age), width: '100%' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.age || ''}
                    onChange={(e) => {
                      const ageValue = parseInt(e.target.value) || 0
                      setFormData({ ...formData, age: ageValue })
                      if (errors.age) setErrors({ ...errors, age: false })
                    }}
                    placeholder="25"
                    style={inputStyle(formData.age > 0)}
                  />
                </div>
              </div>
              {errors.age && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
              </div>
            </div>

            {/* 電話番号 */}
            <div style={{ width: '100%', maxWidth: '330px', height: '73px', position: 'relative' }} data-error-field="phone_number">
              <label style={labelStyle}>電話番号</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ ...formFieldStyle(errors.phone_number), width: '100%' }}>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => {
                      setFormData({ ...formData, phone_number: e.target.value })
                      if (errors.phone_number) setErrors({ ...errors, phone_number: false })
                    }}
                    placeholder="01234567890"
                    style={inputStyle(!!formData.phone_number)}
                  />
                </div>
              </div>
              {errors.phone_number && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* メールアドレス */}
            <div style={{ width: '100%', maxWidth: '330px', height: '73px', position: 'relative' }} data-error-field="email">
              <label style={labelStyle}>メールアドレス</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ ...formFieldStyle(errors.email), width: '100%' }}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: false })
                    }}
                    placeholder="kitchencar@gmail.com"
                    style={inputStyle(!!formData.email)}
                  />
                </div>
              </div>
              {errors.email && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>
          </div>
        </div>

        {/* 利用規約とボタン */}
        <div style={{ marginBottom: '24px', width: '100%', maxWidth: '330px', marginLeft: 'auto', marginRight: 'auto' }}>
          <label style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              background: termsAccepted ? '#FF8A5C' : '#FFFFFF',
              border: termsAccepted ? 'none' : '1px solid #E5E5E5',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: hasViewedTerms ? 'pointer' : 'not-allowed',
              opacity: hasViewedTerms ? 1 : 0.5
            }}
            onClick={() => {
              if (!hasViewedTerms) {
                setShowTermsPage(true)
                return
              }
              setTermsAccepted(!termsAccepted)
              if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: false })
            }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  if (!hasViewedTerms) {
                    setShowTermsPage(true)
                    return
                  }
                  setTermsAccepted(e.target.checked)
                  if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: false })
                }}
                disabled={!hasViewedTerms}
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  opacity: 0,
                  cursor: hasViewedTerms ? 'pointer' : 'not-allowed'
                }}
              />
              {termsAccepted && (
                <svg style={{
                  width: '16px',
                  height: '13px',
                  color: '#FFFFFF'
                }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation()
                setShowTermsPage(true)
              }}
              style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#FF8A5C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              利用規約
              <svg style={{
                width: '14px',
                height: '14px',
                color: '#FF8A5C'
              }} fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
            <span style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#111827'
            }}>
              に同意する
            </span>
          </label>
          {errors.termsAccepted && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>利用規約への同意が必要です</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading || !termsAccepted}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 24px',
            gap: '10px',
            width: '100%',
            maxWidth: '330px',
            height: '48px',
            background: termsAccepted && !loading ? '#2563eb' : '#9ca3af',
            borderRadius: '8px',
            border: 'none',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '1.5',
            color: '#FFFFFF',
            cursor: termsAccepted && !loading ? 'pointer' : 'not-allowed',
            marginLeft: 'auto',
            marginRight: 'auto',
            transition: 'all 0.2s ease-in-out',
            boxShadow: termsAccepted && !loading ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (termsAccepted && !loading) {
              e.currentTarget.style.background = '#1d4ed8'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (termsAccepted && !loading) {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          次に進む
        </button>
      </div>
    </div>
  )

  // ステップ3: 登録完了
  const renderStep3 = () => (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: isDesktop ? '800px' : '852px',
      margin: '0 auto',
      background: '#E8F5F5',
      ...(isDesktop && {
        padding: '40px 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px'
      })
    }}>
      <div className="container mx-auto" style={{ padding: isDesktop ? '20px 32px' : '9px 16px', maxWidth: isDesktop ? '600px' : '393px' }}>
        <ProgressIndicator />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: '#2563eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <svg style={{ width: '64px', height: '64px', color: '#FFFFFF' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '16px'
          }}>
            登録完了
          </h2>
          
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            登録が完了しました。運営側の承認をお待ちください。
          </p>
          
          <button
            onClick={onRegistrationComplete}
            style={{
              width: '100%',
              maxWidth: '330px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '14px 24px',
              gap: '10px',
              height: '48px',
              background: '#2563eb',
              borderRadius: '8px',
              border: 'none',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '1.5',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            マイページへ
          </button>
        </div>
      </div>
    </div>
  )

  if (currentStep === 1) return renderStep1()
  if (currentStep === 2) return renderStep2()
  if (currentStep === 3) return renderStep3()
  
  return null
}
