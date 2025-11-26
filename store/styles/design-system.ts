/**
 * Tomorrow Event Platform デザインシステム
 * すべてのコンポーネントで使用する共通スタイル定義
 */

export const colors = {
  // プライマリカラー
  primary: {
    main: '#06C755',
    dark: '#05B04A',
    light: '#E6F7ED',
  },
  
  // ニュートラルカラー
  neutral: {
    black: '#000000',
    gray900: '#1A1A1A',
    gray700: '#333333',
    gray500: '#666666',
    gray300: '#999999',
    gray200: '#E5E5E5',
    gray100: '#F7F7F7',
    white: '#FFFFFF',
  },
  
  // ステータスカラー
  status: {
    success: '#06C755',
    successLight: '#E6F7ED',
    warning: '#FFB800',
    warningLight: '#FFF9E6',
    error: '#FF3B30',
    errorLight: '#FFEBEE',
    info: '#0066FF',
    infoLight: '#E6F0FF',
  },
  
  // セマンティックカラー
  semantic: {
    pending: {
      bg: '#FFF9E6',
      text: '#B8860B',
    },
    approved: {
      bg: '#E6F7ED',
      text: '#06C755',
    },
    rejected: {
      bg: '#FFE6E6',
      text: '#FF3B30',
    },
  },
} as const

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    japanese: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
  },
  fontSize: {
    displayLarge: '32px',
    displayMedium: '28px',
    heading1: '24px',
    heading2: '20px',
    heading3: '18px',
    bodyLarge: '16px',
    body: '16px',
    bodySmall: '14px',
    caption: '12px',
  },
  lineHeight: {
    displayLarge: '40px',
    displayMedium: '36px',
    heading1: '32px',
    heading2: '28px',
    heading3: '24px',
    bodyLarge: '24px',
    body: '150%',
    bodySmall: '150%',
    caption: '120%',
  },
  fontWeight: {
    bold: 700,
    semiBold: 600,
    medium: 500,
    regular: 400,
  },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const

export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  full: '9999px',
} as const

export const shadows = {
  level0: 'none',
  level1: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  level2: '0px 4px 16px rgba(0, 0, 0, 0.12)',
  level3: '0px 8px 24px rgba(0, 0, 0, 0.15)',
} as const

export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const

export const easing = {
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
} as const

// コンポーネントスタイルのヘルパー関数
export const getButtonStyle = (variant: 'primary' | 'secondary' | 'text') => {
  const baseStyle = {
    borderRadius: borderRadius.medium,
    padding: `${spacing.lg} ${spacing.xl}`,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.primary,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${transitions.normal} ${easing.easeOut}`,
  }

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        background: colors.primary.main,
        color: colors.neutral.white,
        '&:hover': {
          background: colors.primary.dark,
        },
        '&:disabled': {
          background: colors.neutral.gray200,
          color: colors.neutral.gray500,
          cursor: 'not-allowed',
        },
      }
    case 'secondary':
      return {
        ...baseStyle,
        background: colors.neutral.white,
        color: colors.neutral.black,
        border: `1px solid ${colors.neutral.gray200}`,
        '&:hover': {
          background: colors.neutral.gray100,
        },
      }
    case 'text':
      return {
        ...baseStyle,
        background: 'transparent',
        color: colors.primary.main,
        padding: spacing.sm,
        fontWeight: typography.fontWeight.medium,
        '&:hover': {
          color: colors.primary.dark,
        },
      }
  }
}

export const getCardStyle = () => ({
  background: colors.neutral.white,
  borderRadius: borderRadius.large,
  boxShadow: shadows.level1,
  padding: spacing.xl,
})

export const getInputStyle = (hasError = false) => ({
  background: colors.neutral.white,
  border: `1px solid ${hasError ? colors.status.error : colors.neutral.gray200}`,
  borderRadius: borderRadius.medium,
  padding: `${spacing.md} ${spacing.lg}`,
  fontSize: typography.fontSize.body,
  fontFamily: typography.fontFamily.primary,
  width: '100%',
  boxSizing: 'border-box' as const,
  '&:focus': {
    outline: 'none',
    borderColor: colors.primary.main,
  },
})

export const getBadgeStyle = (variant: 'success' | 'warning' | 'error' | 'info') => {
  const variantColors = {
    success: { bg: colors.status.successLight, text: colors.status.success },
    warning: { bg: colors.status.warningLight, text: colors.status.warning },
    error: { bg: colors.status.errorLight, text: colors.status.error },
    info: { bg: colors.status.infoLight, text: colors.status.info },
  }

  const colors = variantColors[variant]

  return {
    padding: `2px ${spacing.sm}`,
    borderRadius: '12px',
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.semiBold,
    background: colors.bg,
    color: colors.text,
  }
}

