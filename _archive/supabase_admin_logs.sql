-- 管理者操作ログテーブル
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'login', 'logout', 'approve_organizer', 'reject_organizer', 'approve_event', 'reject_event'
  target_type TEXT, -- 'organizer', 'event', null
  target_id UUID, -- 対象のID（主催者やイベントのID）
  target_name TEXT, -- 対象の名前（主催者名やイベント名）
  details JSONB, -- 追加の詳細情報
  ip_address TEXT, -- IPアドレス
  user_agent TEXT, -- ブラウザ情報
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_email ON admin_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_id ON admin_logs(target_id);

-- RLSポリシー（管理者のみ閲覧可能）
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 全ての管理者が全てのログを閲覧可能
CREATE POLICY "管理者は全てのログを閲覧可能"
  ON admin_logs
  FOR SELECT
  USING (true);

-- ログの挿入は誰でも可能（アプリケーション側で制御）
CREATE POLICY "ログの挿入を許可"
  ON admin_logs
  FOR INSERT
  WITH CHECK (true);

-- コメント追加
COMMENT ON TABLE admin_logs IS '管理者の操作ログを記録するテーブル';
COMMENT ON COLUMN admin_logs.admin_email IS '操作を行った管理者のメールアドレス';
COMMENT ON COLUMN admin_logs.action_type IS '操作の種類（login, logout, approve_organizer等）';
COMMENT ON COLUMN admin_logs.target_type IS '操作対象のタイプ（organizer, event等）';
COMMENT ON COLUMN admin_logs.target_id IS '操作対象のID';
COMMENT ON COLUMN admin_logs.target_name IS '操作対象の名前';
COMMENT ON COLUMN admin_logs.details IS '追加の詳細情報（JSON形式）';
COMMENT ON COLUMN admin_logs.ip_address IS '操作元のIPアドレス';
COMMENT ON COLUMN admin_logs.user_agent IS '操作元のブラウザ情報';

