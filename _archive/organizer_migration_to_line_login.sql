-- organizer側をLINE Login対応に変更するためのマイグレーション

-- 1. organizersテーブルにline_user_idカラムを追加
ALTER TABLE organizers
ADD COLUMN IF NOT EXISTS line_user_id TEXT;

-- 2. line_user_idにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_organizers_line_user_id ON organizers(line_user_id);

-- 3. line_user_idにユニーク制約を追加（NULLを許可）
CREATE UNIQUE INDEX IF NOT EXISTS idx_organizers_line_user_id_unique 
ON organizers(line_user_id) 
WHERE line_user_id IS NOT NULL;

-- 4. RLSポリシーを更新（line_user_idを使用）
-- 既存のRLSポリシーを削除（必要に応じて）
DROP POLICY IF EXISTS "Users can view own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can insert own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can update own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can view own organizer data by line_user_id" ON organizers;
DROP POLICY IF EXISTS "Users can insert own organizer data by line_user_id" ON organizers;
DROP POLICY IF EXISTS "Users can update own organizer data by line_user_id" ON organizers;

-- 新しいRLSポリシーを作成（line_user_idを使用）
-- 注意: 既存のuser_idベースのポリシーがある場合は、それも残しておく必要があります

-- SELECTポリシー（line_user_idまたはuser_idで認証）
-- 簡易版: 認証済みユーザーは自分のデータを閲覧可能
CREATE POLICY "Users can view own organizer data by line_user_id"
ON organizers
FOR SELECT
USING (
  -- line_user_idが設定されている場合、それでチェック
  (line_user_id IS NOT NULL AND line_user_id = current_setting('app.line_user_id', true))
  OR
  -- user_idが設定されている場合、それでチェック
  (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
  OR
  -- 開発環境用: 認証済みユーザーは全員閲覧可能（本番環境では削除推奨）
  auth.role() = 'authenticated'
);

-- INSERTポリシー
CREATE POLICY "Users can insert own organizer data by line_user_id"
ON organizers
FOR INSERT
WITH CHECK (
  -- line_user_idが設定されている場合、それでチェック
  (line_user_id IS NOT NULL AND line_user_id = current_setting('app.line_user_id', true))
  OR
  -- user_idが設定されている場合、それでチェック
  (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
  OR
  -- 開発環境用: 認証済みユーザーは全員挿入可能（本番環境では削除推奨）
  auth.role() = 'authenticated'
);

-- UPDATEポリシー
CREATE POLICY "Users can update own organizer data by line_user_id"
ON organizers
FOR UPDATE
USING (
  -- line_user_idが設定されている場合、それでチェック
  (line_user_id IS NOT NULL AND line_user_id = current_setting('app.line_user_id', true))
  OR
  -- user_idが設定されている場合、それでチェック
  (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
  OR
  -- 開発環境用: 認証済みユーザーは全員更新可能（本番環境では削除推奨）
  auth.role() = 'authenticated'
)
WITH CHECK (
  -- line_user_idが設定されている場合、それでチェック
  (line_user_id IS NOT NULL AND line_user_id = current_setting('app.line_user_id', true))
  OR
  -- user_idが設定されている場合、それでチェック
  (user_id IS NOT NULL AND user_id::text = auth.uid()::text)
  OR
  -- 開発環境用: 認証済みユーザーは全員更新可能（本番環境では削除推奨）
  auth.role() = 'authenticated'
);

-- 注意: 
-- 1. 既存のuser_idベースのRLSポリシーがある場合は、それも残しておく必要があります
-- 2. current_setting('app.line_user_id', true)は、アプリケーション側で設定する必要があります
-- 3. より簡単な方法として、RLSポリシーを無効化するか、認証済みユーザー全員にアクセスを許可することもできます

