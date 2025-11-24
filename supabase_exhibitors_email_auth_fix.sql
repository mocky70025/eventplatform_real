-- exhibitorsテーブルのメール認証対応RLSポリシー
-- このSQLをSupabaseのSQL Editorで実行してください
-- 注意: 先に supabase_exhibitors_add_user_id.sql を実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own data" ON exhibitors;
DROP POLICY IF EXISTS "Allow public insert on exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Allow public select on exhibitors" ON exhibitors;
DROP POLICY IF EXISTS "Allow public update on exhibitors" ON exhibitors;

-- 公開アクセスを許可するポリシー（新規登録時に必要）
CREATE POLICY "Allow public insert on exhibitors" ON exhibitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on exhibitors" ON exhibitors
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on exhibitors" ON exhibitors
    FOR UPDATE USING (true);

-- 認証済みユーザーが自分のデータを操作できるポリシー（既存データ用）
CREATE POLICY "Users can view their own exhibitor data" ON exhibitors
    FOR ALL USING (
        auth.uid()::text = line_user_id OR 
        auth.uid() = user_id
    );

