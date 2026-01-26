# 出店者向けイベントプラットフォーム - 完全実装プロンプト

## プロジェクト概要

出店者（exhibitor）向けのイベントプラットフォームアプリケーションを、Next.js 14 + Supabase + TypeScriptで実装してください。デザインはシンプルで機能重視、すべての機能が確実に動作することを最優先にしてください。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **認証・データベース**: Supabase
- **スタイリング**: インラインスタイル（シンプルなデザイン）
- **状態管理**: React Hooks (useState, useEffect)

## 環境変数

以下の環境変数が必要です：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID=your_line_channel_id
NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI=http://localhost:3002/auth/callback
```

## データベーススキーマ（Supabase）

### exhibitors テーブル
```sql
- id: uuid (primary key)
- name: text
- gender: text ('男', '女', 'それ以外')
- age: integer
- phone_number: text
- email: text
- genre_category: text (nullable)
- genre_free_text: text (nullable)
- business_license_image_url: text (nullable)
- vehicle_inspection_image_url: text (nullable)
- automobile_inspection_image_url: text (nullable)
- pl_insurance_image_url: text (nullable)
- fire_equipment_layout_image_url: text (nullable)
- user_id: uuid (nullable, Supabase AuthのユーザーID)
- line_user_id: text (nullable, LINE LoginのユーザーID)
- created_at: timestamp
- updated_at: timestamp
```

### events テーブル
```sql
- id: uuid (primary key)
- event_name: text
- event_name_furigana: text
- genre: text
- event_start_date: date
- event_end_date: date
- event_display_period: text
- event_time: text (nullable)
- lead_text: text
- event_description: text
- venue_name: text
- venue_city: text (nullable)
- venue_town: text (nullable)
- venue_address: text (nullable)
- main_image_url: text (nullable)
- main_image_caption: text (nullable)
- application_end_date: date (nullable)
- approval_status: text (nullable, 'approved' or null)
- created_at: timestamp
- updated_at: timestamp
```

### event_applications テーブル
```sql
- id: uuid (primary key)
- exhibitor_id: uuid (foreign key -> exhibitors.id)
- event_id: uuid (foreign key -> events.id)
- application_status: text ('pending', 'approved', 'rejected')
- applied_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

### notifications テーブル
```sql
- id: uuid (primary key)
- user_id: text (Supabase AuthのユーザーIDまたはLINEユーザーID)
- user_type: text ('exhibitor' or 'organizer')
- notification_type: text
- title: text
- message: text
- related_event_id: uuid (nullable)
- related_application_id: uuid (nullable)
- is_read: boolean (default: false)
- created_at: timestamp
```

## 実装すべき機能

### 1. 認証機能

#### 1.1 WelcomeScreen コンポーネント
- **パス**: `app/components/WelcomeScreen.tsx`
- **機能**:
  - ログイン/新規登録のタブ切り替え
  - LINEログインボタン（LINE OAuth）
  - Googleログインボタン（Supabase Google Auth）
  - メールアドレスログインボタン
  - メールアドレス新規登録ボタン
  - メールアドレス/パスワード入力フォーム
  - エラーメッセージ表示

#### 1.2 認証フロー
- **LINE認証**: `/api/auth/line-login` エンドポイントを使用
- **Google認証**: SupabaseのGoogle認証を使用
- **メール認証**: Supabaseのメール認証を使用
- **認証後の処理**: セッション管理、ユーザー情報の保存

#### 1.3 認証コールバック
- **パス**: `app/auth/callback/page.tsx`
- **機能**: LINE認証のコールバック処理

### 2. 情報登録フォーム

#### 2.1 RegistrationForm コンポーネント
- **パス**: `app/components/RegistrationForm.tsx`
- **機能**:
  - 3ステップのフォーム
  - **ステップ1**: 基本情報（名前、性別、年齢、電話番号、メールアドレス、ジャンル）
  - **ステップ2**: 書類アップロード（営業許可証、車検証、自賠責保険、消防設備配置図）
  - **ステップ3**: 利用規約確認
  - 進捗バー表示
  - フォームバリデーション
  - 画像アップロード機能
  - 下書き保存機能（sessionStorage）
  - Supabaseへの登録

### 3. ホーム画面

#### 3.1 ExhibitorHome コンポーネント
- **パス**: `app/components/ExhibitorHome.tsx`
- **機能**:
  - ヘッダー（「マイイベント」）
  - イベント一覧表示（承認済み、申し込み期間内のイベント）
  - イベントカード表示（イベント名、期間、場所、画像）
  - イベント詳細への遷移

### 4. イベント検索・詳細

#### 4.1 EventList コンポーネント
- **パス**: `app/components/EventList.tsx`
- **機能**:
  - 検索フォーム（キーワード、期間、都道府県、市区町村、ジャンル）
  - イベント一覧表示
  - イベント詳細表示
  - イベント申し込み機能
  - フィルタリング機能

### 5. プロフィール

#### 5.1 ExhibitorProfile コンポーネント
- **パス**: `app/components/ExhibitorProfile.tsx`
- **機能**:
  - プロフィール情報表示
  - プロフィール編集機能
  - 画像表示

#### 5.2 ExhibitorEditForm コンポーネント
- **パス**: `app/components/ExhibitorEditForm.tsx`
- **機能**:
  - プロフィール編集フォーム
  - 画像アップロード
  - 更新処理

### 6. 申し込み管理

#### 6.1 ApplicationManagement コンポーネント
- **パス**: `app/components/ApplicationManagement.tsx`
- **機能**:
  - 申し込み履歴一覧表示
  - ステータスフィルター（すべて、審査中、承認済み）
  - 申し込み詳細表示

