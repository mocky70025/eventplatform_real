-- 新しいSupabaseプロジェクト用の統合スキーマ
-- このファイルを新しいSupabaseプロジェクトで実行してください

-- ============================================
-- 1. 基本テーブルの作成
-- ============================================

-- 1-1. 出店者情報テーブル
CREATE TABLE IF NOT EXISTS exhibitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('男', '女', 'それ以外')),
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 99),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    genre_category VARCHAR(50), -- おおまかなジャンル（プルダウン）
    genre_free_text TEXT, -- ジャンル自由回答
    business_license_image_url TEXT, -- 営業許可証画像URL
    vehicle_inspection_image_url TEXT, -- 車検証画像URL
    automobile_inspection_image_url TEXT, -- 自動車検査証画像URL
    pl_insurance_image_url TEXT, -- PL保険画像URL
    fire_equipment_layout_image_url TEXT, -- 火器類配置図画像URL
    line_user_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1-2. 主催者情報テーブル（Web移行対応版）
CREATE TABLE IF NOT EXISTS organizers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('男', '女', 'それ以外')),
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 99),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    line_user_id VARCHAR(100) UNIQUE, -- 既存LIFFユーザー用（NULL許可）
    user_id UUID, -- Supabase Auth用（NULL許可、新規登録時に設定）
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1-3. イベント情報テーブル
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- 基本情報
    event_name VARCHAR(100) NOT NULL,
    event_name_furigana VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL, -- ジャンル（祭り・花火大会など）
    is_shizuoka_vocational_assoc_related BOOLEAN DEFAULT FALSE,
    opt_out_newspaper_publication BOOLEAN DEFAULT FALSE,
    
    -- 開催期間・時間
    event_start_date DATE NOT NULL,
    event_end_date DATE NOT NULL,
    event_display_period VARCHAR(50) NOT NULL,
    event_period_notes VARCHAR(100),
    event_time VARCHAR(50),
    
    -- 申し込み期間
    application_start_date DATE,
    application_end_date DATE,
    application_display_period VARCHAR(50),
    application_notes VARCHAR(250),
    
    -- チケット情報
    ticket_release_start_date DATE,
    ticket_sales_location TEXT,
    
    -- イベント内容
    lead_text VARCHAR(100) NOT NULL,
    event_description VARCHAR(250) NOT NULL,
    event_introduction_text TEXT, -- イベント紹介文（500字以内）
    
    -- 画像情報
    main_image_url TEXT,
    main_image_caption VARCHAR(50),
    additional_image1_url TEXT,
    additional_image1_caption VARCHAR(50),
    additional_image2_url TEXT,
    additional_image2_caption VARCHAR(50),
    additional_image3_url TEXT,
    additional_image3_caption VARCHAR(50),
    additional_image4_url TEXT,
    additional_image4_caption VARCHAR(50),
    
    -- 会場情報
    venue_name VARCHAR(200) NOT NULL,
    venue_postal_code VARCHAR(10),
    venue_city VARCHAR(50),
    venue_town VARCHAR(100),
    venue_address VARCHAR(200),
    venue_latitude DECIMAL(10, 8),
    venue_longitude DECIMAL(11, 8),
    
    -- URL情報
    homepage_url TEXT,
    related_page_url TEXT,
    
    -- 連絡先情報
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    
    -- その他情報
    parking_info TEXT,
    fee_info TEXT,
    organizer_info TEXT,
    
    -- 主催者との関連
    organizer_id UUID REFERENCES organizers(id),
    
    -- システム情報
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1-4. 出店申し込みテーブル
CREATE TABLE IF NOT EXISTS event_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exhibitor_id UUID NOT NULL REFERENCES exhibitors(id),
    event_id UUID NOT NULL REFERENCES events(id),
    application_status VARCHAR(20) DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exhibitor_id, event_id)
);

-- 1-5. フォームドラフトテーブル
CREATE TABLE IF NOT EXISTS form_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    form_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, form_type)
);

-- ============================================
-- 2. インデックスの作成
-- ============================================

CREATE INDEX IF NOT EXISTS idx_exhibitors_line_user_id ON exhibitors(line_user_id);
CREATE INDEX IF NOT EXISTS idx_organizers_line_user_id ON organizers(line_user_id);
CREATE INDEX IF NOT EXISTS idx_organizers_user_id ON organizers(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_organizers_user_id_unique ON organizers(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(event_start_date);
CREATE INDEX IF NOT EXISTS idx_event_applications_exhibitor_id ON event_applications(exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_event_applications_event_id ON event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_form_drafts_user_id ON form_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_form_drafts_form_type ON form_drafts(form_type);

-- ============================================
-- 3. RLS（Row Level Security）の有効化
-- ============================================

ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_drafts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLSポリシーの作成
-- ============================================

-- 4-1. exhibitorsテーブルのポリシー
DROP POLICY IF EXISTS "Users can view their own data" ON exhibitors;
CREATE POLICY "Users can view their own data" ON exhibitors
    FOR ALL USING (auth.uid()::text = line_user_id);

-- 4-2. organizersテーブルのポリシー（Web移行対応）
DROP POLICY IF EXISTS "Users can view their own data" ON organizers;
CREATE POLICY "Users can view their own data" ON organizers
    FOR ALL USING (
        auth.uid()::text = line_user_id OR 
        auth.uid() = user_id
    );

-- 4-3. eventsテーブルのポリシー
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers can manage their own events" ON events;
CREATE POLICY "Organizers can manage their own events" ON events
    FOR ALL USING (
        organizer_id IN (
            SELECT id FROM organizers 
            WHERE line_user_id = auth.uid()::text OR user_id = auth.uid()
        )
    );

-- 4-4. event_applicationsテーブルのポリシー
DROP POLICY IF EXISTS "Users can view their own applications" ON event_applications;
CREATE POLICY "Users can view their own applications" ON event_applications
    FOR ALL USING (
        exhibitor_id IN (
            SELECT id FROM exhibitors WHERE line_user_id = auth.uid()::text
        )
    );

-- 4-5. form_draftsテーブルのポリシー
DROP POLICY IF EXISTS "Users can manage their own drafts" ON form_drafts;
CREATE POLICY "Users can manage their own drafts" ON form_drafts
    FOR ALL USING (user_id = auth.uid()::text);

-- ============================================
-- 完了
-- ============================================

-- すべてのテーブルとポリシーが作成されました
-- 次に、ストレージの設定を行ってください




