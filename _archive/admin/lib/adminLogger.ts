import { supabase } from './supabase'

export type AdminActionType = 
  | 'login'
  | 'logout'
  | 'approve_organizer'
  | 'reject_organizer'
  | 'approve_event'
  | 'reject_event'
  | 'view_dashboard'

export type AdminLogTarget = 'organizer' | 'event' | null

interface LogAdminActionParams {
  adminEmail: string
  actionType: AdminActionType
  targetType?: AdminLogTarget
  targetId?: string
  targetName?: string
  details?: Record<string, any>
}

/**
 * 管理者の操作をログに記録
 */
export async function logAdminAction({
  adminEmail,
  actionType,
  targetType = null,
  targetId,
  targetName,
  details = {}
}: LogAdminActionParams) {
  try {
    // IPアドレスとUser-Agentを取得（クライアント側では制限があるため、可能な範囲で）
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : ''
    
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_email: adminEmail,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId || null,
        target_name: targetName || null,
        details: details,
        user_agent: userAgent,
        ip_address: null // クライアント側では取得困難なため、null
      })

    if (error) {
      console.error('Failed to log admin action:', error)
    } else {
      console.log(`[AdminLog] ${adminEmail} - ${actionType}`, { targetType, targetId, targetName })
    }
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}

/**
 * 管理者操作ログを取得
 */
export async function getAdminLogs(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch admin logs:', error)
    return []
  }
}

/**
 * 特定の管理者のログを取得
 */
export async function getAdminLogsByEmail(adminEmail: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .eq('admin_email', adminEmail)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch admin logs by email:', error)
    return []
  }
}

/**
 * 特定の操作タイプのログを取得
 */
export async function getAdminLogsByAction(actionType: AdminActionType, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .eq('action_type', actionType)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch admin logs by action:', error)
    return []
  }
}

