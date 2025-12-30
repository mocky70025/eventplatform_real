'use client'

import React from 'react'
import { getSvgPath } from '@/lib/svg-paths'

interface ProgressBarProps {
  type: 'organizer' | 'seller'
  step: 'form' | 'confirmation' | 'complete'
  alt?: string
  style?: React.CSSProperties
}

/**
 * プログレスバーコンポーネント
 * SVGパスを一元管理し、エラーハンドリングを提供します
 */
export default function ProgressBar({ 
  type, 
  step, 
  alt = '進捗バー',
  style 
}: ProgressBarProps) {
  const svgPath = getSvgPath(type, step)
  const [imageError, setImageError] = React.useState(false)

  const handleError = () => {
    console.error(`SVG画像の読み込みに失敗しました: ${svgPath}`)
    setImageError(true)
  }

  if (imageError) {
    return (
      <div style={{
        width: '100%',
        height: '61px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F7F7',
        borderRadius: '8px',
        color: '#6C757D',
        fontSize: '12px',
        ...style
      }}>
        プログレスバーを読み込めませんでした
      </div>
    )
  }

  return (
    <img
      src={svgPath}
      alt={alt}
      onError={handleError}
      style={{
        width: '100%',
        height: '61px',
        display: 'block',
        objectFit: 'contain',
        ...style
      }}
    />
  )
}

