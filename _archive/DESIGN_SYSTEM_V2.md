# デミセル デザインシステム v2.0

## 🎨 概要

旧デミセルの全アプリケーション（出店者・主催者・管理者）のデザインを完全刷新しました。
モダンで洗練されたUIデザインシステムを構築し、一貫性のある美しいユーザー体験を提供します。

## ✨ 主な改善点

### 1. デザインシステムの刷新

#### カラーパレット
- **出店者アプリ**: 青緑系（#1AB5A7）をメインカラーに採用
- **主催者アプリ**: オレンジ系（#FFA580）をメインカラーに採用
- **管理者アプリ**: インディゴ系（#6366F1）をメインカラーに採用
- 各アプリで50〜900の段階的なカラースケールを定義
- セマンティックカラー（success, warning, error, info）の統一
- 美しいグラデーションの追加

#### タイポグラフィ
- **フォントファミリー**:
  - Primary: Inter（英数字）
  - Japanese: Noto Sans JP（日本語）
  - Display: Poppins（見出し用）
- **フォントサイズ**: xs（12px）〜 5xl（48px）の8段階
- **フォントウェイト**: light（300）〜 extrabold（800）の6段階
- **行間**: none（1）〜 loose（2）の6段階

#### スペーシング
- 0〜32（0px〜128px）の統一されたスペーシングスケール
- 0.5刻みの細かい調整が可能

#### ボーダーラジアス
- sm（4px）〜 3xl（48px）+ full（9999px）の7段階
- カード、ボタン、インプットで統一された角丸

#### シャドウ
- sm〜2xlの6段階 + カスタムシャドウ
- カードホバー、ボタン、プライマリアクション用の特別なシャドウ

### 2. 共通コンポーネントの作成

#### Button コンポーネント
- **バリアント**: primary, secondary, outline, ghost, text
- **サイズ**: sm, md, lg
- **機能**: loading状態、disabled状態、アイコン対応、fullWidth対応
- スムーズなホバーエフェクトとトランジション

#### Input コンポーネント
- **バリアント**: default, filled
- **機能**: label, error表示、アイコン対応、required表示
- フォーカス時の美しいアウトライン

#### Card コンポーネント
- **機能**: elevated（浮き上がり）、padding調整、hoverable
- ホバー時の滑らかなアニメーション

#### Badge コンポーネント
- **バリアント**: success, warning, error, info, neutral
- **サイズ**: sm, md
- ステータス表示に最適

#### LoadingSpinner コンポーネント
- **サイズ**: sm, md, lg
- **機能**: メッセージ表示、fullScreen対応
- 滑らかな回転アニメーション

#### ProgressBar コンポーネント
- ステップ表示機能
- 進捗に応じたビジュアルフィードバック
- チェックマーク付きの完了ステップ

#### NotificationBox コンポーネント
- **タイプ**: info, success, warning, error
- **機能**: タイトル、アイコン、アクション、クローズボタン
- スライドインアニメーション

### 3. 出店者アプリのデザイン改善

#### WelcomeScreen（ログイン/新規登録）
- グラデーション背景の採用
- タブ切り替えUI（ログイン/新規登録）
- LINE、Google、メールの3つの認証方法
- 美しいカードレイアウト
- アニメーション付きのフェードイン

#### その他のコンポーネント
- EmailConfirmationBanner: メール確認バナー
- EventList: イベント一覧（既存機能を維持）
- EventCard: イベントカード（既存機能を維持）

### 4. 主催者アプリのデザイン改善

#### WelcomeScreen（ログイン/新規登録）
- 暖色系グラデーション背景
- 出店者アプリと同様の統一されたUI
- 主催者専用のアイコン（🎯）

#### その他のコンポーネント
- 出店者アプリと同じ共通コンポーネントを使用
- 一貫性のあるデザイン言語

### 5. 管理者アプリのデザイン改善

#### AdminLogin
- インディゴ系のグラデーション背景
- セキュアな印象のロックアイコン（🔐）
- シンプルで機能的なログインフォーム

#### AdminDashboard
- モダンなダッシュボードレイアウト
- タブナビゲーション（主催者承認/イベント管理）
- グリッドレイアウトのカード表示
- ステータスバッジの統一
- ワンクリック承認/却下機能

### 6. アニメーションとトランジション

