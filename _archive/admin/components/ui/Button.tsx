'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography, shadows, transitions } from '@/styles/design-system'

interface ButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
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
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
}: ButtonProps) {
  const sizeStyles = {
    sm: {
      height: '36px',
      padding: `0 ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
      gap: spacing[1.5],
      borderRadius: borderRadius.md,
    },
    md: {
      height: '44px',
      padding: `0 ${spacing[6]}`,
      fontSize: typography.fontSize.base,
      gap: spacing[2],
      borderRadius: borderRadius.lg,
    },
    lg: {
      height: '52px',
      padding: `0 ${spacing[8]}`,
      fontSize: typography.fontSize.lg,
      gap: spacing[2.5],
      borderRadius: borderRadius.lg,
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
      boxShadow: shadows.subtle,
    },
    outline: {
      background: 'transparent',
      color: colors.primary[600],
      border: `2px solid ${colors.primary[500]}`,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      border: 'none',
      boxShadow: 'none',
    },
    text: {
      background: 'transparent',
      color: colors.primary[600],
      border: 'none',
      boxShadow: 'none',
      padding: `0 ${spacing[2]}`,
    },
    gradient: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: colors.neutral[0],
      border: 'none',
      boxShadow: shadows.glow,
    },
  }

  const baseStyle: CSSProperties = {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.semibold,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.normal}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  const hoverStyle: CSSProperties = !disabled && !loading ? {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'primary' || variant === 'gradient' 
      ? shadows.buttonHover 
      : variant === 'secondary' 
      ? shadows.card 
      : shadows.subtle,
  } : {}

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} hover-lift`.trim()}
      style={{
        ...baseStyle,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyle)
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || 'none'
        }
      }}
    >
      {loading ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: `3px solid ${variant === 'primary' || variant === 'gradient' ? 'rgba(255,255,255,0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderTopColor: variant === 'primary' || variant === 'gradient' ? colors.neutral[0] : colors.primary[500],
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
