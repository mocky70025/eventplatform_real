'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, shadows, transitions } from '@/styles/design-system'

interface CardProps {
  children: ReactNode
  padding?: keyof typeof spacing
  onClick?: () => void
  hoverable?: boolean
  className?: string
  style?: CSSProperties
}

export default function Card({
  children,
  padding = 6,
  onClick,
  hoverable = false,
  className = '',
  style = {},
}: CardProps) {
  const baseStyle: CSSProperties = {
    background: colors.neutral[0],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.xl,
    padding: spacing[padding],
    transition: transitions.normal,
    cursor: onClick || hoverable ? 'pointer' : 'default',
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        ...baseStyle,
        ...(onClick || hoverable ? {
          boxShadow: shadows.card,
        } : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = shadows.cardHover
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = shadows.card
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </div>
  )
}
