# Figmaデザイン仕様: メールアドレスログイン画面 (488-451)

## 基本情報
- **Figma File Key**: `XxOyYjBZdBDkaAbqjpbJJ1`
- **Node ID**: `488:451`
- **画面サイズ**: 393px × 852px

## レイアウト構造

### 1. 白いカード
- **サイズ**: 352px × 504px
- **位置**: 中央（x: 21px, y: 174px from top）

### 2. タイトル・サブタイトル
- 前回と同じスタイル

### 3. タブセクション
- **「ログイン」タブ（アクティブ）**
  - フォント: Inter Semi Bold, 16px, Weight: 600
  - 色: `#FF8A5C`（オレンジ）
  - アンダーライン: 40px × 2px

- **「新規登録」タブ（非アクティブ）**
  - フォント: Inter Regular, 16px, Weight: 400
  - 色: `#6C757D`（グレー）

### 4. LINEボタン
- **サイズ**: 約140px × 52px（推定）
- **位置**: (x: 52px, y: 450px from top)
- **背景**: オレンジ（`#FF8A5C`）
- **テキスト**: "LINE", 16px, Semi Bold, White

### 5. メールアドレス入力フィールド
- **ラベル**: "メールアドレス"
  - フォント: Inter Bold Italic, 14px, Weight: 700, Color: `#2C3E50`
  - 位置: (x: 53px, y: 424px)

- **入力フィールド**
  - サイズ: 289px × 44px
  - 位置: (x: 53px, y: 446px)
  - プレースホルダー: "example@email.com"
  - フォント: Inter Regular, 15px, Color: `#6C757D`

### 6. パスワード入力フィールド
- **ラベル**: "パスワード（忘れた場合はここをクリック）"
  - フォント: Inter Bold Italic, 14px, Weight: 700
  - 色: `#2C3E50`（通常）、`#89cff0`（リンク部分）
  - 位置: (x: 53px, y: 504px)

- **入力フィールド**
  - サイズ: 289px × 44px
  - 位置: (x: 53px, y: 526px)
  - プレースホルダー: "6文字以上"
  - フォント: Inter Regular, 15px, Color: `#6C757D`

### 7. ログインボタン
- **サイズ**: 140px × 52px
- **位置**: (x: 52px, y: 590px)
- **背景**: オレンジ（`#FF8A5C`）
- **テキスト**: "ログイン"
  - フォント: Inter Bold Italic, 15px, Weight: 700, White

### 8. 別の方法ボタン
- **サイズ**: 140px × 52px
- **位置**: (x: 202px, y: 590px)
- **背景**: 白（`#FFFFFF`）
- **ボーダー**: 1px solid `#E9ECEF`（推定）
- **テキスト**: "別の方法"
  - フォント: Inter Bold Italic, 15px, Weight: 700, Color: `#6C757D`

## 実装時の注意点

1. **LINEボタン**: オレンジ背景、16px Semi Bold
2. **入力フィールド**: 44px高さ、15pxフォント
3. **ラベル**: 14px Bold Italic
4. **パスワード忘れリンク**: 青色（`#89cff0`）
5. **ボタン**: 140px幅、52px高さ、横並び

