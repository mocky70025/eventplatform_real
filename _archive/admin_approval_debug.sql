-- adminアプリの承認機能のデバッグ用SQL
-- SupabaseのSQL Editorで実行してください

-- 1. approval_statusカラムが存在するか確認
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'approval_status';

-- 2. イベントのapproval_statusを確認
SELECT id, event_name, approval_status
FROM events
ORDER BY created_at DESC
LIMIT 5;

-- 3. RLSポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'events';

-- 4. テスト: 直接UPDATEを試す（RLSを無視）
-- 注意: これはService Role Keyを使う必要があります
-- UPDATE events SET approval_status = 'approved' WHERE id = '50514c17-8e6b-4088-819a-158060af0bc2';

-- 5. 現在のRLSポリシーを再確認
SELECT * FROM pg_policies WHERE tablename = 'events';

