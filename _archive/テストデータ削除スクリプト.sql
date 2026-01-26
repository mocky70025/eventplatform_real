-- テストデータ削除スクリプト
-- 動作確認前に実行して、データベースをクリーンな状態に戻します

-- 注意: 本番環境では実行しないでください
-- このスクリプトはテスト環境でのみ使用してください

-- 1. イベント申し込みデータを削除
DELETE FROM event_applications;

-- 2. イベントデータを削除（テスト用イベントのみ）
-- 本番データを保持する場合は、WHERE句で条件を指定してください
DELETE FROM events;

-- 3. 出店者データを削除（テスト用のみ）
-- 特定のメールアドレスやLINEユーザーIDのデータのみ削除する場合は、WHERE句で条件を指定してください
-- 例: DELETE FROM exhibitors WHERE email LIKE 'test-%@example.com';
DELETE FROM exhibitors;

-- 4. 主催者データを削除（テスト用のみ）
-- 特定のメールアドレスやLINEユーザーIDのデータのみ削除する場合は、WHERE句で条件を指定してください
-- 例: DELETE FROM organizers WHERE email LIKE 'test-%@example.com';
DELETE FROM organizers;

-- 5. フォームドラフトデータを削除
DELETE FROM form_drafts;

-- 6. Supabase Authのユーザーを削除（オプション）
-- 注意: この操作はSupabase Dashboardから手動で行うことを推奨します
-- または、以下のSQLを実行（Supabaseのauth.usersテーブルに直接アクセス可能な場合）
-- DELETE FROM auth.users WHERE email LIKE 'test-%@example.com';

-- 確認用: 削除後のデータ数を確認
SELECT 
  (SELECT COUNT(*) FROM exhibitors) as exhibitors_count,
  (SELECT COUNT(*) FROM organizers) as organizers_count,
  (SELECT COUNT(*) FROM events) as events_count,
  (SELECT COUNT(*) FROM event_applications) as applications_count,
  (SELECT COUNT(*) FROM form_drafts) as drafts_count;

