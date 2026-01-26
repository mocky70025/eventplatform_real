import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[admin/update-organizer] Missing Supabase environment variables')
}

const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
  }

  const payload = await request.json()
  const { organizerId, approved } = payload

  if (!organizerId || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('organizers')
    .update({ is_approved: approved })
    .eq('id', organizerId)
    .select('id, is_approved')
    .single()

  if (error) {
    console.error('[admin/update-organizer] update error', error)
    return NextResponse.json({ error: 'Failed to update organizer', details: error.message }, { status: 500 })
  }

  return NextResponse.json({ organizer: data })
}
