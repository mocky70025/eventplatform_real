# Figmaフォントウェイト設定ガイド

## フォントウェイトの設定ルール

### 各テキストスタイルのフォントウェイト

| スタイル名 | フォントウェイト | Figmaでの表示 | 用途 |
|-----------|----------------|-------------|------|
| `Text/Display Large` | **700 (Bold)** | Bold | 大きな見出し |
| `Text/Heading 1` | **700 (Bold)** | Bold | ページタイトル |
| `Text/Heading 2` | **600 (SemiBold)** | SemiBold | セクションタイトル |
| `Text/Heading 3` | **600 (SemiBold)** | SemiBold | サブセクション |
| `Text/Body Large` | **400 (Regular)** | Regular | 本文（大きめ） |
| `Text/Body` | **400 (Regular)** | Regular | 本文 |
| `Text/Body Small` | **400 (Regular)** | Regular | サブテキスト |
| `Text/Caption` | **400 (Regular)** | Regular | キャプション、ラベル |

---

## Figmaでの設定方法

### ステップ1: テキストスタイルを作成

1. テキストを選択
2. 右側のパネルで「Text」セクションを開く
3. 「Text styles」で「+」をクリック
4. スタイル名を入力（例: `Text/Heading 1`）

### ステップ2: フォントウェイトを変更

1. **「Regular」と書いてあるドロップダウンをクリック**
2. 以下のいずれかを選択：
   - **Regular** (400) - 本文用
   - **Medium** (500) - ボタン、ラベル用（必要に応じて）
   - **SemiBold** (600) - サブ見出し用
   - **Bold** (700) - 見出し用

### ステップ3: 各スタイルの設定

#### 見出し系（太字）
- `Text/Display Large` → **Bold (700)**
- `Text/Heading 1` → **Bold (700)**

#### サブ見出し系（中太字）
- `Text/Heading 2` → **SemiBold (600)**
- `Text/Heading 3` → **SemiBold (600)**

#### 本文系（通常）
- `Text/Body Large` → **Regular (400)**
- `Text/Body` → **Regular (400)**
- `Text/Body Small` → **Regular (400)**
- `Text/Caption` → **Regular (400)**

---

## 追加のフォントウェイト（オプション）

### ボタン用スタイル（必要に応じて）

ボタンのテキストには、通常のBodyスタイルとは別に、Medium (500) を使用することもできます：

- `Text/Button` → **Medium (500)** または **Bold (700)**
  - 用途: ボタンのテキスト
  - サイズ: 16px
  - 行間: 24px

---

## 確認チェックリスト

各テキストスタイルを作成したら、以下を確認：

- [ ] `Text/Display Large` → Bold (700) ✓
- [ ] `Text/Heading 1` → Bold (700) ✓
- [ ] `Text/Heading 2` → SemiBold (600) ✓
- [ ] `Text/Heading 3` → SemiBold (600) ✓
- [ ] `Text/Body Large` → Regular (400) ✓
- [ ] `Text/Body` → Regular (400) ✓
- [ ] `Text/Body Small` → Regular (400) ✓
- [ ] `Text/Caption` → Regular (400) ✓

---

## よくある質問

### Q: Regularのままでもいいの？

**A: いいえ。** 見出し系（Display Large, Heading 1）は必ず **Bold (700)** に変更してください。Heading 2と3は **SemiBold (600)** に変更してください。

### Q: すべてRegularにしたらどうなる？

**A: 見出しと本文の区別がつかなくなります。** 視覚的な階層が失われ、読みにくくなります。

### Q: Medium (500) は使わないの？

**A: 基本の8つのスタイルでは使いません。** ただし、ボタンのテキストなど、特別な用途で必要に応じて使用できます。

---

## まとめ

- **見出し系**: Bold (700) または SemiBold (600)
- **本文系**: Regular (400)
- **Regularのままにしない**: 各スタイルに適切なウェイトを設定

これで、視覚的な階層が明確になり、読みやすいデザインになります。

