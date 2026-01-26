-- テストデータ削除スクリプト（条件付き）
-- 特定のテストデータのみを削除します
-- 本番データを保持しながら、テストデータのみを削除したい場合に使用

-- 1. テスト用のイベント申し込みデータを削除
DELETE FROM event_applications 
WHERE exhibitor_id IN (
  SELECT id FROM exhibitors 
  WHERE email LIKE 'test-%@example.com' 
     OR line_user_id LIKE 'test-%'
     OR user_id IN (
       SELECT id FROM auth.users 
       WHERE email LIKE 'test-%@example.com'
     )
);

-- 2. テスト用のイベントデータを削除
-- テスト用イベントのタイトルや説明に特定の文字列が含まれている場合
DELETE FROM events 
WHERE title LIKE '%テスト%' 
   OR title LIKE '%test%'
   OR organizer_id IN (
     SELECT id FROM organizers 
     WHERE email LIKE 'test-%@example.com' 
        OR line_user_id LIKE 'test-%'
        OR user_id IN (
          SELECT id FROM auth.users 
          WHERE email LIKE 'test-%@example.com'
        )
   );

-- 3. テスト用の出店者データを削除
DELETE FROM exhibitors 
WHERE email LIKE 'test-%@example.com' 
   OR line_user_id LIKE 'test-%'
   OR user_id IN (
     SELECT id FROM auth.users 
     WHERE email LIKE 'test-%@example.com'
   );

-- 4. テスト用の主催者データを削除
DELETE FROM organizers 
WHERE email LIKE 'test-%@example.com' 
   OR line_user_id LIKE 'test-%'
   OR user_id IN (
     SELECT id FROM auth.users 
     WHERE email LIKE 'test-%@example.com'
   );

-- 5. テスト用のフォームドラフトデータを削除
DELETE FROM form_drafts 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE 'test-%@example.com'
);

-- 確認用: 削除後のデータ数を確認
SELECT 
  (SELECT COUNT(*) FROM exhibitors) as exhibitors_count,
  (SELECT COUNT(*) FROM organizers) as organizers_count,
  (SELECT COUNT(*) FROM events) as events_count,
  (SELECT COUNT(*) FROM event_applications) as applications_count,
  (SELECT COUNT(*) FROM form_drafts) as drafts_count;

