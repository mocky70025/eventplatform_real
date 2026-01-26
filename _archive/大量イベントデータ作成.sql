-- 募集期間に今日を含むイベントを大量作成するスクリプト
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

-- 1. イベントを大量作成
DO $$
DECLARE
  organizer_rec RECORD;
  today_date DATE := CURRENT_DATE;
  app_start_date DATE;
  app_end_date DATE;
  event_start_date DATE;
  event_end_date DATE;
  event_counter INTEGER := 0;
  genres TEXT[] := ARRAY['祭り', '花火大会', 'フードフェス', 'マーケット', '音楽フェス', 'アート展', 'スポーツイベント', '文化祭', '物産展', '手作り市'];
  venue_names TEXT[] := ARRAY[
    '静岡市中央公園', '静岡駅前広場', '静岡市文化会館', '静岡県立美術館', 
    '清水区文化会館', '駿河区総合体育館', '葵区中央公民館', '静岡市役所前広場',
    '静岡県庁前広場', '静岡市立中央図書館', '静岡科学館', '静岡市美術館',
    '静岡市清水区役所前', '静岡市駿河区役所前', '静岡市葵区役所前', '静岡駅南口広場',
    '静岡駅北口広場', '静岡市中央卸売市場', '静岡市清水港', '静岡市駿河区総合体育館'
  ];
  venue_cities TEXT[] := ARRAY['静岡県', '静岡県', '静岡県', '静岡県'];
  venue_towns TEXT[] := ARRAY['静岡市葵区', '静岡市駿河区', '静岡市清水区', '静岡市'];
  lead_texts TEXT[] := ARRAY[
    '地域の魅力を発信する楽しいイベント',
    '家族で楽しめる素晴らしいイベント',
    '地元の名産品や特産品が集まるイベント',
    '伝統文化を体験できる貴重な機会',
    '最新のトレンドを楽しめるイベント',
    '地域コミュニティが集まる賑やかなイベント',
    'アートと文化が融合した特別なイベント',
    'グルメとエンターテイメントが楽しめるイベント',
    '自然と調和した素晴らしいイベント',
    'クリエイターが集まる創作イベント'
  ];
  descriptions TEXT[] := ARRAY[
    '出店者向けのイベントです。様々なジャンルの出店をお待ちしています。屋台や物販、飲食など幅広いジャンルで出店者を募集しています。',
    '地域の活性化を目的としたイベントです。多くの出店者と来場者で賑わう楽しいイベントを目指しています。',
    '地元の魅力を発信するイベントです。出店者の皆様と一緒に素晴らしいイベントを作り上げていきましょう。',
    '家族連れで楽しめるイベントです。様々なジャンルの出店をお待ちしています。',
    '地域コミュニティが集まるイベントです。出店者の皆様のご参加をお待ちしています。',
    '伝統と革新が融合したイベントです。様々なジャンルの出店をお待ちしています。',
    'アートと文化を楽しめるイベントです。クリエイターの出店をお待ちしています。',
    'グルメとエンターテイメントが楽しめるイベントです。飲食店の出店を大募集しています。',
    '自然と調和した素晴らしいイベントです。様々なジャンルの出店をお待ちしています。',
    '最新のトレンドを楽しめるイベントです。若手クリエイターの出店をお待ちしています。'
  ];
  event_times TEXT[] := ARRAY['10:00〜18:00', '11:00〜20:00', '10:00〜16:00', '16:00〜21:00', '9:00〜17:00', '12:00〜20:00'];
  random_genre TEXT;
  random_venue_name TEXT;
  random_venue_city TEXT;
  random_venue_town TEXT;
  random_lead_text TEXT;
  random_description TEXT;
  random_event_time TEXT;
  random_days INTEGER;
  random_duration INTEGER;
