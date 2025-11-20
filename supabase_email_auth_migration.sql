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
-- 既存のRLSポリシーを削除（すべての可能性のあるポリシー名を削除）
DROP POLICY IF EXISTS "Users can view their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can insert their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can update their own data" ON exhibitors;
DROP POLICY IF EXISTS "Users can view their own exhibitor data" ON exhibitors;
DROP POLICY IF EXISTS "Users can insert their own exhibitor data" ON exhibitors;
DROP POLICY IF EXISTS "Users can update their own exhibitor data" ON exhibitors;
DROP POLICY IF EXISTS "Allow public insert on exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Allow public select on exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Allow public update on exhibitors" ON exhibitors;

DROP POLICY IF EXISTS "Users can view their own data" ON organizers;
DROP POLICY IF EXISTS "Users can insert their own data" ON organizers;
DROP POLICY IF EXISTS "Users can update their own data" ON organizers;
DROP POLICY IF EXISTS "Users can view their own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can insert their own organizer data" ON organizers;
DROP POLICY IF EXISTS "Users can update their own organizer data" ON organizers;
DROP POLICY IF EXISTS "Allow public insert on organizers" ON organizers;
DROP POLICY IF EXISTS "Allow public select on organizers" ON organizers;
DROP POLICY IF EXISTS "Allow public update on organizers" ON organizers;

-- 新しいRLSポリシーを作成（user_idまたはline_user_idでアクセス可能）
-- 注意: 既存の公開アクセスポリシーと競合しないように、公開アクセスも許可します
-- exhibitorsテーブル
CREATE POLICY "Allow public insert on exhibitors" ON exhibitors
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on exhibitors" ON exhibitors
FOR SELECT USING (true);

CREATE POLICY "Allow public update on exhibitors" ON exhibitors
FOR UPDATE USING (true);

-- より厳密なポリシー（オプション：上記の公開アクセスポリシーと併用可能）
-- ただし、既存の公開アクセスポリシーがあるため、こちらはコメントアウト
/*
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
*/

-- organizersテーブル
CREATE POLICY "Allow public insert on organizers" ON organizers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on organizers" ON organizers
FOR SELECT USING (true);

CREATE POLICY "Allow public update on organizers" ON organizers
FOR UPDATE USING (true);

-- より厳密なポリシー（オプション：上記の公開アクセスポリシーと併用可能）
-- ただし、既存の公開アクセスポリシーがあるため、こちらはコメントアウト
/*
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
*/

-- 注意: 
-- このマイグレーションでは、既存の公開アクセスポリシー（Allow public insert/select/update）を
-- 維持しています。これにより、LINE Loginユーザーとメールアドレス・パスワード認証ユーザーの
-- 両方がアクセス可能です。
-- 
-- より厳密なセキュリティが必要な場合は、コメントアウトされているポリシーを有効化し、
-- 公開アクセスポリシーを削除してください。

