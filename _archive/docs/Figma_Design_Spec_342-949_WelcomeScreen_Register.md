# Figmaデザイン仕様: WelcomeScreen 新規登録タブ (342-949)

## 基本情報
- **Figma File Key**: `XxOyYjBZdBDkaAbqjpbJJ1`
- **Node ID**: `342:949`
- **画面サイズ**: 393px × 852px
- **背景**: グラデーション（前回と同じ）

## 主な違い（ログインタブとの比較）

### タブの状態

#### 「ログイン」タブ（非アクティブ）
- **テキスト**: "ログイン"
- **位置**: (x: 101px, y: 416px)
- **フォント**:
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Regular
  - Size: 16px
  - Weight: 400
  - Color: `#6C757D`（グレー）

#### 「新規登録」タブ（アクティブ）
- **テキスト**: "新規登録"
- **位置**: (x: 229px, y: 416px)
- **アンダーライン**: 40px × 2px, `#FF8A5C`（x: 241px, y: 444px）
- **フォント**:
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Semi Bold（Italicではない）
  - Size: 16px
  - Weight: 600
  - Color: `#FF8A5C`（オレンジ）

## 実装時の注意点

1. **新規登録タブ**: Semi Bold (600)、Italicではない
2. **ログインタブ**: Regular (400)、グレー（`#6C757D`）
3. **アンダーライン**: アクティブなタブの下に表示

## 現在のコードとの違い

現在の実装では、アクティブなタブにBold Italic (700, italic)を適用していますが、Figmaのデザインでは：
- アクティブなタブは **Semi Bold (600)**、**Italicではない**

調整が必要です。

