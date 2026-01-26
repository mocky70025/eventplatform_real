'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'glass' | 'elevated' | 'bordered' | 'hover'
  padding?: keyof typeof spacing
  onClick?: () => void
  hoverable?: boolean
  className?: string
  style?: CSSProperties
}

export default function Card({
  children,
  variant = 'default',
  padding = 6,
  onClick,
  hoverable = false,
  className = '',
  style = {},
}: CardProps) {
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      background: colors.neutral[0],
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.card,
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid rgba(255, 255, 255, 0.3)`,
      boxShadow: shadows.subtle,
    },
    elevated: {
      background: colors.neutral[0],
      border: 'none',
      boxShadow: shadows.xl,
    },
    bordered: {
      background: colors.neutral[0],
      border: `2px solid ${colors.neutral[200]}`,
      boxShadow: 'none',
    },
    hover: {
      background: colors.neutral[0],
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.card,
      cursor: 'pointer',
    },
  }

  const baseStyle: CSSProperties = {
    borderRadius: borderRadius.xl,
    padding: spacing[padding],
    transition: `all ${transitions.normal}`,
    position: 'relative',
    overflow: 'hidden',
    ...variantStyles[variant],
  }

  const hoverStyle: CSSProperties = (hoverable || onClick || variant === 'hover') ? {
    transform: 'translateY(-4px)',
    boxShadow: shadows.cardHover,
  } : {}

  return (
    <div
      onClick={onClick}
      className={`${className} ${(hoverable || onClick || variant === 'hover') ? 'hover-lift' : ''}`.trim()}
      style={{
        ...baseStyle,
        ...(onClick && { cursor: 'pointer' }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable || onClick || variant === 'hover') {
          Object.assign(e.currentTarget.style, hoverStyle)
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick || variant === 'hover') {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || shadows.card
        }
      }}
    >
      {children}
    </div>
  )
}
