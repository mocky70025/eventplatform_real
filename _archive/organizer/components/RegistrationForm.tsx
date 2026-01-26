'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, type Organizer } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import { colors } from '@/styles/design-system'
import ProgressBar from './ProgressBar'

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
  const isLineLogin = userProfile?.authType === 'line'
  const [formData, setFormData] = useState<OrganizerFormState>({
    ...ORGANIZER_FORM_INITIAL,
    email:
      isLineLogin && userProfile?.email?.startsWith('line_') && userProfile?.email.includes('@line.local')
        ? ''
        : userProfile?.email || '',
  })

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
    padding: '0 16px',
    gap: '10px',
    width: '100%',
    height: '44px',
    background: '#FFFFFF',
    border: hasError ? '2px solid #ef4444' : '1px solid #E9ECEF',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    fontSize: '15px',
    lineHeight: '44px',
    color: '#2C3E50',
    fontFamily: '"Inter", sans-serif'
  })

  const labelStyle = {
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    fontWeight: 700,
    lineHeight: '1.4',
    color: '#2C3E50',
    marginBottom: '8px',
    display: 'block' as const
  }

  const inputStyle = (hasValue: boolean) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '15px',
    lineHeight: '44px',
    color: hasValue ? '#2C3E50' : '#6C757D',
    border: 'none',
    outline: 'none',
    width: '100%',
    background: 'transparent'
  })

  // バリデーション実行
  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.name.trim()) newErrors.name = true
    if (!formData.gender) newErrors.gender = true
    if (!validateAge(formData.age)) newErrors.age = true
    if (!formData.phone_number.trim() || !validatePhoneNumber(formData.phone_number)) newErrors.phone_number = true
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = true
    if (!formData.company_name.trim()) newErrors.company_name = true

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
              borderRadius: '16px',
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
        background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
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
            fontFamily: '"Inter", sans-serif',
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
              <div style={{ ...formFieldStyle(errors.name), width: '100%' }}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: false })
                  }}
                  placeholder="例: 山田太郎"
                  style={inputStyle(!!formData.name)}
                />
              </div>
              {errors.name && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 性別 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="gender">
              <label style={labelStyle}>性別</label>
              <div style={{ ...formFieldStyle(errors.gender), width: '100%', position: 'relative' }}>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, gender: e.target.value as any })
                    if (errors.gender) setErrors({ ...errors, gender: false })
                  }}
                  style={{
                    ...inputStyle(!!formData.gender),
                    appearance: 'none',
                    background: 'transparent',
                    width: '100%',
                    paddingRight: '30px'
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="男">男性</option>
                  <option value="女">女性</option>
                  <option value="それ以外">その他</option>
                </select>
                <svg style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '5px',
                  pointerEvents: 'none'
                }} viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5L0 0H8L4 5Z" fill="#6C757D"/>
                </svg>
              </div>
              {errors.gender && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 年齢 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="age">
              <label style={labelStyle}>年齢</label>
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
                  placeholder="例: 35"
                  style={inputStyle(formData.age > 0)}
                />
              </div>
              {errors.age && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* 電話番号 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="phone_number">
              <label style={labelStyle}>電話番号</label>
              <div style={{ ...formFieldStyle(errors.phone_number), width: '100%' }}>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => {
                    setFormData({ ...formData, phone_number: e.target.value })
                    if (errors.phone_number) setErrors({ ...errors, phone_number: false })
                  }}
                  placeholder="例: 090-1234-5678"
                  style={inputStyle(!!formData.phone_number)}
                />
              </div>
              {errors.phone_number && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>

            {/* メールアドレス */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="email">
              <label style={labelStyle}>メールアドレス</label>
              <div style={{ ...formFieldStyle(errors.email), width: '100%' }}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: false })
                  }}
                  placeholder="例: example@email.com"
                  style={inputStyle(!!formData.email)}
                />
              </div>
              {errors.email && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
              {isLineLogin && (
                <p style={{ fontSize: '12px', color: colors.neutral[600], marginTop: '4px' }}>
                  LINEログインの場合も、実際に届くメールアドレスをここでご記入ください（LINE識別子ではありません）。
                </p>
              )}
            </div>

            {/* 会社名 */}
            <div style={{ width: '100%', position: 'relative' }} data-error-field="company_name">
              <label style={labelStyle}>会社名</label>
              <div style={{ ...formFieldStyle(errors.company_name), width: '100%' }}>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => {
                    setFormData({ ...formData, company_name: e.target.value })
                    if (errors.company_name) setErrors({ ...errors, company_name: false })
                  }}
                  placeholder="入力してください"
                  style={inputStyle(!!formData.company_name)}
                />
              </div>
              {errors.company_name && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>入力してください</p>
              )}
            </div>
          </div>

          {/* ボタン */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
              gap: '8px',
              width: '100%',
              height: '52px',
              background: loading ? '#9ca3af' : '#FF8A5C',
              borderRadius: '12px',
              border: 'none',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '52px',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '24px',
              transition: 'all 0.2s ease-in-out',
              boxShadow: loading ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            次へ進む
            <svg style={{ width: '8px', height: '10px' }} viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L6.5 5L1.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
        background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
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

      {/* 確認フォーム */}
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
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          お名前
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.name}
        </p>

        {/* 性別 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          性別
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.gender === '男' ? '男性' : formData.gender === '女' ? '女性' : formData.gender === 'それ以外' ? 'その他' : ''}
        </p>

        {/* 年齢 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          年齢
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.age || ''}
        </p>

        {/* 電話番号 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          電話番号
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.phone_number}
        </p>

        {/* メールアドレス */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          メールアドレス
        </label>
        <p style={{
          margin: '0 0 24px',
          fontSize: '15px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.email}
        </p>

        {/* 会社名 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          会社名
        </label>
        <p style={{
          margin: '0 0 32px',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#2C3E50'
        }}>
          {formData.company_name}
        </p>

        {/* 次へ進むボタン */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: loading ? '#CCCCCC' : '#FF8A5C', // Primary Default
            borderRadius: '12px',
            border: 'none',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{loading ? '登録中...' : '次へ進む'}</span>
          {!loading && (
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L6.5 5L1.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
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
        background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
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
          margin: '0 0 4px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          主催者登録が完了しました
        </p>
        <p style={{
          margin: '0 0 4px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          運営の許可があり次第
        </p>
        <p style={{
          margin: '0 0 32px',
          fontSize: '14px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D'
        }}>
          イベントの掲載が可能になります
        </p>

        {/* ホームへ進むボタン */}
        <button
          type="button"
          onClick={onRegistrationComplete}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#FF8A5C', // Primary Default
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
          }}
        >
          ホームへ進む
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
