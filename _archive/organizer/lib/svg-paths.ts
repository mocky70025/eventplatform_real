/**
 * SVGファイルパスの管理
 * このファイルでSVGパスを一元管理することで、パスの誤りを防ぎます
 */

export const SVG_PATHS = {
  // 主催者用プログレスバー
  organizer: {
    progressBar: '/progress-bar.svg',
    progressBarConfirmation: '/progress-bar-confirmation.svg',
    progressBarComplete: '/progress-bar-complete.svg',
  },
  // 出店者用プログレスバー
  seller: {
    progressBarForm: '/seller-progress-bar-form.svg',
    progressBarConfirmation: '/seller-progress-bar-confirmation.svg',
    progressBarComplete: '/seller-progress-bar-complete.svg',
  },
} as const

/**
 * SVGパスの検証
 * 開発環境でSVGファイルの存在を確認します
 */
export function validateSvgPath(path: string): boolean {
  if (typeof window === 'undefined') return true // サーバーサイドでは常にtrue
  
  // 開発環境でのみ検証
  if (process.env.NODE_ENV === 'development') {
    // 実際のファイル存在確認は難しいため、パス形式の検証のみ
    return path.startsWith('/') && path.endsWith('.svg')
  }
  
  return true
}

/**
 * 型安全なSVGパス取得
 */
export function getSvgPath(
  type: 'organizer' | 'seller',
  step: 'form' | 'confirmation' | 'complete'
): string {
  if (type === 'organizer') {
    switch (step) {
      case 'form':
        return SVG_PATHS.organizer.progressBar
      case 'confirmation':
        return SVG_PATHS.organizer.progressBarConfirmation
      case 'complete':
        return SVG_PATHS.organizer.progressBarComplete
    }
  } else {
    switch (step) {
      case 'form':
        return SVG_PATHS.seller.progressBarConfirmation
      case 'confirmation':
        return SVG_PATHS.seller.progressBarForm
      case 'complete':
        return SVG_PATHS.seller.progressBarComplete
    }
  }
}

