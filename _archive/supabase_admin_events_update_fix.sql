-- adminアプリでイベントの承認・却下ができるようにするためのRLSポリシー修正
-- SupabaseのSQL Editorで実行してください

-- 1. 既存のUPDATEポリシーを削除
DROP POLICY IF EXISTS "Allow public update on events" ON events;

-- 2. 新しいUPDATEポリシーを作成（すべてのUPDATEを許可）
CREATE POLICY "Allow public update on events" ON events
    FOR UPDATE USING (true) WITH CHECK (true);

-- 3. ポリシーが正しく作成されたか確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'events' AND cmd = 'UPDATE';

-- 4. approval_statusカラムが存在するか確認（存在しない場合は追加）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE events 
    ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (approval_status IN ('pending','approved','rejected'));
    
    -- 既存レコードのNULLをpendingに設定
    UPDATE events SET approval_status = 'pending' WHERE approval_status IS NULL;
    
    RAISE NOTICE 'approval_statusカラムを追加しました';
  ELSE
    RAISE NOTICE 'approval_statusカラムは既に存在します';
  END IF;
END $$;

-- 5. テスト: 直接UPDATEを試す（匿名キーで実行可能か確認）
-- このクエリは実行しないでください（テスト用）
-- UPDATE events SET approval_status = 'approved' WHERE id = 'your-event-id';
