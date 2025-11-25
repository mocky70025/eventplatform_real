-- イベントの申し込み締め切り機能をサポートするためのデータベース拡張

-- 1. eventsテーブルに申し込み締め切り状態を追加
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS application_closed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS application_closed_by UUID REFERENCES organizers(id);

-- 2. 申し込み締め切り時に生成されるスプレッドシート情報を保存
ALTER TABLE events
ADD COLUMN IF NOT EXISTS spreadsheet_id TEXT,
ADD COLUMN IF NOT EXISTS spreadsheet_url TEXT;

-- 3. インデックスの追加（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_events_application_closed_at ON events(application_closed_at);
CREATE INDEX IF NOT EXISTS idx_events_application_end_date ON events(application_end_date);

-- 4. コメントの追加（カラムの説明）
COMMENT ON COLUMN events.application_closed_at IS '申し込みが締め切られた日時（手動締め切りの場合）';
COMMENT ON COLUMN events.application_closed_by IS '申し込みを締め切った主催者のID';
COMMENT ON COLUMN events.spreadsheet_id IS 'GoogleスプレッドシートのID';
COMMENT ON COLUMN events.spreadsheet_url IS 'GoogleスプレッドシートのURL';

