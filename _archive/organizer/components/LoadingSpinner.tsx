'use client'

import { CSSProperties } from 'react'
import { colors, spacing, typography } from '@/styles/design-system'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'md', 
  message = '読み込み中...',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '56px',
  }

  const borderWidths = {
    sm: '2px',
    md: '3px',
    lg: '4px',
  }

  const containerStyle: CSSProperties = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  }

  const spinnerStyle: CSSProperties = {
    width: sizes[size],
    height: sizes[size],
    border: `${borderWidths[size]} solid ${colors.neutral[200]}`,
    borderTopColor: colors.primary[500],
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }

  const messageStyle: CSSProperties = {
    marginTop: spacing[4],
    fontFamily: typography.fontFamily.japanese,
    fontSize: size === 'sm' ? typography.fontSize.sm : typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  )
}
