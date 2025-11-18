-- 主催者向けアプリをLIFFから通常のWebサイトに移行するためのデータベースマイグレーション
-- このSQLを実行する前に、既存のデータをバックアップしてください

-- 1. organizersテーブルにuser_idカラムを追加（既存のline_user_idは保持）
-- 既存データとの互換性のため、NULLを許可します
ALTER TABLE organizers ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. user_idにインデックスを追加（NULL値も含む）
CREATE INDEX IF NOT EXISTS idx_organizers_user_id ON organizers(user_id);

-- 3. user_idにUNIQUE制約を追加（NULL値は複数許可されるため、部分インデックスを使用）
-- 注意: 既存のNULL値がある場合は、UNIQUE制約は適用されません
CREATE UNIQUE INDEX IF NOT EXISTS idx_organizers_user_id_unique ON organizers(user_id) WHERE user_id IS NOT NULL;

-- 4. RLSポリシーを更新（line_user_idからuser_idに変更）
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own data" ON organizers;

-- 新しいポリシーを作成（user_idを使用）
-- 注意: user_idがNULLの場合はアクセスできません（既存のLIFFユーザーは影響を受けます）
CREATE POLICY "Users can view their own data" ON organizers
    FOR ALL USING (auth.uid() = user_id);

-- 5. eventsテーブルのRLSポリシーも確認・更新
-- 既存のポリシーを確認
-- 必要に応じて、organizersテーブルのuser_idを使用するように更新してください

-- 注意事項:
-- - このマイグレーション後、新規登録時はSupabase AuthのユーザーIDをuser_idに設定してください
-- - 既存のLIFFユーザー（line_user_idのみ）は、新規登録時にSupabase Authでアカウントを作成し、
--   そのuser_idをorganizersテーブルに設定する必要があります
-- - line_user_idカラムは後で削除することもできますが、まずは両方を保持することをお勧めします
-- - 既存データの移行は手動で行う必要があります

