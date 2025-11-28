# Figma作業手順

## ステップ1: デザインシステムの構築（最初にやること）

### 1-1. カラースタイルの作成

#### プライマリカラー
1. **Primary Green** (`#06C755`)
   - スタイル名: `Primary/Green`
   - 用途: メインボタン、リンク、強調表示

2. **Primary Green Dark** (`#05B04A`)
   - スタイル名: `Primary/Green Dark`
   - 用途: ボタンのホバー状態

3. **Primary Green Light** (`#E6F7ED`)
   - スタイル名: `Primary/Green Light`
   - 用途: 成功メッセージの背景

#### ニュートラルカラー
1. **Black** (`#000000`) - `Neutral/Black`
2. **Gray 900** (`#1A1A1A`) - `Neutral/Gray 900`
3. **Gray 700** (`#333333`) - `Neutral/Gray 700`
4. **Gray 500** (`#666666`) - `Neutral/Gray 500`
5. **Gray 300** (`#999999`) - `Neutral/Gray 300`
6. **Gray 200** (`#E5E5E5`) - `Neutral/Gray 200`
7. **Gray 100** (`#F7F7F7`) - `Neutral/Gray 100`
8. **White** (`#FFFFFF`) - `Neutral/White`

#### ステータスカラー
1. **Success** (`#06C755`) - `Status/Success`
2. **Success Light** (`#E6F7ED`) - `Status/Success Light`
3. **Warning** (`#FFB800`) - `Status/Warning`
4. **Warning Light** (`#FFF9E6`) - `Status/Warning Light`
5. **Error** (`#FF3B30`) - `Status/Error`
6. **Error Light** (`#FFEBEE`) - `Status/Error Light`
7. **Info** (`#0066FF`) - `Status/Info`
8. **Info Light** (`#E6F0FF`) - `Status/Info Light`

**Figmaでの作成方法:**
1. 左側のパネルで「Design」タブを開く
2. 「Color styles」セクションで「+」をクリック
3. カラーを選択し、スタイル名を設定
4. 階層構造（例: `Primary/Green`）で整理

---

### 1-2. タイポグラフィスタイルの作成

#### テキストスタイル一覧

**Display Large**
- フォントサイズ: 32px (Mobile), 40px (Desktop)
- 行間: 40px (Mobile), 48px (Desktop)
- フォントウェイト: 700
- スタイル名: `Text/Display Large`

**Heading 1**
- フォントサイズ: 24px (Mobile), 32px (Desktop)
- 行間: 32px (Mobile), 40px (Desktop)
- フォントウェイト: 700
- スタイル名: `Text/Heading 1`

**Heading 2**
- フォントサイズ: 20px (Mobile), 24px (Desktop)
- 行間: 28px (Mobile), 32px (Desktop)
- フォントウェイト: 600
- スタイル名: `Text/Heading 2`

**Heading 3**
- フォントサイズ: 18px (Mobile), 24px (Desktop)
- 行間: 24px (Mobile), 32px (Desktop)
- フォントウェイト: 600
- スタイル名: `Text/Heading 3`

**Body Large**
- フォントサイズ: 16px
- 行間: 24px
- フォントウェイト: 400
- スタイル名: `Text/Body Large`

**Body**
- フォントサイズ: 16px (Mobile), 18px (Desktop)
- 行間: 24px (Mobile), 28px (Desktop)
- フォントウェイト: 400
- スタイル名: `Text/Body`

**Body Small**
- フォントサイズ: 14px (Mobile), 16px (Desktop)
- 行間: 20px (Mobile), 24px (Desktop)
- フォントウェイト: 400
- スタイル名: `Text/Body Small`

**Caption**
- フォントサイズ: 12px
- 行間: 120%
- フォントウェイト: 400
- スタイル名: `Text/Caption`

**Figmaでの作成方法:**
1. テキストを選択
2. 右側のパネルで「Text」セクションを開く
3. 「Text styles」で「+」をクリック
4. スタイル名を設定（例: `Text/Body`）
5. **フォントを選択**:
   - **日本語テキスト用**: `Noto Sans JP` を推奨
     - Google Fontsで無料
     - 日本語と英語の両方に対応
     - Figmaでも利用可能
   - **英語のみの場合**: `Inter` でも可
6. サイズ、ウェイト、行間を設定

**フォントの選び方:**
- **日本語が含まれるテキスト**: `Noto Sans JP` を使用
- **英語のみのテキスト**: `Inter` または `Noto Sans JP` を使用
- **推奨**: すべて `Noto Sans JP` で統一（日本語と英語の両方に対応）

**注意:** 
- モバイルとデスクトップでサイズが異なる場合は、別々のスタイルを作成するか、バリアントを使用
- `Noto Sans JP` がFigmaで見つからない場合は、Google Fontsからインストールするか、`Hiragino Sans` を使用

---

### 1-3. エフェクトスタイル（シャドウ）の作成

1. **Level 1** - `Effect/Shadow Level 1`
   - `0px 2px 8px rgba(0, 0, 0, 0.1)`
   - 用途: カード

2. **Level 2** - `Effect/Shadow Level 2`
   - `0px 4px 16px rgba(0, 0, 0, 0.12)`
   - 用途: モーダル

3. **Level 3** - `Effect/Shadow Level 3`
   - `0px 8px 24px rgba(0, 0, 0, 0.15)`
   - 用途: ドロップダウン

