# FigmaからReactコードを生成する方法

## 問題点

Figmaには以下のコピー機能があります：
- ✅ Copy as SVG
- ✅ Copy as CSS
- ✅ Copy as PNG
- ❌ Copy as React（標準機能にはありません）

## 解決方法

### 方法1: SVGをコピーしてReactコンポーネントに変換（アイコン・装飾用）

#### 手順

1. **Figmaで要素を選択**
   - アイコンや図形を選択

2. **SVGとしてコピー**
   - 右クリック → 「Copy/Paste as」→ 「Copy as SVG」
   - または `Cmd + Shift + C` (Mac) / `Ctrl + Shift + C` (Windows)

3. **Reactコンポーネントに変換**

```tsx
// コピーしたSVGをReactコンポーネントに変換
const MyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ここにコピーしたSVGの内容を貼り付け */}
    <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" fill="none"/>
  </svg>
)
```

#### 使用例

**静的要素（アイコン、ロゴ、装飾）に適しています**

```tsx
// 戻るボタンの矢印アイコン
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" fill="none"/>
  </svg>
)

// 使用
<button onClick={handleBack}>
  <BackArrowIcon />
  <span>戻る</span>
</button>
```

---

### 方法2: CSSをコピーしてReactのインラインスタイルに変換

#### 手順

1. **Figmaで要素を選択**

2. **CSSとしてコピー**
   - 右クリック → 「Copy/Paste as」→ 「Copy as CSS」
   - または、Dev Modeで「Code」タブからCSSをコピー

3. **Reactのインラインスタイルに変換**

```tsx
// FigmaからコピーしたCSS
// .button {
//   width: 200px;
//   height: 50px;
//   background-color: #FF8A5C;
//   border-radius: 8px;
// }

// Reactのインラインスタイルに変換
<button style={{
  width: '200px',
  height: '50px',
  backgroundColor: '#FF8A5C',  // CSSのbackground-color → backgroundColor
  borderRadius: '8px'  // CSSのborder-radius → borderRadius
}}>
  ボタン
</button>
```

#### CSSプロパティの変換ルール

| CSS | React (camelCase) |
|---|---|
| `background-color` | `backgroundColor` |
| `border-radius` | `borderRadius` |
| `font-size` | `fontSize` |
| `font-weight` | `fontWeight` |
| `line-height` | `lineHeight` |
| `text-align` | `textAlign` |
| `padding-top` | `paddingTop` |
| `margin-bottom` | `marginBottom` |

#### 変換ツール（自動化）

```javascript
// CSS文字列をReactスタイルオブジェクトに変換する関数
function cssToReactStyle(cssString) {
  // CSSをパースしてオブジェクトに変換
  // 例: "width: 200px; height: 50px;" → { width: '200px', height: '50px' }
  
  const styles = {};
  cssString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // kebab-caseをcamelCaseに変換
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelProperty] = value;
    }
  });
  return styles;
}
```

---

### 方法3: このツール（Figma MCP）を使う（推奨・最も簡単）

#### 手順

1. **Figmaで要素を選択**

2. **URLをコピー**
   - ブラウザのアドレスバーからURLをコピー

3. **このチャットに貼り付け**
   ```
   https://www.figma.com/design/...?node-id=342-923
   ```

4. **自動的にReactコードを生成**
   - 正確な位置、サイズ、色、フォント情報を取得
   - Reactコードを自動生成

**メリット**：
- ✅ 最も正確
- ✅ 手動変換が不要
- ✅ 全ての情報を一度に取得

---

### 方法4: Figmaプラグインを使う

#### おすすめプラグイン

1. **Figma to Code**
   - FigmaデザインをReactコードに変換
   - インストール: Figma → Plugins → Browse plugins → "Figma to Code"

2. **Anima**
   - 高品質なReactコードを生成
   - インストール: Figma → Plugins → Browse plugins → "Anima"

3. **html.to.design / Design to Code**
   - Reactコードを生成
   - インストール: Figma → Plugins → Browse plugins

#### 使い方

1. **プラグインをインストール**
   - Figmaメニュー → 「Plugins」→ 「Browse plugins」
   - プラグインを検索してインストール

2. **プラグインを実行**
   - Figmaメニュー → 「Plugins」→ インストールしたプラグインを選択
   - 要素を選択してプラグインを実行

3. **Reactコードをコピー**
   - 生成されたコードをコピー

**注意点**：
- プラグインによって生成されるコードの品質は異なる
- Tailwind CSSベースの場合が多い（現在のプロジェクトはインラインスタイル）
- 変換が必要な場合がある

---

### 方法5: Dev Modeでコードを確認（Figma Pro機能）

#### 手順

1. **Dev Modeを有効にする**
   - Figma右上の「Dev Mode」ボタンをクリック
   - または `Shift + D` キーを押す

2. **要素を選択**

3. **コードを確認**
   - 右側のパネルに「Code」セクションが表示される
   - 「React」タブを選択

4. **コードをコピー**

**注意点**：
- Figma Pro機能（有料）
- Tailwind CSSベースの場合が多い
- 現在のプロジェクトに合わせて変換が必要

---

## 実用的なワークフロー

### ワークフロー1: SVG + 手動実装（小さな要素）

```
1. アイコンをSVGとしてコピー
2. Reactコンポーネントに変換
3. 手動でスタイルを追加
```

### ワークフロー2: Figma URL + このツール（推奨・画面全体）

```
1. Figmaで画面を選択
2. URLをコピー
3. このチャットに貼り付け
4. 自動生成されたコードを使用
```

### ワークフロー3: プラグイン（中規模要素）

```
1. プラグインをインストール
2. 要素を選択してプラグインを実行
3. 生成されたコードを変換して使用
```

---

## 各方法の比較

| 方法 | 精度 | 手間 | コスト | 推奨度 |
|---|---|---|---|---|
| **SVGをコピー** | 高（静的要素） | 中 | 無料 | ⭐⭐⭐（アイコン用） |
| **CSSをコピー** | 中 | 高（変換が必要） | 無料 | ⭐⭐ |
| **このツール（Figma MCP）** | 最高 | 低 | 無料 | ⭐⭐⭐⭐⭐ |
| **Figmaプラグイン** | 中〜高 | 中 | 無料 | ⭐⭐⭐ |
| **Dev Mode** | 高 | 低 | 有料（Pro） | ⭐⭐⭐⭐ |

---

## 推奨方法

### 静的要素（アイコン、ロゴ、装飾）

**方法**: SVGをコピーしてReactコンポーネントに変換

```tsx
const MyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    {/* コピーしたSVG */}
  </svg>
)
```

### 動的要素（ボタン、入力フィールド、画面全体）

**方法**: このツール（Figma MCP）を使う

```
1. Figma URLを貼り付け
2. 自動生成されたコードを使用
```

---

## 実際の使い方

### 例1: アイコンを実装したい

```
1. Figmaでアイコンを選択
2. 「Copy as SVG」でコピー
3. Reactコンポーネントに変換
```

### 例2: 画面全体を実装したい

```
1. Figmaで画面を選択
2. URLをコピー
3. このチャットに「この画面を実装してください」とURLを貼り付け
```

---

## まとめ

**Figmaには「Copy as React」機能はありませんが、以下の方法があります：**

1. **SVGをコピー** → 静的要素（アイコン）用
2. **CSSをコピー** → 手動でReactスタイルに変換
3. **このツール（Figma MCP）** → 最も簡単・正確（推奨）
4. **Figmaプラグイン** → 追加インストールが必要
5. **Dev Mode** → Figma Proが必要

**推奨**: このツール（Figma MCP）を使うのが最も簡単で正確です。


