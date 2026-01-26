-- Supabase Storage 完全セットアップ
-- このSQLをSupabaseのSQL Editorで実行してください

-- ============================================
-- 1. バケットの作成
-- ============================================

-- 1-1. 既存のバケットを削除（存在する場合）
DELETE FROM storage.buckets WHERE id = 'exhibitor-documents';
DELETE FROM storage.buckets WHERE id = 'event-images';

-- 1-2. 出店者用書類バケットを作成（公開アクセス可能）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exhibitor-documents',
  'exhibitor-documents',
  true, -- 公開アクセスを許可（LINE Loginユーザーも使用可能）
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
);

-- 1-3. イベント画像バケットを作成（公開アクセス可能）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true, -- 公開アクセスを許可
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
);

-- ============================================
-- 2. RLSポリシーの設定（公開アクセスを許可）
-- ============================================

-- 2-1. 既存のRLSポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Allow public upload to exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from exhibitor-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select from event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from event-images" ON storage.objects;

-- 2-2. 出店者用書類バケットのRLSポリシー（公開アクセスを許可）
CREATE POLICY "Allow public upload to exhibitor-documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public select from exhibitor-documents" ON storage.objects
FOR SELECT USING (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public update to exhibitor-documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'exhibitor-documents');

CREATE POLICY "Allow public delete from exhibitor-documents" ON storage.objects
FOR DELETE USING (bucket_id = 'exhibitor-documents');

-- 2-3. イベント画像バケットのRLSポリシー（公開アクセスを許可）
CREATE POLICY "Allow public upload to event-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Allow public select from event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Allow public update to event-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'event-images');

CREATE POLICY "Allow public delete from event-images" ON storage.objects
FOR DELETE USING (bucket_id = 'event-images');

