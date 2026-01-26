import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// Google Sheets APIの認証情報
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
  console.error('Missing Google Sheets environment variables')
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

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
      return NextResponse.json(
        { error: 'Google Sheets API is not configured' },
        { status: 500 }
      )
    }

    const { eventId, eventName, applications } = await request.json()

    if (!eventId || !eventName || !applications || !Array.isArray(applications)) {
      return NextResponse.json(
        { error: 'eventId, eventName, and applications array are required' },
        { status: 400 }
      )
    }

    // Google Sheets認証
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    // スプレッドシートを開く
    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    // 新しいシートを作成（イベント名と日時を含む）
    const sheetTitle = `${eventName}_${new Date().toISOString().split('T')[0]}`
    const sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: [
        '申し込みID',
        '出店者ID',
        '出店者名',
        '性別',
        '年齢',
        '電話番号',
        'メールアドレス',
        'ジャンルカテゴリ',
        'ジャンル自由回答',
        '営業許可証画像URL',
        '車検証画像URL',
        '自動車検査証画像URL',
        'PL保険画像URL',
        '火器類配置図画像URL',
        '申し込みステータス',
        '申し込み日時',
        '登録日時'
      ]
    })

    // データを追加
    const rows = applications.map((app: ApplicationData) => [
      app.id,
      app.exhibitor.id,
      app.exhibitor.name,
      app.exhibitor.gender,
      app.exhibitor.age,
      app.exhibitor.phone_number,
      app.exhibitor.email,
      app.exhibitor.genre_category || '',
      app.exhibitor.genre_free_text || '',
      app.exhibitor.business_license_image_url || '',
      app.exhibitor.vehicle_inspection_image_url || '',
      app.exhibitor.automobile_inspection_image_url || '',
      app.exhibitor.pl_insurance_image_url || '',
      app.exhibitor.fire_equipment_layout_image_url || '',
      app.application_status,
      app.applied_at,
      app.exhibitor.created_at
    ])

    await sheet.addRows(rows)

    // スプレッドシートのURLを返す
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SPREADSHEET_ID}/edit#gid=${sheet.sheetId}`

    return NextResponse.json({
      success: true,
      spreadsheetUrl,
      sheetId: sheet.sheetId,
      sheetTitle,
      rowCount: rows.length
    })
  } catch (error: any) {
    console.error('Error exporting to Google Sheets:', error)
    return NextResponse.json(
      { error: 'Failed to export to Google Sheets', details: error.message },
      { status: 500 }
    )
  }
}

