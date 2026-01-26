-- 大量イベントデータ生成SQL
-- 主催者ID: 664b1a0e-d202-481b-8307-90290a66cbf5

-- 50件のイベントを生成
INSERT INTO events (
    organizer_id,
    event_name,
    genre,
    lead_text,
    description,
    event_start_date,
    event_end_date,
    event_time,
    application_period_start,
    application_period_end,
    venue_name,
    address,
    recruit_count,
    fee,
    requirements,
    status,
    created_at,
    updated_at
)
SELECT 
    '664b1a0e-d202-481b-8307-90290a66cbf5'::uuid AS organizer_id,
    -- イベント名: ジャンル + 日付 + 番号
    (ARRAY['祭り', '花火大会', 'フードフェス', '音楽フェス', 'マルシェ', 'フリーマーケット', 'ワークショップ', '展示会', 'スポーツイベント', '文化祭'])[1 + (series % 10)] || 
    'イベント ' || 
    TO_CHAR(CURRENT_DATE + (30 + series * 2), 'YYYY年MM月DD日') || 
    ' 第' || series || '回' AS event_name,
    -- ジャンル
    (ARRAY['祭り', '花火大会', 'フードフェス', '音楽フェス', 'マルシェ', 'フリーマーケット', 'ワークショップ', '展示会', 'スポーツイベント', '文化祭'])[1 + (series % 10)] AS genre,
    -- リードテキスト
    CASE (series % 10)
        WHEN 0 THEN '伝統的な祭りを楽しもう！'
        WHEN 1 THEN '夏の夜空を彩る花火大会'
        WHEN 2 THEN '美味しいグルメが大集合！'
        WHEN 3 THEN 'ライブ音楽を楽しもう'
        WHEN 4 THEN '手作り品や特産品が集まるマルシェ'
        WHEN 5 THEN '掘り出し物が見つかるかも！'
        WHEN 6 THEN '体験型ワークショップ開催'
        WHEN 7 THEN '様々な作品を展示します'
        WHEN 8 THEN '体を動かして楽しもう'
        ELSE '楽しいイベントです'
    END AS lead_text,
    -- 詳細説明
    (ARRAY['祭り', '花火大会', 'フードフェス', '音楽フェス', 'マルシェ', 'フリーマーケット', 'ワークショップ', '展示会', 'スポーツイベント', '文化祭'])[1 + (series % 10)] || 
    'の詳細説明です。' || 
    'このイベントでは、様々な出店者が参加し、' ||
    '来場者の皆様に楽しんでいただける内容となっております。' ||
    'ぜひお越しください。' AS description,
    -- 開催日（今日から30日後〜90日後）
    CURRENT_DATE + (30 + series * 2) AS event_start_date,
    -- 終了日（開始日の1〜3日後）
    CURRENT_DATE + (30 + series * 2 + 1 + (series % 3)) AS event_end_date,
    -- 開催時間
    CASE (series % 3)
        WHEN 0 THEN '10:00〜17:00'
        WHEN 1 THEN '11:00〜18:00'
        ELSE '9:00〜16:00'
    END AS event_time,
    -- 申し込み開始日（今日）
    CURRENT_DATE AS application_period_start,
    -- 申し込み締切（開催日の7日前）
    CURRENT_DATE + (30 + series * 2 - 7) AS application_period_end,
    -- 会場名（循環的に使用）
    (ARRAY[
        '静岡市中央公園', '浜松市役所前広場', '沼津市民文化センター', '富士市中央公園',
        '三島市中央公園', '熱海市サンビーチ', '伊東市中央公園', '下田市中央公園',
        '掛川市中央公園', '藤枝市中央公園', '焼津市中央公園', '島田市中央公園'
    ])[1 + (series % 12)] AS venue_name,
    -- 住所（循環的に使用）
    (ARRAY[
        '静岡県静岡市葵区追手町', '静岡県浜松市中区元城町', '静岡県沼津市大手町',
        '静岡県富士市本町', '静岡県三島市中央町', '静岡県熱海市中央町',
        '静岡県伊東市中央', '静岡県下田市中央', '静岡県掛川市中央',
        '静岡県藤枝市中央', '静岡県焼津市中央', '静岡県島田市中央'
    ])[1 + (series % 12)] AS address,
    -- 募集数（10〜50の間でランダム）
    10 + ((series * 7) % 41) AS recruit_count,
    -- 出店料
    CASE (series % 5)
        WHEN 0 THEN '無料'
        WHEN 1 THEN '5,000円'
        WHEN 2 THEN '10,000円'
        WHEN 3 THEN '15,000円'
        ELSE '20,000円'
    END AS fee,
    -- 出店条件
    '出店条件：営業許可証が必要です。' ||
    '車両での出店の場合は車検証と自賠責保険証が必要です。' ||
    '詳細は主催者までお問い合わせください。' AS requirements,
    -- ステータス（公開中と下書きを混在）
    CASE (series % 3)
        WHEN 0 THEN 'published'
        WHEN 1 THEN 'published'
        ELSE 'draft'
    END AS status,
    NOW() AS created_at,
    NOW() AS updated_at
FROM 
    generate_series(1, 50) AS series;

-- 作成されたイベントを確認
SELECT 
    id,
    event_name,
    genre,
    event_start_date,
    status,
    recruit_count,
    fee
FROM events
WHERE organizer_id = '664b1a0e-d202-481b-8307-90290a66cbf5'
ORDER BY created_at DESC
LIMIT 10;
