import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 注意: このエンドポイントはサーバーサイドでのみ実行されます
// SUPABASE_SERVICE_ROLE_KEYを使用してRLSをバイパスします

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId
    const { organizerId } = await request.json()

    if (!eventId || !organizerId) {
      return NextResponse.json(
        { error: 'eventId and organizerId are required' },
        { status: 400 }
      )
    }

    // Supabaseクライアントを作成（サービスロールキーを使用）
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // イベントを取得して確認
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, organizer:organizers(*)')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // 主催者IDが一致するか確認
    if (event.organizer_id !== organizerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // 既に締め切られているか確認
    if (event.application_closed_at) {
      return NextResponse.json(
        { error: 'Application is already closed' },
        { status: 400 }
      )
    }

    // 申し込んだ出店者の情報を取得
    const { data: applications, error: applicationsError } = await supabase
      .from('event_applications')
      .select(`
        *,
        exhibitor:exhibitors(*)
      `)
      .eq('event_id', eventId)

    if (applicationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    // 申し込みを締め切る（application_closed_atを更新）
    const { error: updateError } = await supabase
      .from('events')
      .update({
        application_closed_at: new Date().toISOString(),
        application_closed_by: organizerId
      })
      .eq('id', eventId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to close application' },
        { status: 500 }
      )
    }

    // 申し込んだ出店者の情報を返す
    // この時点では、Google Sheetsへの書き込みとメール送信は別の処理として実装します
    return NextResponse.json({
      success: true,
      eventId,
      applications: applications || [],
      closedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error closing application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

