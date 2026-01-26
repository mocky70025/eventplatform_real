# 新しいSupabaseプロジェクトセットアップ手順

## 概要
クリーンな状態から新しいSupabaseプロジェクトを作成し、すべてのスキーマと設定を適用する手順です。

## ステップ1: 新しいSupabaseプロジェクトの作成

1. **Supabaseダッシュボードにアクセス**
   - https://app.supabase.com にログイン

2. **新しいプロジェクトを作成**
   - 「New Project」をクリック
   - プロジェクト名を入力（例: `tomorrow-event-platform`）
   - データベースパスワードを設定（安全なパスワードを推奨）
   - リージョンを選択（日本: `Northeast Asia (Tokyo)`）
   - 「Create new project」をクリック

3. **プロジェクトの準備完了を待つ**
   - 数分かかります（通常2-3分）

## ステップ2: 環境変数の取得

1. **プロジェクト設定を開く**
   - 左メニューから「Settings」→「API」を選択

2. **必要な情報をコピー**
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **環境変数ファイルを更新**
   - プロジェクトルートに `.env.local` ファイルを作成（または既存のものを更新）
   ```bash
   # Supabase設定
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # LINE LIFF設定（出店者用のみ）
   NEXT_PUBLIC_LIFF_ID=your_liff_id
   ```

## ステップ3: データベーススキーマの適用

### 3-1. 基本スキーマの作成

1. **SQL Editorを開く**
   - 左メニューから「SQL Editor」を選択
   - 「New query」をクリック

2. **基本スキーマを実行**
   - `supabase_schema_new.sql` の内容をコピーして実行
   - または、以下の順番で実行：
     - `supabase_schema.sql`（基本テーブル）
     - `supabase_form_drafts.sql`（フォームドラフトテーブル）

### 3-2. 主催者向けWeb移行対応

1. **主催者テーブルの更新**
   - `organizer_migration_to_web.sql` を実行
   - `organizers`テーブルに`user_id`カラムを追加

## ステップ4: ストレージの設定

1. **Storageを開く**
   - 左メニューから「Storage」を選択

2. **バケットを作成**
   - 「Create bucket」をクリック
   - バケット名: `event-images`（または任意の名前）
   - Public bucket: ✅ チェック（画像を公開するため）
   - 「Create bucket」をクリック

3. **ストレージポリシーを設定**
   - `supabase_storage_setup.sql` を実行（必要に応じて）

## ステップ5: RLSポリシーの確認

1. **RLSポリシーの確認**
   - 各テーブルでRLSが有効になっているか確認
   - 必要に応じて `supabase_rls_fix.sql` を実行

## ステップ6: 動作確認

### 6-1. テーブルの確認

```sql
-- すべてのテーブルを確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

以下のテーブルが存在することを確認：
- `exhibitors`
- `organizers`
- `events`
- `event_applications`
- `form_drafts`

### 6-2. カラムの確認

```sql
-- organizersテーブルのカラムを確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'organizers'
ORDER BY ordinal_position;
```

`user_id`カラムが存在することを確認

### 6-3. インデックスの確認

```sql
-- インデックスを確認
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('exhibitors', 'organizers', 'events', 'event_applications');
```

## ステップ7: アプリケーションの動作確認

1. **開発サーバーを起動**
   ```bash
   # 出店者用
   cd store
   npm run dev
   
   # 主催者用（別ターミナル）
   cd organizer
   npm run dev
   ```

2. **動作確認**
   - 出店者用: http://localhost:3001
   - 主催者用: http://localhost:3002
   - ログイン・新規登録が正常に動作するか確認

## ステップ8: Vercel環境変数の設定（デプロイ時）

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - 該当プロジェクトを選択

2. **環境変数を設定**
   - 「Settings」→「Environment Variables」を選択
   - 以下の環境変数を追加：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_LIFF_ID`（出店者用のみ）

3. **再デプロイ**
   - 「Deployments」タブから最新のデプロイを選択
   - 「Redeploy」をクリック

## トラブルシューティング

### エラー: "relation already exists"
- テーブルが既に存在する場合は、`DROP TABLE IF EXISTS` を使用するか、既存のテーブルを削除

### エラー: "permission denied"
- Supabaseの管理者権限で実行しているか確認
- RLSポリシーが正しく設定されているか確認

### エラー: "column does not exist"
- スキーマが正しく適用されているか確認
- カラム名のタイポがないか確認

## 注意事項

⚠️ **重要**: 
- 本番環境で使用する前に、必ずテスト環境で動作確認を行ってください
- 既存データがある場合は、バックアップを取得してから移行してください
- 環境変数は機密情報のため、`.env.local`を`.gitignore`に追加してください

## 次のステップ

- [ ] 新しいSupabaseプロジェクトを作成
- [ ] 環境変数を設定
- [ ] データベーススキーマを適用
- [ ] ストレージを設定
- [ ] 動作確認
- [ ] Vercel環境変数を設定（デプロイ時）




