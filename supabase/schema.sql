-- Organizers Table
CREATE TABLE organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(200),
  name VARCHAR(100),
  gender VARCHAR(10) CHECK (gender IN ('男', '女', 'それ以外')),
  age INTEGER,
  phone_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  social_links JSONB,
  is_approved BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibitors Table
CREATE TABLE exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name VARCHAR(200),
  name VARCHAR(100),
  gender VARCHAR(10) CHECK (gender IN ('男', '女', 'それ以外')),
  age INTEGER,
  phone_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  genre VARCHAR(50),
  genre_free_text TEXT,
  business_license_image_url TEXT,
  vehicle_inspection_image_url TEXT,
  pl_insurance_image_url TEXT,
  fire_equipment_layout_image_url TEXT,
  automobile_inspection_image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES organizers(id),
  event_name VARCHAR(100) NOT NULL,
  event_name_furigana VARCHAR(100),
  genre VARCHAR(50),
  lead_text VARCHAR(200),
  description TEXT,
  event_start_date DATE,
  event_end_date DATE,
  event_time VARCHAR(50),
  application_period_start DATE,
  application_period_end DATE,
  venue_name VARCHAR(200),
  address VARCHAR(200),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  recruit_count INTEGER,
  fee VARCHAR(100),
  requirements TEXT,
  main_image_url TEXT,
  gallery_images TEXT[], -- Array of URLs
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Applications Table
CREATE TABLE event_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  exhibitor_id UUID REFERENCES exhibitors(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  chat_room_id UUID, -- Can link to a chat_rooms table if implemented
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, exhibitor_id)
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES event_applications(id),
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be refined)
-- For now, allow public read for events
CREATE POLICY "Public events are viewable by everyone" ON events FOR SELECT USING (true);
