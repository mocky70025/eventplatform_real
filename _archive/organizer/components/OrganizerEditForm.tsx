'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'

interface OrganizerEditFormProps {
  organizerData: any
  userProfile: LineProfile
  onUpdateComplete: (updatedData: any) => void
  onCancel: () => void
}

export default function OrganizerEditForm({
  organizerData,
  userProfile,
  onUpdateComplete,
  onCancel
}: OrganizerEditFormProps) {
  const [formData, setFormData] = useState({
    name: organizerData.name || '',
    gender: organizerData.gender || '',
    age: organizerData.age || 0,
    phone_number: organizerData.phone_number || '',
    email: organizerData.email || '',
    company_name: organizerData.company_name || '',
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // 全角数字を半角に変換
  const convertToHalfWidth = (str: string): string => {
    return str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
  }

  // 電話番号のバリデーション
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
    border: hasError ? '1px solid #FF3B30' : '1px solid #E5E5E5',
    borderRadius: '8px'
  })

  const labelStyle = {
    display: 'block' as const,
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal' as const,
    fontWeight: 700,
    color: '#2C3E50',
    marginBottom: '8px'
  }

  const inputStyle = (hasValue: boolean) => ({
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '15px',
    color: hasValue ? '#2C3E50' : '#6C757D',
    border: 'none',
    outline: 'none',
    width: '100%',
    background: 'transparent',
    padding: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'age') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    // エラーをクリア
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // バリデーション
      const newErrors: Record<string, boolean> = {}
      if (!formData.name.trim()) newErrors.name = true
      if (formData.age !== 0 && !validateAge(formData.age)) newErrors.age = true
      if (formData.phone_number && !validatePhoneNumber(formData.phone_number)) newErrors.phone_number = true
      if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = true
      if (!formData.company_name.trim()) newErrors.company_name = true

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        const firstErrorKey = Object.keys(newErrors)[0]
        const errorElement = document.querySelector(`[data-error-field="${firstErrorKey}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const inputElement = errorElement.querySelector('input, select')
          if (inputElement) {
            (inputElement as HTMLElement).focus()
          }
        }
        setLoading(false)
        return
      }

      // 電話番号を半角に変換（ハイフン削除）
      const normalizedPhone = convertToHalfWidth(formData.phone_number.replace(/-/g, ''))

      // 更新データの準備
      const updateData = {
        ...formData,
        phone_number: normalizedPhone,
        updated_at: new Date().toISOString()
      }

      // Supabaseで更新
      if (!userProfile?.userId) {
        alert('ログインが必要です。')
        return
      }

      const authTypeRaw = (userProfile as any).authType || 'line'
      const isLineLogin = authTypeRaw === 'line'
      console.log('[OrganizerEditForm] Updating organizer with auth type:', authTypeRaw, 'userId:', userProfile.userId)

      const { data, error } = await supabase
        .from('organizers')
        .update(updateData)
        .eq(isLineLogin ? 'line_user_id' : 'user_id', userProfile.userId)
        .select()
        .single()

      if (error) {
        console.error('Update failed:', error)
        let errorMessage = '不明なエラー'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'object' && error !== null) {
          const errorObj = error as any
          if (errorObj.message) {
            errorMessage = String(errorObj.message)
          }
        }
        alert(`登録情報の更新に失敗しました。エラー: ${errorMessage}`)
        return
      }

      alert('登録情報を更新しました')
      onUpdateComplete(data)
    } catch (error) {
      console.error('Update failed:', error)
      alert('登録情報の更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 1024)
      const checkScreenSize = () => {
        setIsDesktop(window.innerWidth >= 1024)
      }
      window.addEventListener('resize', checkScreenSize)
      return () => window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        maxWidth: '393px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}>
        {/* ヘッダー */}
        <div style={{
          width: '100%',
          flexShrink: 0,
          height: '64px',
          background: 'linear-gradient(180deg, #FF8A5C 0%, #FF7840 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'white'
          }}>
            プロフィール編集
          </h1>
          <button
            onClick={onCancel}
            style={{
              position: 'absolute',
              left: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontFamily: '"Inter", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &lt;
          </button>
        </div>

        <div style={{
          width: '100%',
          flexShrink: 0,
          background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '16px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxSizing: 'border-box'
        }}>
          {/* コンテンツエリア */}
          <div style={{
            width: '100%'
          }}>
            <form onSubmit={handleSubmit}>
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

                {/* お名前 */}
                <label style={labelStyle}>お名前</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="例: 山田太郎"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    border: errors.name ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    color: formData.name ? '#2C3E50' : '#6C757D',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.name && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-20px', marginBottom: '24px' }}>入力してください</p>
                )}

                {/* 性別 */}
                <label style={labelStyle}>性別</label>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.gender ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: formData.gender ? '#2C3E50' : '#6C757D',
                      appearance: 'none',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
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
                    pointerEvents: 'none'
                  }}>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.75 0.75L4 4.25L7.25 0.75" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {errors.gender && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-20px', marginBottom: '24px' }}>選択してください</p>
                )}

                {/* 年齢 */}
                <label style={labelStyle}>年齢</label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="100"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  placeholder="例: 35"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    border: errors.age ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    color: formData.age ? '#2C3E50' : '#6C757D',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.age && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-20px', marginBottom: '24px' }}>入力してください</p>
                )}

                {/* 電話番号 */}
                <label style={labelStyle}>電話番号</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="例: 090-1234-5678"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    border: errors.phone_number ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    color: formData.phone_number ? '#2C3E50' : '#6C757D',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.phone_number && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-20px', marginBottom: '24px' }}>入力してください</p>
                )}

                {/* メールアドレス */}
                <label style={labelStyle}>メールアドレス</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="例: example@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    border: errors.email ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    color: formData.email ? '#2C3E50' : '#6C757D',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.email && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-20px', marginBottom: '24px' }}>入力してください</p>
                )}

                {/* 団体名・組織名 */}
                <label style={labelStyle}>団体名・組織名</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="例: 株式会社〇〇"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '32px',
                    border: errors.company_name ? '1px solid #FF3B30' : '1px solid #E9ECEF',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    color: formData.company_name ? '#2C3E50' : '#6C757D',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.company_name && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '-28px', marginBottom: '32px' }}>入力してください</p>
                )}

                {/* 保存するボタン */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: loading ? '#D9D9D9' : '#FF8A5C', // Primary Default
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '15px',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
                  }}
                >
                  {loading ? '保存中...' : '保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
