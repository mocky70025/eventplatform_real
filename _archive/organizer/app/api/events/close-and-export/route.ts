import { NextRequest, NextResponse } from 'next/server'

/**
 * 申し込み締め切りを実行するAPI
 * 
 * 処理の流れ:
 * 1. 申し込みを締め切る（close-application APIを呼び出す）
 * 2. エクセル形式でダウンロード可能にする（export-to-excel APIを呼び出す）
 */
export async function POST(request: NextRequest) {
  try {
    const { eventId, organizerId, eventName, organizerEmail } = await request.json()

    if (!eventId || !organizerId || !eventName || !organizerEmail) {
      return NextResponse.json(
        { error: 'eventId, organizerId, eventName, and organizerEmail are required' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    // 1. 申し込みを締め切る
    const closeResponse = await fetch(`${baseUrl}/api/events/close-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId, organizerId })
    })

    if (!closeResponse.ok) {
      const errorData = await closeResponse.json()
      return NextResponse.json(
        { error: 'Failed to close application', details: errorData },
        { status: closeResponse.status }
      )
    }

    const closeData = await closeResponse.json()
    const applications = closeData.applications

    return NextResponse.json({
      success: true,
      eventId,
      closedAt: closeData.closedAt,
      applicationCount: applications.length,
      applications // エクセルエクスポート用にアプリケーション情報を返す
    })
  } catch (error: any) {
    console.error('Error in close-and-export:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

