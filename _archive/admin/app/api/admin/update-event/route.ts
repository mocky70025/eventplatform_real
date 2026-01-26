import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[admin/update-event] Missing Supabase environment variables')
}

const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
  }

  const payload = await request.json()
  const { eventId, status } = payload

  if (!eventId || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .update({ approval_status: status })
    .eq('id', eventId)
    .select('id, approval_status')
    .single()

  if (error) {
    console.error('[admin/update-event] update error', error)
    return NextResponse.json({ error: 'Failed to update event', details: error.message }, { status: 500 })
  }

  return NextResponse.json({ event: data })
}
