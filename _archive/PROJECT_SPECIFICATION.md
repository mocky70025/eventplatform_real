# Tomorrow Event Platform - 完全仕様書

## 📋 プロジェクト概要

Tomorrow Event Platformは、イベント主催者とキッチンカー・屋台の出店者をマッチングするWebアプリケーションです。主催者がイベントを掲載し、出店者がイベントに申し込み、主催者が承認するというワークフローを提供します。

### アプリケーション構成

1. **主催者アプリ (organizer)** - ポート: 3002
   - イベントの作成・管理
   - 出店申し込みの承認・却下
   - 出店者情報の確認
   - CSV形式でのデータエクスポート

2. **出店者アプリ (store)** - ポート: 3001
   - イベント一覧の閲覧
   - イベントへの申し込み
   - プロフィール管理
   - 申し込み状況の確認

3. **管理アプリ (admin)** - ポート: 3000
   - 主催者の承認
   - イベントの承認

---

## 🛠 技術スタック

### フロントエンド
- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3.6
- **UI Library**: React 18
- **Icons**: Lucide React 0.294.0

### バックエンド
- **BaaS**: Supabase
  - Authentication (Email/Password, Google OAuth)
  - PostgreSQL Database
  - Storage (画像アップロード)
  - Row Level Security (RLS)

### 外部サービス
- **OpenAI API**: 営業許可証のAI読み取り（GPT-4o-mini Vision API）
- **Resend**: メール送信（通知機能）

### 開発環境
- **Node.js**: v20以上
- **Package Manager**: npm
- **Deployment**: Vercel

---

## 📁 プロジェクト構造

```
tomorrow/
├── organizer/              # 主催者アプリ
│   ├── app/
│   │   ├── page.tsx       # メインページ（認証・登録状態管理）
│   │   ├── auth/
│   │   │   └── callback/  # OAuthコールバック処理
│   │   ├── api/
│   │   │   └── events/
│   │   │       ├── export-to-csv/  # CSVエクスポートAPI
│   │   │       └── verify-business-license/  # AI営業許可証確認API
│   │   └── globals.css    # グローバルスタイル
│   ├── components/
│   │   ├── WelcomeScreen.tsx        # ログイン・新規登録画面
│   │   ├── RegistrationForm.tsx     # 主催者登録フォーム
│   │   ├── EventManagement.tsx      # イベント管理画面
│   │   ├── EventForm.tsx            # イベント作成・編集フォーム
│   │   ├── EventList.tsx            # イベント一覧
│   │   ├── EventApplications.tsx    # 出店申し込み管理
│   │   ├── OrganizerProfile.tsx     # 主催者プロフィール
│   │   ├── NotificationBox.tsx      # 通知一覧
│   │   └── ImageUpload.tsx          # 画像アップロード
│   └── lib/
│       ├── supabase.ts    # Supabaseクライアント
│       └── auth.ts        # 認証ユーティリティ
│
├── store/                  # 出店者アプリ
│   ├── app/
│   │   ├── page.tsx       # メインページ
│   │   ├── auth/
│   │   │   └── callback/  # OAuthコールバック処理
│   │   ├── api/
│   │   │   └── events/
│   │   │       └── verify-business-license/  # AI営業許可証確認API
│   │   └── globals.css    # グローバルスタイル
│   ├── components/
│   │   ├── WelcomeScreen.tsx        # ログイン・新規登録画面
│   │   ├── RegistrationForm.tsx    # 出店者登録フォーム
│   │   ├── EventList.tsx            # イベント一覧
│   │   ├── EventCard.tsx           # イベントカード
│   │   ├── ExhibitorProfile.tsx    # 出店者プロフィール
│   │   ├── ApplicationManagement.tsx  # 申し込み管理
│   │   ├── NotificationBox.tsx     # 通知一覧
│   │   └── ImageUpload.tsx         # 画像アップロード
│   └── lib/
│       ├── supabase.ts    # Supabaseクライアント
│       └── auth.ts        # 認証ユーティリティ
│
└── admin/                  # 管理アプリ
    ├── app/
    │   └── page.tsx       # 管理画面
    └── components/
        └── AdminLogin.tsx # 管理ログイン
```

---

## 🗄 データベーススキーマ

### テーブル一覧

