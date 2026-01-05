'use client'

import { CSSProperties, InputHTMLAttributes, ReactNode, useState } from 'react'
import { colors, spacing, borderRadius, typography, shadows, transitions } from '@/styles/design-system'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  fullWidth?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
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
      padding: leftIcon ? `0 ${spacing[6]} 0 ${spacing[12]}` : `0 ${spacing[6]}`,
      fontSize: typography.fontSize.lg,
    },
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    fontFamily: typography.fontFamily.japanese,
    background: colors.neutral[0],
    border: `1.5px solid ${
      error 
        ? colors.status.error.main 
        : isFocused 
        ? colors.primary[500] 
        : colors.neutral[200]
    }`,
    borderRadius: borderRadius.lg,
    color: colors.neutral[900],
    outline: 'none',
    transition: transitions.normal,
    boxShadow: isFocused ? shadows.glow : 'none',
    ...sizeStyles[inputSize],
  }

  const iconStyle: CSSProperties = {
    position: 'absolute',
    left: spacing[4],
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    color: error ? colors.status.error.main : isFocused ? colors.primary[500] : colors.neutral[400],
    transition: transitions.fast,
    pointerEvents: 'none',
  }

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: error ? colors.status.error.main : colors.neutral[700],
          marginBottom: spacing[2],
        }}>
          {label}
          {props.required && (
            <span style={{ color: colors.status.error.main, marginLeft: spacing[1] }}>*</span>
          )}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={iconStyle}>
            {leftIcon}
          </div>
        )}
        
        <input
          style={{ ...inputStyle, ...style }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <div style={{
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.sm,
          color: error ? colors.status.error.main : colors.neutral[500],
          marginTop: spacing[1.5],
        }}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}
