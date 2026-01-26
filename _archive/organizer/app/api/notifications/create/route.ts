import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { userId, userType, notificationType, title, message, relatedEventId, relatedApplicationId } = await request.json()

    if (!userId || !userType || !notificationType || !title || !message) {
      return NextResponse.json(
        { error: 'userId, userType, notificationType, title, and message are required' },
        { status: 400 }
      )
    }

    // 通知を作成
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        user_type: userType,
        notification_type: notificationType,
        title,
        message,
        related_event_id: relatedEventId || null,
        related_application_id: relatedApplicationId || null,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      notification: data
    })
  } catch (error: any) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

