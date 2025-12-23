# Figmaデザイン仕様: メールアドレス新規登録画面 (342-974)

## 基本情報
- **Figma File Key**: `XxOyYjBZdBDkaAbqjpbJJ1`
- **Node ID**: `342:974`
- **画面サイズ**: 393px × 852px

## レイアウト構造

### 1. タブセクション
- **「ログイン」タブ（非アクティブ）**
  - フォント: Inter Regular, 16px, Weight: 400
  - 色: `#6C757D`（グレー）

- **「新規登録」タブ（アクティブ）**
  - フォント: Inter Semi Bold, 16px, Weight: 600
  - 色: `#FF8A5C`（オレンジ）
  - アンダーライン: 40px × 2px

### 2. メールアドレス入力フィールド
- **ラベル**: "メールアドレス"
  - フォント: Inter Bold Italic, 14px, Weight: 700, Color: `#2C3E50`
  - 位置: (x: 53px, y: 424px)

- **入力フィールド**
  - サイズ: 289px × 44px
  - 位置: (x: 53px, y: 446px)
  - プレースホルダー: "example@email.com"
  - フォント: Inter Regular, 15px, Color: `#6C757D`

### 3. パスワード入力フィールド
- **ラベル**: "パスワード"
  - フォント: Inter Bold Italic, 14px, Weight: 700, Color: `#2C3E50`
  - 位置: (x: 53px, y: 504px)
  - **注意**: パスワード忘れリンクはない

- **入力フィールド**
  - サイズ: 289px × 44px
  - 位置: (x: 53px, y: 526px)
  - プレースホルダー: "6文字以上"
  - フォント: Inter Regular, 15px, Color: `#6C757D`

### 4. 新規登録ボタン
- **サイズ**: 140px × 52px
- **位置**: (x: 52px, y: 590px)
- **背景**: オレンジ（`#FF8A5C`）
- **テキスト**: "新規登録"
  - フォント: Inter Bold Italic, 15px, Weight: 700, White

### 5. 別の方法ボタン
- **サイズ**: 140px × 52px
- **位置**: (x: 202px, y: 590px)
- **背景**: 白（`#FFFFFF`）
- **ボーダー**: 1px solid `#E9ECEF`（推定）
- **テキスト**: "別の方法"
  - フォント: Inter Bold Italic, 15px, Weight: 700, Color: `#6C757D`

## ログイン画面との違い

1. **パスワード忘れリンクがない**
2. **ボタンのテキストが「新規登録」**
3. **タブが「新規登録」でアクティブ**

