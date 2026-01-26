# Figmaの「Copy as SVG」からReactコンポーネントを作る方法

## ステップ1: FigmaでSVGをコピー

1. Figmaで要素を選択（アイコン、図形など）
2. 右クリック → 「Copy/Paste as」→ 「Copy as SVG」
3. または `Cmd + Shift + C` (Mac) / `Ctrl + Shift + C` (Windows)

## ステップ2: Reactコンポーネントに変換

### 基本的な変換

```tsx
// FigmaからコピーしたSVGを貼り付け
const MyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ここにコピーしたSVGの内容を貼り付け */}
  </svg>
)
```

### 例：戻るボタンの矢印アイコン

**FigmaからコピーしたSVG**:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 18l-6-6 6-6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Reactコンポーネントに変換**:
```tsx
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M15 18l-6-6 6-6" 
      stroke="#000000" 
      strokeWidth="2"  // stroke-width → strokeWidth
      strokeLinecap="round"  // stroke-linecap → strokeLinecap
      strokeLinejoin="round"  // stroke-linejoin → strokeLinejoin
    />
  </svg>
)
```

### 属性名の変換（kebab-case → camelCase）

| SVG属性 | React属性 |
|---|---|
| `stroke-width` | `strokeWidth` |
| `stroke-linecap` | `strokeLinecap` |
| `stroke-linejoin` | `strokeLinejoin` |
| `fill-rule` | `fillRule` |
| `clip-path` | `clipPath` |
| `font-size` | `fontSize` |
| `font-weight` | `fontWeight` |

### 色を動的に変更できるようにする

```tsx
// 色をpropsで受け取れるようにする
const BackArrowIcon = ({ color = "#000000", size = 24 }: { color?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M15 18l-6-6 6-6" 
      stroke={color}  // propsから色を受け取る
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
```

### 使用例

```tsx
// 黒い矢印
<BackArrowIcon />

// 白い矢印
<BackArrowIcon color="#FFFFFF" />

// 大きい矢印
<BackArrowIcon size={32} />

// 白い大きい矢印
<BackArrowIcon color="#FFFFFF" size={32} />
```

---

## よくある変換パターン

### パターン1: シンプルなアイコン

```tsx
const SimpleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* コピーしたSVGの内容 */}
  </svg>
)
```

### パターン2: 色を変更可能なアイコン

```tsx
const ColoredIcon = ({ color = "#000000" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill={color} d="..."/>
  </svg>
)
```

### パターン3: サイズも変更可能なアイコン

```tsx
const ScalableIcon = ({ 
  size = 24, 
  color = "#000000" 
}: { 
  size?: number
  color?: string 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path fill={color} d="..."/>
  </svg>
)
```

---

## 注意点

### 1. `xmlns`属性は必要

```tsx
// ✅ 良い例
<svg xmlns="http://www.w3.org/2000/svg">
  ...
</svg>

// ❌ 悪い例（xmlnsがないとブラウザで表示されない場合がある）
<svg>
  ...
</svg>
```

### 2. `viewBox`を保持する

```tsx
// ✅ 良い例（viewBoxがあると拡大縮小可能）
<svg width="24" height="24" viewBox="0 0 24 24">
  ...
</svg>

// ❌ 悪い例（viewBoxがないとサイズ変更できない）
<svg width="24" height="24">
  ...
</svg>
```

### 3. 属性名はcamelCaseに変換

```tsx
// ✅ 良い例
<path strokeWidth="2" strokeLinecap="round"/>

// ❌ 悪い例（kebab-caseは動作しない）
<path stroke-width="2" stroke-linecap="round"/>
```

---

## 実際の使用例

### WelcomeScreen.tsxでの使用例

```tsx
// アイコンコンポーネントを定義
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="..." fill="#4285F4"/>
    <path d="..." fill="#34A853"/>
  </svg>
)

// ボタンで使用
<button onClick={handleGoogleLogin}>
  <GoogleIcon />
  <span>Google</span>
</button>
```

---

## まとめ

**Figmaの「Copy as SVG」からReactコンポーネントを作る手順：**

1. Figmaで「Copy as SVG」でコピー
2. Reactコンポーネントの関数内に貼り付け
3. 属性名をkebab-caseからcamelCaseに変換
4. （必要に応じて）propsで色やサイズを受け取れるようにする

**これで静的な要素（アイコン、ロゴ、装飾）を簡単にReactコンポーネントに変換できます！**