#### 1. exhibitors (出店者)
```sql
- id: UUID (PK)
- name: VARCHAR(100) NOT NULL
- gender: VARCHAR(10) CHECK ('男', '女', 'それ以外')
- age: INTEGER (0-99)
- phone_number: VARCHAR(20) NOT NULL
- email: VARCHAR(255) NOT NULL
- genre_category: VARCHAR(50)
- genre_free_text: TEXT
- business_license_image_url: TEXT
- vehicle_inspection_image_url: TEXT
- automobile_inspection_image_url: TEXT
- pl_insurance_image_url: TEXT
- fire_equipment_layout_image_url: TEXT
- user_id: UUID (Supabase Auth用)
- line_user_id: VARCHAR(100) UNIQUE (LINE Login用)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. organizers (主催者)
```sql
- id: UUID (PK)
- company_name: VARCHAR(200) NOT NULL
- name: VARCHAR(100) NOT NULL
- gender: VARCHAR(10) CHECK ('男', '女', 'それ以外')
- age: INTEGER (0-99)
- phone_number: VARCHAR(20) NOT NULL
- email: VARCHAR(255) NOT NULL
- user_id: UUID (Supabase Auth用、NULL許可)
- line_user_id: VARCHAR(100) UNIQUE (LINE Login用、NULL許可)
- is_approved: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. events (イベント)
```sql
- id: UUID (PK)
- event_name: VARCHAR(100) NOT NULL
- event_name_furigana: VARCHAR(100) NOT NULL
- genre: VARCHAR(50) NOT NULL
- is_shizuoka_vocational_assoc_related: BOOLEAN
- opt_out_newspaper_publication: BOOLEAN
- event_start_date: DATE NOT NULL
- event_end_date: DATE NOT NULL
- event_display_period: VARCHAR(50) NOT NULL
- event_period_notes: VARCHAR(100)
- event_time: VARCHAR(50)
- application_start_date: DATE
- application_end_date: DATE
- application_display_period: VARCHAR(50)
- application_notes: VARCHAR(250)
- ticket_release_start_date: DATE
- ticket_sales_location: TEXT
- lead_text: VARCHAR(100) NOT NULL
- event_description: VARCHAR(250) NOT NULL
- event_introduction_text: TEXT
- main_image_url: TEXT
- main_image_caption: VARCHAR(50)
- additional_image1_url ~ additional_image4_url: TEXT
- additional_image1_caption ~ additional_image4_caption: VARCHAR(50)
- venue_name: VARCHAR(200) NOT NULL
- venue_postal_code: VARCHAR(10)
- venue_city: VARCHAR(50)
- venue_town: VARCHAR(100)
- venue_address: VARCHAR(200)
- venue_latitude: DECIMAL(10, 8)
- venue_longitude: DECIMAL(11, 8)
- homepage_url: TEXT
- related_page_url: TEXT
- contact_name: VARCHAR(100) NOT NULL
- contact_phone: VARCHAR(20) NOT NULL
- contact_email: VARCHAR(255)
- parking_info: TEXT
- fee_info: TEXT
- organizer_info: TEXT
- organizer_id: UUID (FK → organizers.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 4. event_applications (出店申し込み)
```sql
- id: UUID (PK)
- exhibitor_id: UUID (FK → exhibitors.id)
- event_id: UUID (FK → events.id)
- application_status: VARCHAR(20) DEFAULT 'pending' 
  CHECK ('pending', 'approved', 'rejected')
- applied_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(exhibitor_id, event_id)
```

#### 5. notifications (通知)
```sql
- id: UUID (PK)
- user_id: TEXT NOT NULL
- user_type: VARCHAR(20) CHECK ('exhibitor', 'organizer')
- notification_type: VARCHAR(50) NOT NULL
- title: VARCHAR(200) NOT NULL
- message: TEXT NOT NULL
- related_event_id: UUID (FK → events.id)
- related_application_id: UUID (FK → event_applications.id)
- is_read: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 6. form_drafts (フォームドラフト)
```sql
- id: UUID (PK)
- user_id: TEXT NOT NULL
- form_type: TEXT NOT NULL
- payload: JSONB NOT NULL
- updated_at: TIMESTAMP
- UNIQUE(user_id, form_type)
```

### ストレージバケット

1. **exhibitor-documents**: 出店者の書類画像
   - business-license/
   - vehicle-inspection/
   - automobile-inspection/
   - pl-insurance/
   - fire-equipment-layout/

2. **event-images**: イベント画像
   - main/
   - additional/

---

## 🔐 認証システム

### 認証方法

#### 主催者アプリ
- **Email/Password認証**: Supabase Auth
- **Google OAuth**: Supabase Auth

#### 出店者アプリ
- **LINE Login**: LINE Messaging API
- **Email/Password認証**: Supabase Auth
- **Google OAuth**: Supabase Auth

### 認証フロー

1. **初期画面**: WelcomeScreen
   - ログイン/新規登録の選択
   - 認証方法の選択（Google/Email）

2. **ログイン**
   - Google: OAuthリダイレクト
   - Email: メールアドレス・パスワード入力

3. **新規登録**
   - 認証方法選択
   - ユーザー情報入力
   - 登録フォーム送信

4. **コールバック処理**
   - `/auth/callback`でOAuthコールバック受信
   - セッション確認
   - 登録状態確認
   - 適切な画面へリダイレクト

### セッション管理

- **Supabase Auth**: サーバーサイドセッション
- **Session Storage**: クライアントサイド状態管理
  - `auth_type`: 認証タイプ（'email', 'google', 'line'）
  - `user_id`: ユーザーID
  - `user_email`: メールアドレス
  - `is_registered`: 登録済みフラグ
  - `app_type`: アプリタイプ（'organizer', 'store'）

---

## 🎨 UI/UXデザインシステム

> **⚠️ 重要**: 以下のデザインシステムは現在の実装状況を記録したものです。
> 新しいデザインAIは、この情報を参考にしつつ、**完全に新しいデザイン**を作成してください。
> 機能要件や画面構成は維持しつつ、デザインは自由に刷新してください。

### 現在の実装状況（参考情報）

#### カラーパレット

#### プライマリカラー
```css
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6
--primary-600: #2563eb (メイン)
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

#### グレースケール
```css
--gray-50: #f9fafb (背景)
--gray-100: #f3f4f6
--gray-200: #e5e7eb (ボーダー)
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280 (セカンダリテキスト)
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827 (プライマリテキスト)
```

#### セマンティックカラー
```css
--success-500: #10b981
--success-600: #059669
--warning-500: #f59e0b
--error-500: #ef4444
--error-600: #dc2626
```

### タイポグラフィ

```css
/* 見出し */
.text-heading-1: 32px, 800, line-height: 1.2
.text-heading-2: 28px, 700, line-height: 1.3
.text-heading-3: 22px, 600, line-height: 1.4
.text-heading-4: 18px, 600, line-height: 1.5

