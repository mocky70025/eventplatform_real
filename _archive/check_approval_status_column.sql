-- approval_statusカラムの存在確認
-- SupabaseのSQL Editorで実行してください

-- 1. approval_statusカラムが存在するか確認
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'approval_status';

-- 2. 存在しない場合は追加
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

-- 3. 現在のイベントのapproval_statusを確認
SELECT id, event_name, approval_status
FROM events
ORDER BY created_at DESC
LIMIT 5;

