'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography, shadows } from '@/styles/design-system'

interface NotificationBoxProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  icon?: ReactNode
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export default function NotificationBox({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  action,
}: NotificationBoxProps) {
  const typeConfig = {
    info: {
      bg: colors.status.info.light,
      border: colors.status.info.main,
      text: colors.status.info.dark,
      icon: '💡',
    },
    success: {
      bg: colors.status.success.light,
      border: colors.status.success.main,
      text: colors.status.success.dark,
      icon: '✓',
    },
    warning: {
      bg: colors.status.warning.light,
      border: colors.status.warning.main,
      text: colors.status.warning.dark,
      icon: '⚠',
    },
    error: {
      bg: colors.status.error.light,
      border: colors.status.error.main,
      text: colors.status.error.dark,
      icon: '✕',
    },
  }

  const config = typeConfig[type]

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: spacing[3],
    padding: spacing[4],
    background: config.bg,
    border: `1px solid ${config.border}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.sm,
    animation: 'slideInDown 0.3s ease-out',
  }

  const iconContainerStyle: CSSProperties = {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.base,
  }

  const contentStyle: CSSProperties = {
    flex: 1,
  }

  const titleStyle: CSSProperties = {
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: config.text,
    marginBottom: spacing[1],
  }

  const messageStyle: CSSProperties = {
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.sm,
    color: config.text,
    lineHeight: typography.lineHeight.relaxed,
  }

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    marginTop: spacing[3],
  }

  const actionButtonStyle: CSSProperties = {
    padding: `${spacing[1.5]} ${spacing[3]}`,
    background: config.border,
    color: colors.neutral[0],
    border: 'none',
    borderRadius: borderRadius.base,
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const closeButtonStyle: CSSProperties = {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: config.text,
    cursor: 'pointer',
    borderRadius: borderRadius.base,
    transition: 'all 0.2s',
  }

  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>
        {icon || config.icon}
      </div>
      <div style={contentStyle}>
        {title && <div style={titleStyle}>{title}</div>}
        <div style={messageStyle}>{message}</div>
        {action && (
          <div style={actionsStyle}>
            <button
              onClick={action.onClick}
              style={actionButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
