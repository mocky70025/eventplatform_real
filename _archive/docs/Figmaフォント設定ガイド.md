# Figmaフォント設定ガイド

## 推奨フォント設定

### 日本語アプリの場合

**推奨: `Noto Sans JP`**

理由：
1. ✅ 日本語と英語の両方に対応
2. ✅ Google Fontsで無料利用可能
3. ✅ Figmaでも利用可能
4. ✅ 実際のアプリでも簡単に実装可能
5. ✅ 読みやすく、モダンなデザイン

---

## Figmaでの設定方法

### 方法1: Noto Sans JPを使用（推奨）

1. **Figmaでフォントを確認**
   - テキストを選択
   - 右側のパネルで「Text」セクションを開く
   - フォント名をクリック
   - 「Noto Sans JP」を検索

2. **Noto Sans JPが見つからない場合**
   - Google Fontsからダウンロードしてインストール
   - または、Figmaの「Resources」→「Fonts」から追加

3. **すべてのテキストスタイルで `Noto Sans JP` を使用**
   - 日本語テキストも英語テキストも同じフォントで統一

---

### 方法2: Interと日本語フォントを併用

もし `Inter` を使いたい場合：

1. **日本語テキスト用のスタイル**
   - フォント: `Noto Sans JP` または `Hiragino Sans`
   - スタイル名: `Text/Body (JP)`, `Text/Heading 1 (JP)` など

2. **英語テキスト用のスタイル**
   - フォント: `Inter`
   - スタイル名: `Text/Body (EN)`, `Text/Heading 1 (EN)` など

**注意**: この方法は管理が複雑になるため、**方法1（Noto Sans JP統一）を推奨**

---

## 実際のアプリでの実装

### Next.jsでの実装例

```tsx
// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
body {
  font-family: var(--font-noto-sans-jp), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

---

## フォントウェイト

`Noto Sans JP` で使用可能なウェイト：
- **400** (Regular) - 本文
- **500** (Medium) - ボタン、ラベル
- **600** (SemiBold) - サブ見出し
- **700** (Bold) - 見出し、強調

---

## まとめ

### 推奨設定
- **フォント**: `Noto Sans JP`
- **すべてのテキストスタイルで統一**
- **日本語と英語の両方に対応**

### Figmaでの作業
1. テキストスタイルを作成する際、フォントを `Noto Sans JP` に設定
2. すべてのスタイル（Display Large, Heading 1-3, Body, Body Small, Caption）で同じフォントを使用
3. ウェイト（400, 500, 600, 700）とサイズのみを変更

これで、Figmaと実際のアプリで一貫したデザインを実現できます。

