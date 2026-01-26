import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[admin/pending-data] Missing Supabase environment variables')
}

const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

export async function GET(_request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
  }

  const { data: organizers, error: organizerError } = await supabaseAdmin
    .from('organizers')
    .select('id, company_name, name, phone_number, email, created_at, is_approved')

  if (organizerError) {
    console.error('[admin/pending-data] organizers fetch error', organizerError)
    return NextResponse.json({ error: 'Failed to fetch organizers' }, { status: 500 })
  }

  const { data: events, error: eventError } = await supabaseAdmin
    .from('events')
    .select('id, event_name, genre, venue_name, event_start_date, event_end_date, created_at')

  if (eventError) {
    console.error('[admin/pending-data] events fetch error', eventError)
    return NextResponse.json(
      {
        error: 'Failed to fetch events',
        details: eventError.message,
        code: eventError.code,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    organizers: organizers || [],
    events: events || [],
  })
}
