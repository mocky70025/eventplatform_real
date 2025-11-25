import { NextRequest, NextResponse } from 'next/server'

/**
 * 申し込み締め切りとGoogle Sheetsへのエクスポートを一括で実行するAPI
 * 
 * 処理の流れ:
 * 1. 申し込みを締め切る（close-application APIを呼び出す）
 * 2. Google Sheetsにエクスポート（export-to-sheets APIを呼び出す）
 * 3. 主催者にメール送信（send-sheets-email APIを呼び出す）
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

    // 2. Google Sheetsにエクスポート
    const exportResponse = await fetch(`${baseUrl}/api/events/export-to-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId,
        eventName,
        applications
      })
    })

    if (!exportResponse.ok) {
      const errorData = await exportResponse.json()
      return NextResponse.json(
        { error: 'Failed to export to Google Sheets', details: errorData },
        { status: exportResponse.status }
      )
    }

    const exportData = await exportResponse.json()
    const spreadsheetUrl = exportData.spreadsheetUrl

    // 3. 主催者にメール送信
    const emailResponse = await fetch(`${baseUrl}/api/events/send-sheets-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organizerEmail,
        eventName,
        spreadsheetUrl
      })
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      // メール送信が失敗しても、締め切りとエクスポートは成功しているので警告として記録
      console.warn('Failed to send email:', errorData)
    }

    return NextResponse.json({
      success: true,
      eventId,
      closedAt: closeData.closedAt,
      spreadsheetUrl,
      sheetId: exportData.sheetId,
      sheetTitle: exportData.sheetTitle,
      applicationCount: applications.length,
      emailSent: emailResponse.ok
    })
  } catch (error: any) {
    console.error('Error in close-and-export:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

