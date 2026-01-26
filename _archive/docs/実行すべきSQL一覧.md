# 実行すべきSQL一覧

## 現在の状況

- store側（出店者）: `exhibitors`テーブルに`line_user_id`カラムがある ✅
- organizer側（主催者）: `organizers`テーブルに`line_user_id`カラムを追加する必要がある ⚠️
- フォームドラフト機能: `form_drafts`テーブルが必要 ⚠️

---

## 実行すべきSQL（順番に実行）

### 1. organizer側のLINE Login対応（必須）

**ファイル**: `organizer_migration_to_line_login_simple.sql`

**内容**:
- `organizers`テーブルに`line_user_id`カラムを追加
- インデックスとユニーク制約を追加
- RLSポリシーを簡略化

**実行方法**:
1. Supabaseダッシュボードを開く
2. SQL Editorを開く
3. `organizer_migration_to_line_login_simple.sql` の内容をコピーして実行

**✅ これが最も重要です！**

---

### 2. フォームドラフト機能（既に実行済みの可能性あり）

**ファイル**: `supabase_form_drafts.sql`

**内容**:
- `form_drafts`テーブルを作成（フォームの自動保存機能用）

**実行方法**:
1. SupabaseダッシュボードでSQL Editorを開く
2. `supabase_form_drafts.sql` の内容をコピーして実行

**確認方法**:
- Supabaseダッシュボードの「Table Editor」で`form_drafts`テーブルが存在するか確認

---

## 実行不要なSQL

以下のSQLは実行**不要**です：

- ❌ `supabase_schema_new.sql` - 新規プロジェクト用（既存プロジェクトでは不要）
- ❌ `supabase_schema.sql` - 古いスキーマ（既に実行済みの可能性）
- ❌ `organizer_migration_to_line_login.sql` - 複雑版（`organizer_migration_to_line_login_simple.sql`を使用）
- ❌ `organizer_migration_to_web.sql` - 古いマイグレーション（不要）

---

## 実行順序

1. **まず**: `organizer_migration_to_line_login_simple.sql` を実行
2. **次に**: `supabase_form_drafts.sql` を実行（まだ実行していない場合）

---

## 確認方法

### organizersテーブルに`line_user_id`カラムがあるか確認

Supabaseダッシュボードで：
1. 「Table Editor」を開く
2. `organizers`テーブルを選択
3. カラム一覧に`line_user_id`があるか確認

### form_draftsテーブルがあるか確認

Supabaseダッシュボードで：
1. 「Table Editor」を開く
2. `form_drafts`テーブルが存在するか確認

---

## まとめ

**実行すべきSQLは2つだけ**：

1. ✅ `organizer_migration_to_line_login_simple.sql` （必須）
2. ✅ `supabase_form_drafts.sql` （まだ実行していない場合）

これらを実行すれば、LINE Login対応が完了します！



