import { NextRequest, NextResponse } from 'next/server'

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

// CSV形式に変換する関数
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  // ヘッダー行を作成
  const headers = Object.keys(data[0])
  const headerRow = headers.map(header => `"${header}"`).join(',')

  // データ行を作成
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // 値にカンマ、ダブルクォート、改行が含まれる場合はエスケープ
      if (value === null || value === undefined) return '""'
      const stringValue = String(value)
      // ダブルクォートをエスケープ
      const escapedValue = stringValue.replace(/"/g, '""')
      return `"${escapedValue}"`
    }).join(',')
  })

  // BOMを追加してExcelで正しく日本語が表示されるようにする
  const BOM = '\uFEFF'
  return BOM + [headerRow, ...dataRows].join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, eventName, applications } = await request.json()

    if (!eventId || !eventName || !applications || !Array.isArray(applications)) {
      return NextResponse.json(
        { error: 'eventId, eventName, and applications array are required' },
        { status: 400 }
      )
    }

    // CSV用のデータを準備
    const csvData = applications.map((app: ApplicationData) => ({
      '申し込みID': app.id,
      '出店者ID': app.exhibitor.id,
      '出店者名': app.exhibitor.name,
      '性別': app.exhibitor.gender,
      '年齢': app.exhibitor.age,
      '電話番号': app.exhibitor.phone_number,
      'メールアドレス': app.exhibitor.email,
      'ジャンルカテゴリ': app.exhibitor.genre_category || '',
      'ジャンル自由回答': app.exhibitor.genre_free_text || '',
      '営業許可証画像URL': app.exhibitor.business_license_image_url || '',
      '車検証画像URL': app.exhibitor.vehicle_inspection_image_url || '',
      '自動車検査証画像URL': app.exhibitor.automobile_inspection_image_url || '',
      'PL保険画像URL': app.exhibitor.pl_insurance_image_url || '',
      '火器類配置図画像URL': app.exhibitor.fire_equipment_layout_image_url || '',
      '申し込みステータス': app.application_status === 'pending' ? '審査中' : app.application_status === 'approved' ? '承認済み' : '却下',
      '申し込み日時': new Date(app.applied_at).toLocaleString('ja-JP'),
      '登録日時': new Date(app.exhibitor.created_at).toLocaleString('ja-JP')
    }))

    // CSV形式に変換
    const csvContent = convertToCSV(csvData)

    // ファイル名を生成
    const fileName = `${eventName}_${new Date().toISOString().split('T')[0]}.csv`

    // レスポンスヘッダーを設定
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv; charset=utf-8')
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)

    return new NextResponse(csvContent, {
      status: 200,
      headers
    })
  } catch (error: any) {
    console.error('Error exporting to CSV:', error)
    return NextResponse.json(
      { error: 'Failed to export to CSV', details: error.message },
      { status: 500 }
    )
  }
}

