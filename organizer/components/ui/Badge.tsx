'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography } from '@/styles/design-system'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
  style?: CSSProperties
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
}: BadgeProps) {
  const variantStyles: Record<string, CSSProperties> = {
    success: {
      background: colors.status.success.light,
      color: colors.status.success.dark,
    },
    warning: {
      background: colors.status.warning.light,
      color: colors.status.warning.dark,
    },
    error: {
      background: colors.status.error.light,
      color: colors.status.error.dark,
    },
    info: {
      background: colors.status.info.light,
      color: colors.status.info.dark,
    },
    primary: {
      background: colors.primary[100],
      color: colors.primary[700],
    },
    neutral: {
      background: colors.neutral[100],
      color: colors.neutral[700],
    },
  }

  const sizeStyles = {
    sm: {
      padding: `${spacing[0.5]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[1]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
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
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  return (
    <span
      className={className}
      style={{
        ...baseStyle,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
