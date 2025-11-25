import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Google Sheets APIの統合は後で実装します
// このエンドポイントは、申し込み締め切り後に呼び出されます

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId
    const { organizerId, organizerEmail } = await request.json()

    if (!eventId || !organizerId || !organizerEmail) {
      return NextResponse.json(
        { error: 'eventId, organizerId, and organizerEmail are required' },
        { status: 400 }
      )
    }

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // イベントを取得
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
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

    // TODO: Google Sheets APIへの書き込み処理を実装
    // TODO: メール送信処理を実装

    // 一時的なレスポンス（実装が完了するまで）
    return NextResponse.json({
      success: true,
      message: 'Export to sheets functionality will be implemented',
      eventId,
      applicationCount: applications?.length || 0,
      // 実装後は以下を返す:
      // spreadsheetId: '...',
      // spreadsheetUrl: '...',
      // emailSent: true
    })
  } catch (error) {
    console.error('Error exporting to sheets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

