-- イベントの申し込み締め切り機能用のカラム追加

-- 申し込み締め切り状態を追加
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_application_closed BOOLEAN DEFAULT FALSE;

-- 申し込み締め切り日時を記録
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS application_closed_at TIMESTAMP WITH TIME ZONE;

-- インデックスを追加（締め切り状態で検索する場合に便利）
CREATE INDEX IF NOT EXISTS idx_events_is_application_closed ON events(is_application_closed);

-- コメントを追加
COMMENT ON COLUMN events.is_application_closed IS '申し込みが締め切られているかどうか（主催者が手動で締め切った場合、またはapplication_end_dateを過ぎた場合）';
COMMENT ON COLUMN events.application_closed_at IS '申し込みが締め切られた日時';

