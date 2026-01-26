/**
 * デミセル デザインシステム v3.0
 * 洗練された、モダンでシュッとしたデザイン
 * 
 * デザインコンセプト:
 * - ミニマリズム: 余白を活かした洗練されたレイアウト
 * - モダン: グラスモーフィズム、マイクロインタラクション
 * - プロフェッショナル: ビジネスに適した信頼感のある配色
 * - 直感的: 視覚階層が明確なUI
 */

export const colors = {
  // プライマリカラー - 洗練されたティール
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // メイン
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },

  // セカンダリカラー - モダンなバイオレット
  secondary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',  // メイン
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
    950: '#3B0764',
  },

  // アクセントカラー - エレガントなアンバー
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // メイン
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // ニュートラルカラー - クールグレー
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // ステータスカラー
  status: {
    success: {
      light: '#D1FAE5',
      main: '#10B981',
      dark: '#047857',
    },
    warning: {
      light: '#FEF3C7',
      main: '#F59E0B',
      dark: '#B45309',
    },
    error: {
      light: '#FEE2E2',
      main: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      light: '#DBEAFE',
      main: '#3B82F6',
      dark: '#1D4ED8',
    },
  },

  // グラデーション - 洗練された配色
  gradients: {
    primary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    secondary: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
    accent: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    dark: 'linear-gradient(180deg, #111827 0%, #030712 100%)',
    mesh: 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)',
  },

  // 特殊効果
  effects: {
    glass: 'rgba(255, 255, 255, 0.1)',
    glassDark: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shimmer: 'rgba(255, 255, 255, 0.6)',
  },
} as const

export const typography = {
  fontFamily: {
    primary: '"Inter var", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    japanese: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
    display: '"Cal Sans", "Inter var", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
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
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
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
    black: 900,
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
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
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
  
  // カスタムシャドウ - より洗練された影
  subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
  card: '0 4px 16px rgba(0, 0, 0, 0.08)',
  cardHover: '0 8px 32px rgba(0, 0, 0, 0.12)',
  button: '0 2px 8px rgba(16, 185, 129, 0.25)',
  buttonHover: '0 4px 16px rgba(16, 185, 129, 0.35)',
  glow: '0 0 24px rgba(16, 185, 129, 0.3)',
  glowPurple: '0 0 24px rgba(168, 85, 247, 0.3)',
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-in',
  slideUp: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  slideDown: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  scaleIn: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  shimmer: 'shimmer 2s linear infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
} as const

export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultrawide: '1536px',
} as const

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  toast: 1400,
  tooltip: 1500,
} as const

// グラスモーフィズム効果
export const glassEffect = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
} as const

export const glassEffectDark = {
  background: 'rgba(17, 24, 39, 0.7)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
} as const

// ホバーエフェクト
export const hoverLift = {
  transform: 'translateY(-4px)',
  boxShadow: shadows.cardHover,
} as const

export const hoverGlow = {
  boxShadow: shadows.glow,
  transform: 'scale(1.02)',
} as const
