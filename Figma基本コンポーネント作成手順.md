# Figma基本コンポーネント作成手順

## 作成するコンポーネント一覧

1. **ボタンコンポーネント**（Primary, Secondary, Text）
2. **カードコンポーネント**
3. **入力欄コンポーネント**
4. **バッジコンポーネント**

---

## 1. ボタンコンポーネント

### 1-1. Primary Button（メインボタン）

#### Mobile版
- **幅**: フル幅 or 最小 `120px`
- **高さ**: `48px`
- **背景**: `Primary/Green` (`#06C755`)
- **ボーダーラディウス**: `8px`
- **パディング**: `16px 24px`
- **テキスト**: `Text/Body` スタイルを使用
- **テキストカラー**: `Neutral/White` (`#FFFFFF`)
- **フォントウェイト**: `Bold (700)`
- **テキスト**: 例「ログイン」「申し込む」

#### Desktop版
- **幅**: 自動 or 最小 `160px`
- **高さ**: `52px`
- **パディング**: `18px 36px`
- その他はMobile版と同じ

#### バリアント
- **状態**: Default, Hover, Disabled
- **サイズ**: Mobile, Desktop（オプション）

**Figmaでの作成方法:**
1. 四角形を描画（幅: 120px, 高さ: 48px）
2. 背景色を `Primary/Green` に設定
3. ボーダーラディウスを `8px` に設定
4. テキストを追加（例: 「ログイン」）
5. テキストスタイル `Text/Body` を適用
6. テキストカラーを `Neutral/White` に設定
7. フォントウェイトを `Bold (700)` に設定
8. テキストを中央配置
9. 右クリック → 「Create Component」でコンポーネント化
10. バリアントを作成（Hover, Disabled）

---

### 1-2. Secondary Button（セカンダリボタン）

#### Mobile版
- **幅**: フル幅 or 最小 `120px`
- **高さ**: `48px`
- **背景**: `Neutral/White` (`#FFFFFF`)
- **ボーダー**: `1px solid` `Neutral/Gray 200` (`#E5E5E5`)
- **ボーダーラディウス**: `8px`
- **パディング**: `16px 24px`
- **テキスト**: `Text/Body` スタイルを使用
- **テキストカラー**: `Neutral/Black` (`#000000`)
- **フォントウェイト**: `Bold (700)`

#### Desktop版
- **高さ**: `52px`
- **パディング**: `18px 36px`
- その他はMobile版と同じ

**Figmaでの作成方法:**
1. Primary Buttonをコピー
2. 背景色を `Neutral/White` に変更
3. ボーダーを追加（1px, `Neutral/Gray 200`）
4. テキストカラーを `Neutral/Black` に変更
5. コンポーネント化

---

### 1-3. Text Button（テキストボタン）

#### Mobile版
- **幅**: 自動
- **高さ**: `48px`
- **背景**: 透明（なし）
- **ボーダー**: なし
- **パディング**: `16px 24px`
- **テキスト**: `Text/Body` スタイルを使用
- **テキストカラー**: `Primary/Green` (`#06C755`)
- **フォントウェイト**: `Medium (500)`

#### Desktop版
- **高さ**: `52px`
- **パディング**: `18px 36px`
- その他はMobile版と同じ

**Figmaでの作成方法:**
1. Primary Buttonをコピー
2. 背景を削除（透明）
3. ボーダーを削除
4. テキストカラーを `Primary/Green` に変更
5. フォントウェイトを `Medium (500)` に変更
6. コンポーネント化

---

## 2. カードコンポーネント

### 基本仕様

#### Mobile版
- **幅**: `394px`（最大幅）
- **背景**: `Neutral/White` (`#FFFFFF`)
- **ボーダーラディウス**: `12px`
- **シャドウ**: `Effect/Shadow Level 1`
- **パディング**: `24px`

#### Desktop版
- **幅**: `280px`（グリッド表示時）または `800px`（詳細表示時）
- **パディング**: `32px`
- その他はMobile版と同じ

**Figmaでの作成方法:**
1. 四角形を描画（幅: 394px, 高さ: 200px程度）
2. 背景色を `Neutral/White` に設定
3. ボーダーラディウスを `12px` に設定
4. エフェクトスタイル `Effect/Shadow Level 1` を適用
5. パディング `24px` を設定（オートレイアウトを使用）
6. コンポーネント化

---

## 3. 入力欄コンポーネント

### 基本仕様

#### Mobile版
- **幅**: フル幅
- **高さ**: `48px`
- **背景**: `Neutral/White` (`#FFFFFF`)
- **ボーダー**: `1px solid` `Neutral/Gray 200` (`#E5E5E5`)
- **ボーダーラディウス**: `8px`
- **パディング**: `12px 16px`
- **テキスト**: `Text/Body` スタイルを使用
- **プレースホルダー**: `Neutral/Gray 300` (`#999999`)

