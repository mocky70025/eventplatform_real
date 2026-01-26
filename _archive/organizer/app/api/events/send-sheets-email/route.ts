import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@tomorrow-event-platform.com'

// Resendが設定されていない場合でも動作するように、オプショナルにする
let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
}

export async function POST(request: NextRequest) {
  try {
    const { organizerEmail, eventName, spreadsheetUrl } = await request.json()

    if (!organizerEmail || !eventName || !spreadsheetUrl) {
      return NextResponse.json(
        { error: 'organizerEmail, eventName, and spreadsheetUrl are required' },
        { status: 400 }
      )
    }

    // メール本文を作成
    const emailSubject = `【${eventName}】出店者情報がスプレッドシートにエクスポートされました`
    const emailBodyHtml = `
      <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #FF8A5C; margin-bottom: 16px;">${eventName}の申し込みが締め切られました</h2>
        <p>出店者情報をGoogleスプレッドシートにエクスポートしました。</p>
        <p style="margin-top: 24px; margin-bottom: 8px;"><strong>スプレッドシートのリンク：</strong></p>
        <p style="margin-bottom: 24px;"><a href="${spreadsheetUrl}" style="color: #FF8A5C; text-decoration: underline;">${spreadsheetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">
        <p style="font-size: 12px; color: #666666;">このメールは自動送信されています。</p>
      </div>
    `

    // Resendが設定されている場合、メールを送信
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: resendFromEmail,
          to: organizerEmail,
          subject: emailSubject,
          html: emailBodyHtml
        })

        if (error) {
          console.error('Resend error:', error)
          return NextResponse.json(
            { error: 'Failed to send email via Resend', details: error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Email sent successfully via Resend',
          email: organizerEmail,
          spreadsheetUrl,
          emailId: data?.id
        })
      } catch (resendError: any) {
        console.error('Resend exception:', resendError)
        return NextResponse.json(
          { error: 'Failed to send email via Resend', details: resendError.message },
          { status: 500 }
        )
      }
    } else {
      // Resendが設定されていない場合、ログ出力のみ
      console.log('Resend API key not configured. Email would be sent to:', organizerEmail)
      console.log('Subject:', emailSubject)
      console.log('Body:', emailBodyHtml)
      console.log('Spreadsheet URL:', spreadsheetUrl)

      return NextResponse.json({
        success: true,
        message: 'Email sending simulated (RESEND_API_KEY not configured)',
        email: organizerEmail,
        spreadsheetUrl,
        note: 'Please configure RESEND_API_KEY and RESEND_FROM_EMAIL environment variables to enable email sending'
      })
    }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

