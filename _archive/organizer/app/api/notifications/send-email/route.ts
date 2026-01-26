import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@tomorrow-event-platform.com'

let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'to, subject, and html are required' },
        { status: 400 }
      )
    }

    // Resendが設定されている場合、メールを送信
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: resendFromEmail,
          to,
          subject,
          html
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
          message: 'Email sent successfully',
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
      console.log('Resend API key not configured. Email would be sent to:', to)
      console.log('Subject:', subject)
      console.log('Body:', html)

      return NextResponse.json({
        success: true,
        message: 'Email sending simulated (RESEND_API_KEY not configured)',
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

