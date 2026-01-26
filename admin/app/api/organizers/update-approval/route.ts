import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('[admin/update-approval] Missing Supabase environment variables');
}

const supabaseAdmin = supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

export async function POST(request: NextRequest) {
    if (!supabaseAdmin) {
        return NextResponse.json(
            { error: 'Supabase admin client not configured' },
            { status: 500 }
        );
    }

    try {
        const payload = await request.json();
        const { organizerId, isApproved } = payload;

        if (!organizerId || typeof isApproved !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid request payload' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('organizers')
            .update({ is_approved: isApproved })
            .eq('id', organizerId)
            .select('id, is_approved')
            .single();

        if (error) {
            console.error('[admin/update-approval] update error', error);
            return NextResponse.json(
                { error: 'Failed to update organizer', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ organizer: data });
    } catch (error: any) {
        console.error('[admin/update-approval] request error', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