/* 本文 */
.text-body: 16px, 400, line-height: 1.7
.text-body-secondary: 16px, 400, line-height: 1.7, color: gray-600
.text-caption: 14px, 400, line-height: 1.6, color: gray-600
.text-small: 13px, 400, line-height: 1.5, color: gray-400
```

### スペーシング

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### ボーダー半径

```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 20px
--radius-full: 9999px
```

### シャドウ

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### トランジション

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### コンポーネントスタイル（現在の実装）

#### ボタン
- **Primary**: グラデーション背景（primary-600 → primary-700）、ホバー時シャドウ拡大
- **Outline**: 透明背景、ボーダー、ホバー時背景色変更
- **Ghost**: 透明背景、ホバー時背景色変更
- **サイズ**: sm (10px 20px), default (14px 28px), lg (16px 32px)

#### フォーム要素
- **Input**: 2pxボーダー、フォーカス時シャドウ（primary-500, 4px blur）
- **Label**: 14px, 600, margin-bottom: 8px
- **Error**: 13px, 500, color: error-500, アイコン付き

#### カード
- **基本**: 白背景、border-radius: 16px、シャドウ: shadow-sm
- **ホバー**: シャドウ拡大、transform: translateY(-2px)
- **アクセント**: 上部3pxグラデーションライン（ホバー時表示）

---

## 🎨 デザイン要件（新規デザインAI向け）

### デザインの方向性

以下の要件を満たす新しいデザインを作成してください：

1. **モダンで洗練されたデザイン**
   - 2024年最新のUIトレンドに沿ったデザイン
   - プロフェッショナルで信頼感のある見た目
   - 使いやすさを最優先

2. **ブランドアイデンティティ**
   - イベント・祭り・キッチンカーを連想させる温かみのあるデザイン
   - でも、ビジネス向けなので過度にカジュアルすぎない
   - 主催者と出店者の両方に適したデザイン

3. **アクセシビリティ**
   - WCAG 2.1 AAレベル以上を目指す
   - コントラスト比の確保
   - キーボードナビゲーション対応

4. **レスポンシブデザイン**
   - モバイルファースト
   - タブレット（768px以上）
   - デスクトップ（1024px以上）
   - 大型デスクトップ（1280px以上）

5. **パフォーマンス**
   - 軽量なデザイン
   - 不要なアニメーションは避ける（ユーザー要望により削除済み）
   - 高速な読み込み

### 必須コンポーネント

以下のコンポーネントのデザインが必要です：

1. **WelcomeScreen（ログイン・新規登録画面）**
   - 認証方法選択ボタン（Google、メールアドレス、LINE）
   - 新規登録ボタン
   - エラーメッセージ表示

2. **RegistrationForm（登録フォーム）**
   - マルチステップフォーム
   - 進捗インジケーター
   - 入力フィールド
   - バリデーションエラー表示
   - 確認画面

3. **EventManagement（イベント管理）**
   - イベント一覧
   - イベント作成ボタン
   - 承認待ちバナー
   - ナビゲーション

4. **EventForm（イベント作成・編集）**
   - 長いフォーム（多数の入力項目）
   - 画像アップロード
   - 下書き保存機能

5. **EventList（イベント一覧）**
   - イベントカード
   - フィルター・ソート機能（将来的に追加予定）

6. **EventApplications（申し込み管理）**
   - 申し込み一覧
   - 承認/却下ボタン
   - 出店者詳細表示
   - CSVエクスポートボタン

7. **NotificationBox（通知一覧）**
   - 通知カード
   - 未読/既読の視覚的区別
   - 未読数バッジ

8. **Profile（プロフィール）**
   - 情報表示
   - 編集フォーム
   - 画像表示

### デザインの制約事項

1. **アニメーション**: ユーザー要望により削除済み。控えめなトランジションのみ使用可能
2. **カラーパレット**: 上記の現在の実装を参考にしつつ、新しいカラースキームを作成可能
3. **フォント**: 日本語対応フォントを使用（システムフォント推奨）
4. **アイコン**: Lucide Reactを使用（既存のアイコンセット）

### デザインの優先順位

1. **使いやすさ**: 最も重要。直感的で迷わないUI
2. **視認性**: 情報が明確に伝わる
3. **一貫性**: 全画面で統一されたデザイン言語
4. **美しさ**: 上記を満たした上で、美しいデザイン

---

## 📱 画面仕様

### 主催者アプリ

#### 1. WelcomeScreen (ログイン・新規登録)
- **レイアウト**: 中央配置カード型
- **背景**: グラデーション（#667eea → #764ba2）
- **コンテンツ**:
  - ロゴ/アイコン（🎪）
  - タイトル・説明文
  - ログインボタン（Google、メールアドレス）
  - セパレーター
  - 新規登録ボタン
- **状態管理**: authMode ('initial', 'login', 'register')

#### 2. RegistrationForm (主催者登録)
- **ステップ1: 情報登録**
  - 会社名、名前、性別、年齢、電話番号、メールアドレス
  - 利用規約チェックボックス
  - 「次に進む」ボタン
- **ステップ2: 情報確認**
  - 入力内容の確認表示
  - 「修正する」「登録する」ボタン
- **進捗インジケーター**: 2ステップ表示

#### 3. EventManagement (イベント管理)
- **ヘッダー**: タイトル + 「新しいイベントを掲載」ボタン
- **承認待ちバナー**: is_approved=falseの場合表示
- **イベント一覧**: EventListコンポーネント
- **ナビゲーション**: イベント、プロフィール、通知

#### 4. EventForm (イベント作成・編集)
- **フォーム項目**:
  - 基本情報（イベント名、ふりがな、ジャンル）
  - 開催期間・時間
  - 申し込み期間
  - チケット情報
  - イベント内容（リード文、説明、紹介文）
  - 画像（メイン画像 + 追加画像4枚）
  - 会場情報（住所、緯度経度）
  - URL情報
  - 連絡先情報
  - その他情報（駐車場、料金、主催者情報）
- **バリデーション**: 必須項目チェック
- **保存**: 下書き自動保存機能

#### 5. EventApplications (出店申し込み管理)
- **申し込み一覧**: 出店者情報、申し込み日時、ステータス
- **アクション**:
  - 承認ボタン（確認ダイアログ付き）
  - 却下ボタン（確認ダイアログ付き）
  - 出店者詳細表示
  - 営業許可証AI確認ボタン
- **CSVエクスポート**: 「CSV形式でダウンロード」ボタン

#### 6. OrganizerProfile (主催者プロフィール)
- **表示項目**: 登録情報の表示
- **編集機能**: OrganizerEditFormで編集可能

### 出店者アプリ

#### 1. WelcomeScreen (ログイン・新規登録)
- **レイアウト**: 主催者アプリと同様
- **認証方法**: LINE Login、Google、Email

#### 2. RegistrationForm (出店者登録)
- **ステップ1: 基本情報**
  - 名前、性別、年齢、電話番号、メールアドレス
  - ジャンル（カテゴリ + 自由回答）
- **ステップ2: 書類アップロード**
  - 営業許可証（AI確認機能付き）
  - 車検証
  - 自動車検査証
  - PL保険
  - 火器類配置図
- **ステップ3: 情報確認**
  - 入力内容・画像の確認
  - 「修正する」「登録する」ボタン
- **進捗インジケーター**: 3ステップ表示

#### 3. EventList (イベント一覧)
- **カード型レイアウト**: EventCardコンポーネント
- **表示項目**: イベント名、開催期間、会場、ジャンル
- **アクション**: 「申し込む」ボタン（確認ダイアログ付き）

#### 4. ExhibitorProfile (出店者プロフィール)
- **表示項目**: 登録情報、書類画像
- **編集機能**: ExhibitorEditFormで編集可能

#### 5. ApplicationManagement (申し込み管理)
- **申し込み一覧**: イベント名、申し込み日時、ステータス
- **ステータス表示**: pending（承認待ち）、approved（承認済み）、rejected（却下）

#### 6. NotificationBox (通知一覧)
- **未読通知数**: バッジ表示
- **通知一覧**: タイトル、メッセージ、日時
- **既読/未読**: 視覚的区別

---

## 🔄 主要機能フロー

### 1. 主催者登録フロー
1. WelcomeScreenで「新規登録」選択
2. 認証方法選択（Google/Email）
3. 認証完了
4. RegistrationFormで情報入力
5. 確認画面で内容確認
6. 登録送信
7. 承認待ち画面表示
8. 運営側で承認
9. イベント管理画面へ遷移

### 2. イベント作成フロー
1. EventManagementで「新しいイベントを掲載」クリック
2. EventFormで情報入力
3. 画像アップロード
4. 保存（下書き自動保存）
5. イベント一覧に表示

### 3. 出店申し込みフロー
1. 出店者アプリでイベント一覧閲覧
2. イベントカードから「申し込む」クリック
3. 確認ダイアログ表示
4. 申し込み送信
5. 通知送信（主催者へ）
6. 主催者が承認/却下
7. 通知送信（出店者へ）

### 4. 申し込み承認フロー
1. EventApplicationsで申し込み一覧表示
2. 出店者詳細確認
3. 営業許可証AI確認（オプション）
4. 「承認」/「却下」クリック
5. 確認ダイアログ表示
6. 承認/却下実行
7. 通知送信
8. CSVエクスポート（承認時）

---

## 🔌 API仕様

### 1. CSVエクスポートAPI
**エンドポイント**: `POST /api/events/export-to-csv`

**リクエスト**:
```json
{
  "eventName": "イベント名",
  "applications": [
    {
      "exhibitor": {
        "name": "出店者名",
        "email": "email@example.com",
        ...
      },
      "applied_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**レスポンス**: CSVファイル（UTF-8 BOM付き）

### 2. 営業許可証AI確認API
**エンドポイント**: `POST /api/events/verify-business-license`

**リクエスト**:
```json
{
  "imageUrl": "https://..."
}
```

**レスポンス**:
```json
{
  "result": "yes" | "no",
  "expirationDate": "2024-12-31",
  "reason": "理由"
}
```

**処理フロー**:
1. 画像URLから画像取得
2. Base64エンコード
3. OpenAI Vision API呼び出し（GPT-4o-mini）
4. JSON形式で結果返却

---

## 🔔 通知システム

### 通知タイプ

1. **application_received**: 出店申し込み受信（主催者へ）
2. **application_approved**: 申し込み承認（出店者へ）
3. **application_rejected**: 申し込み却下（出店者へ）

### 通知作成タイミング

- 出店申し込み時: 主催者へ通知
- 承認時: 出店者へ通知
- 却下時: 出店者へ通知

### 通知表示

- **未読数**: ナビゲーションバーにバッジ表示
- **通知一覧**: NotificationBoxコンポーネント
- **既読処理**: 通知クリック時に自動既読

---

## 📦 環境変数

### 主催者アプリ (organizer/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_ORGANIZER_URL=http://localhost:3002
OPENAI_API_KEY=sk-xxx
```

### 出店者アプリ (store/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=xxx
LINE_LOGIN_CHANNEL_SECRET=xxx
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=http://localhost:3001/auth/callback
OPENAI_API_KEY=sk-xxx
```

### 管理アプリ (admin/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 🚀 デプロイ手順

### Vercelデプロイ

1. **プロジェクト作成**
   - organizer、store、adminをそれぞれ別プロジェクトとして作成

2. **環境変数設定**
   - Vercelダッシュボードで環境変数を設定

3. **ビルド設定**
   - Root Directory: `organizer` / `store` / `admin`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **デプロイ**
   - Git pushで自動デプロイ

---

## 🔒 セキュリティ

### Row Level Security (RLS)

- **exhibitors**: 自分のデータのみアクセス可能
- **organizers**: 自分のデータのみアクセス可能
- **events**: 全員閲覧可能、主催者のみ編集可能
- **event_applications**: 自分の申し込みのみアクセス可能
- **notifications**: 自分の通知のみアクセス可能
- **form_drafts**: 自分のドラフトのみアクセス可能

### ストレージセキュリティ

- **公開バケット**: 画像は公開アクセス可能
- **RLSポリシー**: 必要に応じて設定

---

## 📝 今後の拡張予定

1. **AI機能**: 営業許可証のAI読み取り（現在はAPIキー待ち）
2. **メール通知**: Resendを使用したメール送信
3. **管理機能**: イベント承認機能の拡張

---

## 🐛 既知の問題・制約事項

1. **アニメーション**: ユーザー要望により削除済み
2. **Google Sheets連携**: 削除済み（CSVエクスポートに置き換え）
3. **営業許可証AI確認**: APIキー設定待ち（機能は実装済み）

---

## 📚 参考資料

- **Supabase公式ドキュメント**: https://supabase.com/docs
- **Next.js公式ドキュメント**: https://nextjs.org/docs
- **Tailwind CSS公式ドキュメント**: https://tailwindcss.com/docs
- **OpenAI Vision API**: https://platform.openai.com/docs/guides/vision

---

## 📞 サポート

技術的な質問や問題がある場合は、プロジェクトのGitHubリポジトリのIssuesセクションをご利用ください。

---

## 🎨 UIコンポーネント詳細仕様（デザインAI向け）

このセクションは、デザインAIがUIコンポーネントを作成するために必要な詳細な仕様を記載しています。
各コンポーネントについて、機能要件、データ構造、インタラクション、レイアウト要件を詳しく説明します。

### 共通要件

#### レスポンシブブレークポイント
- **モバイル**: 0px - 767px
- **タブレット**: 768px - 1023px
- **デスクトップ**: 1024px以上

#### 画面サイズ検出
各コンポーネントは`useEffect`で画面サイズを検出し、`isDesktop`状態を管理します：
```typescript
const [isDesktop, setIsDesktop] = useState(false)

useEffect(() => {
  const checkScreenSize = () => {
    setIsDesktop(window.innerWidth >= 1024)
  }
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  return () => window.removeEventListener('resize', checkScreenSize)
}, [])
```

#### ローディング状態
- データ取得中は`LoadingSpinner`コンポーネントを表示
- ボタンは`loading`状態で無効化し、テキストを「...中」に変更

#### エラーハンドリング
- エラー発生時は`alert()`でエラーメッセージを表示
- フォームバリデーションエラーは各フィールドの下に赤色で表示

---

### 1. WelcomeScreen（ログイン・新規登録画面）

#### ファイルパス
- 主催者アプリ: `organizer/components/WelcomeScreen.tsx`
- 出店者アプリ: `store/components/WelcomeScreen.tsx`

#### Props
なし（スタンドアロンコンポーネント）

#### State管理
```typescript
const [authMode, setAuthMode] = useState<'initial' | 'login' | 'register'>('initial')
const [loginMethod, setLoginMethod] = useState<'line' | 'email' | 'google' | null>(null)
const [registerMethod, setRegisterMethod] = useState<'line' | 'email' | 'google' | null>(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [registerEmail, setRegisterEmail] = useState('')
const [registerPassword, setRegisterPassword] = useState('')
const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [isDesktop, setIsDesktop] = useState(false)
```

#### 機能要件

**主催者アプリ:**
- 認証方法: Google、メールアドレス・パスワード
- 背景: 青系グラデーション（#667eea → #764ba2）
- アイコン: 🎪（イベント）

**出店者アプリ:**
- 認証方法: LINE Login、Google、メールアドレス・パスワード
- 背景: 緑系グラデーション（#10b981 → #059669）
- アイコン: 🚚（トラック）

#### レイアウト要件
- 中央配置のカード型レイアウト
- モバイル: 全幅、パディング24px 16px
- デスクトップ: 最大幅480px、パディング48px 24px
- カード背景: rgba(255, 255, 255, 0.98)
- ボーダーラディウス: モバイル20px、デスクトップ24px
- シャドウ: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

#### インタラクション
- 「ログイン」ボタンクリック → `authMode`を`'login'`に変更
- 「新規登録」ボタンクリック → `authMode`を`'register'`に変更
- 認証方法ボタンクリック → 対応する認証処理を実行
- エラー発生時 → エラーメッセージをカード内に表示

#### バリデーション
- パスワード: 6文字以上
- パスワード確認: パスワードと一致
- メールアドレス: 基本的なメール形式チェック

---

### 2. RegistrationForm（登録フォーム）

#### ファイルパス
- 主催者アプリ: `organizer/components/RegistrationForm.tsx`
- 出店者アプリ: `store/components/RegistrationForm.tsx`

#### Props
```typescript
interface RegistrationFormProps {
  userProfile: LineProfile | any
  onRegistrationComplete: () => void
}
```

#### State管理

**主催者アプリ:**
```typescript
const [formData, setFormData] = useState<OrganizerFormState>({
  company_name: '',
  name: '',
  gender: '' | '男' | '女' | 'それ以外',
  age: 0,
  phone_number: '',
  email: ''
})
const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
const [errors, setErrors] = useState<Record<string, boolean>>({})
const [termsAccepted, setTermsAccepted] = useState(false)
const [hasViewedTerms, setHasViewedTerms] = useState(false)
const [loading, setLoading] = useState(false)
const [showTermsPage, setShowTermsPage] = useState(false)
const [draftLoaded, setDraftLoaded] = useState(false)
```

**出店者アプリ:**
```typescript
const [formData, setFormData] = useState<ExhibitorFormState>({
  name: '',
  gender: '' | '男' | '女' | 'それ以外',
  age: 0,
  phone_number: '',
  email: '',
  genre_category: '',
  genre_free_text: ''
})
const [documentUrls, setDocumentUrls] = useState<ExhibitorDocumentState>({
  business_license: '',
  vehicle_inspection: '',
  automobile_inspection: '',
  pl_insurance: '',
  fire_equipment_layout: ''
})
const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
const [licenseVerificationStatus, setLicenseVerificationStatus] = useState<{
  verifying: boolean
  result: 'yes' | 'no' | null
  expirationDate: string | null
  reason: string | null
}>({...})
```

#### ステップ構成

**主催者アプリ（3ステップ）:**
1. **情報登録**: 会社名、名前、性別、年齢、電話番号、メールアドレス、利用規約同意
2. **情報確認**: 入力内容の確認表示、「修正する」「登録する」ボタン
3. **登録完了**: 完了メッセージ、「マイページへ」ボタン

**出店者アプリ（3ステップ）:**
1. **情報登録**: 名前、性別、年齢、電話番号、メールアドレス、ジャンル、書類アップロード、利用規約同意
2. **情報確認**: 入力内容・画像の確認表示、「修正する」「登録する」ボタン
3. **登録完了**: 完了メッセージ、「マイページへ」ボタン

#### 進捗インジケーター
- 3ステップのプログレスバー
- 各ステップ: 円形マーカー + ラベル（情報登録、情報確認、登録完了）
- 完了ステップ: 緑色で塗りつぶし、チェックマーク表示
- 未完了ステップ: 緑色の輪郭のみ
- ステップ間の線: 完了時は緑色、未完了時はグレー

#### バリデーション

**主催者アプリ:**
- 会社名: 必須
- 名前: 必須
- 性別: 必須
- 年齢: 必須、0-100の範囲
- 電話番号: 必須、10-15桁の数字（全角/半角対応、ハイフン削除）
- メールアドレス: 必須、メール形式
- 利用規約: 必須（利用規約を閲覧した後）

**出店者アプリ:**
- 名前: 必須
- 性別: 必須
- 年齢: 必須、0-100の範囲
- 電話番号: 必須、10-15桁の数字（全角/半角対応、ハイフン削除）
- メールアドレス: 必須、メール形式
- ジャンルカテゴリ: 必須（飲食、物販、サービス、その他）
- より詳しいジャンル: 必須
- 営業許可証: 必須
- 車検証: 必須
- 自動車検査証: 必須
- PL保険: 必須
- 火器類配置図: 必須
- 利用規約: 必須（利用規約を閲覧した後）

#### 下書き保存機能
- 入力内容を800msのデバウンスで自動保存
- `form_drafts`テーブルに保存
- ページ再読み込み時に自動復元

#### 画像アップロード（出店者アプリ）
- `ImageUpload`コンポーネントを使用
- 対応形式: JPEG, PNG, GIF, WebP, HEIC（最大10MB）
- アップロード完了後、URLを`documentUrls`に保存
- 営業許可証はアップロード後にAI確認を実行

#### 営業許可証AI確認（出店者アプリ）
- アップロード完了後、自動でAPI呼び出し
- 結果表示: 有効/期限切れ、期限日、理由
- 期限切れの場合: 警告表示（登録は可能）

---

### 3. EventForm（イベント作成・編集フォーム）

#### ファイルパス
`organizer/components/EventForm.tsx`

#### Props
```typescript
interface EventFormProps {
  organizer: Organizer
  onEventCreated: (event: Event) => void
  onCancel: () => void
  initialEvent?: Partial<Event> // 編集時に事前入力
}
```

#### State管理
```typescript
const [formData, setFormData] = useState<EventFormState>({
  event_name: '',
  event_name_furigana: '',
  genre: '',
  is_shizuoka_vocational_assoc_related: false,
  opt_out_newspaper_publication: false,
  event_start_date: '',
  event_end_date: '',
  event_display_period: '',
  event_period_notes: '',
  event_time: '',
  application_start_date: '',
  application_end_date: '',
  application_display_period: '',
  application_notes: '',
  ticket_release_start_date: '',
  ticket_sales_location: '',
  lead_text: '',
  event_description: '',
  event_introduction_text: '',
  venue_name: '',
  venue_postal_code: '',
  venue_city: '',
  venue_town: '',
  venue_address: '',
  venue_latitude: '',
  venue_longitude: '',
  homepage_url: '',
  related_page_url: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  parking_info: '',
  fee_info: '',
  organizer_info: ''
})
const [imageUrls, setImageUrls] = useState<EventImageState>({
  main: '',
  additional1: '',
  additional2: '',
  additional3: '',
  additional4: ''
})
const [errors, setErrors] = useState<Record<string, boolean>>({})
const [loading, setLoading] = useState(false)
const [addressLoading, setAddressLoading] = useState(false)
```

#### フォーム項目（セクション別）

**1. 基本情報**
- イベント名（必須）
- イベント名ふりがな（必須）
- ジャンル（必須）
- 静岡県職業能力開発協会関連（チェックボックス）
- 新聞掲載辞退（チェックボックス）

**2. 開催期間・時間**
- 開催開始日（必須、日付選択）
- 開催終了日（必須、日付選択）
- 開催期間表示（必須）
- 開催期間備考
- 開催時間

**3. 申し込み期間**
- 申し込み開始日（日付選択）
- 申し込み終了日（日付選択）
- 申し込み期間表示
- 申し込み備考

**4. チケット情報**
- チケット発売開始日（日付選択）
- チケット販売場所

**5. イベント内容**
- リード文（必須）
- イベント説明（必須）
- イベント紹介文

**6. 画像**
- メイン画像（必須、`ImageUpload`コンポーネント）
- 追加画像1-4（任意、`ImageUpload`コンポーネント）

**7. 会場情報**
- 会場名（必須）
- 郵便番号（郵便番号から住所自動入力機能付き）
- 都道府県・市区町村・町名・番地
- 緯度・経度（任意）

**8. URL情報**
- ホームページURL
- 関連ページURL

**9. 連絡先情報**
- 連絡先名前（必須）
- 連絡先電話番号（必須）
- 連絡先メールアドレス

**10. その他情報**
- 駐車場情報
- 料金情報
- 主催者情報

#### バリデーション
- 必須項目: イベント名、イベント名ふりがな、ジャンル、開催開始日、開催終了日、開催期間表示、リード文、イベント説明、会場名、連絡先名前、連絡先電話番号、メイン画像
- 日付の整合性: 開始日 ≤ 終了日、申し込み開始日 ≤ 申し込み終了日

#### 下書き保存機能
- 入力内容を800msのデバウンスで自動保存
- `form_drafts`テーブルに保存
- 編集時は下書き保存を無効化

#### 郵便番号から住所自動入力
- 郵便番号入力後、API呼び出しで住所を自動入力
- ローディング中は`addressLoading`状態を表示

---

### 4. EventList（イベント一覧）

#### ファイルパス
- 主催者アプリ: `organizer/components/EventList.tsx`
- 出店者アプリ: `store/components/EventList.tsx`

#### Props

**主催者アプリ:**
```typescript
interface EventListProps {
  userProfile: LineProfile
  onBack: () => void
}
```

**出店者アプリ:**
```typescript
interface EventListProps {
  userProfile: any
  onBack: () => void
}
```

#### State管理
```typescript
const [events, setEvents] = useState<Event[]>([])
const [loading, setLoading] = useState(true)
const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
const [showSearchPage, setShowSearchPage] = useState(false)
const [keyword, setKeyword] = useState('')
const [periodStart, setPeriodStart] = useState('')
const [periodEnd, setPeriodEnd] = useState('')
const [prefecture, setPrefecture] = useState('')
const [city, setCity] = useState('')
const [hasSearched, setHasSearched] = useState(false)
```

#### 機能要件

**主催者アプリ:**
- 自分のイベント一覧を表示
- イベントカードクリック → イベント詳細表示
- イベント編集・削除機能

**出店者アプリ:**
- 公開されているイベント一覧を表示
- 検索機能: キーワード、期間、都道府県、市区町村
- イベントカードクリック → イベント詳細表示
- 「申し込む」ボタン → 確認ダイアログ → 申し込み送信

#### レイアウト要件
- カード型グリッドレイアウト
- モバイル: 1列
- タブレット: 2列
- デスクトップ: 3列
- カード間のギャップ: 16px

#### 検索機能（出店者アプリ）
- 検索ページ: キーワード、期間開始日、期間終了日、都道府県、市区町村
- 検索実行後、結果をイベント一覧に表示
- 検索条件をリセット可能

---

### 5. EventCard（イベントカード）

#### ファイルパス
`store/components/EventCard.tsx`

#### Props
```typescript
interface EventCardProps {
  event: Event
  userProfile: any
}
```

#### State管理
```typescript
const [showDetails, setShowDetails] = useState(false)
const [applying, setApplying] = useState(false)
```

#### 表示項目
- メイン画像（存在する場合）
- イベント名
- 開催期間（`event_display_period`）
- 開催時間（存在する場合）
- 会場名
- リード文（`lead_text`）

#### インタラクション
- 「詳細を見る」ボタン → `showDetails`を`true`に変更、イベント説明を表示
- 「このイベントに申し込む」ボタン → 確認ダイアログ → 申し込み送信
- 申し込み中はボタンを無効化、「申し込み中...」表示

#### 申し込み処理
1. 確認ダイアログ表示
2. 出店者情報を取得（認証タイプに応じて`user_id`または`line_user_id`で検索）
3. `event_applications`テーブルに`pending`ステータスで挿入
4. 主催者に通知を作成
5. 主催者にメール通知を送信（オプション）
6. 成功メッセージ表示

---

### 6. EventApplications（出店申し込み管理）

#### ファイルパス
`organizer/components/EventApplications.tsx`

#### Props
```typescript
interface EventApplicationsProps {
  eventId: string
  eventName: string
  organizerId: string
  organizerEmail: string
  onBack: () => void
}
```

#### State管理
```typescript
const [applications, setApplications] = useState<Application[]>([])
const [loading, setLoading] = useState(true)
const [isApplicationClosed, setIsApplicationClosed] = useState(false)
const [closingApplication, setClosingApplication] = useState(false)
const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorDetail | null>(null)
const [licenseVerificationStatus, setLicenseVerificationStatus] = useState<{...}>()
```

#### 表示項目
- 申し込み一覧: 出店者名、申し込み日時、ステータス（pending/approved/rejected）
- 各申し込みに「詳細を見る」「承認」「却下」ボタン

#### インタラクション
- 「詳細を見る」 → 出店者詳細情報をモーダル表示
- 「承認」 → 確認ダイアログ → ステータスを`approved`に更新 → 出店者に通知
- 「却下」 → 確認ダイアログ → ステータスを`rejected`に更新 → 出店者に通知
- 「営業許可証AI確認」 → API呼び出し → 結果表示
- 「CSV形式でダウンロード」 → CSVエクスポートAPI呼び出し → ファイルダウンロード
- 「申し込みを締め切る」 → 確認ダイアログ → `is_application_closed`を`true`に更新

#### 出店者詳細表示
- 基本情報: 名前、性別、年齢、電話番号、メールアドレス、ジャンル
- 書類画像: 営業許可証、車検証、自動車検査証、PL保険、火器類配置図

#### CSVエクスポート
- 承認済み申し込みのみエクスポート
- エクスポート項目: 出店者情報、申し込み日時
- UTF-8 BOM付きCSV形式

---

### 7. ApplicationManagement（申し込み管理 - 出店者アプリ）

#### ファイルパス
`store/components/ApplicationManagement.tsx`

#### Props
```typescript
interface ApplicationManagementProps {
  userProfile: any
  onBack: () => void
}
```

#### State管理
```typescript
const [applications, setApplications] = useState<Application[]>([])
const [loading, setLoading] = useState(true)
```

#### 表示項目
- 申し込み一覧: イベント名、開催期間、会場、申し込み日時、ステータス
- ステータス表示:
  - `pending`: 承認待ち（黄色/オレンジ）
  - `approved`: 承認済み（緑色）
  - `rejected`: 却下（赤色）

#### レイアウト要件
- カード型レイアウト
- 各カードにイベント画像、イベント名、ステータスバッジを表示

---

### 8. NotificationBox（通知一覧）

#### ファイルパス
- 主催者アプリ: `organizer/components/NotificationBox.tsx`
- 出店者アプリ: `store/components/NotificationBox.tsx`

#### Props
```typescript
interface NotificationBoxProps {
  userProfile: any
  onBack: () => void
  onUnreadCountChange?: (count: number) => void
}
```

#### State管理
```typescript
const [notifications, setNotifications] = useState<Notification[]>([])
const [loading, setLoading] = useState(true)
const [unreadCount, setUnreadCount] = useState(0)
```

#### 表示項目
- 通知一覧: タイトル、メッセージ、日時、関連イベント名（存在する場合）
- 未読/既読の視覚的区別:
  - 未読: 背景色を変える、または左側にバーを表示
  - 既読: 通常の背景色

#### インタラクション
- 通知クリック → 既読にマーク、`onUnreadCountChange`コールバック呼び出し
- 関連イベントがある場合、クリックでイベント詳細へ遷移

#### 通知タイプ
- `application_received`: 出店申し込み受信（主催者へ）
- `application_approved`: 申し込み承認（出店者へ）
- `application_rejected`: 申し込み却下（出店者へ）

---

### 9. OrganizerProfile / ExhibitorProfile（プロフィール）

#### ファイルパス
- 主催者アプリ: `organizer/components/OrganizerProfile.tsx`
- 出店者アプリ: `store/components/ExhibitorProfile.tsx`

#### Props

**主催者アプリ:**
```typescript
interface OrganizerProfileProps {
  userProfile: LineProfile
}
```

**出店者アプリ:**
```typescript
interface ExhibitorProfileProps {
  userProfile: any
  onBack: () => void
}
```

#### State管理
```typescript
const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
const [exhibitorData, setExhibitorData] = useState<ExhibitorData | null>(null)
const [loading, setLoading] = useState(true)
const [isEditing, setIsEditing] = useState(false)
```

#### 表示項目

**主催者アプリ:**
- 会社名、名前、性別、年齢、電話番号、メールアドレス、承認状態

**出店者アプリ:**
- 名前、性別、年齢、電話番号、メールアドレス、ジャンル
- 書類画像: 営業許可証、車検証、自動車検査証、PL保険、火器類配置図

#### インタラクション
- 「編集」ボタン → `OrganizerEditForm` / `ExhibitorEditForm`を表示
- 編集完了 → プロフィール情報を更新

---

### 10. OrganizerEditForm / ExhibitorEditForm（プロフィール編集）

#### ファイルパス
- 主催者アプリ: `organizer/components/OrganizerEditForm.tsx`
- 出店者アプリ: `store/components/ExhibitorEditForm.tsx`

#### Props

**主催者アプリ:**
```typescript
interface OrganizerEditFormProps {
  organizer: OrganizerData
  onUpdateComplete: (updatedData: OrganizerData) => void
  onCancel: () => void
}
```

**出店者アプリ:**
```typescript
interface ExhibitorEditFormProps {
  exhibitor: ExhibitorData
  onUpdateComplete: (updatedData: ExhibitorData) => void
  onCancel: () => void
}
```

#### 機能要件
- 登録フォームと同様の入力項目
- 既存データを事前入力
- バリデーションは登録フォームと同じ
- 更新完了後、`onUpdateComplete`コールバックを呼び出し

---

### 11. ImageUpload（画像アップロード）

#### ファイルパス
- 主催者アプリ: `organizer/components/ImageUpload.tsx`
- 出店者アプリ: `store/components/ImageUpload.tsx`

#### Props
```typescript
interface ImageUploadProps {
  label: string
  documentType: string
  userId: string
  currentImageUrl?: string
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  onImageDelete?: () => void
  hasError?: boolean
}
```

#### 機能要件
- ドラッグ&ドロップ対応
- クリックでファイル選択
- 画像プレビュー表示
- アップロード中はローディング表示
- アップロード完了後、URLを`onUploadComplete`コールバックで返す
- 画像削除機能（`onImageDelete`コールバック）
- エラー表示（`hasError`が`true`の場合）

#### 対応形式
- JPEG, PNG, GIF, WebP, HEIC
- 最大ファイルサイズ: 10MB

---

### 12. LoadingSpinner（ローディング表示）

#### ファイルパス
- 主催者アプリ: `organizer/components/LoadingSpinner.tsx`
- 出店者アプリ: `store/components/LoadingSpinner.tsx`

#### Props
なし

#### レイアウト要件
- 画面中央に配置
- スピナーアニメーション（回転）
- 背景: #F7F7F7

---

### 13. EmailConfirmationBanner / EmailConfirmationPending（メール確認）

#### ファイルパス
- 主催者アプリ: `organizer/components/EmailConfirmationBanner.tsx`, `EmailConfirmationPending.tsx`
- 出店者アプリ: `store/components/EmailConfirmationBanner.tsx`, `EmailConfirmationPending.tsx`

#### 機能要件
- メール確認待ち状態を表示
- メール再送信機能（将来的に実装予定）

---

### デザイン実装時の注意事項

1. **既存のデザインシステムを参考にしつつ、完全に新しいデザインを作成**
2. **機能要件は必ず維持**（入力項目、バリデーション、インタラクションなど）
3. **レスポンシブ対応は必須**（モバイル、タブレット、デスクトップ）
4. **アクセシビリティを考慮**（キーボードナビゲーション、スクリーンリーダー対応）
5. **パフォーマンスを考慮**（不要なアニメーションは避ける）
6. **一貫性を保つ**（全コンポーネントで統一されたデザイン言語）

---

**最終更新日**: 2024年12月
**バージョン**: 1.0.0

