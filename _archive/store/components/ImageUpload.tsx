'use client'

import { useState, useRef, useEffect } from 'react'
import { uploadExhibitorDocument, getPublicUrl } from '@/lib/storage'

interface ImageUploadProps {
  label: string
  documentType: string
  userId: string
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  onImageDelete?: () => void
  currentImageUrl?: string
  hasError?: boolean
}

export default function ImageUpload({
  label,
  documentType,
  userId,
  onUploadComplete,
  onUploadError,
  onImageDelete,
  currentImageUrl,
  hasError = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // currentImageUrlが変更されたときにpreviewUrlを更新
  useEffect(() => {
    console.log('[ImageUpload] currentImageUrl changed:', currentImageUrl, 'label:', label)
    if (currentImageUrl) {
      console.log('[ImageUpload] Updating previewUrl from currentImageUrl:', currentImageUrl)
      setPreviewUrl(currentImageUrl)
    } else {
      // currentImageUrlが空の場合は、previewUrlもクリア（ただし、アップロード直後は保持）
      console.log('[ImageUpload] currentImageUrl is empty, clearing previewUrl')
      setPreviewUrl(null)
    }
  }, [currentImageUrl, label])

  // 許可する画像形式
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ]

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（10MB）
    if (file.size > 10 * 1024 * 1024) {
      onUploadError('ファイルサイズは10MB以下にしてください。')
      return
    }

    // ファイル形式チェック
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      onUploadError('対応していない画像形式です。JPEG, PNG, GIF, WebP, HEIC形式を選択してください。')
      return
    }

    // プレビュー表示
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // アップロード実行
    setUploading(true)
    try {
      const result = await uploadExhibitorDocument(file, documentType, userId)
      
      if (result.error) {
        console.error('[ImageUpload] Upload error:', result.error)
        onUploadError(`アップロードに失敗しました: ${result.error.message}`)
        setPreviewUrl(null)
      } else if (result.data) {
        console.log('[ImageUpload] Upload successful, path:', result.data.path)
        const publicUrl = getPublicUrl('exhibitor-documents', result.data.path)
        console.log('[ImageUpload] Public URL:', publicUrl)
        console.log('[ImageUpload] Setting previewUrl and calling onUploadComplete')
        setPreviewUrl(publicUrl)
        onUploadComplete(publicUrl)
        console.log('[ImageUpload] Preview URL set to:', publicUrl)
      } else {
        console.error('[ImageUpload] Upload result has no data and no error')
        onUploadError('アップロードに失敗しました: データが取得できませんでした')
        setPreviewUrl(null)
      }
    } catch (error) {
      onUploadError('アップロード中にエラーが発生しました。')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // 親コンポーネントに削除を通知
    if (onImageDelete) {
      onImageDelete()
    }
  }

  return (
    <div style={{ marginBottom: '24px', width: '100%', maxWidth: '289px' }} data-error-field={documentType}>
      {label && (
        <label style={{
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          fontStyle: 'italic',
          lineHeight: '120%',
          color: '#2C3E50',
          marginBottom: '8px',
          display: 'block'
        }}>
          {label}
        </label>
      )}
      
      {previewUrl ? (
        <div style={{ position: 'relative', width: '100%', height: '187px' }}>
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2px',
            gap: '10px',
            width: '100%',
            height: '187px',
            background: '#F7F7F7',
            border: hasError ? '2px solid #FF3B30' : '2px solid #5DABA8',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <img
              src={previewUrl}
              alt={label || 'アップロード画像'}
              onLoad={() => console.log('[ImageUpload] Image loaded successfully:', previewUrl, 'label:', label)}
              onError={(e) => {
                console.error('[ImageUpload] Failed to load image:', previewUrl, 'label:', label)
                console.error('[ImageUpload] Error event:', e)
                e.currentTarget.style.display = 'none'
              }}
              style={{
                width: 'calc(100% - 4px)',
                height: '183px',
                objectFit: 'contain',
                borderRadius: '6px'
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                right: '-5px',
                top: '-5px',
                background: '#FF3B30',
                borderRadius: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1
              }}
              title="画像を削除"
            >
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center'
              }}>×</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '187px' }}>
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
              gap: '8px',
              width: '100%',
              height: '187px',
              background: '#FFFFFF',
              border: hasError ? '2px dashed #FF3B30' : '2px dashed #5DABA8',
              borderRadius: '8px',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
              id={`file-${documentType}`}
            />
            <div style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#5DABA8',
              fontWeight: 400,
              lineHeight: '48px'
            }}>+</div>
            <div style={{
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontSize: '15px',
              lineHeight: '150%',
              color: '#5DABA8'
            }}>画像をアップロード</div>
          </div>
          {hasError && (
            <div style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              right: '-5px',
              top: '-5px',
              background: '#FF3B30',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#FFFFFF'
              }}>×</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
