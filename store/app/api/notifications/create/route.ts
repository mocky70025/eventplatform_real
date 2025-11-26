import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[Notification API] Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('[Notification API] Service Key:', supabaseServiceKey ? 'Set' : 'Missing')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Notification API] Supabase configuration is missing')
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { userId, userType, notificationType, title, message, relatedEventId, relatedApplicationId } = await request.json()

    console.log('[Notification API] Request data:', {
      userId,
      userType,
      notificationType,
      title,
      message,
      relatedEventId,
      relatedApplicationId
    })

    if (!userId || !userType || !notificationType || !title || !message) {
      console.error('[Notification API] Missing required fields')
      return NextResponse.json(
        { error: 'userId, userType, notificationType, title, and message are required' },
        { status: 400 }
      )
    }

    // 通知を作成
    console.log('[Notification API] Inserting notification...')
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

    if (error) {
      console.error('[Notification API] Supabase error:', error)
      throw error
    }

    console.log('[Notification API] Notification created successfully:', data)
    return NextResponse.json({
      success: true,
      notification: data
    })
  } catch (error: any) {
    console.error('[Notification API] Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

