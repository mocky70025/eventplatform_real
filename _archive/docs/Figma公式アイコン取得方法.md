# Figma公式アイコン取得方法

## LINE公式アイコン

### 方法1: LINE公式ブランドリソースから取得（推奨）

1. [LINE Brand Resources](https://line.me/ja/brand-resource/) にアクセス
2. 「LINEロゴ」セクションからダウンロード
3. SVG形式を推奨
4. 使用規約を確認して使用

### 方法2: Iconifyプラグインを使用

1. Figmaメニュー → **「Plugins」** → **「Iconify」**
2. 検索: `line` または `line:simple`
3. アイコンを選択して配置
4. サイズ: `24px` に設定

### 方法3: 手動で作成

LINEロゴの特徴：
- 緑色（`#06C755`）
- シンプルなデザイン
- 角丸の四角形に「LINE」の文字

---

## Google公式アイコン

### 方法1: Google Brand Resource Centerから取得（推奨）

1. [Google Brand Resource Center](https://about.google/brand-resource-center/) にアクセス
2. 「Googleロゴ」セクションからダウンロード
3. SVG形式を推奨
4. 使用規約を確認して使用

### 方法2: Iconifyプラグインを使用

1. Figmaメニュー → **「Plugins」** → **「Iconify」**
2. 検索: `google` または `logos:google-icon`
3. アイコンを選択して配置
4. サイズ: `24px` に設定

### 方法3: Material Iconsを使用

1. Iconifyプラグインで検索: `material:google`
2. Googleの「G」アイコンを選択
3. サイズ: `24px` に設定

---

## ボタンでの使用例

### LINEログインボタン

```
┌─────────────────────────┐
│  [LINEアイコン] LINEでログイン │
└─────────────────────────┘
```

- アイコンサイズ: `24px`
- アイコンとテキストの間隔: `8px`
- アイコンカラー: `#FFFFFF`（白背景のボタン内）

### Googleログインボタン

```
┌─────────────────────────┐
│  [Googleアイコン] Googleでログイン │
└─────────────────────────┘
```

- アイコンサイズ: `24px`
- アイコンとテキストの間隔: `8px`
- アイコンカラー: `#FFFFFF`（白背景のボタン内）

---

## 使用規約の確認

### LINEロゴ
- [LINE Brand Guidelines](https://line.me/ja/brand-resource/) を確認
- ロゴの変更・変形は禁止
- 指定された色を使用

### Googleロゴ
- [Google Brand Guidelines](https://about.google/brand-resource-center/) を確認
- ロゴの変更・変形は禁止
- 指定された色を使用

---

## Figmaでの実装手順

### ステップ1: アイコンを取得

1. 上記の方法でアイコンを取得
2. Figmaにインポート（ドラッグ&ドロップ）

### ステップ2: アイコンを配置

1. ボタンコンポーネント内に配置
2. サイズ: `24px × 24px`
3. テキストの左側に配置
4. アイコンとテキストの間隔: `8px`

### ステップ3: カラーを設定

1. ボタンが白背景の場合: アイコンはカラー版を使用
2. ボタンが緑背景の場合: アイコンは白版を使用（可能な場合）

---

## 推奨: Iconifyプラグインを使用

最も簡単な方法は、**Iconifyプラグイン**を使用することです：

1. **LINEアイコン**:
   - 検索: `line` または `simple-icons:line`
   - サイズ: `24px`

2. **Googleアイコン**:
   - 検索: `google` または `logos:google-icon`
   - サイズ: `24px`

これで、公式アイコンを簡単に使用できます。

