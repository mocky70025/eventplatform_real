-- Supabase Storage 公開アクセス修正
-- このSQLをSupabaseのSQL Editorで実行してください

-- 1. 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Allow public upload to exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from event-images" ON storage.objects;

-- 2. バケットが公開アクセス可能か確認（必要に応じて設定）
-- 注意: バケットの設定はSupabase DashboardのStorageセクションで行う必要があります
-- Storage > exhibitor-documents > Settings > Public bucket を有効にする

-- 3. 新しいRLSポリシーを作成（公開アクセスを許可）
-- 出店者用書類バケット
CREATE POLICY "Allow public upload to exhibitor-documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public select from exhibitor-documents" ON storage.objects
FOR SELECT USING (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public update to exhibitor-documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public delete from exhibitor-documents" ON storage.objects
FOR DELETE USING (bucket_id = 'exhibitor-documents');

-- イベント画像バケット
CREATE POLICY "Allow public upload to event-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Allow public select from event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Allow public update to event-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'event-images');

CREATE POLICY "Allow public delete from event-images" ON storage.objects
FOR DELETE USING (bucket_id = 'event-images');

-- 4. form_draftsテーブルのRLSポリシーも修正
DROP POLICY IF EXISTS "Allow public insert on form_drafts" ON form_drafts;
DROP POLICY IF EXISTS "Allow public select on form_drafts" ON form_drafts;
DROP POLICY IF EXISTS "Allow public update on form_drafts" ON form_drafts;
DROP POLICY IF EXISTS "Allow public delete on form_drafts" ON form_drafts;

CREATE POLICY "Allow public insert on form_drafts" ON form_drafts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on form_drafts" ON form_drafts
FOR SELECT USING (true);

CREATE POLICY "Allow public update on form_drafts" ON form_drafts
FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on form_drafts" ON form_drafts
FOR DELETE USING (true);

