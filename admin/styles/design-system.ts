/**
 * デミセル デザインシステム v2.0
 * 出店者向けプラットフォーム
 * モダンで洗練されたUIデザイン
 */

export const colors = {
  // プライマリカラー - 青緑系（出店者）
  primary: {
    50: '#E6F7F5',
    100: '#B3E8E3',
    200: '#80D9D1',
    300: '#4DCABF',
    400: '#33BFB3',
    500: '#1AB5A7', // メイン
    600: '#17A598',
    700: '#138F83',
    800: '#0F796E',
    900: '#0A5C54',
  },
  
  // セカンダリカラー - 暖色系アクセント
  secondary: {
    50: '#FFF5F0',
    100: '#FFE6DB',
    200: '#FFD4C2',
    300: '#FFC2A8',
    400: '#FFB394',
    500: '#FFA580', // メイン
    600: '#FF9670',
    700: '#FF8760',
    800: '#FF7850',
    900: '#FF6940',
  },
  
  // ニュートラルカラー
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  
  // ステータスカラー
  status: {
    success: {
      light: '#D1FAE5',
      main: '#10B981',
      dark: '#059669',
    },
    warning: {
      light: '#FEF3C7',
      main: '#F59E0B',
      dark: '#D97706',
    },
    error: {
      light: '#FEE2E2',
      main: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#DBEAFE',
      main: '#3B82F6',
      dark: '#2563EB',
    },
  },
  
  // セマンティックカラー
  semantic: {
    pending: {
      bg: '#FEF3C7',
      text: '#92400E',
      border: '#FCD34D',
    },
    approved: {
      bg: '#D1FAE5',
      text: '#065F46',
      border: '#6EE7B7',
    },
    rejected: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FCA5A5',
    },
  },
  
  // グラデーション
  gradients: {
    primary: 'linear-gradient(135deg, #1AB5A7 0%, #0F796E 100%)',
    secondary: 'linear-gradient(135deg, #FFA580 0%, #FF6940 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warm: 'linear-gradient(135deg, #FFF5F0 0%, #FFE6DB 100%)',
    cool: 'linear-gradient(135deg, #E6F7F5 0%, #B3E8E3 100%)',
  },
} as const

