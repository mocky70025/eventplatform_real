-- スプレッドシート機能確認用SQL
-- デプロイ後に実行してください

-- ============================================
-- 1. 出店者アカウントの作成（テスト用）
-- ============================================
-- メール認証用の出店者を作成する場合
-- 注意: user_idはSupabase Authで作成したユーザーのUUIDを使用してください
-- または、テスト用にダミーのUUIDを生成して使用することも可能です

-- テスト用出店者1（メール認証想定）
INSERT INTO exhibitors (
  name,
  gender,
  age,
  phone_number,
  email,
  genre_category,
  genre_free_text,
  user_id,  -- メール認証の場合はSupabase Authのuser_idを設定
  line_user_id  -- メール認証の場合はNULLでもOK（supabase_email_auth_migration.sqlを実行済みの場合）
) VALUES (
  'テスト出店者1',
  '男',
  30,
  '09012345678',
  'exhibitor1@test.com',
  'フード',
  'たこ焼き・お好み焼き',
  gen_random_uuid(),  -- テスト用UUID（実際にはSupabase Authのuser_idを使用）
  NULL  -- メール認証の場合はNULL
) ON CONFLICT DO NOTHING;

-- テスト用出店者2（メール認証想定）
INSERT INTO exhibitors (
  name,
  gender,
  age,
  phone_number,
  email,
  genre_category,
  genre_free_text,
  user_id,
  line_user_id
) VALUES (
  'テスト出店者2',
  '女',
  25,
  '09087654321',
  'exhibitor2@test.com',
  'ドリンク',
  'かき氷・ジュース',
  gen_random_uuid(),
  NULL
) ON CONFLICT DO NOTHING;

-- テスト用出店者3（メール認証想定）
INSERT INTO exhibitors (
  name,
  gender,
  age,
  phone_number,
  email,
  genre_category,
  genre_free_text,
  user_id,
  line_user_id
) VALUES (
  'テスト出店者3',
  '男',
  35,
  '09011112222',
  'exhibitor3@test.com',
  'フード',
  '焼きそば・ラーメン',
  gen_random_uuid(),
  NULL
) ON CONFLICT DO NOTHING;

-- ============================================
-- 2. イベント申し込みの作成
-- ============================================
-- 注意: 以下のSQLは、デプロイ後に主催者アカウントとイベントを作成した後に実行してください
-- 
-- 実行手順:
-- 1. デプロイ完了後、主催者アカウントを作成
-- 2. イベントを作成（イベントIDを取得）
-- 3. 以下のSQLで、作成した出店者をイベントに申し込ませる
-- 
-- イベントIDと出店者IDを確認するSQL:
-- SELECT id, event_name FROM events ORDER BY created_at DESC LIMIT 1;  -- 最新のイベントIDを取得
-- SELECT id, name FROM exhibitors WHERE email LIKE 'exhibitor%@test.com';  -- テスト用出店者のIDを取得

-- 例: イベント申し込みの作成（イベントIDと出店者IDを実際の値に置き換えてください）
/*
INSERT INTO event_applications (
  exhibitor_id,
  event_id,
  application_status,
  applied_at
) VALUES 
  -- 出店者1を申し込ませる
  (
    (SELECT id FROM exhibitors WHERE email = 'exhibitor1@test.com' LIMIT 1),
    'ここにイベントIDを入力',  -- デプロイ後に作成したイベントのID
    'pending',
    NOW()
  ),
  -- 出店者2を申し込ませる
  (
    (SELECT id FROM exhibitors WHERE email = 'exhibitor2@test.com' LIMIT 1),
    'ここにイベントIDを入力',  -- 同じイベントID
    'pending',
    NOW()
  ),
  -- 出店者3を申し込ませる
  (
    (SELECT id FROM exhibitors WHERE email = 'exhibitor3@test.com' LIMIT 1),
    'ここにイベントIDを入力',  -- 同じイベントID
    'pending',
    NOW()
  )
ON CONFLICT (exhibitor_id, event_id) DO NOTHING;
*/

-- ============================================
-- 3. 確認用SQL
-- ============================================
-- 作成した出店者を確認
SELECT id, name, email, user_id, line_user_id, created_at 
FROM exhibitors 
WHERE email LIKE 'exhibitor%@test.com'
ORDER BY created_at DESC;

-- イベント申し込みを確認（イベント作成後）
/*
SELECT 
  ea.id as application_id,
  e.name as exhibitor_name,
  ev.event_name,
  ea.application_status,
  ea.applied_at
FROM event_applications ea
JOIN exhibitors e ON ea.exhibitor_id = e.id
JOIN events ev ON ea.event_id = ev.id
WHERE e.email LIKE 'exhibitor%@test.com'
ORDER BY ea.applied_at DESC;
*/

-- ============================================
-- 4. クリーンアップ用SQL（テスト後）
-- ============================================
-- テスト用データを削除する場合（必要に応じて実行）
/*
-- イベント申し込みを削除
DELETE FROM event_applications 
WHERE exhibitor_id IN (
  SELECT id FROM exhibitors WHERE email LIKE 'exhibitor%@test.com'
);

-- 出店者を削除
DELETE FROM exhibitors 
WHERE email LIKE 'exhibitor%@test.com';
*/