#### 定義されたアニメーション
- **fadeIn**: フェードイン
- **slideInUp**: 下から上へスライドイン
- **slideInDown**: 上から下へスライドイン
- **scaleIn**: スケールイン
- **spin**: 回転（ローディング用）
- **shimmer**: シマーエフェクト（スケルトン用）
- **pulse**: パルス
- **bounce**: バウンス

#### トランジション
- **fast**: 150ms（ホバー、フォーカス）
- **normal**: 250ms（一般的なトランジション）
- **slow**: 350ms（大きな変化）
- **bounce**: 500ms（バウンスエフェクト）

### 7. レスポンシブデザイン

#### ブレークポイント
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

#### 最適化
- スマートフォン（393px）を基準にデザイン
- タブレット、デスクトップでの表示最適化
- コンテナの最大幅を1280pxに設定

### 8. アクセシビリティ

- フォーカスリングの統一（各アプリのプライマリカラー）
- スクリーンリーダー対応（.sr-onlyクラス）
- キーボードナビゲーション対応
- 適切なコントラスト比
- セマンティックHTML

## 📁 ファイル構造

```
旧デミセル/
├── store/                          # 出店者アプリ
│   ├── styles/
│   │   └── design-system.ts       # デザインシステム定義
│   ├── components/
│   │   ├── ui/                    # 共通UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── WelcomeScreen.tsx      # ログイン/新規登録
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── NotificationBox.tsx
│   │   └── EmailConfirmationBanner.tsx
│   └── app/
│       └── globals.css            # グローバルスタイル
│
├── organizer/                      # 主催者アプリ
│   ├── styles/
│   │   └── design-system.ts       # デザインシステム定義
│   ├── components/
│   │   ├── ui/                    # 共通UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── WelcomeScreen.tsx      # ログイン/新規登録
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProgressBar.tsx
│   │   └── NotificationBox.tsx
│   └── app/
│       └── globals.css            # グローバルスタイル
│
└── admin/                          # 管理者アプリ
    ├── components/
    │   └── AdminLogin.tsx         # 管理者ログイン
    └── app/
        ├── page.tsx               # ダッシュボード
        └── globals.css            # グローバルスタイル
```

## 🚀 使用方法

### デザインシステムのインポート

```typescript
import { colors, spacing, typography, shadows } from '@/styles/design-system'
```

### コンポーネントの使用例

```typescript
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

// ボタン
<Button variant="primary" size="lg" fullWidth>
  ログイン
</Button>

// インプット
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  label="メールアドレス"
  placeholder="example@email.com"
  required
/>

// カード
<Card elevated hoverable padding="lg">
  <h2>カードタイトル</h2>
  <p>カードコンテンツ</p>
</Card>
```

## 🎯 デザイン原則

1. **一貫性**: 全アプリで統一されたデザイン言語
2. **シンプルさ**: 不要な装飾を排除し、機能に集中
3. **アクセシビリティ**: 誰もが使いやすいUI
4. **パフォーマンス**: 軽量で高速なコンポーネント
5. **拡張性**: 新しいコンポーネントの追加が容易

## 📊 カラーパレット

### 出店者アプリ（青緑系）
- Primary: #1AB5A7
- Secondary: #FFA580
- Background: グラデーション（#E6F7F5 → #B3E8E3）

### 主催者アプリ（オレンジ系）
- Primary: #FFA580
- Secondary: #1AB5A7
- Background: グラデーション（#FFF5F0 → #FFE6DB）

### 管理者アプリ（インディゴ系）
- Primary: #6366F1
- Background: グラデーション（#EEF2FF → #F5F5F5）

## 🔧 カスタマイズ

デザインシステムは各アプリの `styles/design-system.ts` で定義されています。
必要に応じてカラー、スペーシング、タイポグラフィなどをカスタマイズできます。

## 📝 今後の拡張

- [ ] ダークモード対応
- [ ] より多くの共通コンポーネント（Modal, Dropdown, Tooltipなど）
- [ ] アニメーションライブラリの統合（Framer Motion）
- [ ] ストーリーブック（Storybook）の導入
- [ ] テーマ切り替え機能

## 🎉 まとめ

デミセルのデザインシステムv2.0により、全アプリケーションが統一された美しいUIを持つようになりました。
モダンで洗練されたデザイン、スムーズなアニメーション、優れたアクセシビリティを提供し、
ユーザーに最高の体験を届けます。

