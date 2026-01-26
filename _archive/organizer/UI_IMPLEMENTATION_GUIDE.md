# 主催者アプリ UI実装ガイド

このドキュメントには、主催者アプリの各ページを実装する際に必要な情報をまとめています。

## 📋 実装チェックリスト

### 共通事項

- [ ] デザインシステムの色を使用（Primary: #FF8A5C, Background: #E8F5F5）
- [ ] PC版対応（中央に393px幅のUIを配置、周囲は背景色で埋める）
- [ ] レスポンシブデザイン（`isDesktop` state を使用）
- [ ] エラーハンドリングの実装
- [ ] ローディング状態の表示
- [ ] アクセシビリティの考慮

---

## 🎨 各ページの実装詳細

### 1. WelcomeScreen（ログイン・新規登録画面）

**ファイル**: `organizer/components/WelcomeScreen.tsx`

#### 必要な機能
- [ ] ログイン/新規登録タブの切り替え
- [ ] Googleログイン（LINEログインはなし）
- [ ] メールアドレス/パスワードログイン
- [ ] メールアドレス/パスワード新規登録
- [ ] パスワードリセットリンク
- [ ] エラー表示

#### 必要なコンポーネント/ライブラリ
- `supabase` (認証)
- `@/lib/auth` (Google認証ヘルパー)
- `useState`, `useEffect` (React hooks)

#### 必要なAPI
- `supabase.auth.signInWithPassword()` - メール/パスワードログイン
- `supabase.auth.signUp()` - メール/パスワード新規登録
- `supabase.auth.signInWithOAuth()` - Googleログイン

