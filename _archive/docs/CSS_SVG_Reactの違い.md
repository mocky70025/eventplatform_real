# CSS、SVG、Reactの違いと使い分け

## 1. CSS（Cascading Style Sheets）

### 何をするもの？
**見た目を決めるための言語**です。

### 何ができる？
- 色、サイズ、配置を指定
- レイアウト（どこに何を配置するか）
- アニメーション
- ホバー効果（マウスを乗せたときの変化）

### 例
```css
/* ボタンのスタイル */
.button {
  background-color: #FF8A5C;  /* 背景色 */
  color: white;                /* 文字色 */
  padding: 16px 24px;          /* 内側の余白 */
  border-radius: 8px;          /* 角丸 */
  font-size: 16px;             /* 文字サイズ */
}
```

### 特徴
- ✅ **静的な装飾**に適している
- ✅ **スタイルの統一**ができる
- ❌ データを扱えない
- ❌ 動的な処理ができない

---

## 2. SVG（Scalable Vector Graphics）

### 何をするもの？
**画像を描くための形式**です。線や図形を数値で表現します。

### 何ができる？
- イラスト、アイコン、図形を描く
- ベクター形式（拡大してもぼやけない）
- アニメーション（限定的）

### 例
```svg
<!-- 円を描く -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#FF8A5C" />
</svg>

<!-- 矢印を描く -->
<svg width="24" height="24">
  <path d="M15 18l-6-6 6-6" stroke="#000" stroke-width="2" fill="none"/>
</svg>
```

### 特徴
- ✅ **図形やイラスト**に適している
- ✅ **拡大縮小しても綺麗**
- ✅ **ファイルサイズが小さい**（単純な図形の場合）
- ❌ 動的なデータ処理はできない
- ❌ 複雑なインタラクションには不向き

### いつ使う？
- アイコン（戻るボタンの矢印など）
- ロゴ
- 装飾的な図形
- **静的な絵**

---

## 3. React

### 何をするもの？
**インタラクティブなWebページを作るためのJavaScriptライブラリ**です。

### 何ができる？
- データの管理（状態管理）
- ユーザーの操作に反応（ボタンクリックなど）
- 画面の動的な更新
- フォーム入力の処理
- APIからデータを取得して表示

### 例
```jsx
// カウンターの例
function Counter() {
  const [count, setCount] = React.useState(0);  // データを保存
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>  {/* クリックでデータを変更 */}
        増やす
      </button>
    </div>
  );
}
```

### 特徴
- ✅ **動的な処理**ができる
- ✅ **データの管理**ができる
- ✅ **ユーザー操作に反応**できる
- ✅ **条件によって表示を変える**ことができる
- ❌ 見た目を直接決めるのは苦手（CSSと組み合わせる）

### いつ使う？
- フォーム（入力フィールド、送信ボタン）
- データの表示（イベント一覧など）
- ユーザー操作への反応（ボタンクリック、入力など）
- **動的な機能**

---

## 実例で見る違い

### 例：ログインボタンを作る

#### ❌ SVGだけで作る場合
```svg
<svg width="200" height="50">
  <rect width="200" height="50" fill="#FF8A5C" rx="8"/>
  <text x="100" y="30" fill="white" text-anchor="middle">ログイン</text>
</svg>
```
**問題点**：
- クリックしても何も起こらない
- 入力値に応じて変更できない
- 無効化（disabled）状態を作れない

#### ❌ CSSだけで作る場合
```css
.button {
  background-color: #FF8A5C;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
}
```
**問題点**：
- HTMLが必要（でもHTMLだけでは動かない）
- データを扱えない

#### ✅ React + CSSで作る場合
```jsx
function LoginButton({ isDisabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        backgroundColor: isDisabled ? '#D9D9D9' : '#FF8A5C',  // CSSで見た目
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      ログイン
    </button>
  );
}
```
**良い点**：
- クリックで処理が実行される（React）
- 無効化状態を表示できる（React + CSS）
- 動的にスタイルを変更できる（React + CSS）

---

## 実際の使い分け

### 1. **ログインボタンの矢印アイコン**
```jsx
// SVG（静的）: アイコンの絵を描く
<svg width="24" height="24">
  <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2"/>
</svg>

// React + CSS（動的）: ボタン全体、クリック処理
<button onClick={handleLogin} style={{ display: 'flex', alignItems: 'center' }}>
  <svg>...</svg>  {/* SVGは絵だけ */}
  <span>ログイン</span>
</button>
```

### 2. **入力フィールド**
```jsx
// React（動的）: データの管理、入力の処理
const [email, setEmail] = React.useState('');

// CSS（静的）: 見た目
<input
  type="email"
  value={email}  // React: データを表示
  onChange={(e) => setEmail(e.target.value)}  // React: データを更新
  style={{
    padding: '12px 16px',  // CSS: 見た目
    border: '1px solid #E5E5E5',
    borderRadius: '8px'
  }}
/>
```

### 3. **装飾的な背景パターン**
```jsx
// SVG（静的）: 装飾的な絵
<div style={{ position: 'relative' }}>
  <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
    {/* 装飾的なパターン */}
  </svg>
  
  {/* React + CSS（動的）: 実際のコンテンツ */}
  <div style={{ padding: '24px' }}>
    <h1>タイトル</h1>
  </div>
</div>
```

---

## まとめ

| | CSS | SVG | React |
|---|---|---|---|
| **役割** | 見た目を決める | 絵を描く | 動的な機能を作る |
| **使う場面** | 色、サイズ、レイアウト | アイコン、図形、装飾 | フォーム、ボタン、データ表示 |
| **データ** | 扱えない | 扱えない | 扱える |
| **インタラクション** | ホバー効果のみ | 限定的 | 完全対応 |
| **更新** | 手動で変更 | 手動で変更 | 自動で更新 |

### 実際の開発では
1. **React**: 機能（データ、操作、状態管理）
2. **CSS**: 見た目（色、サイズ、レイアウト）
3. **SVG**: 装飾（アイコン、図形、ロゴ）

これらを組み合わせて使います！

---

## 具体例：イベント登録フォーム

```jsx
function EventForm() {
  // React: データの管理
  const [eventName, setEventName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  return (
    <div style={{ background: '#E8F5F5' }}>  {/* CSS: 背景色 */}
      {/* SVG: 装飾的なアイコン */}
      <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
        <circle cx="50" cy="50" r="40" fill="#FF8A5C" />
      </svg>
      
      {/* React + CSS: 入力フィールド */}
      <input
        type="text"
        value={eventName}  // React: データ
        onChange={(e) => setEventName(e.target.value)}  // React: データ更新
        placeholder="イベント名"
        style={{  // CSS: 見た目
          padding: '12px 16px',
          border: '1px solid #E5E5E5',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      />
      
      {/* React + CSS: 送信ボタン */}
      <button
        onClick={handleSubmit}  // React: クリック処理
        disabled={isSubmitting}  // React: 状態管理
        style={{  // CSS: 見た目
          backgroundColor: isSubmitting ? '#D9D9D9' : '#FF8A5C',  // React + CSS: 条件付きスタイル
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px'
        }}
      >
        {isSubmitting ? '送信中...' : '送信'}  {/* React: 条件付き表示 */}
      </button>
    </div>
  );
}
```

- **React**: `useState`, `onChange`, `onClick`, 条件付き表示
- **CSS**: `background`, `padding`, `border`, `borderRadius`, `color`
- **SVG**: 装飾的な円形アイコン

これらを組み合わせることで、動的で見た目も良いフォームが作れます！


