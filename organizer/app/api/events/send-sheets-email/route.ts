import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { organizerEmail, eventName, spreadsheetUrl } = await request.json()

    if (!organizerEmail || !eventName || !spreadsheetUrl) {
      return NextResponse.json(
        { error: 'organizerEmail, eventName, and spreadsheetUrl are required' },
        { status: 400 }
      )
    }

    // メール送信（Supabase Functionsまたは外部サービスを使用）
    // ここでは、Supabaseのメール送信機能を使用するか、外部サービス（SendGrid、Resend等）を使用します
    // 今回は、実装例としてSupabase Functionsを使用する前提でコメントを残します

    // メール本文を作成
    const emailSubject = `【${eventName}】出店者情報がスプレッドシートにエクスポートされました`
    const emailBody = `
${eventName}の申し込みが締め切られ、出店者情報をGoogleスプレッドシートにエクスポートしました。

以下のリンクからスプレッドシートを確認できます：
${spreadsheetUrl}

---
このメールは自動送信されています。
`

    // メール送信の実装
    // オプション1: Supabase Functionsを使用
    // const { data, error } = await supabaseAdmin.functions.invoke('send-email', {
    //   body: {
    //     to: organizerEmail,
    //     subject: emailSubject,
    //     body: emailBody
    //   }
    // })

    // オプション2: 外部サービス（Resend、SendGrid等）を使用
    // ここでは、実装例としてResendを使用する前提でコメントを残します
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // const { data, error } = await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: organizerEmail,
    //   subject: emailSubject,
    //   html: emailBody.replace(/\n/g, '<br>')
    // })

    // 一時的な実装: メール送信機能は後で実装するため、成功レスポンスを返す
    console.log('Email would be sent to:', organizerEmail)
    console.log('Subject:', emailSubject)
    console.log('Body:', emailBody)
    console.log('Spreadsheet URL:', spreadsheetUrl)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (simulated)',
      email: organizerEmail,
      spreadsheetUrl
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    )
  }
}

