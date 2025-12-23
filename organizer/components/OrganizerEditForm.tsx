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
    genre: organizerData.genre || '',
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
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '14px',
    fontStyle: 'italic' as const,
    fontWeight: 700,
    lineHeight: '120%',
    color: '#2C3E50',
    marginBottom: '8px',
    display: 'block' as const
  }

  const inputStyle = (hasValue: boolean) => ({
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    fontSize: '15px',
    lineHeight: '150%',
    color: hasValue ? '#2C3E50' : '#6C757D',
    border: 'none',
    outline: 'none',
    width: '100%',
    background: 'transparent'
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
      if (!formData.gender) newErrors.gender = true
      if (!validateAge(formData.age)) newErrors.age = true
      if (!formData.phone_number.trim() || !validatePhoneNumber(formData.phone_number)) newErrors.phone_number = true
      if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = true
      if (!formData.genre) newErrors.genre = true

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

      const authType = (userProfile as any).authType || 'line'
      console.log('[OrganizerEditForm] Updating organizer with auth type:', authType, 'userId:', userProfile.userId)

      let data, error

      if (authType === 'email') {
        const result = await supabase
          .from('organizers')
          .update(updateData)
          .eq('user_id', userProfile.userId)
          .select()
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('organizers')
          .update(updateData)
          .eq('line_user_id', userProfile.userId)
          .select()
          .single()
        data = result.data
        error = result.error
      }

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
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#E8F5F5'
    }}>
      {/* ヘッダー */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#FF8A5C',
        color: '#FFFFFF',
        padding: '16px',
        textAlign: 'center',
        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
        fontSize: '18px',
        fontWeight: 700,
        lineHeight: '120%',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        maxWidth: isDesktop ? '1000px' : '393px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '64px'
      }}>
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Inter", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '1'
          }}
        >
          &lt;
        </button>
        プロフィール編集
      </div>

      <div style={{ paddingTop: '88px', paddingBottom: '24px', paddingLeft: '20px', paddingRight: '20px' }}>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '20px',
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: '120%',
              color: '#2C3E50',
              marginBottom: '24px',
              paddingLeft: '4px'
            }}>
              情報を入力してください
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* お名前 */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="name">
                <label style={labelStyle}>お名前</label>
                <div style={{ ...formFieldStyle(errors.name), width: '100%' }}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="例: 山田太郎"
                    style={inputStyle(!!formData.name)}
                  />
                </div>
                {errors.name && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>入力してください</p>
                )}
              </div>

              {/* 性別 */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="gender">
                <label style={labelStyle}>性別</label>
                <div style={{ ...formFieldStyle(errors.gender), width: '100%', position: 'relative' }}>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle(!!formData.gender),
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="男">男性</option>
                    <option value="女">女性</option>
                    <option value="それ以外">その他</option>
                  </select>
                  <svg
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: 'absolute',
                      right: '16px',
                      pointerEvents: 'none'
                    }}
                  >
                    <path d="M1 1L4 4L7 1" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {errors.gender && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>選択してください</p>
                )}
              </div>

              {/* 年齢 */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="age">
                <label style={labelStyle}>年齢</label>
                <div style={{ ...formFieldStyle(errors.age), width: '100%' }}>
                  <input
                    type="number"
                    name="age"
                    min="0"
                    max="100"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    placeholder="例: 35"
                    style={inputStyle(formData.age > 0)}
                  />
                </div>
                {errors.age && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>入力してください</p>
                )}
              </div>

              {/* 電話番号 */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="phone_number">
                <label style={labelStyle}>電話番号</label>
                <div style={{ ...formFieldStyle(errors.phone_number), width: '100%' }}>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="例: 090-1234-5678"
                    style={inputStyle(!!formData.phone_number)}
                  />
                </div>
                {errors.phone_number && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>入力してください</p>
                )}
              </div>

              {/* メールアドレス */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="email">
                <label style={labelStyle}>メールアドレス</label>
                <div style={{ ...formFieldStyle(errors.email), width: '100%' }}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="例: example@email.com"
                    style={inputStyle(!!formData.email)}
                  />
                </div>
                {errors.email && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>入力してください</p>
                )}
              </div>

              {/* ジャンル */}
              <div style={{ width: '100%', maxWidth: '289px', position: 'relative' }} data-error-field="genre">
                <label style={labelStyle}>ジャンル</label>
                <div style={{ ...formFieldStyle(errors.genre), width: '100%', position: 'relative' }}>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle(!!formData.genre),
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="飲食">飲食</option>
                    <option value="その他">その他</option>
                  </select>
                  <svg
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: 'absolute',
                      right: '16px',
                      pointerEvents: 'none'
                    }}
                  >
                    <path d="M1 1L4 4L7 1" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {errors.genre && (
                  <p style={{ fontSize: '12px', color: '#FF3B30', marginTop: '4px' }}>選択してください</p>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                maxWidth: '289px',
                height: '52px',
                padding: '0',
                background: loading ? '#D9D9D9' : '#FF8A5C',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '15px',
                fontStyle: 'italic',
                fontWeight: 700,
                lineHeight: '52px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              {loading ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

