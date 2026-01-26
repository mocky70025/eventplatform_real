'use client'

import { CSSProperties, InputHTMLAttributes, ReactNode, useState } from 'react'
import { colors, spacing, borderRadius, typography, shadows, transitions } from '@/styles/design-system'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  inputSize = 'md',
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const sizeStyles = {
    sm: {
      height: '36px',
      padding: leftIcon ? `0 ${spacing[3]} 0 ${spacing[10]}` : `0 ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '44px',
      padding: leftIcon ? `0 ${spacing[4]} 0 ${spacing[12]}` : `0 ${spacing[4]}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '52px',
      padding: leftIcon ? `0 ${spacing[6]} 0 ${spacing[14]}` : `0 ${spacing[6]}`,
      fontSize: typography.fontSize.lg,
    },
  }

  const inputContainerStyle: CSSProperties = {
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: error ? colors.status.error.main : colors.neutral[700],
    marginBottom: spacing[2],
    transition: transitions.fast,
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    fontFamily: typography.fontFamily.japanese,
    background: colors.neutral[0],
    border: `2px solid ${
      error 
        ? colors.status.error.main 
        : isFocused 
        ? colors.primary[500] 
        : colors.neutral[200]
    }`,
    borderRadius: borderRadius.lg,
    color: colors.neutral[900],
    outline: 'none',
    transition: `all ${transitions.normal}`,
    boxShadow: isFocused ? shadows.card : 'none',
    ...sizeStyles[inputSize],
    ...(rightIcon && { paddingRight: spacing[12] }),
  }

  const iconStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: error ? colors.status.error.main : isFocused ? colors.primary[500] : colors.neutral[400],
    transition: transitions.fast,
    pointerEvents: 'none',
  }

  const leftIconStyle: CSSProperties = {
    ...iconStyle,
    left: spacing[4],
  }

  const rightIconStyle: CSSProperties = {
    ...iconStyle,
    right: spacing[4],
  }

  const helperStyle: CSSProperties = {
    fontFamily: typography.fontFamily.japanese,
    fontSize: typography.fontSize.sm,
    color: error ? colors.status.error.main : colors.neutral[500],
    marginTop: spacing[2],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  }

  return (
    <div style={inputContainerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {props.required && (
            <span style={{ color: colors.status.error.main, marginLeft: spacing[1] }}>*</span>
          )}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={leftIconStyle}>
            {leftIcon}
          </div>
        )}
        
        <input
          style={{ ...inputStyle, ...style }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <div style={rightIconStyle}>
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div style={helperStyle}>
          {error && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 10.5C7.59 10.5 7.25 10.16 7.25 9.75V8C7.25 7.59 7.59 7.25 8 7.25C8.41 7.25 8.75 7.59 8.75 8V9.75C8.75 10.16 8.41 10.5 8 10.5ZM8.75 6H7.25V4.5H8.75V6Z"
                fill="currentColor"
              />
            </svg>
          )}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  )
}
