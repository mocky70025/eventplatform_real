-- organizersテーブルの公開アクセスを許可するRLSポリシー
-- このSQLをSupabaseのSQL Editorで実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Allow public insert on organizers" ON organizers;
DROP POLICY IF EXISTS "Allow public select on organizers" ON organizers;
DROP POLICY IF EXISTS "Allow public update on organizers" ON organizers;
DROP POLICY IF EXISTS "Users can view their own data" ON organizers;

-- 公開アクセスを許可するポリシーを作成
CREATE POLICY "Allow public insert on organizers" ON organizers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on organizers" ON organizers
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on organizers" ON organizers
    FOR UPDATE USING (true);

-- 認証済みユーザーが自分のデータを操作できるポリシーも追加（既存データ用）
CREATE POLICY "Users can view their own organizer data" ON organizers
    FOR ALL USING (
        auth.uid()::text = line_user_id OR 
        auth.uid() = user_id
    );