**Figmaでの作成方法:**
1. オブジェクトを選択
2. 右側のパネルで「Effects」セクションを開く
3. 「Drop shadow」を追加
4. 「Effect styles」で「+」をクリック
5. スタイル名を設定

---

### 1-4. グリッドシステムの設定

#### Mobile用グリッド
- カラム数: 1
- 最大幅: 394px
- ガター: 16px
- マージン: 16px

#### Desktop用グリッド
- カラム数: 12
- 最大幅: 1200px
- ガター: 32px
- マージン: 32px

**Figmaでの設定方法:**
1. フレームを選択
2. 右側のパネルで「Layout grid」を開く
3. 「Grid」を追加
4. タイプを「Columns」に設定
5. カラム数、ガター、マージンを設定

---

## ステップ2: 基本コンポーネントの作成

### 2-1. ボタンコンポーネント

#### Primary Button
- 背景: `Primary/Green`
- テキスト: `Text/Body` (White)
- 高さ: 48px (Mobile), 52px (Desktop)
- パディング: 16px 24px (Mobile), 18px 36px (Desktop)
- ボーダーラディウス: 8px
- フォントウェイト: 700

#### Secondary Button
- 背景: `Neutral/White`
- テキスト: `Text/Body` (Black)
- ボーダー: 1px solid `Neutral/Gray 200`
- その他はPrimary Buttonと同じ

#### Text Button
- 背景: transparent
- テキスト: `Text/Body` (Primary Green)
- ボーダー: none
- フォントウェイト: 500

**Figmaでの作成方法:**
1. ボタンのデザインを作成
2. コンポーネント化（右クリック → 「Create Component」）
3. バリアントを作成（Primary, Secondary, Text）
4. サイズバリアント（Mobile, Desktop）も作成

---

### 2-2. カードコンポーネント

- 背景: `Neutral/White`
- ボーダーラディウス: 12px
- シャドウ: `Effect/Shadow Level 1`
- パディング: 24px (Mobile), 32px (Desktop)

---

### 2-3. 入力欄コンポーネント

- 背景: `Neutral/White`
- ボーダー: 1px solid `Neutral/Gray 200`
- ボーダーラディウス: 8px
- パディング: 12px 16px (Mobile), 16px 24px (Desktop)
- 高さ: 48px (Mobile), 52px (Desktop)
- フォント: `Text/Body`

**状態:**
- Default
- Focus (ボーダー: `Primary/Green`)
- Error (ボーダー: `Status/Error`)
- Disabled

---

### 2-4. バッジコンポーネント

- パディング: 2px 8px
- ボーダーラディウス: 12px
- フォント: `Text/Caption`
- フォントウェイト: 600

**バリアント:**
- Pending (背景: `Status/Warning Light`, テキスト: `#B8860B`)
- Approved (背景: `Status/Success Light`, テキスト: `Status/Success`)
- Rejected (背景: `Status/Error Light`, テキスト: `Status/Error`)

---

## ステップ3: アイコンライブラリの作成

### 3-1. アイコンフレームの作成

1. 新しいフレームを作成（例: "Icons"）
2. グリッドを設定（例: 24x24pxのグリッド）
3. 各アイコンを24x24pxのフレーム内に配置

### 3-2. 主要アイコンの作成

- Calendar (イベント)
- User (プロフィール)
- Checklist (申し込み)
- Bell (通知)
- Search (検索)
- Close (閉じる)
- Arrow Left (戻る)
- Edit (編集)
- Trash (削除)
- Upload (アップロード)
- Download (ダウンロード)
- Share (共有)

**Figmaでの作成方法:**
1. 24x24pxのフレームを作成
2. アイコンを描画（SVG形式推奨）
3. コンポーネント化
4. カラーバリアントを作成（必要に応じて）

---

## ステップ4: ページデザインの作成

### 4-1. フレームサイズの設定

#### Mobile
- 幅: 375px (iPhone SE) または 414px (iPhone 12 Pro Max)
- 高さ: 812px (標準)

#### Desktop
- 幅: 1440px
- 高さ: 1024px

### 4-2. ページの優先順位

1. **WelcomeScreen** - ログイン・新規登録画面
2. **EventList** - イベント一覧
3. **EventDetail** - イベント詳細
4. **RegistrationForm** - 登録フォーム
5. **Profile** - プロフィール
6. **EventForm** - イベント作成・編集

---

## Figmaでの作業のコツ

### 1. コンポーネント化
- 再利用可能な要素は必ずコンポーネント化
- バリアントを使用して状態を管理

### 2. オートレイアウト
- レイアウトの調整を自動化
- レスポンシブ対応が容易に

### 3. スタイルの一貫性
- カラー、テキスト、エフェクトは必ずスタイルを使用
- 直接値を設定しない

### 4. 命名規則
- 階層構造で命名（例: `Primary/Green`）
- わかりやすい名前を使用

### 5. バージョン管理
- 重要な変更はバージョンを保存
- コメント機能を活用

---

## 次のステップ

1. ✅ カラースタイルの作成
2. ✅ タイポグラフィスタイルの作成
3. ✅ エフェクトスタイルの作成
4. ✅ 基本コンポーネントの作成
5. ✅ アイコンライブラリの作成
6. ⏭️ ページデザインの作成

