-- organizer側をLINE Login対応に変更するためのマイグレーション（簡易版）

-- 1. organizersテーブルにline_user_idカラムを追加
ALTER TABLE organizers
ADD COLUMN IF NOT EXISTS line_user_id TEXT;

-- 2. line_user_idにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_organizers_line_user_id ON organizers(line_user_id);

-- 3. line_user_idにユニーク制約を追加（NULLを許可）
CREATE UNIQUE INDEX IF NOT EXISTS idx_organizers_line_user_id_unique 
ON organizers(line_user_id) 
WHERE line_user_id IS NOT NULL;

-- 4. RLSポリシーを簡略化（開発環境用）
-- 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Users can view own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can insert own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can update own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can view own organizer data by line_user_id" ON organizers;
DROP POLICY IF EXISTS "Users can insert own organizer data by line_user_id" ON organizers;
DROP POLICY IF EXISTS "Users can update own organizer data by line_user_id" ON organizers;

-- 簡易版: 認証済みユーザー全員にアクセスを許可（開発環境用）
-- 本番環境では、アプリケーション側で認証を処理することを推奨

CREATE POLICY "Allow authenticated users to view organizers"
ON organizers
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert organizers"
ON organizers
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update organizers"
ON organizers
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 注意: 
-- 1. このポリシーは開発環境用です。本番環境では、より厳格なポリシーを設定してください。
-- 2. アプリケーション側で、line_user_idを使用して認証を処理することを推奨します。
-- 3. 本番環境では、RLSを有効にしたまま、アプリケーション側で適切な認証チェックを行うことを推奨します。