export const typography = {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif',
    japanese: '"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
    display: '"Poppins", "Inter", sans-serif',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  full: '9999px',
} as const

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  // カスタムシャドウ
  card: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
  button: '0 2px 4px rgba(0, 0, 0, 0.1)',
  buttonHover: '0 4px 8px rgba(0, 0, 0, 0.15)',
  primary: '0 4px 12px rgba(26, 181, 167, 0.3)',
  primaryHover: '0 8px 20px rgba(26, 181, 167, 0.4)',
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// コンポーネントスタイルヘルパー
export const getButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    transition: transitions.normal,
    outline: 'none',
    textDecoration: 'none',
  }

  const sizeStyles = {
    sm: {
      height: '36px',
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '44px',
      padding: `${spacing[2.5]} ${spacing[6]}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '52px',
      padding: `${spacing[3]} ${spacing[8]}`,
      fontSize: typography.fontSize.lg,
    },
  }

  const variantStyles = {
    primary: {
      background: colors.primary[500],
      color: colors.neutral[0],
      boxShadow: shadows.button,
      ':hover': {
        background: colors.primary[600],
        boxShadow: shadows.buttonHover,
        transform: 'translateY(-1px)',
      },
      ':active': {
        background: colors.primary[700],
        transform: 'translateY(0)',
      },
      ':disabled': {
        background: colors.neutral[300],
        color: colors.neutral[500],
        cursor: 'not-allowed',
        boxShadow: 'none',
      },
    },
    secondary: {
      background: colors.secondary[500],
      color: colors.neutral[0],
      boxShadow: shadows.button,
      ':hover': {
        background: colors.secondary[600],
        boxShadow: shadows.buttonHover,
        transform: 'translateY(-1px)',
      },
      ':active': {
        background: colors.secondary[700],
        transform: 'translateY(0)',
      },
      ':disabled': {
        background: colors.neutral[300],
        color: colors.neutral[500],
        cursor: 'not-allowed',
        boxShadow: 'none',
      },
    },
    outline: {
      background: 'transparent',
      color: colors.primary[500],
      border: `2px solid ${colors.primary[500]}`,
      ':hover': {
        background: colors.primary[50],
        borderColor: colors.primary[600],
      },
      ':active': {
        background: colors.primary[100],
      },
      ':disabled': {
        color: colors.neutral[400],
        borderColor: colors.neutral[300],
        cursor: 'not-allowed',
      },
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      ':hover': {
        background: colors.neutral[100],
      },
      ':active': {
        background: colors.neutral[200],
      },
      ':disabled': {
        color: colors.neutral[400],
        cursor: 'not-allowed',
      },
    },
    text: {
      background: 'transparent',
      color: colors.primary[500],
      padding: spacing[2],
      ':hover': {
        color: colors.primary[600],
        textDecoration: 'underline',
      },
      ':disabled': {
        color: colors.neutral[400],
        cursor: 'not-allowed',
      },
    },
  }

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  }
}

export const getCardStyle = (elevated: boolean = false) => ({
  background: colors.neutral[0],
  borderRadius: borderRadius.lg,
  boxShadow: elevated ? shadows.cardHover : shadows.card,
  padding: spacing[6],
  transition: transitions.normal,
  ':hover': elevated ? {
    boxShadow: shadows.xl,
    transform: 'translateY(-2px)',
  } : {},
})

export const getInputStyle = (hasError: boolean = false, variant: 'default' | 'filled' = 'default') => ({
  width: '100%',
  height: '44px',
  padding: `${spacing[2.5]} ${spacing[4]}`,
  fontFamily: typography.fontFamily.primary,
  fontSize: typography.fontSize.base,
  lineHeight: typography.lineHeight.normal,
  color: colors.neutral[900],
  background: variant === 'filled' ? colors.neutral[50] : colors.neutral[0],
  border: `1px solid ${hasError ? colors.status.error.main : colors.neutral[300]}`,
  borderRadius: borderRadius.md,
  outline: 'none',
  transition: transitions.fast,
  boxSizing: 'border-box' as const,
  '::placeholder': {
    color: colors.neutral[400],
  },
  ':focus': {
    borderColor: hasError ? colors.status.error.main : colors.primary[500],
    boxShadow: `0 0 0 3px ${hasError ? colors.status.error.light : colors.primary[50]}`,
  },
  ':disabled': {
    background: colors.neutral[100],
    color: colors.neutral[500],
    cursor: 'not-allowed',
  },
})

export const getBadgeStyle = (variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral') => {
  const variantColors = {
    success: {
      bg: colors.status.success.light,
      text: colors.status.success.dark,
    },
    warning: {
      bg: colors.status.warning.light,
      text: colors.status.warning.dark,
    },
    error: {
      bg: colors.status.error.light,
      text: colors.status.error.dark,
    },
    info: {
      bg: colors.status.info.light,
      text: colors.status.info.dark,
    },
    neutral: {
      bg: colors.neutral[100],
      text: colors.neutral[700],
    },
  }

  const variantColor = variantColors[variant]

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${spacing[1]} ${spacing[2.5]}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    background: variantColor.bg,
    color: variantColor.text,
    whiteSpace: 'nowrap' as const,
  }
}

export const getAvatarStyle = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '48px',
  }

  return {
    width: sizes[size],
    height: sizes[size],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.primary[100],
    color: colors.primary[700],
    fontWeight: typography.fontWeight.semibold,
    fontSize: size === 'sm' ? typography.fontSize.xs : size === 'md' ? typography.fontSize.sm : typography.fontSize.base,
  }
}

export const getSkeletonStyle = () => ({
  background: `linear-gradient(90deg, ${colors.neutral[200]} 25%, ${colors.neutral[100]} 50%, ${colors.neutral[200]} 75%)`,
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: borderRadius.base,
})

// レスポンシブヘルパー
export const mediaQuery = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
}

// グローバルスタイル
export const globalStyles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily.primary}, ${typography.fontFamily.japanese};
    color: ${colors.neutral[900]};
    background: ${colors.neutral[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }
`