### 7. 通知機能

#### 7.1 NotificationBox コンポーネント
- **パス**: `app/components/NotificationBox.tsx`
- **機能**:
  - 通知一覧表示
  - 未読通知数表示
  - 通知既読機能
  - 通知クリック時のアクション

### 8. メインアプリケーション

#### 8.1 app/page.tsx
- **機能**:
  - 認証状態の管理
  - 画面遷移の制御
  - ボトムナビゲーション
  - ローディング状態の管理
  - セッション管理

#### 8.2 認証フロー
1. セッションが無効な場合 → WelcomeScreenを表示
2. セッションが有効だが未登録の場合 → RegistrationFormを表示
3. セッションが有効で登録済みの場合 → ExhibitorHomeを表示

#### 8.3 ボトムナビゲーション
- 通知（未読数表示）
- 履歴（申し込み履歴）
- 検索（イベント検索）
- プロフィール

## 重要な実装ポイント

### 1. 認証ロジック
- **セッションが無効な場合、必ずsessionStorageをクリアしてWelcomeScreenを表示**
- セッションの有効性を厳密にチェック
- LINE認証、Google認証、メール認証のすべてに対応

### 2. エラーハンドリング
- すべてのAPI呼び出しでエラーハンドリングを実装
- ユーザーフレンドリーなエラーメッセージを表示
- ネットワークエラー時の適切な処理

### 3. データ取得
- Supabaseクエリのエラーハンドリング
- `approval_status`カラムが存在しない場合の対応
- ページネーション（必要に応じて）

### 4. 画像アップロード
- Supabase Storageを使用
- 画像のプレビュー機能
- アップロード進捗表示

### 5. 状態管理
- sessionStorageを使用した下書き保存
- 認証状態の管理
- ローディング状態の管理

## ファイル構造

```
store/
├── app/
│   ├── page.tsx                    # メインアプリケーション
│   ├── layout.tsx                  # レイアウト
│   ├── auth/
│   │   ├── callback/
│   │   │   └── page.tsx            # LINE認証コールバック
│   │   ├── verify-email/
│   │   │   └── page.tsx            # メール認証確認
│   │   ├── reset-password/
│   │   │   └── page.tsx            # パスワードリセット
│   │   └── update-password/
│   │       └── page.tsx            # パスワード更新
│   └── api/
│       ├── auth/
│       │   └── line-login/
│       │       └── route.ts        # LINE認証API
│       └── notifications/
│           ├── create/
│           │   └── route.ts        # 通知作成API
│           └── send-email/
│               └── route.ts        # メール送信API
├── components/
│   ├── WelcomeScreen.tsx           # ログイン/新規登録画面
│   ├── RegistrationForm.tsx        # 情報登録フォーム
│   ├── ExhibitorHome.tsx            # ホーム画面
│   ├── EventList.tsx                # イベント検索・詳細
│   ├── ExhibitorProfile.tsx         # プロフィール表示
│   ├── ExhibitorEditForm.tsx        # プロフィール編集
│   ├── ApplicationManagement.tsx    # 申し込み管理
│   ├── NotificationBox.tsx          # 通知一覧
│   ├── EventCard.tsx                # イベントカード
│   ├── ImageUpload.tsx              # 画像アップロード
│   ├── ProgressBar.tsx              # 進捗バー
│   ├── LoadingSpinner.tsx           # ローディングスピナー
│   ├── EmailConfirmationBanner.tsx  # メール確認バナー
│   └── EmailConfirmationPending.tsx # メール確認待ち
├── lib/
│   ├── supabase.ts                  # Supabaseクライアント
│   ├── auth.ts                      # 認証ユーティリティ
│   └── storage.ts                   # ストレージユーティリティ
└── package.json
```

## 実装の優先順位

1. **最優先**: 認証機能（WelcomeScreen、認証フロー）
2. **高**: 情報登録フォーム（RegistrationForm）
3. **高**: ホーム画面（ExhibitorHome）
4. **中**: イベント検索・詳細（EventList）
5. **中**: プロフィール（ExhibitorProfile、ExhibitorEditForm）
6. **中**: 申し込み管理（ApplicationManagement）
7. **低**: 通知機能（NotificationBox）

## デザイン方針

- **シンプルで機能重視**: デザインは最小限、機能が確実に動作することを優先
- **インラインスタイル**: CSSファイルは使わず、インラインスタイルで実装
- **モバイルファースト**: 393px幅のモバイル画面を基準に設計
- **基本的な色**: 白背景、グレーのテキスト、アクセントカラー（#5DABA8）

## 注意事項

1. **セッション管理**: セッションが無効な場合、必ずsessionStorageをクリアしてWelcomeScreenを表示
2. **エラーハンドリング**: すべてのAPI呼び出しでエラーハンドリングを実装
3. **型安全性**: TypeScriptの型を適切に定義
4. **パフォーマンス**: 不要な再レンダリングを避ける
5. **アクセシビリティ**: 基本的なアクセシビリティを考慮

## テスト項目

1. ログイン/新規登録が正常に動作するか
2. 情報登録フォームが正常に動作するか
3. イベント一覧が正常に表示されるか
4. イベント検索が正常に動作するか
5. イベント申し込みが正常に動作するか
6. プロフィール表示・編集が正常に動作するか
7. 申し込み履歴が正常に表示されるか
8. 通知機能が正常に動作するか

## 完成の定義

すべての機能が動作し、エラーなく使用できる状態。デザインはシンプルで問題なし。

