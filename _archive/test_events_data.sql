-- テスト用イベントデータ作成スクリプト
-- SupabaseのSQL Editorで実行してください

-- 0. approval_statusカラムが存在しない場合は追加
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

-- 1. 既存の主催者を取得（承認済みの主催者が存在する場合）
-- 存在しない場合は、テスト用主催者を作成
DO $$
DECLARE
  test_organizer_id UUID;
  today_date DATE := CURRENT_DATE;
  app_start_date DATE;
  app_end_date DATE;
BEGIN
  -- 既存の承認済み主催者を取得
  SELECT id INTO test_organizer_id 
  FROM organizers 
  WHERE is_approved = true 
  LIMIT 1;

  -- 主催者が存在しない場合は、テスト用主催者を作成
  IF test_organizer_id IS NULL THEN
    INSERT INTO organizers (
      company_name, name, gender, age, phone_number, email, line_user_id, is_approved
    ) VALUES (
      'テスト主催会社', 'テスト主催者', '男', 35, '090-0000-0000', 'test-organizer@example.com', 'test_organizer_line_001', true
    ) RETURNING id INTO test_organizer_id;
    
    RAISE NOTICE 'テスト用主催者を作成しました: %', test_organizer_id;
  ELSE
    RAISE NOTICE '既存の主催者を使用します: %', test_organizer_id;
  END IF;

  -- 応募期間の設定（今日を含む期間）
  app_start_date := today_date - INTERVAL '7 days'; -- 7日前から応募開始
  app_end_date := today_date + INTERVAL '30 days';  -- 30日後まで応募可能

  -- 2. テスト用イベントを複数作成（今日が応募期間内）
  INSERT INTO events (
    event_name, 
    event_name_furigana, 
    genre, 
    event_start_date, 
    event_end_date,
    event_display_period, 
    event_time,
    application_start_date,
    application_end_date,
    application_display_period,
    lead_text, 
    event_description, 
    venue_name, 
    venue_city,
    venue_town,
    contact_name,
    contact_phone,
    contact_email,
    organizer_id,
    approval_status
  ) VALUES 
  (
    '春の祭典2025', 
    'はるのさいてん2025', 
    '祭り', 
    today_date + INTERVAL '60 days',  -- 60日後に開催
    today_date + INTERVAL '62 days',  -- 2日間開催
    TO_CHAR(today_date + INTERVAL '60 days', 'YYYY年MM月DD日') || '〜' || TO_CHAR(today_date + INTERVAL '62 days', 'MM月DD日'),
    '10:00〜18:00',
    app_start_date,
    app_end_date,
    TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
    '春の訪れを祝う楽しい祭典です', 
    '出店者向けのテスト用イベントです。様々なジャンルの出店をお待ちしています。屋台や物販、飲食など幅広いジャンルで出店者を募集しています。', 
    '静岡市中央公園', 
    '静岡県',
    '静岡市葵区',
    'テスト主催者',
    '090-0000-0000',
    'test-organizer@example.com',
    test_organizer_id,
    'approved'
  ),
  (
    'フードフェスティバル2025', 
    'ふーどふぇすてぃばる2025', 
    '飲食', 
    today_date + INTERVAL '45 days',  -- 45日後に開催
    today_date + INTERVAL '47 days',  -- 2日間開催
    TO_CHAR(today_date + INTERVAL '45 days', 'YYYY年MM月DD日') || '〜' || TO_CHAR(today_date + INTERVAL '47 days', 'MM月DD日'),
    '11:00〜20:00',
    app_start_date,
    app_end_date,
    TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
    '地元の名店が集まるグルメの祭典', 
    '静岡県内の名店が集まるフードフェスティバルです。飲食店の出店を大募集しています。', 
    '静岡駅前広場', 
    '静岡県',
    '静岡市葵区',
    'テスト主催者',
    '090-0000-0000',
    'test-organizer@example.com',
    test_organizer_id,
    'approved'
  ),
  (
    '手作りマーケット', 
    'てづくりまーけっと', 
    '物販', 
    today_date + INTERVAL '75 days',  -- 75日後に開催
    today_date + INTERVAL '75 days',  -- 1日のみ
    TO_CHAR(today_date + INTERVAL '75 days', 'YYYY年MM月DD日'),
    '10:00〜16:00',
    app_start_date,
    app_end_date,
    TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
    '手作り雑貨やアート作品の展示販売会', 
    'ハンドメイド作品やアート作品の展示販売会です。クリエイターの出店をお待ちしています。', 
    '静岡市文化会館', 
    '静岡県',
    '静岡市駿河区',
    'テスト主催者',
    '090-0000-0000',
    'test-organizer@example.com',
    test_organizer_id,
    'approved'
  ),
  (
    '夏祭り2025', 
    'なつまつり2025', 
    '祭り', 
    today_date + INTERVAL '90 days',  -- 90日後に開催
    today_date + INTERVAL '92 days',  -- 2日間開催
    TO_CHAR(today_date + INTERVAL '90 days', 'YYYY年MM月DD日') || '〜' || TO_CHAR(today_date + INTERVAL '92 days', 'MM月DD日'),
    '16:00〜21:00',
    app_start_date,
    app_end_date,
    TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
    '夏の夜を彩る伝統的な祭り', 
    '夏の風物詩である夏祭りです。屋台や出店で賑わう楽しいイベントです。', 
    '静岡市清水区', 
    '静岡県',
    '静岡市清水区',
    'テスト主催者',
    '090-0000-0000',
    'test-organizer@example.com',
    test_organizer_id,
    'approved'
  ),
  (
    'アート展覧会2025', 
    'あーとてんらんかい2025', 
    'アート', 
    today_date + INTERVAL '30 days',  -- 30日後に開催
    today_date + INTERVAL '35 days',  -- 5日間開催
    TO_CHAR(today_date + INTERVAL '30 days', 'YYYY年MM月DD日') || '〜' || TO_CHAR(today_date + INTERVAL '35 days', 'MM月DD日'),
    '10:00〜17:00',
    app_start_date,
    app_end_date,
    TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
    '若手アーティストの作品を展示する展覧会', 
    '静岡県内の若手アーティストの作品を展示する展覧会です。アート作品の展示や販売を行います。', 
    '静岡県立美術館', 
    '静岡県',
    '静岡市駿河区',
    'テスト主催者',
    '090-0000-0000',
    'test-organizer@example.com',
    test_organizer_id,
    'approved'
  );

  RAISE NOTICE 'テスト用イベントを5件作成しました';
  RAISE NOTICE '応募期間: % 〜 %', app_start_date, app_end_date;
END $$;

-- 3. 作成されたイベントを確認
SELECT 
  event_name,
  event_start_date,
  event_end_date,
  application_start_date,
  application_end_date,
  approval_status,
  organizer_id
FROM events
WHERE approval_status = 'approved'
ORDER BY event_start_date;

