# FigmaからReactコードを取得する方法

## 方法1: Figma MCPツールを使用（最も簡単・推奨）

### 手順

1. **Figmaファイルを開く**
   - Figmaで該当の画面/コンポーネントを開く

2. **対象の要素を選択**
   - 実装したい要素（フレーム、コンポーネント）をクリックして選択

3. **URLをコピー**
   - ブラウザのアドレスバーからURLをコピー
   - 例: `https://www.figma.com/design/XxOyYjBZdBDkaAbqjpbJJ1/kitchen-car?node-id=342-1311`

4. **このツールにURLを提供**
   - チャットでURLを送信するだけ！
   - 自動的にデザイン情報を取得してReactコードを生成します

### 例

```
https://www.figma.com/design/XxOyYjBZdBDkaAbqjpbJJ1/kitchen-car?node-id=342-1311
```

このURLを提供すると、以下の情報を取得できます：
- 正確な位置、サイズ、色
- フォント情報
- Reactコード（自動生成）

---

## 方法2: Figma Dev Modeを使用（Figma Pro機能）

### 手順

1. **Dev Modeを有効にする**
   - Figma右上の「Dev Mode」ボタンをクリック
   - または `Shift + D` キーを押す

2. **要素を選択**
   - 実装したい要素をクリック

3. **右パネルでコードを確認**
   - 右側のパネルに「Code」セクションが表示される
   - 「React」タブを選択

4. **コードをコピー**
   - コードを選択してコピー（`Cmd + C` / `Ctrl + C`）

### 注意点

- Dev ModeはFigma Pro機能です（有料）
- 生成されるコードはTailwind CSSベースの場合が多い
- 現在のプロジェクトはインラインスタイルを使用しているため、変換が必要

---

## 方法3: Figmaプラグインを使用

### おすすめプラグイン

#### 1. **HTML/CSS to Figma**（逆方向だが参考になる）
- コードをFigmaに変換

#### 2. **Figma to Code**
- Figmaデザインをコードに変換
- HTML、CSS、Reactをサポート

#### 3. **Anima**
- FigmaからReactコードを生成
- 高品質なコードを生成

### プラグインの使い方

1. **プラグインをインストール**
   - Figmaメニュー → 「Plugins」→ 「Browse plugins」
   - プラグインを検索してインストール

2. **プラグインを実行**
   - Figmaメニュー → 「Plugins」→ インストールしたプラグインを選択
   - 要素を選択してプラグインを実行

3. **コードをコピー**
   - 生成されたコードをコピー

---

## 方法4: SVGを直接コピー（アイコンや装飾用）

### 手順

1. **要素を選択**
   - Figmaでアイコンや図形を選択

2. **SVGとしてコピー**
   - 右クリック → 「Copy/Paste as」→ 「Copy as SVG」
   - または `Cmd + Shift + C` (Mac) / `Ctrl + Shift + C` (Windows)

3. **Reactコンポーネントに変換**

```tsx
// コピーしたSVGをReactコンポーネントに変換
const MyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ここにコピーしたSVGの内容を貼り付け */}
    <path d="..." fill="#000"/>
  </svg>
)
```

### 例：戻るボタンの矢印アイコン

1. Figmaで矢印を選択
2. 「Copy as SVG」でコピー
3. Reactコンポーネントに変換：

```tsx
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" fill="none"/>
  </svg>
)
```

---

## 方法5: デザインスペックを手動で確認

### 手順

1. **要素を選択**
   - Figmaで要素を選択

2. **右パネルで情報を確認**
   - **Position**: 位置（x, y）
   - **Size**: サイズ（width, height）
   - **Fill**: 背景色
   - **Stroke**: ボーダー色・太さ
   - **Effects**: シャドウ
   - **Typography**: フォント、サイズ、ウェイト、行間

3. **手動でReactコードを書く**

```tsx
// Figmaの情報を元に手動で実装
<div style={{
  position: 'absolute',
  left: '20px',  // Figmaのx座標
  top: '100px',  // Figmaのy座標
  width: '353px',  // Figmaのwidth
  height: '50px',  // Figmaのheight
  background: '#FFFFFF',  // FigmaのFill
  borderRadius: '8px',
  padding: '12px 16px',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'  // FigmaのEffects
}}>
  <input
    type="text"
    style={{
      fontFamily: '"Noto Sans JP", sans-serif',  // FigmaのTypography
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '150%',
      color: '#2C3E50'
    }}
  />
</div>
```

---

## 実際のワークフロー（推奨）

### ステップ1: Figma URLを提供

```
このチャットにFigma URLを貼り付け
例: https://www.figma.com/design/XxOyYjBZdBDkaAbqjpbJJ1/kitchen-car?node-id=342-1311
```

### ステップ2: 自動取得

このツールが以下を自動的に取得します：
- ✅ 正確な位置、サイズ
- ✅ 色（HEX値）
- ✅ フォント情報
- ✅ Reactコード（自動生成）

### ステップ3: 実装

取得した情報を基に、適切に分離して実装：
- 静的要素（アイコンなど）→ SVG
- 動的要素（入力、ボタンなど）→ React + CSS

---

## 具体的な例

### 例1: ログインボタンを実装したい

1. **Figma URLを提供**
   ```
   https://www.figma.com/design/...?node-id=123-456
   ```

2. **このツールが取得**
   - ボタンのサイズ: 200px × 50px
   - 背景色: #FF8A5C
   - テキスト: "ログイン"
   - フォント: Noto Sans JP, 16px, Bold

3. **コードを生成**
   ```tsx
   <button
     onClick={handleLogin}
     style={{
       width: '200px',
       height: '50px',
       background: '#FF8A5C',
       color: 'white',
       borderRadius: '8px',
       fontFamily: '"Noto Sans JP", sans-serif',
       fontSize: '16px',
       fontWeight: 'bold'
     }}
   >
     ログイン
   </button>
   ```

### 例2: アイコンを実装したい

1. **Figmaでアイコンを選択**
2. **「Copy as SVG」でコピー**
3. **Reactコンポーネントに変換**

```tsx
const MyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* コピーしたSVGの内容 */}
  </svg>
)
```

---

## 注意点

### 1. 生成されたコードは調整が必要な場合がある

- Tailwind CSSベースのコードが生成される場合がある
- 現在のプロジェクトはインラインスタイルを使用しているため、変換が必要

### 2. 動的な要素は手動で実装が必要

- 入力フィールド、ボタンのクリック処理など
- 状態管理（useState）など

### 3. SVGはそのまま使える

- アイコンや装飾的な要素は、SVGをそのままReactコンポーネントに変換できる

---

## まとめ

**最も簡単な方法：Figma URLをこのチャットに貼り付けるだけ！**

1. Figmaで要素を選択
2. ブラウザのURLをコピー
3. このチャットに貼り付け
4. 自動的にReactコードを生成

**他の方法：**
- Dev Mode（Figma Proが必要）
- プラグイン（追加インストールが必要）
- SVGを直接コピー（アイコン用）
- 手動でスペックを確認（細かい調整用）

---

## 次のステップ

Figma URLを貼り付けてください。自動的にReactコードを生成します！


