-- event_applicationsテーブルのRLSポリシー修正
-- LINE LoginユーザーとEmail認証ユーザーの両方から申し込みを許可する

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own applications" ON event_applications;
DROP POLICY IF EXISTS "Allow public select on event_applications" ON event_applications;
DROP POLICY IF EXISTS "Allow public insert on event_applications" ON event_applications;
DROP POLICY IF EXISTS "Allow public update on event_applications" ON event_applications;
DROP POLICY IF EXISTS "Allow public delete on event_applications" ON event_applications;

-- 新しいRLSポリシーを作成（パブリックアクセスを許可）
CREATE POLICY "Allow public select on event_applications" ON event_applications
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on event_applications" ON event_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on event_applications" ON event_applications
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on event_applications" ON event_applications
    FOR DELETE USING (true);

-- 確認メッセージ
DO $$
BEGIN
    RAISE NOTICE 'event_applicationsテーブルのRLSポリシーを更新しました';
    RAISE NOTICE 'パブリックアクセス（SELECT, INSERT, UPDATE, DELETE）を許可しました';
END $$;

