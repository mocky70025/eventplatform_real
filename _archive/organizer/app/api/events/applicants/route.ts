import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 環境変数のチェックは実行時に行う
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

  return createClient(supabaseUrl, supabaseServiceKey)
}

interface ExhibitorData {
  id: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  genre_category?: string
  genre_free_text?: string
  business_license_image_url?: string
  vehicle_inspection_image_url?: string
  automobile_inspection_image_url?: string
  pl_insurance_image_url?: string
  fire_equipment_layout_image_url?: string
  created_at: string
}

interface ApplicationData {
  id: string
  exhibitor_id: string
  event_id: string
  application_status: string
  applied_at: string
  exhibitor: ExhibitorData
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const eventId = searchParams.get('eventId')
    const organizerId = searchParams.get('organizerId')

    if (!eventId || !organizerId) {
      return NextResponse.json(
        { error: 'eventId and organizerId are required' },
        { status: 400 }
      )
    }

    // イベントが主催者のものか確認
    const supabaseAdmin = getSupabaseAdmin()
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, organizer_id')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.organizer_id !== organizerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // 申し込んだ出店者の情報を取得
    const { data: applications, error: applicationsError } = await supabaseAdmin
      .from('event_applications')
      .select(`
        id,
        exhibitor_id,
        event_id,
        application_status,
        applied_at,
        exhibitor:exhibitors (
          id,
          name,
          gender,
          age,
          phone_number,
          email,
          genre_category,
          genre_free_text,
          business_license_image_url,
          vehicle_inspection_image_url,
          automobile_inspection_image_url,
          pl_insurance_image_url,
          fire_equipment_layout_image_url,
          created_at
        )
      `)
      .eq('event_id', eventId)
      .order('applied_at', { ascending: false })

    if (applicationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch applications', details: applicationsError.message },
        { status: 500 }
      )
    }

    // 申し込みデータを整形
    const applicantData: ApplicationData[] = (applications || []).map((app: any) => ({
      id: app.id,
      exhibitor_id: app.exhibitor_id,
      event_id: app.event_id,
      application_status: app.application_status,
      applied_at: app.applied_at,
      exhibitor: app.exhibitor
    }))

    return NextResponse.json({
      success: true,
      eventId,
      applicants: applicantData,
      count: applicantData.length
    })
  } catch (error: any) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