#### 必要な環境変数
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` (使わないが、既存コードに含まれている可能性)
- `NEXT_PUBLIC_APP_URL`

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 1️⃣-5️⃣ を参照

---

### 2. RegistrationForm（主催者登録フォーム）

**ファイル**: `organizer/components/RegistrationForm.tsx`

#### 必要な機能
- [ ] ステップ1: 基本情報入力（会社名、名前、性別、年齢、電話番号、メールアドレス）
- [ ] ステップ2: 情報確認
- [ ] ステップ3: 登録完了
- [ ] プログレスインジケーター
- [ ] バリデーション
- [ ] 下書き保存機能（オプション）

#### 必要なデータベーステーブル
- `organizers` テーブル

#### 必要なフィールド
- `company_name` (string) - 会社名
- `name` (string) - お名前
- `gender` (string) - 性別（'男' | '女' | 'それ以外'）
- `age` (number) - 年齢
- `phone_number` (string) - 電話番号
- `email` (string) - メールアドレス
- `user_id` (string) - Supabase AuthのユーザーID（email認証の場合）
- `line_user_id` (string) - LINEユーザーID（LINE認証の場合、主催者アプリでは使用しない）

#### 必要なAPI
- `supabase.from('organizers').insert()` - 主催者情報の登録

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 6️⃣-8️⃣ を参照

---

### 3. EventManagement（イベント管理 - マイホーム）

**ファイル**: `organizer/components/EventManagement.tsx`

#### 必要な機能
- [ ] イベント一覧の表示
- [ ] 新規イベント作成ボタン
- [ ] イベント編集・削除
- [ ] ナビゲーションバー（イベント、登録情報、申し込み、通知）
- [ ] 未読通知数の表示

#### 必要なコンポーネント
- `EventList` - イベント一覧表示
- `EventForm` - イベント作成/編集フォーム
- `OrganizerProfile` - プロフィール表示
- `EventApplications` - 申し込み管理
- `NotificationBox` - 通知一覧

#### 必要なデータベーステーブル
- `events` テーブル
- `organizers` テーブル
- `notifications` テーブル

#### 必要なAPI
- `supabase.from('events').select()` - イベント一覧取得
- `supabase.from('events').select().eq('organizer_id', organizerId)` - 主催者のイベント取得
- `supabase.from('notifications').select()` - 通知取得

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 9️⃣ を参照

---

### 4. EventForm（イベント作成/編集フォーム）

**ファイル**: `organizer/components/EventForm.tsx`

#### 必要な機能
- [ ] ステップ1: 全部の情報入力（基本情報、開催期間、イベント詳細、連絡先、その他情報、画像アップロードを含む）
- [ ] ステップ2: 情報の確認
- [ ] ステップ3: 登録完了画面
- [ ] プログレスインジケーター
- [ ] バリデーション
- [ ] 下書き保存機能

#### 必要なデータベーステーブル
- `events` テーブル

#### 必要なフィールド
- `event_name` (string) - イベント名
- `event_name_furigana` (string) - イベント名（ふりがな）
- `genre` (string) - ジャンル
- `is_shizuoka_related` (boolean) - 静岡県職業能力開発協会関連イベント
- `newspaper_decline` (boolean) - 新聞掲載辞退
- `event_start_date` (date) - 開催開始日
- `event_end_date` (date) - 開催終了日
- `event_display_period` (string) - 表示期間
- `event_time` (string) - 開催時間
- `application_start_date` (date) - 出店者募集開始日
- `application_end_date` (date) - 出店者募集終了日
- `application_display_period` (string) - 出店者募集期間(表示用)
- `lead_text` (string) - リードテキスト
- `event_description` (text) - イベント説明
- `venue_name` (string) - 会場名
- `venue_postal_code` (string) - 郵便番号
- `venue_prefecture` (string) - 都道府県
- `venue_city` (string) - 市区町村
- `venue_address` (string) - 住所
- `venue_latitude` (number) - 緯度
- `venue_longitude` (number) - 経度
- `homepage_url` (string) - ホームページURL
- `related_page_url` (string) - 関連ページURL
- `contact_name` (string) - 連絡先担当者名
- `contact_phone` (string) - 連絡先電話番号
- `contact_email` (string) - 連絡先メールアドレス
- `parking_info` (text) - 駐車場情報
- `fee_info` (text) - 料金情報
- `organizer_info` (text) - 主催者情報
- `main_image_url` (string) - メイン画像URL
- `additional_image_1_url` (string) - 追加画像1
- `additional_image_2_url` (string) - 追加画像2
- `additional_image_3_url` (string) - 追加画像3
- `additional_image_4_url` (string) - 追加画像4

#### 必要なAPI
- `supabase.storage.from('event-images').upload()` - 画像アップロード
- `supabase.from('events').insert()` - イベント作成
- `supabase.from('events').update()` - イベント更新
- `supabase.from('events').delete()` - イベント削除

#### 必要なストレージバケット
- `event-images` - イベント画像用

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 🔟-1️⃣5️⃣ を参照

---

### 5. EventList（イベント一覧）

**ファイル**: `organizer/components/EventList.tsx`

#### 必要な機能
- [ ] イベントカードの表示
- [ ] イベント詳細の表示
- [ ] イベント編集ボタン
- [ ] イベント削除ボタン
- [ ] ステータス表示（公開中/非公開/審査中）
- [ ] 申し込み数の表示

#### 必要なデータベーステーブル
- `events` テーブル
- `event_applications` テーブル（申し込み数のカウント用）

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 1️⃣6️⃣ を参照（EventDetailとして）

---

### 6. EventApplications（申し込み管理）

**ファイル**: `organizer/components/EventApplications.tsx`

#### 必要な機能
- [ ] 申し込み一覧の表示
- [ ] ステータス別フィルタリング（すべて/承認待ち/承認済み/却下）
- [ ] 承認ボタン
- [ ] 却下ボタン
- [ ] 申し込み詳細の表示
- [ ] 出店者情報の表示

#### 必要なデータベーステーブル
- `event_applications` テーブル
- `exhibitors` テーブル（出店者情報取得用）
- `events` テーブル（イベント情報取得用）

#### 必要なAPI
- `supabase.from('event_applications').select()` - 申し込み一覧取得
- `supabase.from('event_applications').update()` - ステータス更新（承認/却下）
- `supabase.from('notifications').insert()` - 通知作成（承認/却下時）

#### 必要なAPI Route
- `/api/notifications/create` - 通知作成API

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 1️⃣7️⃣ を参照

---

### 7. OrganizerProfile（プロフィール表示・編集）

**ファイル**: `organizer/components/OrganizerProfile.tsx`

#### 必要な機能
- [ ] プロフィール情報の表示（会社名、名前、性別、年齢、電話番号、メールアドレス）
- [ ] プロフィール編集モード
- [ ] プロフィール更新
- [ ] バリデーション

#### 必要なデータベーステーブル
- `organizers` テーブル

#### 必要なAPI
- `supabase.from('organizers').select()` - プロフィール取得
- `supabase.from('organizers').update()` - プロフィール更新

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 1️⃣8️⃣-1️⃣9️⃣ を参照

---

### 8. NotificationBox（通知一覧）

**ファイル**: `organizer/components/NotificationBox.tsx`

#### 必要な機能
- [ ] 通知一覧の表示
- [ ] 未読/既読の区別
- [ ] 通知をタップして既読にする
- [ ] 通知タイプ別アイコン表示
- [ ] 日時表示

#### 必要なデータベーステーブル
- `notifications` テーブル

#### 必要なAPI
- `supabase.from('notifications').select()` - 通知取得
- `supabase.from('notifications').update()` - 既読更新

#### 通知タイプ
- `application_submitted` - 申し込み受付
- `application_approved` - 承認通知（これは出店者向けなので、主催者アプリでは使わないかも）
- その他カスタム通知タイプ

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 2️⃣0️⃣ を参照

---

### 9. EmailConfirmationBanner（メール確認バナー）

**ファイル**: `organizer/components/EmailConfirmationBanner.tsx`

#### 必要な機能
- [ ] メール確認が必要な場合に表示
- [ ] 再送信ボタン
- [ ] 閉じるボタン

#### 必要なAPI
- `supabase.auth.resend()` - 確認メール再送信

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 2️⃣1️⃣ を参照

---

### 10. EmailConfirmationPending（メール確認待ち画面）

**ファイル**: `organizer/components/EmailConfirmationPending.tsx`

#### 必要な機能
- [ ] メール確認待ちメッセージの表示
- [ ] 再送信ボタン
- [ ] 確認メールの送信状況表示

#### 必要なAPI
- `supabase.auth.resend()` - 確認メール再送信

#### SVGデザイン
- `SVG_DESIGNS_ORGANIZER.md` の 2️⃣2️⃣ を参照

---

## 🔧 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + インラインスタイル
- **状態管理**: React hooks (useState, useEffect)

### バックエンド
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage
- **API**: Next.js API Routes

### 外部サービス
- **Google OAuth**: Googleログイン用
- **Resend**: メール送信用（オプション）

---

## 📦 必要なパッケージ

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^3.3.6"
  }
}
```

