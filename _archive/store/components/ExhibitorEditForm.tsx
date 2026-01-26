'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from './ImageUpload'

interface ExhibitorEditFormProps {
  exhibitorData: any
  userProfile: any
  onUpdateComplete: (updatedData: any) => void
  onCancel: () => void
}

export default function ExhibitorEditForm({
  exhibitorData,
  userProfile,
  onUpdateComplete,
  onCancel
}: ExhibitorEditFormProps) {
  const [formData, setFormData] = useState({
    name: exhibitorData.name || '',
    gender: exhibitorData.gender || '',
    age: exhibitorData.age || '',
    phone_number: exhibitorData.phone_number || '',
    email: exhibitorData.email || '',
    genre_category: exhibitorData.genre_category || '',
    genre_free_text: exhibitorData.genre_free_text || '',
  })

  const [imageUrls, setImageUrls] = useState({
    business_license_image_url: exhibitorData.business_license_image_url || '',
    vehicle_inspection_image_url: exhibitorData.vehicle_inspection_image_url || '',
    automobile_inspection_image_url: exhibitorData.automobile_inspection_image_url || '',
    pl_insurance_image_url: exhibitorData.pl_insurance_image_url || '',
    fire_equipment_layout_image_url: exhibitorData.fire_equipment_layout_image_url || '',
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const nextValue = name === 'age' ? Math.min(99, Math.max(0, Number(value) || 0)) : value
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }))
  }

  const handleImageUpload = (field: string, url: string) => {
    setImageUrls(prev => ({
      ...prev,
      [field]: url
    }))
  }

  const handleImageDelete = (field: string) => {
    setImageUrls(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // バリデーション
      if (!formData.name.trim()) {
        alert('お名前を入力してください')
        return
      }
      if (!formData.gender) {
        alert('性別を選択してください')
        return
      }
      if (!formData.age || formData.age < 0 || formData.age > 99) {
        alert('年齢を正しく入力してください（0-99歳）')
        return
      }
      if (!formData.phone_number.trim()) {
        alert('電話番号を入力してください')
        return
      }
      if (!formData.email.trim()) {
        alert('メールアドレスを入力してください')
        return
      }

      // 更新データの準備
      const updateData = {
        ...formData,
        age: parseInt(formData.age),
        business_license_image_url: imageUrls.business_license_image_url || null,
        vehicle_inspection_image_url: imageUrls.vehicle_inspection_image_url || null,
        automobile_inspection_image_url: imageUrls.automobile_inspection_image_url || null,
        pl_insurance_image_url: imageUrls.pl_insurance_image_url || null,
        fire_equipment_layout_image_url: imageUrls.fire_equipment_layout_image_url || null,
        updated_at: new Date().toISOString()
      }

      // Supabaseで更新
      const { data, error } = await supabase
        .from('exhibitors')
        .update(updateData)
        .or(`id.eq.${userProfile.userId},line_user_id.eq.${userProfile.userId}`)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Update failed:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        
        let errorMessage = '不明なエラー'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'object' && error !== null) {
          const errorObj = error as any
          if (errorObj.message) {
            errorMessage = String(errorObj.message)
          } else if (errorObj.details) {
            errorMessage = String(errorObj.details)
          } else if (errorObj.hint) {
            errorMessage = String(errorObj.hint)
          }
        }
        
        alert(`登録情報の更新に失敗しました。エラー: ${errorMessage}`)
        return
      }

      console.log('Update successful:', data)
      alert('登録情報を更新しました')
      onUpdateComplete(data)
    } catch (error) {
      console.error('Update failed:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      let errorMessage = '不明なエラー'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any
        if (errorObj.message) {
          errorMessage = String(errorObj.message)
        } else if (errorObj.details) {
          errorMessage = String(errorObj.details)
        } else if (errorObj.hint) {
          errorMessage = String(errorObj.hint)
        } else {
          errorMessage = JSON.stringify(error)
        }
      }
      
      alert(`登録情報の更新に失敗しました。エラー: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#FFF5F0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '852px',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          width: '100%',
          height: '64px',
          background: '#5DABA8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onCancel}
            style={{
              position: 'absolute',
              left: '16px',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &lt;
          </button>
          <h1 style={{
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            textAlign: 'center'
          }}>
            プロフィール編集
          </h1>
        </div>

        {/* フォーム */}
        <div style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              width: '100%',
              maxWidth: '353px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              padding: '20px'
            }}>
              {/* フォームタイトル */}
              <h2 style={{
                fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#2C3E50',
                margin: '0 0 24px 0'
              }}>
                情報を入力してください
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* お名前 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    お名前
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="例: 山田太郎"
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 性別 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    性別
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 40px 0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: formData.gender ? '#2C3E50' : '#6C757D',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L4 4L7 1' stroke='%236C757D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    <option value="" style={{ color: '#6C757D' }}>選択してください</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                {/* 年齢 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    年齢
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' && Number(formData.age || 0) <= 0) {
                        e.preventDefault()
                      }
                    }}
                    min="0"
                    max="99"
                    required
                    placeholder="例: 35"
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 電話番号 */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    電話番号
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    placeholder="例: 090-1234-5678"
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="例: example@email.com"
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* ジャンル */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    ジャンル
                  </label>
                  <select
                    name="genre_category"
                    value={formData.genre_category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '44px',
                      padding: '0 40px 0 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: formData.genre_category ? '#2C3E50' : '#6C757D',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L4 4L7 1' stroke='%236C757D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    <option value="" style={{ color: '#6C757D' }}>選択してください</option>
                    <option value="飲食">飲食</option>
                    <option value="物販">物販</option>
                    <option value="サービス">サービス</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                {/* ジャンル（自由回答） */}
                <div>
                  <label style={{
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    ジャンル（自由回答）
                  </label>
                  <textarea
                    name="genre_free_text"
                    value={formData.genre_free_text}
                    onChange={handleInputChange}
                    placeholder="例: 焼きそば、たこ焼きなど"
                    style={{
                      width: '100%',
                      maxWidth: '289px',
                      height: '80px',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 400,
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* 画像アップロード */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 営業許可証 */}
                  <div>
                    <label style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#2C3E50',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      営業許可証
                    </label>
                    <ImageUpload
                      label=""
                      documentType="business_license"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.business_license_image_url}
                      onUploadComplete={(url) => handleImageUpload('business_license_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('business_license_image_url')}
                    />
                    {!imageUrls.business_license_image_url && (
                      <p style={{
                        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#6C757D',
                        textAlign: 'center',
                        marginTop: '8px',
                        marginBottom: 0
                      }}>
                        AI確認機能付き
                      </p>
                    )}
                    {/* 有効期限表示（データがある場合のみ表示） */}
                    {(exhibitorData as any).business_license_expiration_date && (
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
                          期限: {(exhibitorData as any).business_license_expiration_date}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* その他の書類 */}
                  <div>
                    <label style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#2C3E50',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      車検証
                    </label>
                    <ImageUpload
                      label=""
                      documentType="vehicle_inspection"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.vehicle_inspection_image_url}
                      onUploadComplete={(url) => handleImageUpload('vehicle_inspection_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('vehicle_inspection_image_url')}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#2C3E50',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      自動車検査証
                    </label>
                    <ImageUpload
                      label=""
                      documentType="automobile_inspection"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.automobile_inspection_image_url}
                      onUploadComplete={(url) => handleImageUpload('automobile_inspection_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('automobile_inspection_image_url')}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#2C3E50',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      PL保険
                    </label>
                    <ImageUpload
                      label=""
                      documentType="pl_insurance"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.pl_insurance_image_url}
                      onUploadComplete={(url) => handleImageUpload('pl_insurance_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('pl_insurance_image_url')}
                    />
                  </div>

                  <div>
                    <label style={{
                      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#2C3E50',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      火器類配置図
                    </label>
                    <ImageUpload
                      label=""
                      documentType="fire_equipment_layout"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.fire_equipment_layout_image_url}
                      onUploadComplete={(url) => handleImageUpload('fire_equipment_layout_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('fire_equipment_layout_image_url')}
                    />
                  </div>
                </div>
              </div>

              {/* 保存ボタン */}
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    maxWidth: '289px',
                    height: '52px',
                    border: 'none',
                    borderRadius: '12px',
                    background: loading ? '#6C757D' : '#5DABA8',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
