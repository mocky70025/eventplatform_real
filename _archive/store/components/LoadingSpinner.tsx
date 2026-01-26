'use client'

import { CSSProperties } from 'react'
import { colors, spacing, typography } from '../styles/design-system'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'md', 
  message,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '56px',
  }

  const spinnerSize = sizeMap[size]

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
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease-in',
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  }

  const spinnerStyle: CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `3px solid ${colors.primary[100]}`,
    borderTop: `3px solid ${colors.primary[500]}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }

  const messageStyle: CSSProperties = {
    marginTop: spacing[4],
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
    textAlign: 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  )
}