---

## 🔐 必要な環境変数

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # API Routes用

# Google OAuth設定
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# アプリURL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# メール送信（オプション）
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@your-domain.com
```

---

## 🎨 デザインシステム

### カラーパレット
- **Primary**: #FF8A5C（オレンジ）
- **Secondary**: #FF8A5C（オレンジ）
- **Background**: #E8F5F5（薄い青緑）
- **Text Primary**: #2C3E50
- **Text Secondary**: #6C757D
- **Border**: #E9ECEF
- **White**: #FFFFFF
- **Gray (Inactive)**: #666666

### シャドウ
- **カード・ボタン**: `rgba(0, 0, 0, 0.08)` (8% opacity black)
- **実装**: `boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'`

### フォント
- **フォントファミリー**: Arial, 'Noto Sans JP', sans-serif
- **フォントサイズ**: タイトル 18px, 本文 14px, サブテキスト 12px
- **フォントウェイト**: タイトル 600, 本文 400

### 角丸
- **カード**: 12px
- **ボタン**: 12px
- **入力フィールド**: 8px

---

## 📱 レスポンシブデザイン

### PC版対応
- 画面幅が1024px以上の場合は、中央に393px幅のUIを配置
- 周囲の空白部分は背景色（#E8F5F5）で埋める
- `isDesktop` state を使用して判定

### 実装パターン
```tsx
const [isDesktop, setIsDesktop] = useState(false)

useEffect(() => {
  const checkScreenSize = () => {
    setIsDesktop(window.innerWidth >= 1024)
  }
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  return () => window.removeEventListener('resize', checkScreenSize)
}, [])

// レイアウト
<div style={{
  minHeight: '100vh',
  width: '100%',
  background: '#E8F5F5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: isDesktop ? '40px 20px' : 0
}}>
  <div style={{
    width: '100%',
    maxWidth: '393px',
    background: '#E8F5F5',
    minHeight: isDesktop ? 'auto' : '100vh'
  }}>
    {/* コンテンツ */}
  </div>
</div>
```

---

## 📝 実装時の注意点

1. **出店者アプリとの違い**
   - LINEログインはなし（Googleとメール/パスワードのみ）
   - 登録フォームに書類アップロードはなし
   - カラーパレットが異なる（Primary: #FF8A5C, Background: #E8F5F5）

2. **デザイン一貫性**
   - 出店者アプリと同じデザインパターンを使用
   - 色のみ変更（メインカラーと背景色）

3. **エラーハンドリング**
   - すべてのAPI呼び出しでエラーハンドリングを実装
   - ユーザーフレンドリーなエラーメッセージを表示

4. **パフォーマンス**
   - 画像の遅延読み込み
   - 適切なキャッシュ戦略

5. **アクセシビリティ**
   - 適切なaria-labelの使用
   - キーボードナビゲーションのサポート
   - コントラスト比の確保

---

## 📚 参考資料

- [SVGデザインストア](./SVG_DESIGNS_ORGANIZER.md) - 各画面のSVGデザイン
- [出店者アプリ実装](./store/components/) - 実装パターンの参考
- [Supabaseドキュメント](https://supabase.com/docs)
- [Next.jsドキュメント](https://nextjs.org/docs)

---

## ✅ 実装完了チェックリスト

各ページ実装後、以下を確認：

- [ ] SVGデザインと一致しているか
- [ ] PC版・スマホ版の両方で正常に表示されるか
- [ ] エラーハンドリングが実装されているか
- [ ] ローディング状態が適切に表示されるか
- [ ] バリデーションが実装されているか
- [ ] アクセシビリティ要件を満たしているか
- [ ] パフォーマンスが最適化されているか

