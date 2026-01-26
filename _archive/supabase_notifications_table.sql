-- 通知テーブルの作成
-- SupabaseのSQL Editorで実行してください

-- 通知テーブル
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- 出店者のuser_idまたはline_user_id、主催者のuser_idまたはline_user_id
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('exhibitor', 'organizer')), -- ユーザータイプ
    notification_type VARCHAR(50) NOT NULL, -- 通知タイプ（'application_received', 'application_approved', 'application_rejected'など）
    title VARCHAR(200) NOT NULL, -- 通知タイトル
    message TEXT NOT NULL, -- 通知メッセージ
    related_event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- 関連するイベントID
    related_application_id UUID REFERENCES event_applications(id) ON DELETE CASCADE, -- 関連する申し込みID
    is_read BOOLEAN DEFAULT FALSE, -- 既読フラグ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS（Row Level Security）の設定
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLSポリシー：パブリックアクセスを許可（認証タイプに応じて適切にフィルタリング）
DROP POLICY IF EXISTS "Allow public select on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public insert on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public update on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public delete on notifications" ON notifications;

CREATE POLICY "Allow public select on notifications" ON notifications
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on notifications" ON notifications
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on notifications" ON notifications
    FOR DELETE USING (true);

-- コメントを追加
COMMENT ON TABLE notifications IS 'ユーザーへの通知を管理するテーブル';
COMMENT ON COLUMN notifications.user_id IS 'ユーザーID（user_idまたはline_user_id）';
COMMENT ON COLUMN notifications.user_type IS 'ユーザータイプ（exhibitorまたはorganizer）';
COMMENT ON COLUMN notifications.notification_type IS '通知タイプ（application_received, application_approved, application_rejectedなど）';
COMMENT ON COLUMN notifications.is_read IS '既読フラグ（true: 既読, false: 未読）';

