# DB初期化後のセットアップ手順

## 実行すべきSQL（順番に実行）

### 1. 基本テーブルの作成（必須）

**ファイル**: `supabase_schema_new.sql`

**内容**:
- `exhibitors`テーブル（出店者情報）
- `organizers`テーブル（主催者情報）- `line_user_id`カラム付き
- `events`テーブル（イベント情報）
- `event_applications`テーブル（出店申し込み）
- インデックスとRLSポリシー

**実行方法**:
1. Supabaseダッシュボードを開く
2. SQL Editorを開く
3. `supabase_schema_new.sql` の内容をコピーして実行

**✅ これが最も重要です！**

---

### 2. フォームドラフト機能のテーブル作成（必須）

**ファイル**: `supabase_form_drafts.sql`

**内容**:
- `form_drafts`テーブル（フォームの自動保存機能用）

**実行方法**:
1. SQL Editorを開く
2. `supabase_form_drafts.sql` の内容をコピーして実行

---

### 3. ストレージの設定（画像アップロード用）

**ファイル**: `supabase_storage_setup.sql`

**内容**:
- ストレージバケットの作成
- RLSポリシーの設定

**実行方法**:
1. SQL Editorを開く
2. `supabase_storage_setup.sql` の内容をコピーして実行

---

## 実行順序

1. ✅ **`supabase_schema_new.sql`** - 基本テーブル作成（必須）
2. ✅ **`supabase_form_drafts.sql`** - フォームドラフト機能（必須）
3. ✅ **`supabase_storage_setup.sql`** - ストレージ設定（画像アップロード用）

---

## 実行後の確認

### テーブルが作成されているか確認

Supabaseダッシュボードの「Table Editor」で以下が存在するか確認：

- ✅ `exhibitors` - 出店者情報
- ✅ `organizers` - 主催者情報（`line_user_id`カラムがあることを確認）
- ✅ `events` - イベント情報
- ✅ `event_applications` - 出店申し込み
- ✅ `form_drafts` - フォームドラフト

### ストレージバケットが作成されているか確認

Supabaseダッシュボードの「Storage」で以下が存在するか確認：

- ✅ `event-images` - イベント画像用
- ✅ `exhibitor-documents` - 出店者書類用
- ✅ `organizer-documents` - 主催者書類用

---

## 注意事項

- `organizer_migration_to_line_login_simple.sql` は**実行不要**です
  - `supabase_schema_new.sql` に既に`line_user_id`カラムが含まれているため

---

## まとめ

**実行すべきSQLは3つ**：

1. ✅ `supabase_schema_new.sql` （必須）
2. ✅ `supabase_form_drafts.sql` （必須）
3. ✅ `supabase_storage_setup.sql` （画像アップロード用）

これらを順番に実行すれば、データベースのセットアップが完了します！