BEGIN
  -- 応募期間の設定（今日を含む期間）
  app_start_date := today_date - INTERVAL '7 days'; -- 7日前から応募開始
  app_end_date := today_date + INTERVAL '30 days';  -- 30日後まで応募可能

  RAISE NOTICE '応募期間: % 〜 %', app_start_date, app_end_date;
  RAISE NOTICE '今日の日付: %', today_date;

  -- 既存の承認済み主催者を全て取得
  FOR organizer_rec IN 
    SELECT id, company_name, name, email, phone_number 
    FROM organizers 
    WHERE is_approved = true
    ORDER BY created_at
  LOOP
    RAISE NOTICE '主催者を使用: % (ID: %)', organizer_rec.company_name, organizer_rec.id;

    -- 各主催者に対して20件のイベントを作成
    FOR i IN 1..20 LOOP
      -- ランダムな値を選択
      random_genre := genres[1 + floor(random() * array_length(genres, 1))::int];
      random_venue_name := venue_names[1 + floor(random() * array_length(venue_names, 1))::int];
      random_venue_city := venue_cities[1 + floor(random() * array_length(venue_cities, 1))::int];
      random_venue_town := venue_towns[1 + floor(random() * array_length(venue_towns, 1))::int];
      random_lead_text := lead_texts[1 + floor(random() * array_length(lead_texts, 1))::int];
      random_description := descriptions[1 + floor(random() * array_length(descriptions, 1))::int];
      random_event_time := event_times[1 + floor(random() * array_length(event_times, 1))::int];
      
      -- 開催日をランダムに設定（30日後〜120日後の間）
      random_days := 30 + floor(random() * 90)::int;
      random_duration := 1 + floor(random() * 3)::int; -- 1〜3日間
      
      event_start_date := today_date + (random_days || ' days')::INTERVAL;
      event_end_date := event_start_date + (random_duration || ' days')::INTERVAL;

      -- イベント名を生成
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
        approval_status,
        is_application_closed
      ) VALUES (
        random_genre || 'イベント' || TO_CHAR(event_start_date, 'YYYY年MM月') || '第' || i || '回', 
        random_genre || 'いべんと' || TO_CHAR(event_start_date, 'YYYYねんMMがつ') || 'だい' || i || 'かい', 
        random_genre, 
        event_start_date,
        event_end_date,
        CASE 
          WHEN random_duration = 1 THEN TO_CHAR(event_start_date, 'YYYY年MM月DD日')
          ELSE TO_CHAR(event_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(event_end_date, 'MM月DD日')
        END,
        random_event_time,
        app_start_date,
        app_end_date,
        TO_CHAR(app_start_date, 'YYYY年MM月DD日') || '〜' || TO_CHAR(app_end_date, 'MM月DD日'),
        random_lead_text, 
        random_description, 
        random_venue_name, 
        random_venue_city,
        random_venue_town,
        organizer_rec.name,
        organizer_rec.phone_number,
        organizer_rec.email,
        organizer_rec.id,
        'approved',
        false
      );

      event_counter := event_counter + 1;
    END LOOP;
  END LOOP;

  -- 主催者が存在しない場合のエラーハンドリング
  IF event_counter = 0 THEN
    RAISE EXCEPTION '承認済みの主催者が見つかりませんでした。先に主催者を承認してください。';
  END IF;

  RAISE NOTICE '合計 % 件のイベントを作成しました', event_counter;
  RAISE NOTICE '応募期間: % 〜 % (今日を含む)', app_start_date, app_end_date;
END $$;

-- 作成されたイベントを確認
SELECT 
  event_name,
  genre,
  event_start_date,
  event_end_date,
  application_start_date,
  application_end_date,
  venue_name,
  approval_status,
  is_application_closed,
  (SELECT company_name FROM organizers WHERE id = events.organizer_id) as organizer_name
FROM events
WHERE approval_status = 'approved'
  AND application_start_date <= CURRENT_DATE
  AND application_end_date >= CURRENT_DATE
ORDER BY event_start_date
LIMIT 50;

-- 統計情報
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT organizer_id) as total_organizers,
  COUNT(CASE WHEN is_application_closed = true THEN 1 END) as closed_events,
  MIN(application_start_date) as earliest_application_start,
  MAX(application_end_date) as latest_application_end
FROM events
WHERE approval_status = 'approved'
  AND application_start_date <= CURRENT_DATE
  AND application_end_date >= CURRENT_DATE;