#### Desktop版
- **高さ**: `52px`
- **パディング**: `16px 24px`
- その他はMobile版と同じ

#### バリアント
- **状態**: Default, Focus, Error, Disabled

**Figmaでの作成方法:**
1. 四角形を描画（幅: 394px, 高さ: 48px）
2. 背景色を `Neutral/White` に設定
3. ボーダーを追加（1px, `Neutral/Gray 200`）
4. ボーダーラディウスを `8px` に設定
5. テキストを追加（プレースホルダー: 「入力してください」）
6. テキストスタイル `Text/Body` を適用
7. プレースホルダーカラーを `Neutral/Gray 300` に設定
8. コンポーネント化
9. バリアントを作成：
   - **Focus**: ボーダーカラーを `Primary/Green` に変更
   - **Error**: ボーダーカラーを `Status/Error` に変更
   - **Disabled**: 背景色を `Neutral/Gray 100` に変更、テキストカラーを `Neutral/Gray 300` に変更

---

## 4. バッジコンポーネント

### 基本仕様

- **高さ**: 自動
- **パディング**: `2px 8px`
- **ボーダーラディウス**: `12px`
- **テキスト**: `Text/Caption` スタイルを使用
- **フォントウェイト**: `SemiBold (600)`

#### バリアント

1. **Pending（審査中）**
   - 背景: `Status/Warning Light` (`#FFF9E6`)
   - テキスト: `#B8860B`（濃い黄色）
   - テキスト: 「審査中」

2. **Approved（承認済み）**
   - 背景: `Status/Success Light` (`#E6F7ED`)
   - テキスト: `Status/Success` (`#06C755`)
   - テキスト: 「承認済み」

3. **Rejected（却下）**
   - 背景: `Status/Error Light` (`#FFEBEE`)
   - テキスト: `Status/Error` (`#FF3B30`)
   - テキスト: 「却下」

**Figmaでの作成方法:**
1. テキストを追加（例: 「審査中」）
2. テキストスタイル `Text/Caption` を適用
3. フォントウェイトを `SemiBold (600)` に設定
4. オートレイアウトでパディング `2px 8px` を設定
5. 背景色を設定（バリアントごと）
6. テキストカラーを設定（バリアントごと）
7. ボーダーラディウスを `12px` に設定
8. コンポーネント化
9. バリアントを作成（Pending, Approved, Rejected）

---

## コンポーネント作成のコツ

### 1. オートレイアウトを使用
- パディング、ギャップを自動調整
- レスポンシブ対応が容易

### 2. バリアントを使用
- 状態（Default, Hover, Disabled）を管理
- サイズ（Mobile, Desktop）を管理

### 3. スタイルを適用
- カラー、テキスト、エフェクトは必ずスタイルを使用
- 直接値を設定しない

### 4. 命名規則
- コンポーネント名: `Button/Primary`, `Card/Default`, `Input/Default`, `Badge/Pending`
- バリアント名: `State=Default`, `State=Hover`, `Size=Mobile`, `Size=Desktop`

---

## 作成順序の推奨

1. ✅ **Primary Button** - 最も使用頻度が高い
2. ✅ **Secondary Button** - Primary Buttonをベースに作成
3. ✅ **Text Button** - Primary Buttonをベースに作成
4. ✅ **カード** - レイアウトの基本
5. ✅ **入力欄** - フォームで使用
6. ✅ **バッジ** - ステータス表示で使用

---

## 確認チェックリスト

各コンポーネントを作成したら、以下を確認：

### ボタン
- [ ] Primary Button - 背景: Primary Green, テキスト: White, Bold
- [ ] Secondary Button - 背景: White, ボーダー: Gray 200, テキスト: Black, Bold
- [ ] Text Button - 背景: 透明, テキスト: Primary Green, Medium
- [ ] すべてのボタンで適切なパディングと高さが設定されている

### カード
- [ ] 背景: White
- [ ] ボーダーラディウス: 12px
- [ ] シャドウ: Shadow Level 1
- [ ] パディング: 24px (Mobile) / 32px (Desktop)

### 入力欄
- [ ] 背景: White
- [ ] ボーダー: Gray 200
- [ ] ボーダーラディウス: 8px
- [ ] バリアント: Default, Focus, Error, Disabled

### バッジ
- [ ] パディング: 2px 8px
- [ ] ボーダーラディウス: 12px
- [ ] テキスト: Caption, SemiBold
- [ ] バリアント: Pending, Approved, Rejected

---

## 次のステップ

基本コンポーネントの作成が完了したら、次は：

1. **アイコンライブラリ**の作成
2. **ページデザイン**の作成

に進みます。

