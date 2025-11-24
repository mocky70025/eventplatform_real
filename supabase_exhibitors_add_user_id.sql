-- exhibitorsテーブルにuser_idカラムを追加
-- このSQLをSupabaseのSQL Editorで実行してください

-- user_idカラムを追加（既に存在する場合はスキップ）
ALTER TABLE exhibitors 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- line_user_idのNOT NULL制約を削除（メール認証ユーザーはline_user_idがNULLになる可能性があるため）
ALTER TABLE exhibitors 
ALTER COLUMN line_user_id DROP NOT NULL;

-- user_idとline_user_idのいずれかが必須であることを保証する制約を追加（オプション）
-- ただし、既存データとの互換性のため、ここでは制約を追加しません

-- user_idカラムにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_exhibitors_user_id ON exhibitors(user_id);

