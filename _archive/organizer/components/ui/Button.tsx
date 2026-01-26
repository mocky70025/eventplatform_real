'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography, shadows, transitions } from '@/styles/design-system'

interface ButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: CSSProperties
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
  style = {},
}: ButtonProps) {
  const sizeStyles = {
    sm: {
      height: '36px',
      padding: `0 ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '44px',
      padding: `0 ${spacing[6]}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '52px',
      padding: `0 ${spacing[8]}`,
      fontSize: typography.fontSize.lg,
    },
  }

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: colors.primary[500],
      color: colors.neutral[0],
      border: 'none',
      boxShadow: shadows.button,
    },
    secondary: {
      background: colors.neutral[0],
      color: colors.neutral[900],
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.sm,
    },
    outline: {
      background: 'transparent',
      color: colors.primary[600],
      border: `1.5px solid ${colors.primary[500]}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      border: 'none',
      boxShadow: 'none',
    },
  }

  const baseStyle: CSSProperties = {
    fontFamily: typography.fontFamily.japanese,
    fontWeight: typography.fontWeight.semibold,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: transitions.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.5 : 1,
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
      {loading ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${variant === 'primary' ? 'rgba(255,255,255,0.3)' : colors.primary[200]}`,
            borderTopColor: variant === 'primary' ? colors.neutral[0] : colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        children
      )}
    </button>
  )
}
