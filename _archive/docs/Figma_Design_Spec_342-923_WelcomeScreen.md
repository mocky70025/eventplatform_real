# Figmaデザイン仕様: WelcomeScreen (342-923)

## 基本情報
- **Figma File Key**: `XxOyYjBZdBDkaAbqjpbJJ1`
- **Node ID**: `342:923`
- **画面サイズ**: 393px × 852px
- **背景**: グラデーション（`linear-gradient(-44.94deg, rgba(255, 245, 240, 1) 0%, rgba(232, 245, 245, 1) 99.95%)`）

## レイアウト構造

### 1. 白いカード（中央配置）
- **サイズ**: 352px × 404px
- **位置**: 中央（x: 21px, y: 224px from top）
- **背景**: White (`#FFFFFF`)
- **角丸**: 16px（推定）
- **シャドウ**: Shadow/Small (`0px 2px 8px rgba(0, 0, 0, 0.08)`)

### 2. ロゴ/アイコン
- **サイズ**: 64px × 64px
- **位置**: 中央上部（x: 165px, y: 260px from top）
- **背景**: Primary/Default (`#FF8A5C`)
- **角丸**: 8px（推定）

### 3. タイトル「デミセル」
- **テキスト**: "デミセル"
- **位置**: 中央（x: 149px, y: 332px from top）
- **サイズ**: 96px × 29px
- **フォント**: 
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Bold Italic
  - Size: 24px
  - Weight: 700
  - Color: `#2C3E50`
  - Text Align: center

### 4. サブタイトル「主催者向けプラットフォーム」
- **テキスト**: "主催者向けプラットフォーム"
- **位置**: 中央（x: 99px, y: 369px from top）
- **サイズ**: 195px × 18px
- **フォント**:
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Regular
  - Size: 15px
  - Weight: 400
  - Color: `#6C757D`
  - Text Align: center

### 5. タブセクション
- **区切り線**: 1px solid `#E9ECEF`（推定）

#### 5.1 「ログイン」タブ（アクティブ）
- **テキスト**: "ログイン"
- **位置**: (x: 101px, y: 416px from top)
- **サイズ**: 64px × 19px
- **フォント**:
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Bold Italic
  - Size: 16px
  - Weight: 700
  - Color: `#FF8A5C`（アクティブ時）
- **アンダーライン**: 40px × 2px, `#FF8A5C`

#### 5.2 「新規登録」タブ（非アクティブ）
- **テキスト**: "新規登録"
- **位置**: (x: 229px, y: 416px from top)
- **サイズ**: 64px × 19px
- **フォント**:
  - Family: `"Inter", "Noto Sans JP", sans-serif`
  - Style: Regular
  - Size: 16px
  - Weight: 400
  - Color: `#6C757D`（非アクティブ時）

### 6. ボタンセクション

#### 6.1 Googleログインボタン
- **サイズ**: 256px × 52px
- **位置**: (x: 69px, y: 472px from top)
- **背景**: White (`#FFFFFF`)
- **ボーダー**: 1px solid `#E9ECEF`（推定）
- **角丸**: 12px（推定）
- **シャドウ**: Shadow/Small (`0px 2px 8px rgba(0, 0, 0, 0.08)`)
- **内容**:
  - Googleアイコン（左側）
  - テキスト「Google」（中央）
  - フォント: Inter Semi Bold, 16px, Weight: 600, Color: `#2C3E50`

#### 6.2 メールアドレスボタン
- **サイズ**: 256px × 52px
- **位置**: (x: 69px, y: 540px from top)
- **背景**: Primary/Default (`#FF8A5C`)
- **角丸**: 12px（推定）
- **シャドウ**: Shadow/Small (`0px 2px 8px rgba(0, 0, 0, 0.08)`)
- **内容**:
  - メールアイコン（左側）
  - テキスト「メールアドレス」（中央）
  - フォント: Inter Bold Italic, 15px, Weight: 700, Color: White (`#FFFFFF`)

## カラーパレット

- **Primary/Default**: `#FF8A5C`
- **Text Main**: `#2C3E50`
- **Text Sub**: `#6C757D`
- **White**: `#FFFFFF`
- **Border**: `#E9ECEF`

## シャドウ

- **Shadow/Small**: `0px 2px 8px rgba(0, 0, 0, 0.08)`
- **Shadow/Large**: `0px 8px 32px rgba(0, 0, 0, 0.08)`

## フォント設定

### タイトル「デミセル」
- Font Family: `"Inter", "Noto Sans JP", sans-serif`
- Font Style: Bold Italic
- Font Size: 24px
- Font Weight: 700
- Color: `#2C3E50`

### サブタイトル
- Font Family: `"Inter", "Noto Sans JP", sans-serif`
- Font Style: Regular
- Font Size: 15px
- Font Weight: 400
- Color: `#6C757D`

### タブ
- Font Family: `"Inter", "Noto Sans JP", sans-serif`
- Font Style: Bold Italic（アクティブ）/ Regular（非アクティブ）
- Font Size: 16px
- Font Weight: 700（アクティブ）/ 400（非アクティブ）
- Color: `#FF8A5C`（アクティブ）/ `#6C757D`（非アクティブ）

### ボタン
- Font Family: `"Inter", sans-serif`
- Font Style: Semi Bold（Google）/ Bold Italic（メールアドレス）
- Font Size: 16px（Google）/ 15px（メールアドレス）
- Font Weight: 600（Google）/ 700（メールアドレス）
- Line Height: 100%

## 実装時の注意点

1. **Italicスタイル**: タイトルとタブ、メールアドレスボタンはItalicが必要
2. **フォントサイズ**: サブタイトルは15px、メールアドレスボタンは15px
3. **ボタンサイズ**: 256px × 52px（固定幅）
4. **背景グラデーション**: カード背景はグラデーション
5. **シャドウ**: ボタンとカードにShadow/Smallを適用

## 現在のコードとの違い

現在のWelcomeScreen.tsxと比較して、以下の調整が必要：

1. ✅ タイトルのフォントスタイルにItalicを追加
2. ✅ サブタイトルのフォントサイズを15pxに調整
3. ✅ タブのフォントスタイルにItalicを追加（アクティブ時）
4. ✅ メールアドレスボタンのフォントサイズを15px、スタイルをBold Italicに調整
5. ✅ ボタンのサイズを256px × 52pxに調整（または相対サイズで対応）

