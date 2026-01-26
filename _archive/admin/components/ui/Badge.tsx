'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography } from '@/styles/design-system'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  icon?: ReactNode
  className?: string
  style?: CSSProperties
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  icon,
  className = '',
  style = {},
}: BadgeProps) {
  const variantStyles: Record<string, CSSProperties> = {
    success: {
      background: colors.status.success.light,
      color: colors.status.success.dark,
      border: `1px solid ${colors.primary[200]}`,
    },
    warning: {
      background: colors.status.warning.light,
      color: colors.status.warning.dark,
      border: `1px solid ${colors.accent[200]}`,
    },
    error: {
      background: colors.status.error.light,
      color: colors.status.error.dark,
      border: `1px solid #FECACA`,
    },
    info: {
      background: colors.status.info.light,
      color: colors.status.info.dark,
      border: `1px solid #BFDBFE`,
    },
    primary: {
      background: colors.primary[50],
      color: colors.primary[700],
      border: `1px solid ${colors.primary[200]}`,
    },
    secondary: {
      background: colors.secondary[50],
      color: colors.secondary[700],
      border: `1px solid ${colors.secondary[200]}`,
    },
    neutral: {
      background: colors.neutral[100],
      color: colors.neutral[700],
      border: `1px solid ${colors.neutral[200]}`,
    },
  }

  const sizeStyles = {
    sm: {
      padding: `${spacing[0.5]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
      height: '20px',
      gap: spacing[1],
    },
    md: {
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
      height: '24px',
      gap: spacing[1.5],
    },
    lg: {
      padding: `${spacing[1.5]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      height: '32px',
      gap: spacing[2],
    },
  }

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.japanese,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.full,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  const dotStyle: CSSProperties = {
    width: size === 'sm' ? '6px' : size === 'md' ? '8px' : '10px',
    height: size === 'sm' ? '6px' : size === 'md' ? '8px' : '10px',
    borderRadius: borderRadius.full,
    background: variantStyles[variant].color as string,
  }

  return (
    <span
      className={className}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
      {dot && <span style={dotStyle} />}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  )
}
