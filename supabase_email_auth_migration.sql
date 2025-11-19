-- メールアドレス・パスワード認証対応のマイグレーション
-- このSQLをSupabaseのSQL Editorで実行してください

-- 1. exhibitorsテーブルにuser_idカラムを追加（Supabase AuthのユーザーIDを保存）
ALTER TABLE exhibitors 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. organizersテーブルにuser_idカラムを追加（Supabase AuthのユーザーIDを保存）
ALTER TABLE organizers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. インデックスの追加
CREATE INDEX IF NOT EXISTS idx_exhibitors_user_id ON exhibitors(user_id);
CREATE INDEX IF NOT EXISTS idx_organizers_user_id ON organizers(user_id);

-- 4. RLSポリシーの更新（user_idを使用したアクセス制御）
-- 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Users can view their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can insert their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can update their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can view their own data" ON organizers;
DROP POLICY IF EXISTS "Users can insert their own data" ON organizers;
DROP POLICY IF EXISTS "Users can update their own data" ON organizers;

-- 新しいRLSポリシーを作成（user_idまたはline_user_idでアクセス可能）
-- exhibitorsテーブル
CREATE POLICY "Users can view their own exhibitor data" ON exhibitors
FOR SELECT USING (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

CREATE POLICY "Users can insert their own exhibitor data" ON exhibitors
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

CREATE POLICY "Users can update their own exhibitor data" ON exhibitors
FOR UPDATE USING (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

-- organizersテーブル
CREATE POLICY "Users can view their own organizer data" ON organizers
FOR SELECT USING (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

CREATE POLICY "Users can insert their own organizer data" ON organizers
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

CREATE POLICY "Users can update their own organizer data" ON organizers
FOR UPDATE USING (
  auth.uid() = user_id OR 
  (line_user_id IS NOT NULL AND line_user_id = auth.uid()::text)
);

-- 注意: 既存の公開アクセスポリシー（Allow public insert/select/update）が存在する場合は、
-- 上記のポリシーと競合する可能性があります。
-- 必要に応じて、既存の公開アクセスポリシーを削除してください。

